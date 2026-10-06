# Database Internals & SQL — session log

## 2026-10-01 — session 1
- Done: chapter list approved by the owner (P1–P8 + 48), with three small changes: P4 renamed
  "Data Types" (constraints belong to Ch 8), icons de-duplicated (Ch 27 🔌, Ch 28 🗄️), Ch 45 retitled
  "Discord's Trillions of Messages".
- Done: Step 2: course home (hero, 4-layer dependency map, SQL code-style strip, playbook link,
  footer), glossary (86 terms), mock interview (20 problems, DB phases and rubric), README.
  Flashcards intro checked; it is generic and needed no change.

### Chapters
- DB P1: Tables, Rows & Keys: key-chooser panel (unique / not null / stable)
- DB P2: Your First SELECT: query-builder panel with per-row true/false/unknown
- DB P3: Disks, Files & Pages: random-vs-sequential I/O calculator with crossover chart
- DB P4: Data Types: type lab panel (money, ID overflow, time zones, text limits, json/jsonb)
- DB P5: JSON, CSV & Loading Data: bulk-load calculator with race (autocommit, txn, batched, COPY)
- DB P6: Python & psycopg: SQL-injection lab (f-string vs parameter, with restore)
- DB P7: Sets & Relational Algebra: algebra workbench (σ π × ⋈ ∪ ∩ −, bag vs set)
- DB P8: Data-Size Arithmetic: size estimator with tuple byte map, padding and growth
- DB 1: The Relational Model: data-independence panel (navigational code vs SQL under storage changes)
- DB 2: Filtering, Sorting & Pagination: pagination lab (deep OFFSET cost + drift demo vs keyset)
- DB 3: Joins: join visualiser (7 join types, NULL padding, fan-out and fix); [hidden] rule in style.css
- DB 4: GROUP BY & Aggregates: grouping machine (WHERE/GROUP BY/HAVING stages, GROUP BY error)
- DB 5: Subqueries & CTEs: recursive CTE stepper with cycle bug and CYCLE clause
- DB 6: Window Functions: window playground (functions, partition, order, frames, click-to-highlight frame)
- DB 7: Schema Design & Normalisation: normalisation workbench (UNF→3NF with update/insert/delete anomalies)
- DB 8: Constraints & Integrity: constraint gatekeeper (FK ON DELETE modes, CHECK, lower() unique, exclusion, deferrable)
- DB 9: Indexes: A First Look: index lab (7 queries x 5 indexes: seq/index/bitmap/index-only, write cost)
- DB 10: Transactions & ACID: crash lab (txn vs autocommit, failing credit, synchronous_commit off)

## 2026-10-07 — session 2 (standalone clone)
- Setup: work continues in a standalone clone at `C:\Users\palak\atlas-courses\databases` (branch `feature/databases-course`), with
  `main` merged in (OS and Networks released, shared tools). 18 of 56 lessons were written (P1–P8, Ch 1–10); Ch 11–48 remain.
- Decisions: objectives are written `<li><span>…</span></li>` from Ch 11 on, so that an objective containing `<code>` doesn't split
  into columns (`.objectives li` is a flex row). Each chapter's panel is driven headlessly and its text checked against the panel's
  numbers before the commit; wide tables go in `.table-wrap`.
- DB 11: Pages, Tuples & Heap Files: slotted-page simulator (insert, update, delete, VACUUM; fillfactor 100 vs 70; HOT updates and redirects)
