# Backend & API — Interactive Course

Building the service itself: HTTP and API design, data access, authentication and authorization,
idempotency, concurrency control, caching, rate limiting, background jobs, webhooks, real-time
connections, gRPC and GraphQL, then testing, resilience, observability, security and deployment.
**48 chapters across five levels, plus an 8-chapter Prerequisites level** (P1–P8: Python for backend
work, async Python, curl and HTTP tools, JSON and schemas, SQL for application developers,
configuration and secrets, pytest, and the path a request takes to your code).

Static site, **zero dependencies**, no build step required to read it. Open `index.html` in a
browser; progress, quiz scores and flashcard state are saved in `localStorage` under `api-*` keys.

> **Status: in progress.** Chapters are written in order, one commit each. Pages still marked with
> `<!-- api:placeholder -->` are unwritten; `grep -l api:placeholder *.html` lists them.

## The levels

| Level | Chapters | What it covers |
|---|---|---|
| **Prerequisites** | P1–P8 | Python for backend work, async Python and the event loop, curl and the browser dev tools, JSON and schemas, SQL for app developers, configuration and secrets, pytest, how a request reaches your code |
| **Beginner** | 1–10 | What a backend does, HTTP for API builders, a first FastAPI service, REST resource design, validation and errors, database access, ORMs and migrations, pagination, authentication, authorization |
| **Intermediate** | 11–24 | OAuth 2.0 and OpenID Connect, JWTs, versioning, OpenAPI contracts, idempotency, optimistic concurrency, transactions in application code, caching, rate limiting, background jobs, webhooks, file uploads, WebSockets and server-sent events, gRPC |
| **Advanced** | 25–36 | GraphQL, testing APIs, structuring a service, concurrency inside a service, timeouts and circuit breakers, the outbox pattern, observability, performance, API security, multi-tenancy, gateways, deployment |
| **Expert** | 37–40 | Zero-downtime changes, public APIs and SDKs, debugging in production, the interview playbook |
| **Case Studies** | 41–48 | Stripe's idempotency keys, GitHub's REST and GraphQL APIs, an unauthenticated API breach, flash-sale rate limits, real-time messaging, a webhook platform, ticket booking, migrating a monolith's API |

Where this course meets the others, each keeps its own angle and links across: Networks covers
TCP, TLS and HTTP on the wire; Databases covers storage engines and isolation in depth; System
Design and Distributed Systems cover architecture across many services; Cloud & DevOps covers
containers, CI/CD and Kubernetes. This course is about building and running one service well.

## Study tools

- **`glossary.html`**: backend and API terms, each linked to the chapter that introduces it
- **`flashcards.html`**: spaced-repetition deck generated from the chapter quizzes
- **`mock-interview.html`**: timed room with 20 concept and API-design problems, a phase timer, an 8-point rubric and notes saved locally

## Tools

```bash
node tools/scaffold.cjs            # create placeholder pages for chapters in tools/chapters.cjs
node tools/build-study-data.js     # regenerate assets/study-data.js (search index + flashcards)
node build.js                      # -> dist/backend-api-course.html, the single-file offline edition
```

`assets/app.js` holds the `CHAPTERS` registry, the single source of truth for the sidebar, the
navigation and progress. `tools/chapters.cjs` is the original plan (with each chapter's outline);
`node tools/scaffold.cjs --registry` rewrites the registry from it, so only use that flag before
chapters start being edited by hand.

## House style

Listings are Python with FastAPI and Pydantic, following the same five rules: validate at the
boundary with Pydantic models; type everything, so the OpenAPI document is generated from the code;
keep handlers thin, with business rules in a service layer; put a timeout on every network call; and
return errors as problem details with a stable code, never a stack trace.
