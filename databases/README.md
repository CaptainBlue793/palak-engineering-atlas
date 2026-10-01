# Database Internals & SQL — Interactive Course

What happens between your SQL and the disk. The SQL that interviews and real jobs ask for (joins,
window functions, schema design, indexes, transactions), then the engine underneath: pages, the
buffer pool, B-trees and LSM trees, query planning, the write-ahead log, isolation and MVCC, and
finally scaling out with replication, sharding, column stores and distributed SQL.
**48 chapters across five levels, plus an 8-chapter Prerequisites level** (P1–P8: tables and keys,
a first `SELECT`, disks and pages, data types, loading JSON and CSV, Python with psycopg, relational
algebra, data-size arithmetic).

Every listing is PostgreSQL SQL, with Python (psycopg) where application code matters.

Static site, **zero dependencies**, no build step required to read it. Open `index.html` in a
browser; progress, quiz scores and flashcard state are saved in `localStorage` under `db-*` keys.

> **Status: in progress.** Chapters are written in order; `grep -l db:placeholder *.html` lists the
> ones still to write. Each finished chapter has an interactive panel, SQL listings in the house
> style, a sequence or workflow diagram, a comparison table, a real-world use case, a
> common-mistakes box, an interview drill and a five-question quiz.

## The levels

| Level | Chapters | What it covers |
|---|---|---|
| **Prerequisites** | P1–P8 | Tables and keys, `SELECT` and `NULL`, disks and pages, data types, `COPY`/CSV/JSON, psycopg and SQL injection, relational algebra, sizing tables |
| **Beginner** | 1–10 | The relational model, filtering and pagination, joins, `GROUP BY`, subqueries and CTEs, window functions, normalisation, constraints, a first look at indexes, ACID |
| **Intermediate** | 11–24 | Pages and heap files, the buffer pool, B-trees, LSM trees, GIN/GiST/BRIN, how a query runs, `EXPLAIN`, join algorithms, the cost-based optimiser, WAL and recovery, isolation anomalies, two-phase locking, MVCC, deadlocks |
| **Advanced** | 25–36 | Replication, partitioning and sharding, connection pooling, column stores, time series, NoSQL families, search, vector databases, materialised views, schema migrations, backups and PITR, distributed SQL |
| **Expert** | 37–40 | The tuning playbook, ORMs and N+1, SQL interview drills, the database interview playbook |
| **Case Studies** | 41–48 | An e-commerce schema, a slow query made fast, Uber's Postgres → MySQL move, GitHub's 2018 failover, Discord's messages, Instagram's sharded IDs, a mini LSM store in Python, an analytics warehouse |

## Study tools

- **`glossary.html`**: database terms, each linked to the chapter that explains it
- **`flashcards.html`**: spaced-repetition deck generated from the chapter quizzes (five cards per chapter)
- **`mock-interview.html`**: timed room with 20 schema, SQL and internals problems, a phase timer, an 8-point rubric and notes saved locally

## Tools

```bash
node tools/scaffold.cjs            # create placeholder pages for chapters in tools/chapters.cjs
node tools/build-study-data.js     # regenerate assets/study-data.js (search index + flashcards)
node build.js                      # -> dist/databases-course.html, the single-file offline edition
```

`assets/app.js` holds the `CHAPTERS` registry, the single source of truth for the sidebar, the
navigation and progress. `tools/chapters.cjs` is the original plan (with each chapter's outline);
`node tools/scaffold.cjs --registry` rewrites the registry from it, so only use that flag before
chapters start being edited by hand.

## House style

Every SQL listing is written the same way: keywords in capitals, names in `snake_case`, one clause
per line; every table has a primary key and its rules as constraints; named columns instead of
`SELECT *`; values passed as parameters, never formatted into the SQL string; and every
performance claim backed by `EXPLAIN (ANALYZE, BUFFERS)`.
