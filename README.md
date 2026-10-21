# The Engineering Atlas

**[captainblue793.github.io/palak-engineering-atlas](https://captainblue793.github.io/palak-engineering-atlas/)**

Every interactive engineering course I've written, in one place — **732 chapters (628 main chapters plus a 104-chapter Prerequisites level), ~524 hours,
zero dependencies**. No walls of text: every chapter has animated diagrams, simulators you can
break, an interview drill and a quiz. It all runs in your browser, offline, with no account and
no build step.

| Course | Chapters | Covers |
|---|---|---|
| **[DSA](dsa/)** | 8 prerequisites + 56 | Every structure and algorithm, in one consistent C++ house style |
| **[OS & Concurrency](os/)** | 8 prerequisites + 48 | Processes, virtual memory, file systems, locks, epoll and containers in C — plus 8 case studies |
| **[Computer Networks](networks/)** | 8 prerequisites + 48 | TCP/IP layer by layer, DNS, TLS, HTTP/2 and 3, BGP, CDNs and packet-level debugging in Python and the CLI — plus 8 case studies |
| **[Database Internals & SQL](databases/)** | 8 prerequisites + 48 | SQL from the first SELECT, then pages, B-trees and LSM trees, query plans, WAL, MVCC, replication and sharding in PostgreSQL and Python — plus 8 case studies |
| **[Low-Level Design](lld/)** | 8 prerequisites + 46 | SOLID, design patterns, concurrency and 16 case studies in Java |
| **[Backend & API](backend-api/)** | 8 prerequisites + 48 | HTTP and REST design, validation and errors, databases from a service, authentication, OAuth and JWT, idempotency, caching, rate limiting, background jobs, webhooks, gRPC and GraphQL, then testing, observability, performance, security and deployment in Python and FastAPI — 8 case studies on the way |
| **[System Design](system-design/)** | 8 prerequisites + 42 | Caching, sharding, queues, consensus, multi-region — plus 17 case studies |
| **[Distributed Systems](distributed-systems/)** | 8 prerequisites + 48 | Clocks, replication, quorums, Paxos and Raft, two-phase commit, CRDTs, Kafka and stream processing in Java — plus 8 case studies |
| **[Cloud & DevOps](cloud-devops/)** | 8 prerequisites + 48 | Docker, Kubernetes, CI/CD, Terraform and observability, then SLOs, disaster recovery, cost and incident response in Bash, YAML and Terraform — plus 8 case studies |
| **[ML Fundamentals](ml-fundamentals/)** | 8 prerequisites + 48 | Regression, classification, trees and ensembles, clustering, dimensionality reduction, forecasting, calibration, interpretability, leakage and honest evaluation in Python and scikit-learn — 8 case studies on the way |
| **[ML & AI Systems](ml-ai-systems/)** | 8 prerequisites + 52 | Transformers, RAG, agents, distributed training, inference, MLOps |
| **[RAG](rag/)** | 8 prerequisites + 48 | Chunking, embedding models, exact, HNSW and IVF vector search, BM25 and hybrid search, reranking, query rewriting, citations and grounding, evaluation, permissions, GraphRAG, prompt injection and running it in production, measured on small local models in Python — 8 case studies on the way |
| **[Single Agent](single-agent/)** | 8 prerequisites + 48 | The agent loop, tool calling and tool errors, structured output, context engineering, planning and decomposition, memory, sandboxed code execution, MCP, prompt injection and permissions, reliability and evaluation, cost and latency, observability and debugging, coding and browser agents, measured on a local model in Python — 8 case studies on the way |

The Atlas home page suggests an order through the courses for each kind of role.


## Optional accounts

Learners can sign in with **email + phone** and a one-time code (sent by email) to sync progress across
devices. The configured backend is a Cloudflare Worker + D1 database in `api/`, with Resend delivering
sign-in emails — see **[ACCOUNTS.md](ACCOUNTS.md)** for how it works and the setup steps.

### Website, accounts and email workflow

The website is hosted on **GitHub Pages**. Its JavaScript calls the account API at
`https://atlas-accounts-api.atlas-accounts-api.workers.dev`. Your domain **`palakdebpatra.com`**
provides the email identity: sign-in codes are sent from **`login@palakdebpatra.com`**.

```mermaid
flowchart TD
    Pages["GitHub Pages<br/>Static course website"]
    Browser["Learner's browser"]
    Local["Browser localStorage<br/>Progress on this device"]
    Worker["Cloudflare Worker<br/>Accounts API"]
    DB[("Cloudflare D1<br/>Codes, sessions and progress")]
    Resend["Resend<br/>Email delivery"]
    Inbox["Recipient email service<br/>Learner's inbox"]
    DNS["Cloudflare DNS<br/>palakdebpatra.com<br/>SPF, DKIM and DMARC"]

    Pages -->|Serves HTML, CSS and JavaScript| Browser
    Browser <-->|Saves and reads progress| Local
    Browser -->|1. Request code with email and phone| Worker
    Worker <-->|Stores and reads account data| DB
    Worker -->|2. Send six-digit code through email API| Resend
    Resend -->|3. Email from login@palakdebpatra.com| Inbox
    Inbox -.->|Recipient mail server checks sender records| DNS
    Inbox -->|4. Learner reads the code| Browser
    Browser -->|5. Verify code and sync progress| Worker
```

**DNS is the public directory for your domain.** Cloudflare manages its records; SPF identifies
authorized email senders, DKIM lets receiving mail servers verify email signatures, and DMARC tells
them how to handle authentication failures. The current DMARC policy, `p=none`, requests monitoring
without requiring rejection or quarantine.

The custom domain is used for sending email; the website and API use the addresses above.
Without signing in, progress stays in the browser. After signing in, the Worker syncs it with D1
so the learner can continue on another device. Codes expire after five minutes; the phone number
is part of the account identity, and codes are delivered by email.

```
palak-engineering-atlas/
├── index.html          ← the Atlas (start here)
├── assets/atlas.js     ← the COURSES registry + hub runtime
├── dsa/                ← each course is a self-contained site
├── os/
├── networks/
├── databases/
├── lld/
├── backend-api/
├── system-design/
├── distributed-systems/
├── cloud-devops/
├── ml-fundamentals/
├── ml-ai-systems/
├── rag/
└── single-agent/
```

## What the Atlas adds

The courses are **not** merged into one file — each stays a standalone site with its own sidebar,
search, progress, glossary, flashcards and mock-interview room. The Atlas joins them at the
entry point:

- **Combined progress** — reads each course's own `localStorage` key (`dsa-done`, `os-done`,
  `net-done` and so on), so ticking a chapter off inside a course shows up on the hub, and vice versa.
  The chapter tracker on the home page has a tab per subject area: one square per chapter, 732 of them
  in released courses, and outlines for the courses still to come.
- **Resume** — deep-links to the next unread chapter of whichever course you're furthest into.
- **Cross-course search** — `Ctrl+K` (or `/`) searches ~12,600 chapter, section and demo entries
  across every released course at once, filterable by course, deep-linking to the exact anchor.
  The indexes load lazily after first paint, so the page opens instantly.
- **Shared theme** — the toggle writes every course's theme key, so it carries across.

## Running it

Open `index.html` in a browser. That's it — no install, no server, no build step.

Each course also builds into a single self-contained HTML file you can keep offline:

```bash
cd system-design && node build.js    # -> dist/system-design-course.html
```

Re-run that after editing any chapter in that course, and commit the `dist/` file.

## Adding a course

Everything on the hub is derived from the `COURSES` array at the top of `assets/atlas.js`.
Drop the course folder next to the others (use a url-safe slug) and add one object — cards,
progress, the mosaic, search, filters, study-tool links and the hero counts all pick it up.
Its `tab` field puts the card in one of the home page's subject tabs (`TABS`, just below);
a course marked `soon: true` shows there as a "Coming soon" card and nowhere else.
Optionally add it to a track in `PATHS` just below. The full field list is documented in that
file's header comment.

A course only needs the house layout for this to work: `index.html`, `glossary.html`,
`flashcards.html`, `mock-interview.html`, numbered chapter files, and an `assets/study-data.js`
that sets `window.<INDEX_VAR>` to `[{ n, f, ti, lv, e: [{ t, a, k }] }]`.

## History

Three of the courses previously lived in their own repositories
([system design](https://github.com/CaptainBlue793/palak-system-design-playlist),
[ML & AI systems](https://github.com/CaptainBlue793/palak_ML_AI_system_playlist),
[DSA](https://github.com/CaptainBlue793/palak-DSA-playlist)). Those are archived and kept only
so existing links keep working.

---

Written by **Palak Deb Patra**.
