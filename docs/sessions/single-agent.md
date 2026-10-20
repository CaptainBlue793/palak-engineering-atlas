# Single Agent — session log

Branch `feature/single-agent-course`, worktree `C:\Users\StarBlue\atlas-courses\single-agent` (cut from `main` at `ce12c46`).
Code: Python with a local model (qwen3:14b) served by Ollama 0.40.6, ollama-python 0.6.3. Runtime namespace: `AGENT`; storage prefix `agent-`.
Measurement scripts and the venv live outside the repo in `C:\Users\StarBlue\atlas-courses\agent-lab` (RTX 5070 Ti 16 GB).

## 2026-10-20 — session 1
- Owner: "Resume the agents tab work, the 2 remaining courses" (RAG released; Single Agent, then Multi-Agent Systems). Both plans approved as drafted; measure with **qwen3:14b only** (no 3B baseline; Ch 22 compares thinking on/off and settings instead of model sizes).
- Done: chapter plan in `single-agent/tools/chapters.cjs` (P1–P8 + 48). Case studies 41–48 stay placeholders for the later all-courses pass.
- Multi-Agent plan (P1–P4 + 26) drafted and approved on `feature/multi-agent-course` (worktree `…\atlas-courses\multi-agent`); it starts after Single Agent.
- Decisions: scope is building one agent that works; ML & AI Systems (Ch 22 agents survey), RAG (retrieval; Ch 34 agentic RAG), OS (processes, containers), Cloud & DevOps and Multi-Agent Systems are linked where they go deeper, not repeated.
- Registry stub completed in `assets/atlas.js` (`indexVar: 'AGENT_INDEX'`, `first`, `dist`; still `soon`) and the shell scaffolded with `tools/new-course.cjs`.
- Course shell: home page (4 × 6 dependency map, Python agent-loop code-style strip verified against qwen3:14b), glossary (79 terms), mock interview (22 problems, Clarify / Tools / Loop / Safety / Evaluate / Wrap-up phases, 8-row rubric), flashcards, README.
- Needs a shared change at release: add `agent-` (and later `mas-`) to the account-sync allow-lists in `assets/account.js` (TRACK regex) and `api/src/index.js`, then a Worker redeploy.
