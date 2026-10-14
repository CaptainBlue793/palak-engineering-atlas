# Backend & API — session log

Branch `feature/backend-api-course`, clone `C:\Users\palak\atlas-courses\backend-api` (cut from `main` at `b055e8d`).
Code: Python with FastAPI and Pydantic, PostgreSQL, Redis, pytest and curl. Runtime namespace: `API`; storage prefix `api-`.

## 2026-10-14 — session 1
- Owner: "switch to backend&API and work on it (leave case studies as it is)", then "start working on backend course" (plan as drafted: Python + FastAPI).
- Done: chapter plan in `backend-api/tools/chapters.cjs` (P1–P8 + 48 chapters, ~39 h). Case studies 41–48 stay placeholders for the later all-courses pass.
- Decisions: scope is building and running one service; Networks, Databases, System Design, Distributed Systems and Cloud & DevOps are linked where they go deeper, not repeated.
- Registry stub completed in `assets/atlas.js` (`indexVar: 'API_INDEX'`, `first`, `dist`, `lang`; still `soon`) and the shell scaffolded with `tools/new-course.cjs`.
- Course shell: home page (4 × 6 dependency map, FastAPI code-style strip), glossary (103 terms), mock interview (20 problems, Clarify / Interface / Data / Reliability / Ship / Wrap-up phases, 8-row rubric), flashcards, README.
- Related fix outside this branch: `fix/sync-new-course-keys` adds `mlf-` and `api-` to the account-sync allow-lists (client and Worker); needs merging and a Worker redeploy.
- P1 Python for Backend Work: import-resolver simulator (3 working directories x 7 launch commands x absolute/relative imports; every outcome and message recorded from Python 3.11 and uvicorn 0.54 on the same layout; sys.path[0] and __package__ shown); venv and lock files; dataclass vs Pydantic measured ("3", "3.0", True accepted, "three" and 3.5 rejected in Pydantic 2.13); PyTorch torchtriton dependency-confusion use case
