# Plan — Annotation Analytics Assessment

## Commit / environment (filled from local checks)

- Branch: dev-test01
- Cloned commit SHA: d4f1aff1929b68cf744edcb0a55b958bbf171de2
- OS: Microsoft Windows 11 Pro (10.0.26200)
- CPU: Intel(R) Core(TM) i7-8650U CPU @ 1.90GHz
- RAM: 15.9 GB
- Docker: present (Compose v5.x)

### COCO Sample Data

- Task: `coco-val2017-200`
- Images: 200
- Source: COCO val2017
- Image folder: `val2017_small`
- Annotation file: `instances_val2017_small.json`

## Goal (floor first)

Deliver items 1-4 solidly: API counts per class, then a page, then a graph, then empty + error states.
Auth, speed objective, and extras only after that.
Honest stop is better than a rushed broken feature.

## Order of work (8 hours)

Original order and estimates are kept; **final status** reflects what was submitted.

| # | Work | Budget | Final status |
| --- | --- | --- | --- |
| 1 | Docker up + createsuperuser + COCO task with visible boxes | ~45 min active (pull/wait does not count) | **Completed** |
| 2 | Explore CVAT: task → job → label → shape in DB / existing APIs | ~45 min | **Completed** |
| 3 | New Django app `test` + endpoint: annotation counts per class for a task | ~90 min | **Completed** |
| 4 | UI page that calls the API | ~45 min | **Completed** |
| 5 | Graph + empty state + failed-request state | ~45 min | **Completed** |
| 6 | Auth: refuse no login + refuse no task access (item 5) | ~45 min | **Completed** (401 unauthenticated; 403 user `assessment_limited`) |
| 7 | One measurable speed target for the endpoint; 5 runs; median + spread (MO-1) | ~30 min | **Completed** |
| 8 | Tick Definition of Done with evidence; update this Plan if scope changed | ~20 min | **Completed** |
| 9 | Loom under 5 min (demo + request path + K1–K4) | ~30 min | **Completed** |
| — | Assessment item 7: `min_count` filter | stretch | **Optional stretch completed** |
| — | Assessment items 8–9: WebSocket live updates + reconnect | stretch | **Optional stretch completed** |
| — | Assessment item 10: decision record | stretch | **Completed** (see below) |

## Initially skipping (updated at end)

At the start, stretch items 7–10 were **deferred until floor items 1–4 were solid**. After the floor was verified, **filter, WebSocket, reconnect, auth (403), MO-1, decision record, and Loom** were completed before submission. Nothing mandatory was left open.

## Decisions already made

- Backend lives in a new Django app named `test` (per brief).
- Floor is items 1-4 before any live/WebSocket work (order preserved in implementation).
- First git commit = this Plan only (no feature code).
- PR only against own fork, never cvat-ai/cvat.

## Plan change log

- **start:** Initial plan (assessment start).
- **after setup:** Recorded COCO sample (200 images); COCO import required task labels registered first.
- **final:** Floor (API, UI, graph, empty/error) completed; MO-1 measured; auth 401/403 verified; stretch completed (`min_count`, WebSocket, reconnect); decision record written; DoD and Loom finished. Docker/COCO download time delayed early work but did not change final scope.

## Decision record (assessment item 10)

**Approach taken:** Django ORM aggregation on `LabeledShape` (group by `Label.name`) in app `test`, shared by REST and WebSocket; UI uses Chart.js with `min_count` filter and WebSocket reconnect. **Why ORM here:** it uses CVAT’s existing models and DB truth, and the same path can enforce task-level access checks (`TaskPermission`) before returning counts.

**Approach rejected:** Raw SQL or reading exported COCO JSON — faster to prototype but bypasses CVAT auth/DB truth and duplicates import data.

**Cost of rejecting it:** ORM query is easier to permission-check and keep in sync with live annotations, at the cost of some query overhead (still well under MO-1 target).
