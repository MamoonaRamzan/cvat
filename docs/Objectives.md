# Objectives — Annotation Analytics Assessment

## Environment (for any number reported later)

- OS: Microsoft Windows 11 Pro (10.0.26200)
- CPU: Intel(R) Core(TM) i7-8650U CPU @ 1.90GHz
- RAM: 15.9 GB
- Stack: local Docker Compose CVAT
- Sample task: `coco-val2017-200` (task id=1) — **200** COCO val2017 images; **1,635** labeled shapes in the database for that task
- Cloned commit SHA: d4f1aff1929b68cf744edcb0a55b958bbf171de2
- Branch: dev-test01

---

## MO-1 — Annotation counts API latency

| Field | Entry |
| --- | --- |
| ID | MO-1 |
| What is measured | Elapsed time for an authenticated GET request to `/api/test/annotation-counts/1`, measured using Django's test client inside the `cvat_server` container, including view execution and database access. |
| How | Script `sample-data/measure_mo1.py` (copied to container): **one warm-up GET excluded**; then **five consecutive timed GETs** to the same endpoint; same task and DB state; **median** is the primary metric. |
| Target | Median of 5 measured runs at or below **500 ms**. |
| Why this target | Local Docker on a laptop; aggregating **1,635** labeled shapes across **200** images via one grouped query should stay fast; 500 ms allows ORM/permission overhead without being trivial. |
| Conditions | Task id=1, local Docker, warm-up discarded, no UI render. |
| Not included | Cold start after container restart (discarded warm-up). Unauthenticated calls. **Not included:** full end-to-end latency through browser, network, Traefik, or nginx — see limitations below. |

### Measurement procedure

1. Run inside `cvat_server` with Django settings loaded.
2. Log in test client as superuser (same auth path as an authenticated API user).
3. One warm-up `GET /api/test/annotation-counts/1` — **not recorded**.
4. Five timed runs; record elapsed seconds per run (`time.perf_counter()` around `client.get(...)`).
5. Compute median, min, max, and range across the five runs.

### Results

| Run | time_total (s) |
| --- | --- |
| 1 | 0.0183 |
| 2 | 0.0153 |
| 3 | 0.0141 |
| 4 | 0.0152 |
| 5 | 0.0147 |

- Median: **0.0152 s** (15.2 ms)
- Min / max: 0.0141 s – 0.0183 s
- Range (max − min): **0.0042 s** (4.2 ms)
- Raw command output:

```text
run=1 status=200 seconds=0.0183
run=2 status=200 seconds=0.0153
run=3 status=200 seconds=0.0141
run=4 status=200 seconds=0.0152
run=5 status=200 seconds=0.0147
median=0.0152
min=0.0141 max=0.0183
```

- Hit target? **yes** (median 15.2 ms vs 500 ms target)

### Limitations (how to interpret MO-1)

MO-1 measures **application-level** request handling (Django view + DB + permission checks via the test client). It does **not** measure a complete real-world round trip through the browser, LAN/Wi‑Fi, or the reverse proxy in front of `cvat_server`. **Do not treat 15.2 ms as end-to-end browser API latency.** For comparable numbers, rerun `measure_mo1.py` on the same machine and task.

---
