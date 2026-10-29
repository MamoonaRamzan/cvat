# Plan — Annotation Analytics Assessment

## Commit / environment (filled from local checks)

- Branch: dev-test01
- Cloned commit SHA: d4f1aff1929b68cf744edcb0a55b958bbf171de2
- OS: Microsoft Windows 11 Pro (10.0.26200)
- CPU: Intel(R) Core(TM) i7-8650U CPU @ 1.90GHz
- RAM: 15.9 GB
- Docker: present (Compose v5.x)

### COCO images used ()

COCO images used: (not imported yet)

## Goal (floor first)

Deliver items 1-4 solidly: API counts per class, then a page, then a graph, then empty + error states.
Auth, speed objective, and extras only after that.
Honest stop is better than a rushed broken feature.

## Order of work (8 hours)

1. Docker up + createsuperuser + COCO task with visible boxes — ~45 min active (pull/wait does not count) — in progress
2. Explore CVAT: task -> job -> label -> shape in DB / existing APIs — ~45 min — not started
3. New Django app "test" + endpoint: annotation counts per class for a task — ~90 min — not started
4. UI page that calls the API — ~45 min — not started
5. Graph + empty state + failed-request state — ~45 min — not started
6. Auth: refuse no login + refuse no task access (item 5) — ~45 min — stretch
7. One measurable speed target for the endpoint; 5 runs; median + spread — ~30 min — stretch
8. Tick Definition of Done with evidence; update this Plan if scope changed — ~20 min — required before submit
9. Loom under 5 min (demo + request path + K1-K4) — ~30 min — required before submit

## Intentionally skipping unless steps 1-5 above are solid

- Assessment item 7: extra filter / grouping
- Assessment items 8-9: WebSocket live updates + reconnect
- Assessment item 10: decision record below (add only if reached)

## Decisions already made

- Backend lives in a new Django app named "test" (per brief).
- Floor is items 1-4 before any live/WebSocket work.
- First git commit = this Plan only (no feature code).
- PR only against own fork, never cvat-ai/cvat.

## Plan change log

- start: Initial plan (assessment start)

## Decision record (assessment item 10) —

