# Multi-Agent Systems — session log

Branch `feature/multi-agent-course`, worktree `C:\Users\StarBlue\atlas-courses\multi-agent` (cut from `main` at `ce12c46`).
Code: Python with asyncio and a local model (qwen3:14b) served by Ollama 0.40.6, ollama-python 0.6.3. Runtime namespace: `MAS`; storage prefix `mas-`.
Measurement scripts and the venv live outside the repo in `C:\Users\StarBlue\atlas-courses\agent-lab` (RTX 5070 Ti 16 GB), shared with Single Agent.

## 2026-10-21 — session 1
- Plan approved by the owner on 2026-10-20 (P1–P4 + 26 chapters; case studies 24–26 stay placeholders for the all-courses pass); measure with **qwen3:14b only**.
- Registry stub completed in `assets/atlas.js` (`indexVar: 'MAS_INDEX'`, `first: 'p1-one-agent-recap.html'`, `dist: 'multi-agent-course.html'`, still `soon`); shell scaffolded with `tools/new-course.cjs multi-agent` (30 placeholders).
- Needs a shared change at release: add `mas-` to the account-sync allow-lists in `assets/account.js` and `api/src/index.js`, then a Worker redeploy.
- P2 written: 8 tool calls (0.5 s) sequential 4.0 s, gather 0.5 s, limit 3 1.5 s; 4 qwen3:14b calls sequential 1.48 s vs gather 1.44 s (one GPU, queued: done at 0.36/0.74/0.92/1.44 s); wait_for stopped a 30 s hang at 1.00 s; plain gather lost results on one crash, return_exceptions kept them; as_completed + cancel 0.40 s vs 6 s. Links to Single Agent are plain-text references until both courses are on main.
- P3 written (seeded asyncio simulations): 40 jobs on a queue with 1/2/4/8 consumers 8.2/4.2/2.3/1.2 s, out-of-order pairs 0/7/8/16 of 39; pub-sub 3 subscribers x 3 events; at-least-once with 10% crash-before-ack: 200 msgs -> 226 deliveries, naive consumer 26 duplicate effects, idempotent 0
- P4 written (seeded simulations, 2,000 runs per fan-out cell): all workers succeed 10@5% 59.2%, 30@10% 4.0%; one retry per failed worker 97.0% / 75.0%; return_exceptions always returns. Retry storm (30 clients, capacity 5, 8 attempts): immediate 5/30 served in 205 attempts; backoff 30/30, 130 attempts, 3.31 s; backoff+jitter 30/30, 106 attempts, 1.12 s. Late replies (20%) retried: 15/100 applied twice without keys, 0 with idempotency keys. Circuit breakers in prose only (not measured).
