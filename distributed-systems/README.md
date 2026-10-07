# Distributed Systems — Interactive Course

How programs behave when they run on many machines that fail independently and share no clock, in Java:
from "a remote call is not a local call" to Raft, CRDTs, Kafka and Spanner. **48 chapters across five
levels, plus an 8-chapter Prerequisites level** (P1–P8: Java concurrency, RPC and timeouts, serialization,
failure arithmetic, clocks on one machine, hashing, reading a systems paper, and a recap of the System
Design building blocks).

Static site, **zero dependencies**, no build step required to read it. Open `index.html` in a
browser; progress, quiz scores and flashcard state are saved in `localStorage` under `dist-*` keys.

> **Status: in progress.** The course home, glossary, mock-interview room and flashcards are ready;
> chapters are being written in order. `grep -l dist:placeholder *.html` lists the ones still to come.

## The levels

| Level | Chapters | What it covers |
|---|---|---|
| **Prerequisites** | P1–P8 | Java concurrency, RPC and timeouts, Protobuf, nines and MTBF, wall vs monotonic clocks, hashing, reading papers, System Design building blocks |
| **Beginner** | 1–10 | The eight fallacies, system models, gRPC in Java, retries and idempotency, failure detectors, NTP and skew, Lamport and vector clocks, replication, CAP and PACELC |
| **Intermediate** | 11–24 | Consistency models, quorums, leader election, primary–backup, state machine replication, Paxos, Raft (election, log replication), consistent hashing, partitioning, 2PC, sagas, gossip, Merkle trees |
| **Advanced** | 25–36 | CRDTs, Dynamo-style stores, Chandy–Lamport snapshots, exactly-once delivery, Kafka internals, watermarks, ZooKeeper and etcd, leases and fencing tokens, PBFT, blockchain consensus, TrueTime, distributed tracing |
| **Expert** | 37–40 | Jepsen and deterministic simulation testing, TLA+, FLP and other impossibility results, the interview playbook |
| **Case Studies** | 41–48 | Spanner, Dynamo and DynamoDB, Kafka, etcd and Kubernetes, Cassandra, GFS and HDFS, MapReduce to Spark, a Jepsen split-brain report |

This course goes deeper into protocols and code than the System Design course's Expert level, and
links to it wherever the two meet: System Design decides *which* building block to use, this course
shows how the block keeps its promises when machines fail.

## Study tools

- **`glossary.html`**: distributed-systems terms, each linked to the chapter that introduces it
- **`flashcards.html`**: spaced-repetition deck generated from the chapter quizzes
- **`mock-interview.html`**: timed room with 18 design problems (idempotent payments to a global SQL
  database), a phase timer that reserves time for the failure walkthrough, an 8-point rubric and notes saved locally

## Tools

```bash
node tools/scaffold.cjs            # create placeholder pages for chapters in tools/chapters.cjs
node tools/build-study-data.js     # regenerate assets/study-data.js (search index + flashcards)
node build.js                      # -> dist/distributed-systems-course.html, the single-file offline edition
```

`assets/app.js` holds the `CHAPTERS` registry, the single source of truth for the sidebar, the
navigation and progress. `tools/chapters.cjs` is the original plan (with each chapter's outline);
`node tools/scaffold.cjs --registry` rewrites the registry from it, so only use that flag before
chapters start being edited by hand.

## House style

Every listing is Java (17+) written the same way: every remote call has a deadline; a call has three
outcomes (success, failure, unknown); retries carry an idempotency key; durations use
`System.nanoTime()`, never the wall clock; messages are immutable `record`s and each node changes
state in one place, one message at a time.
