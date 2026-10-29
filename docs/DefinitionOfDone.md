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
  Evidence: `/tasks/1/annotation-analytics` (commit after UI fix)

- [x] Counts shown as a graph  
  Evidence: bar chart “Top 20 classes by annotation count” verified in UI

- [ ] Empty state handled (task with no annotations / no classes)  
  Evidence: _(how tested later)_

- [x] Failed request handled (API error shown cleanly)  
  Evidence: `/tasks/99999/annotation-analytics` shows Result error “Task not found” (UI verified)

- [ ] MO-1 measured: 5 runs, median + spread recorded in Objectives.md  
  Evidence: _(link to Objectives results section later)_

- [ ] Everything not finished is listed below (honest stop)  
  Evidence: see "Not finished"

- [ ] Loom ≤ 5 minutes recorded; answers K1–K4 without reading notes  
  Evidence: _(Loom URL later)_

## Stretch (only if floor above is done)

- [ ] Auth: unauthenticated request refused  
  Evidence: _(status code later)_

- [ ] Auth: user without task access refused  
  Evidence: _(status code later)_

- [ ] Extra filter or grouping beyond plain count  
  Evidence: _(what + why later)_

- [ ] Live updates over WebSocket  
  Evidence: _(how demonstrated later)_

- [ ] Recovers when WebSocket drops and returns  
  Evidence: _(how demonstrated later)_

## Not finished

_(Fill at the end. List assessment items you did not reach and why.)_

## Done means

Floor items 1–4 work with evidence above, docs are complete, and the recording exists. Stretch items are optional credit only after the floor.
