# Copyright (C) CVAT.ai Corporation
#
# SPDX-License-Identifier: MIT

from django.db.models import Count

from cvat.apps.engine.models import LabeledShape


def annotation_counts_for_task(task_id: int, min_count: int = 0) -> list[dict[str, int | str]]:
    rows = (
        LabeledShape.objects.filter(job__segment__task_id=task_id)
        .values("label__name")
        .annotate(count=Count("id"))
        .order_by("-count", "label__name")
    )

    counts = [
        {"label": row["label__name"], "count": row["count"]}
        for row in rows
        if row["count"] >= min_count
    ]
    return counts
