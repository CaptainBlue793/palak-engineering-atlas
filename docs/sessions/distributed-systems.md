# Distributed Systems — session log

## 2026-10-01 — session 1
- Done: chapter list approved by the owner as drafted (tools/chapters.cjs, P1–P8 + 48, no changes).
- Decisions: overlapping topics keep one owner each — fencing tokens in Ch 32 (Ch 13 only shows split brain and
  points forward); SWIM probing in Ch 5, SWIM dissemination in Ch 23; Kafka: Ch 28 delivery semantics, Ch 29 broker
  internals, Ch 43 history/design story; Dynamo/TrueTime/Jepsen concept chapters teach the idea, case studies
  (42/41/48) cover the real system, incidents and evolution.
- Step 2: course home (pill, lead, 4-layer dependency map with 24 nodes + routes, Java code-style strip,
  playbook link, footer), glossary (131 terms), mock interview (18 problems, 6-phase plan with a failure
  walkthrough phase, 8-row rubric), flashcards intro, README.
- Needs a shared change: none yet.
- Next: P1 and onwards, one commit per chapter.

## Chapters (one commit each)
- P1 Java concurrency refresher: race-lab panel (double vote), firstK quorum futures, happens-before, event loop
- P2 RPC & timeouts: timeout-lab panel (latency histogram, false timeouts, unknown outcomes), Outcome type, deadlines
- P3 Serialization: live Protobuf encoder panel with v1/v2/v3 readers (unknown fields, reused field number)
- P4 Failure arithmetic: availability calculator (tiers, quorum replicas, correlated outage), MTBF/MTTR, S3 2017
- P5 Clocks on one machine: wall vs monotonic panel (step back/forward, leap second, slew), Ticker injection, leap-second incidents
- P6 Hashing: placement lab (Murmur3 vs String.hashCode, mod N vs ring, keys moved on N→N+1), floorMod, hot keys
- P7 Reading papers: claim-sorting panel (Raft/Dynamo/Spanner goals, assumptions, mechanisms, evidence), three passes, Figure 2 to code
- P8 Building blocks recap: fail-a-block panel (state per tier, failure timelines, chapter map), dual write, GitHub 2018
- Ch 1 Eight fallacies: fallacy lab (loss, jitter, topology move; naive→timeout→retry→idempotency), partial failure, JVM DNS cache
- Ch 2 System models: model explorer (sync/partial/async × crash/recovery/Byzantine heartbeat detector), durable vote in Java, Cloudflare 2020
- Ch 3 gRPC in Java: deadline lab (propagation, cancellation, wasted work), service/server/client/streaming code, status-code retry table, HTTP/2 LB pitfall
- Ch 4 Retries: open-loop retry-storm lab (metastable failure, budget, deadline-aware server), Retrier with full jitter, idempotency-key store, DynamoDB 2015
- Ch 5 Failure detectors: detector duel (fixed timeout vs phi accrual on LAN/WAN/GC), PhiAccrualDetector in Java, SWIM probing, cheap suspicions

## 2026-10-07 — session 2 (standalone clone)
- Setup: the course is now written in a standalone clone, `C:\Users\palak\atlas-courses\distributed-systems`, on
  `feature/distributed-course` with `main` merged in (OS, Networks and Databases are released there). 13 lessons existed
  (P1–P8, Ch 1–5); Ch 6 onwards is written here, one commit per chapter, pushed after each.
- Decisions carried over from the earlier courses: lesson objectives are wrapped in `<span>` from Ch 6 on, so that inline
  `<code>` does not split the flex row; every table sits inside `.table-wrap`; each lesson is loaded headlessly at 1100 px and
  390 px before its commit. Cross-course links point at the released Databases, Networks and OS lessons where they own a topic
  (storage engines, MVCC, TCP, clocks on one machine), and this course does not re-teach them.

## Chapters, session 2 (one commit each)
