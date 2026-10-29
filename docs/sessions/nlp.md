# NLP — session log

## 2026-10-29 — session 1
- Done: worktree `atlas-courses\nlp`, branch `feature/nlp-course` from main 25fb5e8. Plan P1–P8 + 48 drafted (no NLP outline in the expansion spec) and APPROVED as drafted; owner chose **train locally**. Registry stub got indexVar NLP_INDEX, first, dist; `tools/new-course.cjs nlp` ran (shell + 56 placeholders). Scope: text up to encoder and encoder–decoder models; links to LLMs for BPE internals, the GPT decoder, decoding and instruction tuning.
- Needs a shared change (release time): `nlp-` sync keys (account.js, api index + test, ACCOUNTS.md), registry chapters/hours and remove `soon`, README table/tree, crosslinks topics.
- Next: course home, glossary, mock interview; lab `atlas-courses\nlp-lab`; then P1.
- Shell done: home page (4×6 map, code strip with a measured truncation demo), glossary (101 terms), mock interview (24 problems), README. Lab `atlas-courses
lp-lab` with drive/shot/eval/errs/links/inject and ship_nlp.sh.
- P1 shipped: café composed vs decomposed -> different cased-BERT tokens; uncased BERT strips Hindi vowel signs; XLM-R NFKC; C4 lines 28% non-ASCII, NFKC changes 1.6%; tweet_eval hub copy 0% non-ASCII (pre-folded).
- P2 shipped: masked pooling 86.94 vs 84.78; one review 70%→51% positive as padding grows; dynamic padding saved nothing on IMDB (0.853^64), bucketing cut padding 46.3%→1.8%, 1.56x faster.
- P3 shipped: \S+@\S+ on C4 49% trailing punctuation, 12% not addresses; 29% of strict dates ambiguous; ^(a+)+$ 1.21 s at 26 chars (x4 per 2); stop words -1.21 pts, other cleaning within ±0.25 (s.e. 0.19). Live tester runs in a worker killed at 1.5 s.
- P4 shipped: 140,665 types, 46.2% hapax; top 100 cover 44.3%; Zipf s=1.12, Heaps beta 0.57 (pred 142.6k vs 140.7k); P(states|united) 64%; product underflows at word 16 (fp32) / 96 (fp64); H 10.93 bits, ppl 1,948.
- P5 shipped: 25k x 44,796 TF-IDF 0.30% dense, CSR 39 MB vs 4,272 MB; cosine 1-NN label agreement 81.0%, raw dot 49.2% and collapses onto 6 docs (52.6% to the longest, 2,335 words); sparse GPU 61.7 ms, dense fp32 81.5, scipy CPU 663, fp64 GPU 3,281 (first run's fp64 trap kept as a lesson).
- P6 shipped: scratch LR 90.56 vs sklearn 90.50; C sweep: weaker penalty always better at 1k (84.64 at C=1000), C=10 best at 25k, log-loss 0.24->0.37 past it; weights: 'today' (+7.7, 74% of its reviews positive), '10 10' +4.4, 7/10 invisible (token pattern); underconfident by up to 6.4 pts; AG News 92.55% with afp/reuters/#39 shortcuts.
- P7 shipped: offensive P/R 68.4/49.6 at 0.5, best F1 59.1 at 0.35; emotion acc 65.38 vs macro 58.27 (optimism 35.6), balanced +1.5 macro inside 55.0-61.4 CI; CoNLL token acc 98.25 vs all-O 82.53, span F1 91.29, CHINA=PER gold error; GoEmotions kappa 0.80 gratitude to 0.21 pride.
