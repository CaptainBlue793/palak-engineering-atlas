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
- P1 Python for Agent Code: ollama-python's hint-to-schema converter dropped a Literal enum, marked defaulted params required, lost list/dict item types; qwen3:14b with it sent a valid log level 1/18 vs 19/19 with a Pydantic enum (which silently coerced debug/critical to INFO/ERROR); 8 HTTP calls 4.05 -> 0.51 s with gather, 8 model calls 2.94 -> 2.91 s (OLLAMA_NUM_PARALLEL=1); 4 slots x 16k spilled 28% to CPU (best 4.78 s), 4 slots x 4k 1.21 s (2.4x); default context 40,960 put 10% on CPU (5.5 s vs 2.9 s at num_ctx 16,384, now the course default); shell=True timeout hung 10 s with an orphan, taskkill /T 2.62 s, direct 2.01 s.
- P2 Chat Messages, Roles & Turns: prompt tokens 22 (no tools) / 222 (1) / 1,268 (10) / 5,954 (50), ~118 per tool, 1.08 s prefill at 50; 20 single-metric lookups survive result-as-user-text, missing assistant call and call hidden by text (all 20/20); result missing -> 20/20 empty replies (continuation of the assistant turn); no history -> 20/20 asked what was meant; two parallel results: bare values in call order 20/20, swapped 0/20 (all attributed backwards; qwen3 template drops tool_name), labelled and swapped 20/20.
