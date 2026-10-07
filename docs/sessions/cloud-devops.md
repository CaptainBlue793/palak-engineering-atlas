# Cloud & DevOps — session log

## 2026-10-01 — session 1
- Done: chapter list approved by the owner as drafted (tools/chapters.cjs, P1–P8 + 48, no changes).
  Step 2: course home (hero, 4-layer map with 24 nodes and real edges, the style strip as a pinned GitHub Actions
  workflow, hero gradient now uses theme variables so it reads in dark mode), glossary (78 terms), mock interview
  (20 design/troubleshooting problems, Clarify→Design→Ship→Observe→Break it→Wrap-up phases, DevOps rubric), README.
- Decisions: owner's optional suggestions (managed databases, K8s RBAC) not adopted; RBAC and pod security will be
  covered inside Ch 36, managed-database operations inside Ch 4/32 where they fit.
- Needs a shared change: none yet.
- Next: P1.

### Chapters
- P1 The Linux Command Line: terminal simulator (02:00 502 page; disk full, deleted-but-open log), permission bits widget
- P2 Bash Scripting: script runner (deploy/cleanup/backup × -e/-u/pipefail), Steam rm -rf use case
- P3 Git Workflows: commit-graph simulator (fast-forward, merge, rebase, squash), PR sequence, trunk vs GitFlow
- P4 YAML & JSON: type inspector (YAML 1.1 vs 1.2 resolution, four documents, free input), jq
- P5 Networking for Operations: troubleshooter (5 faults: TTL, expired cert, 127.0.0.1 bind, firewall timeout, SAN mismatch)
- P6 Processes & systemd: supervisor simulator (4 failure modes × Restart= × RestartSec × start limit, journal output)
- P7 SSH & Keys: sshd hardening lab (auth.log for an hour of bots, second-session lockout test), ProxyJump vs agent forwarding
- P8 HTTP APIs & curl: stateful API console (token scopes, 6/min rate limit, dropped responses, idempotency keys, generated curl)

## 2026-10-07 — session 2: chapters 1 to 48

- Setup: standalone clone at `C:\Users\palak\atlas-courses\cloud-devops`, `main` merged in (it now carries the four
  finished courses). P1 to P8 re-checked at 1100 px and 390 px: no script errors, no overflow. The one table in
  `p4-yaml-json.html` that was not inside `.table-wrap` is wrapped.
- Conventions: runtime global `OPS`, theme key `ops-theme`, placeholder marker `<!-- ops:placeholder -->`, commit titles
  `OPS <n>: <Title>`, case-study hero pill `Case Study`. Use cases come from real systems and incidents and are written
  from memory; figures and dates need checking against sources before they are quoted elsewhere.
- Ch 1 DevOps & SRE: release-habits simulator (cadence x tests x approval x recovery over 12 seeded weeks; the four DORA metrics and a 99.9% error budget), delivery flow, nines table, roles table, interview rounds, Knight Capital use case
- Ch 2 Cloud Fundamentals: placement simulator (zones x instances per zone x standby region x failure, 96 settings, with monthly cost), zonal/regional/global scopes, IaaS/PaaS/SaaS, provider name map, shared responsibility, an example bill, OVHcloud Strasbourg fire use case
- Ch 3 Compute: one-day autoscaling simulator (fixed fleet vs tracking 70% or 50% CPU x 5 or 1 minute boot x on demand or spot, minute by minute with reclaims), instance type names and families, baked image vs install at boot, launch template and group in Terraform, spot notice handler, Netflix Aminator and Scryer use case
- Ch 4 Storage: lifecycle simulator (infrequent access x deep archive x expiry x object size x read rate over 36 months, 48 settings, bill split by storage class, transition and retrieval fees), block vs object vs file, growing a volume online, presigned upload, durability vs availability vs backup, storage classes, lifecycle JSON, Dropbox Magic Pocket use case
- Ch 5 VPC networking: packet tracer (4 connections x 7 switches, 512 settings checked against an independent rule: routes, public IP, security groups, stateless NACL, NAT, S3 gateway endpoint), address plan, public vs private, NAT sequence, SG vs NACL, peering and endpoints, debugging order and flow logs, Slack January 2021 transit gateway use case
- Ch 6 IAM: policy engine (2 principals x 4 requests x identity policy x permissions boundary x bucket policy, 144 settings checked against an independent rule; wildcard matching, explicit deny, cross-account both-sides rule, AWS-style denial messages), principals and policy anatomy, evaluation order, least privilege table, workload identity (metadata service v2, CI token exchange), Capital One 2019 use case
- Ch 7 Containers and Docker: container lifecycle simulator (published port x storage x restart policy x memory limit; write, curl, crash, leak, stop, start, reboot, redeploy; checked against a shadow model over 4,000 random steps), image vs container, exit codes, run flags, volumes, container networking and published ports, containers vs VMs, Google Borg use case
- Ch 8 Dockerfiles: build simulator (instruction order x stages x final base x .dockerignore x what changed, 120 settings checked against independent rules; per-instruction cache hits, build time, image size split, leaked context), layers and the cache rule, multi-stage Go and Node builds, base image table, non-root user, .dockerignore and secret mounts, Codecov 2021 use case
- Ch 9 Registries and tags: what-is-running simulator (latest vs version tag vs digest x pull policy x tag immutability; push, re-push, restart, scale out, deploy; invariants held over 1,430-step random walks in each of 12 settings), image name anatomy, blobs and manifests, tags vs digests, why not latest, tagging and promotion, image scanning loop with Trivy, Docker Hub pull limits 2020 use case
- Ch 10 CI with GitHub Actions: pipeline run simulator (trigger x job order x cache x failing test x matrix, 72 settings; job timeline, waiting time, billed minutes with per-job rounding and the macOS multiplier, fail-fast), a full four-job workflow, triggers, jobs and steps, cache keys and cache vs artefact, matrix cost, secrets, fork pull requests and token permissions, Travis CI 2021 use case
- Ch 11 Kubernetes architecture: what-still-works simulator (API server, etcd, scheduler, controller manager, a kubelet and a node can each be switched off; get, scale, delete, crash and wait; invariants held over 4,000 random steps and the cluster converged on all 778 repairs), control plane and node components, reconcile loop, apply-to-running sequence, object anatomy, kubectl essentials, Spotify cluster deletion use case
- Ch 11 fix: commit 0c94e38 shipped the panel without its plural helper, so its script threw on load; the helper is added and the 4,000-step walk re-run on the fixed page (0 violations, 778 of 778 repairs converged). Verification now runs as its own step before the commit step
- Ch 12 Pods, Deployments and Services: rolling update simulator (maxSurge x maxUnavailable x readiness probe x new version behaviour, second by second, 54 settings with the surge and availability rules checked every tick), pod status table, ReplicaSets and rollback, Services and endpoints, the three probes, graceful shutdown, a full Deployment and Service manifest, Monzo October 2017 use case
- Ch 13 ConfigMaps and Secrets: config propagation simulator (environment variable vs mounted file vs subPath x application reads once or re-reads x edit in place or hash-named ConfigMap; change, wait, rollout restart; 12 modes and a 2,800-step random walk), where a value should live, base64 is not encryption, what protects a Secret, env vars vs files, external secret stores compared, ExternalSecret manifest, Tesla 2018 use case
