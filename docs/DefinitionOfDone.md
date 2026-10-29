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

- [ ] Empty state handled (task with no annotations / no classes)  
  Evidence: open `/tasks/2/annotation-analytics` — task `empty-no-annotations`, 0 shapes in DB (confirm UI shows Empty)

- [x] Failed request handled (API error shown cleanly)  
  Evidence: `/tasks/99999/annotation-analytics` shows Result error “Task not found” (UI verified)

- [x] MO-1 measured: 5 runs, median + spread recorded in Objectives.md  
  Evidence: Objectives.md MO-1 median 0.0152 s, target 500 ms met

- [x] Everything not finished is listed below (honest stop)  
  Evidence: see "Not finished"

- [ ] Loom ≤ 5 minutes recorded; answers K1–K4 without reading notes  
  Evidence: _(Loom URL before submit)_

## Stretch (only if floor above is done)

- [x] Auth: unauthenticated request refused  
  Evidence: `curl http://localhost:8080/api/test/annotation-counts/1` → HTTP 401

- [ ] Auth: user without task access refused  
  Evidence: not tested (time); endpoint uses TaskPermission VIEW like other task APIs

- [ ] Extra filter or grouping beyond plain count  
  Evidence: skipped (time)

- [ ] Live updates over WebSocket  
  Evidence: skipped (time)

- [ ] Recovers when WebSocket drops and returns  
  Evidence: skipped (time)

## Not finished

- Assessment items 7–10: extra filter/grouping, WebSocket live updates, reconnect, decision record in Plan — skipped to finish floor + MO-1 + submission in time.
- Item 5 (partial): did not demo a second user denied task access (401 without login verified).
- Loom recording and GitHub PR — must complete before deadline.

## Done means

Floor items 1–4 work with evidence above, docs are complete, and the recording exists. Stretch items are optional credit only after the floor.
