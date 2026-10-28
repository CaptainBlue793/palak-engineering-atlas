# Computer Vision — session log

Branch `feature/cv-course`, worktree `C:\Users\StarBlue\atlas-courses\computer-vision` (cut from `main` at `0f5e0f4`).
Code: Python with PyTorch and torchvision, trained and measured on this machine (RTX 5070 Ti, 16 GB). Runtime namespace: `CV`; storage prefix `cv-`.
Measurement scripts live outside the repo in `C:\Users\StarBlue\atlas-courses\cv-lab` (venv: `llm-lab\.venv`, torch 2.11 cu128). Ship a chapter with `sh ../cv-lab/ship_cv.sh <page> "<title>" "<log line>"`.

## 2026-10-28 — session 1
- Owner: "Finish CV course in a new feature branch. As usual keep placeholder for the case studies". Plan (P1–P8 + 48) drafted and approved as drafted; owner chose to **train and measure locally** (CNNs/ViTs on CIFAR-10, small detectors and segmenters, a DDPM from scratch, pretrained torchvision/HF models).
- Decisions: scope is how machines see, from pixels up. Deep Learning (backprop in general), LLMs (transformers; Ch34 multimodal LLMs), ML & AI Systems and RAG (vector search) are linked where they go further, not repeated. Deep Learning is not written yet, so P1–P8 cover the PyTorch and image basics the chapters need. Case studies 41–48 stay placeholders for the all-courses pass.
- Registry stub completed in `assets/atlas.js` (`indexVar: 'CV_INDEX'`, `first`, `dist`; still `soon`) and the shell scaffolded with `tools/new-course.cjs`.
- Needs a shared change at release: add `cv-` to the account-sync allow-lists (`assets/account.js` TRACK regex, `api/src/index.js` and its test, ACCOUNTS.md), then a Worker redeploy; check a METRO station exists for `computer-vision`.
