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
- Ch 6 Physical clocks, NTP & skew: NTP exchange lab (client offset, request and reply delay, drift, poll interval; estimate, hidden asymmetry error, delay bound, worst error before the next poll), NtpSample and LwwRegister in Java, LWW losing a newer write, PTP, Facebook ntpd to chrony
- Ch 7 Lamport clocks: space-time sandbox (three processes, add local events and messages, click two events for happens-before or concurrent against their timestamps, tie-broken total order), LamportClock and Stamp in Java, the one-way clock condition, Raft terms as a logical clock
- Ch 8 Vector clocks: three-device shopping list (edit offline, sync pairwise, version vectors compared entry by entry, siblings kept on conflict, merge on one device), VectorClock with compareTo and HybridClock in Java, version-vector costs, Riak's sibling explosion and dotted version vectors
- Ch 9 Replication basics: timeline engine for four set-ups (single leader async, single leader waiting for one follower, multi-leader, leaderless 2 of 3) against four situations (read elsewhere, two writers, a region cut off, a replica dying), with stale reads, refusals, conflicts and lost writes computed; write(entry, waitFor) in Java; RDS Multi-AZ and read replicas
- Ch 10 CAP & PACELC: a write at A then a read at C under two policies (partition: C or A; otherwise: C or latency), with the network healthy or cut and C near or across an ocean, giving latency, staleness or refusal and the PACELC class; the two-node proof; read() with both choices in Java; classifying real systems by configuration; Brewer's ATM
- Ch 11 Consistency models: history checker (five preset histories on one register, click a read to change its value; linearizable, sequential and causal verdicts by exhaustive search for a legal ordering, read-your-writes and monotonic reads per client, with a witness order), Session with a version token in Java, the non-linearizable two-replica figure, Cosmos DB's five levels
- Ch 12 Quorums: quorum simulator (N of 3 or 5, W and R dials, click replicas to fail them, write, read once or 100 times, sloppy quorum with stand-ins and hinted handoff, read repair, anti-entropy; overlap, miss probability, failures survived and stale reads counted), put and get with firstK in Java, why strict quorums are not linearizable, Cassandra consistency levels
- Ch 13 Leader election: five-node election panel (bully or ring with every message logged and counted, crash and restart nodes, split the network 2 | 3, optional majority rule; two leaders under a split, none on the minority side with the rule), LeaderLease in Java, causes of split brain, leases and their clock assumption, fencing pointed forward to Ch 32, Kubernetes Lease-based leader election
- Ch 14 Primary-backup: three servers and a view service (client writes forwarded to the backup before replying, crash and restart servers, cut one off from the view service, numbered views with promotion of the backup only and state transfer, a stale primary refused by its former backup, a double failure that leaves nobody to promote), handle and onForward in Java, chain replication, VMware FT
- Ch 15 State machine replication: three replicas of one account applying a log of commands (deposit, withdraw, double, fee, bonus) in the agreed order or in arrival order, with the bonus fixed by the leader or computed locally, divergence shown per replica, and snapshots replacing the log prefix; StateMachine, applyCommitted and the TTL fix in Java; sources of non-determinism; Paxos Made Live
- Ch 16 Paxos: single-decree sandbox (two proposers wanting X and Y, three acceptors that can be taken down, prepare and accept as separate steps with every message logged; value adoption, partial acceptance, duelling proposers; fuzzed with 16,000 random steps and no change of a chosen value), Acceptor and valueToPropose in Java, the safety argument, Multi-Paxos, Cassandra lightweight transactions
