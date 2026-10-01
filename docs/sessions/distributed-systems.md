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
