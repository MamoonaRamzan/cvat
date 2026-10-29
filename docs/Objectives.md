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
| What is measured | Time for the authenticated HTTP GET that returns per-class annotation counts for task id=1, from request start until the full JSON body is received. |
| How | `curl.exe` (or equivalent) with cookie/token from a logged-in session; record total time with `%{time_total}` (or PowerShell `Measure-Command`) for 5 successive calls after one warm-up call that is discarded. |
| Target | Median of 5 measured runs at or below **500 ms**. |
| Why this target | Local Docker on a laptop CPU; counting shapes for ~200 images / ~1460 annotations should be a simple DB aggregate. 500 ms leaves room for Django/ORM overhead without being a no-op target. If we miss it, we write why (query shape, N+1, cold DB, etc.). |
| Conditions | Chrome or curl against `http://localhost:8080`, local Docker stack, sample task above, nothing heavy running on the machine. |
| Not included | First request after container restart (warm-up discarded). UI render time. Unauthenticated calls. Tasks larger than this sample. |

### Results (fill after the endpoint exists )

| Run | time_total (s) |
| --- | --- |
| 1 | |
| 2 | |
| 3 | |
| 4 | |
| 5 | |

- Median:
- Min / max (spread):
- Raw command output:
- Hit target? yes / no — reason if no: 

---

