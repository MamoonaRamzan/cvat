# Copyright (C) CVAT.ai Corporation
#
# SPDX-License-Identifier: MIT

from cvat.apps.engine.permissions import TaskPermission


class AnnotationAnalyticsPermission:
    """Require permission to view the task whose annotation counts are requested."""

    @classmethod
    def create(cls, request, view, obj, iam_context):
        if obj is None:
            return []
        return [TaskPermission.create_scope_view(request, obj, iam_context=iam_context)]
