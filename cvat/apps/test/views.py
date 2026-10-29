# Copyright (C) CVAT.ai Corporation
#
# SPDX-License-Identifier: MIT

from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import status, viewsets
from rest_framework.response import Response

from cvat.apps.engine.models import Task

from .permissions import AnnotationAnalyticsPermission
from .services import annotation_counts_for_task


@extend_schema(tags=["test"])
@extend_schema_view(
    retrieve=extend_schema(
        summary="Get annotation counts per class for a task",
        description=(
            "Returns the number of labeled shapes grouped by label name for the given task. "
            "Requires authentication and permission to view the task."
        ),
        responses={
            200: {
                "type": "object",
                "properties": {
                    "task_id": {"type": "integer"},
                    "counts": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "label": {"type": "string"},
                                "count": {"type": "integer"},
                            },
                        },
                    },
                },
            }
        },
    )
)
class AnnotationCountsViewSet(viewsets.ViewSet):
    """
    GET /api/test/annotation-counts/{task_id}
    """

    iam_permission_class = AnnotationAnalyticsPermission
    lookup_url_kwarg = "pk"

    def get_queryset(self):
        return Task.objects.select_related("organization", "project")

    def get_object(self):
        queryset = self.get_queryset()
        task = queryset.filter(pk=self.kwargs[self.lookup_url_kwarg]).first()
        if task is None:
            from rest_framework.exceptions import NotFound

            raise NotFound("Task not found")
        self.check_object_permissions(self.request, task)
        return task

    def retrieve(self, request, pk=None):
        task = self.get_object()

        try:
            min_count = max(0, int(request.query_params.get("min_count", 0)))
        except (TypeError, ValueError):
            min_count = 0

        counts = annotation_counts_for_task(task.id, min_count=min_count)

        return Response(
            {
                "task_id": task.id,
                "min_count": min_count,
                "counts": counts,
            },
            status=status.HTTP_200_OK,
        )
