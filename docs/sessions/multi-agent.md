# Multi-Agent Systems — session log

Branch `feature/multi-agent-course`, worktree `C:\Users\StarBlue\atlas-courses\multi-agent` (cut from `main` at `ce12c46`).
Code: Python with asyncio and a local model (qwen3:14b) served by Ollama 0.40.6, ollama-python 0.6.3. Runtime namespace: `MAS`; storage prefix `mas-`.
Measurement scripts and the venv live outside the repo in `C:\Users\StarBlue\atlas-courses\agent-lab` (RTX 5070 Ti 16 GB), shared with Single Agent.

## 2026-10-21 — session 1
- Plan approved by the owner on 2026-10-20 (P1–P4 + 26 chapters; case studies 24–26 stay placeholders for the all-courses pass); measure with **qwen3:14b only**.
- Registry stub completed in `assets/atlas.js` (`indexVar: 'MAS_INDEX'`, `first: 'p1-one-agent-recap.html'`, `dist: 'multi-agent-course.html'`, still `soon`); shell scaffolded with `tools/new-course.cjs multi-agent` (30 placeholders).
- Needs a shared change at release: add `mas-` to the account-sync allow-lists in `assets/account.js` and `api/src/index.js`, then a Worker redeploy.
