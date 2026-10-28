# Computer Vision — session log

Branch `feature/cv-course`, worktree `C:\Users\StarBlue\atlas-courses\computer-vision` (cut from `main` at `0f5e0f4`).
Code: Python with PyTorch and torchvision, trained and measured on this machine (RTX 5070 Ti, 16 GB). Runtime namespace: `CV`; storage prefix `cv-`.
Measurement scripts live outside the repo in `C:\Users\StarBlue\atlas-courses\cv-lab` (venv: `llm-lab\.venv`, torch 2.11 cu128). Ship a chapter with `sh ../cv-lab/ship_cv.sh <page> "<title>" "<log line>"`.

## 2026-10-28 — session 1
- Owner: "Finish CV course in a new feature branch. As usual keep placeholder for the case studies". Plan (P1–P8 + 48) drafted and approved as drafted; owner chose to **train and measure locally** (CNNs/ViTs on CIFAR-10, small detectors and segmenters, a DDPM from scratch, pretrained torchvision/HF models).
- Decisions: scope is how machines see, from pixels up. Deep Learning (backprop in general), LLMs (transformers; Ch34 multimodal LLMs), ML & AI Systems and RAG (vector search) are linked where they go further, not repeated. Deep Learning is not written yet, so P1–P8 cover the PyTorch and image basics the chapters need. Case studies 41–48 stay placeholders for the all-courses pass.
- Registry stub completed in `assets/atlas.js` (`indexVar: 'CV_INDEX'`, `first`, `dist`; still `soon`) and the shell scaffolded with `tools/new-course.cjs`.
- Needs a shared change at release: add `cv-` to the account-sync allow-lists (`assets/account.js` TRACK regex, `api/src/index.js` and its test, ACCOUNTS.md), then a Worker redeploy; check a METRO station exists for `computer-vision`.
- Course shell: home page (4 × 6 dependency map: pixels & CNNs, recognition, detection & segmentation, generating & shipping; code-style strip run on ResNet-50 IMAGENET1K_V2, torchvision 0.26, skimage chelsea: Egyptian cat 33.9%, tabby 6.0%, tiger cat 4.9%; BGR-flipped: tiger cat 16.6%, tabby 14.6%, Egyptian cat 10.0%), glossary (98 terms), mock interview (26 problems; Clarify / Data / Model / Training / Evaluate & ship / Wrap-up; 8-row rubric), README. Lab: torch 2.11.0+cu128, torchvision 0.26.0, timm 1.0.30, scikit-image 0.26.0, opencv 5.0.0.
