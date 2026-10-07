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
- DB 31: Search & Inverted Indexes: live search over six titles (analyser levels, posting lists, real BM25 scores)
- DB 32: Vector Databases: 150 vectors in eight k-means lists, exact search vs IVF with 1, 2 or 4 lists probed, recall and a movable query
- DB 33: Caching & Materialised Views: cache and database stepped through four invalidation schemes, in order and with the unlucky interleaving
- DB 34: Schema Migrations at Scale: a column rename stepped through as a direct rename or as expand and contract, with four servers on mixed code versions
- DB 35: Backups & Point-in-Time Recovery: four backup plans against three incidents on a five-day timeline, giving what is recovered, what is lost and how long the restore takes
- DB 36: Distributed SQL: a five-node cluster with three replicas of every range (inserts split ranges, replicas rebalance, machines fail and are repaired, ranges without a majority stop)
- DB 37: Performance Tuning Playbook: a day of pg_stat_statements for nine queries, ranked by mean time, calls or total time, with fixes applied from the top and the load removed
- DB 38: ORMs & the N+1 Problem: one page of posts loaded lazily, joined, select-in or mixed, with the statements sent, rows returned and time for 10, 50 or 200 posts
- DB 39: SQL Interview Drills: five classic questions built in three stages each, with results computed from small tables that contain the awkward case (ties, a same-day pair, an empty cell)
- DB 40: Database Interview Playbook: assemble a two-minute answer to three questions from ten points each (four essential, three depth, three wrong), with a time bar and the interviewer's reaction
- DB 41: Case Study: Designing an E-Commerce Schema: one order's invoice under two designs (joins to live rows, or facts copied at purchase) as the price, name and address change and the product is deleted
- DB 42: Case Study: A Slow Query Made Fast: the planner's choice among three plans for three accounts, with extended statistics and a partial composite index switched on or off, and the rows read and time for each
- DB 43: Case Study: Uber's Move from Postgres to MySQL: the structures one UPDATE writes with 2, 6 or 12 secondary indexes, for a PostgreSQL heap-only update, a PostgreSQL update to a new location, and InnoDB, with bytes replicated and read cost
- DB 44: Case Study: GitHub's MySQL Failover Incident: three failover policies against three faults (a 43-second partition, a dead primary, a lost data centre), with the state of both sites and the cost of each
- DB 45: Case Study: Discord's Trillions of Messages: three partition keys and three bucket lengths against four channels, giving the largest partition and the partitions read for the latest 50 messages
- DB 46: Case Study: Instagram's Sharded IDs: real 64-bit IDs built from a time, a user's logical shard and a sequence, shown as bits, decoded back, and unchanged when the number of servers changes
- DB 47: Case Study: Building a Mini LSM Key-Value Store: the store running (put, delete, get with its search path, crash and restart, compaction) with the memtable, the log and every table's contents shown; the 125 lines of Python were tested against a dictionary over 40,000 random operations and 178 restarts
- DB 48: Case Study: An Analytics Warehouse: bytes read, time and monthly cost of four queries over two years of events, with partitioning by day, clustering by event type or customer, and daily rollups switched on or off
- Status after DB 48 (2026-10-07): all 56 lessons are written (P1–P8 + Ch 1–48). A full sweep loaded every lesson headlessly at 1100 px
  and at 390 px: five quizzes, one panel, at least one figure, no script errors, no horizontal overflow, no placeholder left.
  Audit: 0 errors. Bundle rebuilt (60 pages, 2.33 MB). Bundle, palette and hub checks pass.
- The phone-width sweep found 12 of the session-1 lessons (P1, P3, P6–P8, Ch 1–5, 8, 10) overflowing: their comparison tables were not
  inside `.table-wrap`. All 23 bare `table.t` elements in P1–P8 and Ch 1–10 are now wrapped. The stylesheet expects the wrapper,
  which supplies the frame and the scrolling. No wording changed.
- Checked beyond the panels: Ch 39's queries were run in SQLite and agree with the panel's results. Ch 46's decoding example was
  recomputed independently. Ch 47's 125 lines of Python were run against a dictionary (40,000 random operations, 178 restarts, a
  torn log line, a half-finished compaction), and a script confirms that every tested line appears in the lesson unchanged.
- Not checked against sources: the figures and dates in the real-system write-ups (GitLab 2017, Spanner and F1, OpenAI, Stack
  Overflow, Shopify, Uber, GitHub 2018, Discord, Instagram and Snowflake, LevelDB, LinkedIn and Kafka, and those in the earlier
  chapters) were written from memory. They are worth a read by the owner before release.
- Needs a shared change (release, Step 4 of the playbook; not done, waiting for the owner's go-ahead): in `assets/atlas.js` remove
  `soon: true` from the databases entry. `chapters` is already 56. `hours` is 42 and the lessons total 2,475 minutes (41.25
  hours), so 41 or 42 is the owner's call. In `README.md` add the Database Internals & SQL row to the course table, drop it from
  "On the way", change the totals to 396 chapters (340 main + 56 prerequisites) and about 290 hours, and add `databases/` to the
  folder tree. Still open from before: the `.objectives li` flex fix in `style.css`, the README table's order, the home page's
  meta description, and release `networks-v1.0.0`.
- Next: the owner's go-ahead, then Step 4 (shared edits, checks, pull request into main, and release `databases-v1.0.0` if wanted).
  After that, the next course (Distributed Systems).
- Release prepared (2026-10-07, with the owner's go-ahead): the shared edits above are made on this branch. `assets/atlas.js`:
  `soon` removed and `hours` set to 41 (2,475 minutes). `README.md`: the Database Internals & SQL row, totals of 396 chapters
  and ~290 hours (the registry's live courses sum to exactly that), and `databases/` in the folder tree. Checks: content audit
  0 errors across all courses, bundle check, palette check, hub check in light, dark and at 390 px all pass. Left for later, as
  before: the `.objectives li` fix, the README table's order, and the home page's meta description. No release tag is published.
