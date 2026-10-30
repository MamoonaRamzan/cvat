# Definition of Done — Annotation Analytics Assessment

Written before feature work. Tick only with evidence (number, path, screenshot note, or commit SHA). A ticked line with no evidence counts as unticked.

## Checklist

- [x] Sample data ready: task openable with labelled boxes
  Evidence: task `coco-val2017-200`, 200 images, boxes visible after COCO import (verified in UI)

- [x] Django app `test` exists and is wired into the project
  Evidence: `cvat/apps/test/`, commit 5325cc9

- [x] API returns per-class annotation counts for a task, read from the database
  Evidence: GET `/api/test/annotation-counts/1` returns JSON; person count 571 matches DB query

- [x] Web page calls that API
  Evidence: `/tasks/1/annotation-analytics` (commit c0e0b62)

- [x] Counts shown as a graph
  Evidence: bar chart “Top 20 classes by annotation count” verified in UI

- [x] Empty state handled (task with no annotations / no classes)
  Evidence: `/tasks/2/annotation-analytics` — task `empty-no-annotations`, 0 shapes; UI shows Empty message (verified)

- [x] Failed request handled (API error shown cleanly)
  Evidence: `/tasks/99999/annotation-analytics` shows Result error “Task not found” (UI verified)

- [x] MO-1 measured: 5 runs, median + spread recorded in Objectives.md
  Evidence: Objectives.md — median 0.0152 s (15.2 ms), spread 0.0141 s–0.0183 s; below 500 ms target

- [x] Everything not finished is listed below (honest stop)
  Evidence: see "Not finished"

- [x] Loom ≤ 5 minutes recorded; answers K1–K4 without reading notes
  Evidence: https://www.loom.com/share/590e7164945c46eabb814f7aa2e372bc

## Stretch Goals (Optional)

These are additional improvements and are not required for the assessment's core completion.

- [x] Auth: unauthenticated request refused
  Evidence: `curl http://localhost:8080/api/test/annotation-counts/1` → HTTP 401

- [x] Auth: user without task access refused
  Evidence: user `assessment_limited` → GET `/api/test/annotation-counts/1` → HTTP 403 (`verify_task_access.py`)

- [x] Extra filter or grouping beyond plain count
  Evidence: `min_count` query param + UI InputNumber; hides rare classes so the chart focuses on frequent labels

- [x] Live updates over WebSocket
  Evidence: `ws://…/api/test/ws/annotation-counts/{task_id}` broadcasts updated annotation counts during annotation (approximately 1-second update interval; server loop in `cvat/apps/test/ws.py`)

- [x] Recovers when WebSocket drops and returns
  Evidence: UI reconnects every 2s; yellow Alert when disconnected (`annotation-analytics-page.tsx`)

## Not finished

- None.

## Done means

All mandatory checklist items are completed and supported by evidence, documentation is complete, and the Loom recording is available. Stretch items are optional and are not required for completion.
