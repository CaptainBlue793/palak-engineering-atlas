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
