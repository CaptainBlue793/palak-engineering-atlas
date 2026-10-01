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
