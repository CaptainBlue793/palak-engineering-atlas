# Engineering Atlas expansion: five new courses, new palettes, role paths

_Design approved in conversation on 2026-09-30. Owner: Palak Deb Patra._

## 1. Goal

Grow the Atlas from four courses to nine so it covers the core CS subjects and the
operational side of backend work, and help learners choose an order through them.

- **Add five full-depth courses**: OS & Concurrency, Computer Networks, Database
  Internals & SQL, Distributed Systems, Cloud & DevOps.
- **Give all nine courses a two-hue palette**, like ML & AI's teal → violet (Set C, §3).
- **Show learning paths on the home page**: one general "Complete Atlas" order plus
  nine role paths (§4).

Success means each new course matches the existing courses in depth and format; the
home page shows all nine courses (unreleased ones marked "Coming soon") and ten paths;
progress in every course syncs through accounts from its first day.

Out of scope: Security Engineering (possible later course), SMS sign-in, refactoring
the shared runtime into one engine (rejected, §6).

## 2. Delivery: six sub-projects, in order

Each sub-project gets its own branch, is merged to `main` and released before the next
starts. Courses are built one commit per chapter, like LLD.

| # | Sub-project | Branch | Release |
|---|---|---|---|
| 0 | Atlas hub (registry, palettes, paths, sync prefixes) | `feature/atlas-hub` | push to `main` (GitHub Pages) |
| 1 | OS & Concurrency | `feature/os-course` | `os-v1.0.0` |
| 2 | Computer Networks | `feature/networks-course` | `networks-v1.0.0` |
| 3 | Database Internals & SQL | `feature/databases-course` | `databases-v1.0.0` |
| 4 | Distributed Systems | `feature/distributed-course` | `distributed-v1.0.0` |
| 5 | Cloud & DevOps | `feature/devops-course` | `devops-v1.0.0` |

Each course's exact chapter list is written into its `tools/chapters.cjs` and reviewed
with the owner when that course starts; §5 fixes the outline.

## 3. Palettes (Set C)

The first colour is the course's own hue (no two courses share one); the second is a
neighbouring or contrasting tone. Light values are used on white; dark values in dark mode.
Light-mode first colours are dark enough for link text on white; ML's teal is kept as it is.

| Course | Blend | Light c1 · c2 | Dark c1 · c2 | Status |
|---|---|---|---|---|
| System Design | blue → cyan | `#2563eb` · `#0891b2` | `#60a5fa` · `#22d3ee` | c2 changes (was `#0284c7`) |
| ML & AI Systems | teal → violet | `#0d9488` · `#8b5cf6` | `#2dd4bf` · `#a78bfa` | unchanged |
| DSA | fuchsia → rose | `#c026d3` · `#e11d48` | `#e879f9` · `#fb7185` | c2 changes (was `#db2777`) |
| Low-Level Design | indigo → violet | `#4f46e5` · `#7c3aed` | `#818cf8` · `#a78bfa` | c2 changes (was `#6366f1`) |
| OS & Concurrency | red → amber | `#dc2626` · `#d97706` | `#f87171` · `#fbbf24` | new |
| Computer Networks | green → cyan | `#15803d` · `#0e7490` | `#4ade80` · `#22d3ee` | new |
| Database Internals & SQL | gold → olive | `#a16207` · `#4d7c0f` | `#facc15` · `#a3e635` | new |
| Distributed Systems | purple → pink | `#9333ea` · `#db2777` | `#c084fc` · `#f472b6` | new |
| Cloud & DevOps | slate → orange | `#334155` · `#ea580c` | `#94a3b8` · `#fb923c` | new |

For the **five new courses**, each course's `assets/style.css` sets `--accent` = c1 and
`--accent-2` = c2 (light), and `--accent` = d1, `--accent-2` = d2 (both dark blocks), with their
`-soft` rgba variants at the alpha the file already uses. For the **existing courses** only
`--accent-2` changes (System Design, DSA, LLD); their `--accent` keeps its current value, which
may differ slightly from the hub's `c1`/`d1` (e.g. DSA `#b5179e`). In `assets/atlas.js`: `c1`/`c2`
are the light values and `d1`/`d2` the dark values; `tools/palette-check.cjs` checks each course.

## 4. Learning paths

**Featured general path, "The complete Atlas":**
DSA → OS → Networks → Databases → LLD → System Design → Distributed → Cloud & DevOps → ML & AI.
Fundamentals, then design, then scale and operations; ML last because it builds on all of
it (it can also be taken on its own).

**Role paths** (optional "go further" steps in brackets):

| Path | Steps |
|---|---|
| 🎓 Campus placements / SDE-1 | DSA → OS → Databases → Networks → LLD |
| 🎯 Cracking the SDE-2+ interview | DSA → LLD → System Design (→ Distributed) |
| 🛠️ Backend engineer | Databases → Networks → OS → LLD → System Design (→ Distributed) |
| 🚦 SRE / platform / DevOps | OS → Networks → Cloud & DevOps → System Design (→ Distributed) |
| 🗄️ Data engineer | Databases → Distributed → Cloud & DevOps → System Design (→ ML & AI) |
| 🧠 ML / AI engineer | ML & AI → System Design (→ Distributed → Cloud & DevOps) |
| ⚙️ ML infrastructure / MLOps | OS → ML & AI → Distributed → Cloud & DevOps (→ System Design) |
| 🧱 CS fundamentals (self-taught / career switch) | DSA → OS → Networks → Databases (→ LLD) |
| 🏛️ Senior / staff / architect | System Design → Distributed → Databases → Cloud & DevOps (→ LLD) |

**Layout B (chosen):** the featured path as a full-width strip, then the nine role paths
as a card grid (3 columns, 1 on narrow screens). Each step is a chip in the course's
gradient. Optional steps are dashed; unreleased courses are faded and not links; released
steps link to the course and show a tick when the course is complete. Each card shows
"N of M courses complete", counting released required steps only.

## 5. Course outlines

Shared shape (same as LLD): Prerequisites P1–P8 (stored as 0.1–0.8), then Beginner →
Intermediate → Advanced → Expert → Case Studies, about 48 chapters. The last Expert chapter
is the interview playbook. Every chapter has one interactive panel, sequence/flow diagrams
(`figure.seq`, `figure.flow`), a comparison table (`table.t.cmp`), a use case
(`.callout.usecase`), a common-mistakes box, an interview drill and exactly 5 quiz questions,
with computing examples, not everyday analogies. Every course ships a glossary, flashcards,
a mock-interview room, Ctrl+K search and an offline single-file build.

Where courses meet, each keeps its own angle and cross-links: OS explains how containers
work, DevOps runs them; Networks covers Kubernetes networking, DevOps operates Kubernetes;
Distributed goes deeper into protocols and code than System Design's Expert level.

| Course | Folder · prefix | Code |
|---|---|---|
| OS & Concurrency | `os/` · `os` | C (POSIX), a little Python |
| Computer Networks | `networks/` · `net` | Python sockets + `curl`, `dig`, `tcpdump` |
| Database Internals & SQL | `databases/` · `db` | PostgreSQL SQL + Python |
| Distributed Systems | `distributed-systems/` · `dist` | Java |
| Cloud & DevOps | `cloud-devops/` · `ops` | Bash, Dockerfile, Kubernetes YAML, Terraform, GitHub Actions |

### 5.1 OS & Concurrency
- **P1–P8:** C for systems (pointers, structs, memory); how a CPU executes code; the memory hierarchy; bits and hex; compiling and linking; the Linux shell; files and processes from user space; syscalls and man pages.
- **Beginner:** what an OS does; kernel vs user mode, syscalls; processes (`fork`/`exec`/`wait`); threads; context switches; scheduling (FCFS, SJF, round robin, MLFQ, CFS); IPC (pipes, signals, shared memory); file descriptors.
- **Intermediate:** paging and page tables; TLB; page faults; page replacement (LRU, Clock); `malloc` internals; race conditions; mutexes and spinlocks; condition variables; semaphores; producer–consumer, readers–writers, dining philosophers; deadlock and the banker's algorithm; file systems and journaling.
- **Advanced:** atomics and memory models; lock-free structures (CAS, ABA); thread pools; `epoll`/`io_uring` and event loops; `mmap` and copy-on-write; page cache and `fsync`; NUMA, cache coherence, false sharing; virtualization; namespaces and cgroups; boot and drivers; ASLR and sandboxing.
- **Expert:** `perf`/`strace`; tail latency; priority inversion (Mars Pathfinder); OS playbook.
- **Case studies:** the shell running `ls | grep`; nginx and 10k connections; Postgres on the OS; Redis `fork` snapshots; goroutines vs JVM threads; starting a Docker container; Chrome's sandbox; an OOM-killer incident.

### 5.2 Computer Networks
- **P1–P8:** encoding and bytes; IP arithmetic; ports and client/server; `ping`/`curl`/`dig`; Python sockets; Wireshark basics; layering; latency vs bandwidth.
- **Beginner:** OSI vs TCP/IP; Ethernet and switches; ARP; IP and subnetting; routing tables; ICMP and traceroute; UDP; the TCP handshake; NAT; DNS resolution.
- **Intermediate:** TCP reliability; flow control; congestion control (CUBIC, BBR); `TIME_WAIT`; HTTP/1.1 → 2 → 3/QUIC; TLS 1.3; DHCP; IPv6; WebSockets and SSE; gRPC on the wire; proxies; L4 vs L7 load balancing.
- **Advanced:** BGP; anycast and CDNs; DNS in depth (DNSSEC, GeoDNS); VPNs (WireGuard); VLANs and VXLAN; Clos data-centre networks; Kubernetes networking (CNI); service mesh and mTLS; Nagle and head-of-line blocking; kernel networking (NIC, zero-copy, DPDK); firewalls and iptables; DDoS.
- **Expert:** packet-level debugging; internet latency budgets; SDN; Networks playbook.
- **Case studies:** typing google.com packet by packet; a WebRTC call; a CDN and a viral video; Facebook's 2021 BGP outage; the 2016 Dyn DNS attack; load-balancer failover; UDP for games; debugging a slow API from a capture.

### 5.3 Database Internals & SQL
- **P1–P8:** tables and keys; basic `SELECT`; disks and files; data types; JSON and CSV; Python with `psycopg`; sets and relational algebra; data-size arithmetic.
- **Beginner:** the relational model; filtering; joins; `GROUP BY`; CTEs and subqueries; window functions; normalization; constraints; first look at indexes; ACID.
- **Intermediate:** pages and heap files; buffer pool; B-trees; LSM trees; GIN/GiST/bitmap indexes; query planning and execution; `EXPLAIN`; join algorithms; cost-based optimizer; WAL and recovery; isolation anomalies; two-phase locking; MVCC; deadlocks.
- **Advanced:** replication; partitioning and sharding; connection pooling; column stores and OLAP; time-series storage; NoSQL families; inverted indexes; vector databases; materialized views; schema migrations at scale; backups and PITR; distributed SQL.
- **Expert:** tuning playbook; ORMs and N+1; SQL drills; DB playbook.
- **Case studies:** an e-commerce schema; a slow query made fast; Uber's Postgres → MySQL move; GitHub's MySQL failover incident; Discord's messages on ScyllaDB; Instagram's sharded IDs; a mini LSM key-value store; an analytics warehouse.

### 5.4 Distributed Systems
- **P1–P8:** Java concurrency refresher; RPC and timeouts; serialization (Protobuf); failure arithmetic (nines); clocks; hashing; reading a paper; system-design building blocks recap.
- **Beginner:** fallacies of distributed computing; system models; gRPC in Java; retries and idempotency; failure detectors; NTP and skew; Lamport clocks; vector clocks; replication basics; CAP and PACELC.
- **Intermediate:** consistency models; quorums; leader election; primary–backup; state-machine replication; Paxos; Raft (two chapters); consistent hashing; rebalancing; two-phase commit; sagas; gossip; Merkle trees.
- **Advanced:** CRDTs; Dynamo-style eventual consistency; Chandy–Lamport snapshots; exactly-once delivery; Kafka internals; watermarks; ZooKeeper and etcd; leases and fencing tokens; PBFT; blockchain consensus; TrueTime; distributed tracing.
- **Expert:** Jepsen and deterministic simulation; TLA+; FLP impossibility; playbook.
- **Case studies:** Spanner; Dynamo; Kafka; etcd and Kubernetes; Cassandra; GFS/HDFS; MapReduce → Spark; a Jepsen split-brain report.

### 5.5 Cloud & DevOps
- **P1–P8:** Linux command line; Bash; Git; YAML; networking for ops; `systemd`; SSH; `curl` and HTTP APIs.
- **Beginner:** DevOps and SRE; regions and AZs; compute; block/object/file storage; VPCs and security groups; IAM; Docker; Dockerfiles; registries; CI with GitHub Actions.
- **Intermediate:** Kubernetes architecture; pods, deployments, services; config and secrets; ingress; storage; Helm; rolling/blue-green/canary; GitOps with Argo CD; Terraform (two chapters); metrics, logs, traces; SLOs and alerting.
- **Advanced:** autoscaling; serverless and cold starts; operating a mesh; Vault and KMS; supply-chain security; landing zones; FinOps; disaster recovery (RPO/RTO); multi-region; chaos engineering; platform engineering; policy as code.
- **Expert:** incident response and postmortems; on-call and toil; capacity planning; playbook.
- **Case studies:** laptop to production; a zero-downtime migration; a Kubernetes outage; AWS us-east-1 (2021); CrowdStrike (2024) and staged rollouts; a cloud-cost blowout; monolith to Kubernetes; the 2025 GitHub Actions supply-chain attack.

## 6. Architecture

**Approach: clone the LLD shell per course** (chosen). Copy `lld/` (runtime, `style.css`,
study tools, `build.js`, `tools/`), rename the runtime namespace and storage prefix, apply
the palette, plan chapters in `tools/chapters.cjs`, generate placeholder chapters with
`tools/scaffold.cjs`, then write chapters one by one. Shared visual components stay in sync
via `tools/components/install.cjs`. Rejected: extracting one shared course engine (refactors
four live courses and their offline builders before any content ships) and a JSON content
engine (a rewrite).

### 6.1 Sub-project 0: Atlas hub
- **`assets/atlas.js` `COURSES`:** add the five courses (id, title, mark, tagline, blurb,
  topics, chapters, hours, `c1`/`c2`, store, indexVar, dir, first, dist, release) with a new
  field `soon: true`. Removing `soon` is the only hub change needed when a course is released.
  Marks (24×24 stroked SVG): OS a CPU chip with pins; Networks three linked nodes; Databases
  a stacked cylinder; Distributed a ring of four nodes; DevOps an infinity loop.
- **`soon` behaviour:** the card is muted with a "Coming soon" badge, not a link and has no
  progress bar; the course is left out of the combined progress card, the "continue" logic,
  cross-course search, the tools grid and "reset progress".
- **Course grid:** 2×2 → 3 columns (2 on medium screens, 1 on phones), cards ordered as in §3.
- **Paths:** replace `PATHS` with the featured path plus nine role paths from §4; each
  entry is `{ id, icon, title, blurb, steps: [...], optional: [...] }`; render as in §4.
- **Existing courses' colours:** update `c2` in `atlas.js` and `--accent-2`/`--accent-2-soft`
  (both themes) in `system-design/`, `dsa/` and `lld/` `assets/style.css`; rebuild their
  offline bundles (`node build.js`) and study data if affected.
- **Account sync:** add `os|net|db|dist|ops` to the key pattern in `assets/account.js`
  (`TRACK`) and `api/src/index.js` (progress whitelist). The Worker must be redeployed
  (owner runs `npm run deploy` in `api/`). Add an API test that an `os-done` key round-trips.
- **Audit:** `tools/content-audit.cjs` already iterates a `courses` list; each course
  sub-project adds its folder there.

### 6.2 Sub-projects 1–5: each course
- Folder and prefix per §5; runtime namespace `OS`, `NET`, `DB`, `DIST`, `OPS`; index
  globals `OS_INDEX`, `NET_INDEX`, `DB_INDEX`, `DIST_INDEX`, `OPS_INDEX`.
- `<dir>/dist/<dir>-course.html` built by the course's `build.js`, which must keep the Atlas
  link rewrite and the account-loader hook that the other courses' `app.js` files have.
- On release: remove `soon`, set `chapters`/`hours` from the real registry, add to the audit
  list, rebuild, commit, merge, push, `gh release create <tag> <dist file>`.

## 7. Testing and verification

- **Hub:** headless Chrome screenshots of the home page in light and dark mode at desktop,
  tablet and 390 px widths; check the "Coming soon" cards aren't links, path chips link only to
  released courses, and combined progress ignores `soon` courses. `node tools/content-audit.cjs
  check` passes. API tests pass (24 existing + the new prefix test) against local dev.
- **Each chapter:** headless Chrome run of its interactive panel with scripted clicks; 5 quiz
  questions; audit passes with no placeholder left; null-byte check before commit
  (OneDrive has corrupted files before).
- **Each course release:** offline bundle opens from `file://`, navigation and search work, no
  console errors; the study data (search index, flashcards) is regenerated.

## 8. Risks

- **Size:** about 280 chapters in total, many sessions. Mitigation: one commit per chapter, a
  `SESSIONS.md` entry per session, a course is only listed as released when complete.
- **Shared-origin localStorage:** all of `captainblue793.github.io` shares storage, so
  prefixes must stay distinctive; `db-`/`net-`/`ops-` are only read by Atlas code.
- **Worker redeploy is manual** (the auto-mode classifier blocks it). The new prefix test runs
  against local dev (the live Worker never returns sign-in codes, so the end-to-end test can't run
  there); the hub isn't merged until the owner has redeployed and Wrangler confirms the upload.
- **Line endings:** `install.cjs` and rebuilds flip CRLF; restore files whose content
  didn't change before committing.
