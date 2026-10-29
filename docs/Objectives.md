# Objectives — Annotation Analytics Assessment

## Environment (for any number reported later)

- OS: Microsoft Windows 11 Pro (10.0.26200)
- CPU: Intel(R) Core(TM) i7-8650U CPU @ 1.90GHz
- RAM: 15.9 GB
- Stack: local Docker Compose CVAT
- Sample: task coco-val2017-200 (200 COCO val2017 images)
- Cloned commit SHA: d4f1aff1929b68cf744edcb0a55b958bbf171de2
- Branch: dev-test01

---

## MO-1 — Annotation counts API latency

| Field | Entry |
| --- | --- |
| ID | MO-1 |
| What is measured | Time for authenticated GET `/api/test/annotation-counts/1` until JSON is ready (server handles request). |
| How | Django test client inside `cvat_server` after one warm-up; 5 timed runs (`measure_mo1.py`). Same view + DB path as browser/API. |
| Target | Median of 5 runs at or below **500 ms**. |
| Why this target | Local Docker on a laptop; ~1635 shapes aggregated by label should stay fast with a single grouped query. |
| Conditions | Task id=1, local Docker, warm-up discarded, no UI render. |
| Not included | Cold start after container restart (discarded warm-up). Unauthenticated calls. |

### Results

| Run | time_total (s) |
| --- | --- |
| 1 | 0.0183 |
| 2 | 0.0153 |
| 3 | 0.0141 |
| 4 | 0.0152 |
| 5 | 0.0147 |

- Median: **0.0152 s** (15.2 ms)
- Min / max (spread): 0.0141 s – 0.0183 s
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

---
