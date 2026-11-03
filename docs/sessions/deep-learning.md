# Deep Learning — session log

Branch `feature/dl-course`, worktree `C:\Users\StarBlue\atlas-courses\deep-learning` (cut from `main` at `c79e155`).
Code: Python with PyTorch, trained and measured on this machine (RTX 5070 Ti, 16 GB). Runtime namespace: `DL`; storage prefix `dl-`.
Measurement scripts live outside the repo in `C:\Users\StarBlue\atlas-courses\dl-lab` (venv: `llm-lab\.venv`, torch 2.11 cu128). Ship a chapter with `sh ../dl-lab/ship_dl.sh <page> "<title>" "<log line>"`.

## 2026-11-03 — session 1
- Owner: "only 1 more course left -> Deep learning. Start the work in a separate feature branch". Plan (P1–P8 + 48) drafted and APPROVED as drafted; trained and measured locally.
- Decisions: scope is how neural networks learn, independent of data type (autograd and backprop by hand, MLPs, optimisers, normalisation, residuals, core CNN/RNN/attention, a transformer from scratch, then mixed precision, speed, memory, batch size, tuning, generalisation, tabular, GNNs, SSMs, deep RL, μP, Triton). Links rather than re-teaches: ML Fundamentals (classical GD/losses), CV (CNN architectures, generative models), NLP (RNNs for text), LLMs (GPT decoder, LLM-scale tricks), ML & AI Systems (multi-GPU). Case studies 41–48 stay placeholders for the all-courses pass.
- Registry stub completed in `assets/atlas.js` (`indexVar: 'DL_INDEX'`, `first`, `dist`; still `soon`) and the shell scaffolded with `tools/new-course.cjs`.
- Needs a shared change at release: `dl-` sync keys (account.js TRACK regex, api/src/index.js and its test, ACCOUNTS.md, Worker redeploy), registry chapters/hours and remove `soon`, README table/tree, crosslinks topics, METRO station check.
- Next: course home, glossary, mock interview, README; lab `atlas-courses\dl-lab`; then P1.
