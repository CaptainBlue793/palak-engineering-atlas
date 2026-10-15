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
- P2 Async Python & the Event Loop: coroutines, the event loop, blocking calls, FastAPI's def thread pool, CPU-bound work; event-loop timeline simulator with measured uvicorn figures.
- P3 curl, HTTPie & the Browser Dev Tools: curl flags, reading -v, JSON vs form bodies, redirects, -f exit codes, HTTPie, the network tab; simulator of 60 real curl runs against FastAPI.
- P4 JSON, Schemas & Serialisation: JSON types, numbers and money, dates and nulls, JSON Schema, serialising models, Unicode; Pydantic validation lab of 196 real FastAPI responses (strict mode rejects every date and decimal under FastAPI).
- P5 SQL for Application Developers: CRUD with row counts and RETURNING, joins and N+1 (measured 41x), indexes and column order, parameters and injection, reading plans; query-plan lab of 25 real SQLite runs on 500k rows.
- P6 Configuration, Secrets & Environments: environment variables, a validated settings object with production rules, source precedence, SecretStr and secret managers, environments, Docker Compose; simulator of a real loader run 48 ways.
- P7 Testing Basics with pytest: assertions and pytest's rewritten failures, fixtures and conftest, parametrize, fakes, mocks and dependency overrides, coverage; lab of 18 real pytest runs (5 planted bugs x 3 suites; 100% coverage still misses 2).
- P8 How a Request Reaches Your Code: DNS and TCP (measured localhost IPv6-first delay), TLS termination, load balancers and reverse proxies, forwarded headers, ASGI and workers, the FastAPI stack; waterfall of 16 measured paths with a modelled network distance.
- Ch 1 What a Backend Does: clients and servers, state in a shared store, APIs as contracts and Hyrum's law, latency percentiles and nines, a course map; measured hit counter (dict vs SQLite, 1 vs 3 uvicorn workers, before and after a restart).
- Ch 2 HTTP for API Builders: safe and idempotent methods, status codes, the headers that matter, content negotiation and gzip, keep-alive and HTTP/2-3; 96 raw requests to FastAPI (HEAD 405, partial Allow, trailing-slash 307, Accept ignored, 304, gzip 1814 to 331 bytes, keep-alive 13x).
- Ch 3 Your First Service with FastAPI: routes and handlers, path, query, header and body parameters, Pydantic bodies and constraints, response models, OpenAPI and /docs; ten real requests with a spy on the handler's arguments.
- Ch 4 REST Resource Design: resources and collections, IDs, URL rules, mapping actions to methods, links vs embedding vs expand, when REST does not fit; one order screen loaded three ways (measured requests, bytes and time, modelled network).
- Ch 5 Validation & Error Responses: validation at the boundary, 400 vs 422, RFC 9457 problem details, exception handlers, stable error codes; six failures under FastAPI defaults, debug=True (traceback leaks a password) and problem-details handlers.
- Ch 6 Talking to a Database: drivers and connections, SQLAlchemy pools (size, overflow, timeout, pre-ping), a yield-dependency session per request, pool exhaustion; 60 real checkouts bursting a SQLAlchemy pool (release vs hold vs leak, overflow 0 vs 10).
- Ch 7 ORMs, Migrations & N+1 Queries: SQLAlchemy typed models, identity map, a real Alembic autogenerate (index + column, and its SQL), lazy/joined/selectin/raise loading, raw SQL; every statement captured for 10/50/200 orders, before and after the FK index.
- Ch 8 Pagination, Filtering & Sorting: offset vs cursor (keyset) with opaque cursors, stable ordering, safe filters and sort allowlists, the cost of totals; 1M-row SQLite timings by depth (82 ms vs 0.26 ms at page 19,001) and a paging walk with inserts (offset repeats 3 orders).
- Ch 9 Authentication: Argon2id hashing with rehash, server-side sessions and cookie flags (HttpOnly, Secure, SameSite, __Host-), bearer tokens and API keys, logout and revocation; measured hash costs (SHA-256 667k/s vs Argon2id 14/s) driving a crack-time model.
- Ch 10 Authorization: authn vs authz, roles and permissions, scopes, object-level checks and scoped lists, a central policy; 60 real requests against role-only and policy+ownership apps (8 of 30 wrong vs 0; ID scan reads 20 of 20 vs 0).
