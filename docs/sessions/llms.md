# LLMs — session log

Branch `feature/llms-course`, worktree `C:\Users\StarBlue\atlas-courses\llms` (cut from `main` at `2e7367f`).
Code: Python with PyTorch and Hugging Face, trained and measured on this machine (RTX 5070 Ti, 16 GB). Runtime namespace: `LLM`; storage prefix `llm-`.
Measurement scripts and the venv live outside the repo in `C:\Users\StarBlue\atlas-courses\llm-lab`.

## 2026-10-21 — session 1
- Owner: "start working on LLM course. Start in a new feature branch and do it". Plan (P1–P8 + 48) drafted and approved as drafted; owner chose to **train and fine-tune locally** (a tiny GPT from scratch, small open models such as GPT-2 and Qwen2.5 0.5B–1.5B), not inference-only.
- Decisions: scope is how an LLM is built and run, from the inside. ML & AI Systems (one-chapter surveys of transformers, fine-tuning, alignment, serving), Deep Learning (backprop in general), NLP (pre-transformer language tasks), RAG and Single Agent are linked where they go further, not repeated. Deep Learning and NLP are not written yet, so P1–P8 cover the PyTorch, probability and text basics the chapters need. Case studies 41–48 stay placeholders for the all-courses pass.
- Registry stub completed in `assets/atlas.js` (`indexVar: 'LLM_INDEX'`, `first`, `dist`; still `soon`) and the shell scaffolded with `tools/new-course.cjs`.
- Needs a shared change at release: add `llm-` to the account-sync allow-lists (`assets/account.js` TRACK regex, `api/src/index.js` and its test, ACCOUNTS.md), then a Worker redeploy; a METRO station already exists for `llms`.
- Next: course shell (home page, glossary, mock interview, README), then P1.
- Course shell: home page (4 × 6 dependency map: text & tokens, training, adapting, running & evaluating; code-style strip run on GPT-2 rev 607a30d in bf16: ' 200' 18.4%, ' 204' 4.1%, ' 0' 4.1%, ' 304' 2.5%, ' 1' 2.5%), glossary (84 terms), mock interview (22 problems; Clarify / Model / Data & training / Inference / Evaluate / Wrap-up; 8-row rubric), README. Lab: torch 2.11.0+cu128 (RTX 5070 Ti, sm_120), transformers 5.20.2, peft 0.21.2, Python 3.12.
