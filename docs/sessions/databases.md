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
- DB 12: The Buffer Pool: buffer-pool simulator (FIFO, LRU, clock sweep; 8 or 16 frames; hot pages with a scan, or random)
- DB 13: B-Trees: growable B+ tree with four keys a page (ordered or random keys, middle or right-edge splits, search and range scan)
- DB 14: LSM Trees: small LSM store (memtable, flushes, level 0 to 2 compaction, tombstones, real Bloom filters, write stall, amplification figures)
- DB 15: Hash, GIN, GiST & Bitmap Indexes: BRIN block-range panel against a B-tree (ordered, late arrivals, shuffled; day, week, month)
- DB 16: How a Query Runs: iterator-model stepper (LIMIT over a scan, over a Sort, and over an index scan; rows read before the first result)
- DB 17: Reading EXPLAIN: four EXPLAIN ANALYZE plans with per-node decoding (missing index, 1-row misestimate under a nested loop, sort spill, heap fetches)
- DB 18: Join Algorithms: cost comparison of nested loop, index nested loop, hash and merge join (outer rows, index, sorted inputs, work_mem)
- DB 19: The Cost-Based Optimiser: estimate, plan and reality for four filters (common value, stale statistics, correlated columns, expression), with each remedy
- DB 20: WAL & Crash Recovery: log, buffer pool and data files with update, commit, page write, checkpoint, crash and redo (LSN test, redo point)
- DB 21: Isolation Levels & Anomalies: two-session stepper for five anomalies at four isolation levels (results, errors and retries per level)
- DB 22: Locking & Two-Phase Locking: three-session lock-conflict panel on PostgreSQL's table and row locks (with the lock-queue pile-up behind ALTER TABLE)
- DB 23: MVCC: one row's versions with xmin/xmax, a writer, held reader snapshots and VACUUM limited by the oldest snapshot
- DB 24: Deadlocks in Databases: two opposite transfers stepped through with row locks and a wait-for graph (sender-first vs id order)
- DB 25: Replication: primary and standby with async or sync commit, a healthy, slow or disconnected standby, stale reads and failover loss
- DB 26: Partitioning & Sharding: three shard keys over four shards (data and write spread, shards visited by four operations, a very large customer)
- DB 27: Connection Pooling: throughput and time-in-database for five pool sizes at three loads on an 8-core server
- DB 28: Column Stores & OLAP: row store vs column store (plain and compressed) for four operations, with the cells of the table each one reads
- DB 29: Time-Series Storage: Gorilla encoder on real bits (delta-of-delta timestamps, XOR values) for steady, slow-moving and noisy series
- DB 30: NoSQL Families: one blogging site in five data models, with seven needs rated natural, workable or awkward for each
