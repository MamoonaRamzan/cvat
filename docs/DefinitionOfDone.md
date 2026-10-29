# Definition of Done — Annotation Analytics Assessment

Written before feature work. Tick only with evidence (number, path, screenshot note, or commit SHA). A ticked line with no evidence counts as unticked.

## Checklist

- [x] Sample data ready: task openable with labelled boxes  
  Evidence: task `coco-val2017-200`, 200 images, boxes visible after COCO import (verified in UI)

- [ ] Django app `test` exists and is wired into the project  
  Evidence: _(path + commit later)_

- [ ] API returns per-class annotation counts for a task, read from the database  
  Evidence: _(example JSON + how verified against known task later)_

- [ ] Web page calls that API  
  Evidence: _(UI route / how to open later)_

- [ ] Counts shown as a graph  
  Evidence: _(what chart library / screenshot note later)_

- [ ] Empty state handled (task with no annotations / no classes)  
  Evidence: _(how tested later)_

- [ ] Failed request handled (API error shown cleanly)  
  Evidence: _(how tested later)_

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
