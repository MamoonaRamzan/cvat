# Copyright (C) CVAT.ai Corporation
#
# SPDX-License-Identifier: MIT

import json
from http.cookies import SimpleCookie

from asgiref.sync import sync_to_async
from django.contrib.auth import get_user_model
from django.contrib.sessions.backends.db import SessionStore

from cvat.apps.engine.models import Task
from cvat.apps.engine.permissions import TaskPermission

from .services import annotation_counts_for_task


def _parse_session_key(scope) -> str | None:
    headers = dict(scope.get("headers") or [])
    raw = headers.get(b"cookie", b"").decode("latin-1")
    if not raw:
        return None
    jar = SimpleCookie()
    jar.load(raw)
    morsel = jar.get("sessionid")
    return morsel.value if morsel else None


def _user_from_session_key(session_key: str | None):
    if not session_key:
        return None
    store = SessionStore(session_key=session_key)
    if not store.exists(session_key):
        return None
    store.load()
    user_id = store.get("_auth_user_id")
    if not user_id:
        return None
    User = get_user_model()
    try:
        return User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return None


def _user_can_view_task(user, task_id: int) -> bool:
    if user is None or not user.is_authenticated:
        return False
    try:
        task = Task.objects.select_related("organization", "project").get(pk=task_id)
    except Task.DoesNotExist:
        return False

    from django.test import RequestFactory

    from cvat.apps.iam.middleware import get_organization as build_request_iam_context

    request = RequestFactory().get(f"/api/test/annotation-counts/{task_id}")
    request.user = user
    request.iam_context = build_request_iam_context(request)

    perm = TaskPermission.create_scope_view(request, task, iam_context=None)
    return perm.check_access().allow


def _task_id_from_path(path: str) -> int | None:
    # /api/test/ws/annotation-counts/{task_id}
    parts = path.strip("/").split("/")
    if len(parts) < 5:
        return None
    if parts[:4] != ["api", "test", "ws", "annotation-counts"]:
        return None
    try:
        return int(parts[4])
    except ValueError:
        return None


async def test_websocket_application(scope, receive, send):
    if scope["type"] != "websocket":
        return

    task_id = _task_id_from_path(scope.get("path", ""))
    if task_id is None:
        await send({"type": "websocket.close", "code": 4400})
        return

    session_key = _parse_session_key(scope)
    user = await sync_to_async(_user_from_session_key)(session_key)
    allowed = await sync_to_async(_user_can_view_task)(user, task_id)
    if not allowed:
        await send({"type": "websocket.close", "code": 4403})
        return

    query = scope.get("query_string", b"").decode()
    min_count = 0
    for part in query.split("&"):
        if part.startswith("min_count="):
            try:
                min_count = max(0, int(part.split("=", 1)[1]))
            except ValueError:
                min_count = 0

    await send({"type": "websocket.accept"})

    import asyncio

    last_payload = None
    while True:
        try:
            message = await asyncio.wait_for(receive(), timeout=1.0)
            if message["type"] == "websocket.disconnect":
                break
        except TimeoutError:
            pass

        counts = await sync_to_async(annotation_counts_for_task)(task_id, min_count)
        payload = {"task_id": task_id, "counts": counts, "min_count": min_count}
        serialized = json.dumps(payload)
        if serialized != last_payload:
            await send({"type": "websocket.send", "text": serialized})
            last_payload = serialized
