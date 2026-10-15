# RAG — session log

Branch `feature/rag-course`, clone `C:\Users\palak\atlas-courses\rag` (cut from `main` at `701d468`).
Code: Python with sentence-transformers, faiss, hnswlib and a local model served by Ollama. Runtime namespace: `RAG`; storage prefix `rag-`.

## 2026-10-15 — session 1
- Owner: "now start working on Agents tab. As usual, keep the case studies as placeholder". Answers: small local models approved (Ollama qwen2.5:3b, bge-small-en-v1.5 embeddings, a MiniLM cross-encoder, small public datasets, faiss-cpu and hnswlib); Multi-Agent Systems to be a shorter standalone course (~30 lessons). Order: RAG, then Single Agent, then Multi-Agent Systems, one branch each.
- Done: chapter plan in `rag/tools/chapters.cjs` (P1–P8 + 48 chapters). Case studies 41–48 stay placeholders for the later all-courses pass.
- Decisions: scope is building retrieval that can be trusted; ML & AI Systems (model internals, its RAG survey), Databases (inverted indexes, vector databases), System Design (search at scale) and Single Agent are linked where they go deeper, not repeated. Every simulator is measured with local models.
- Registry stub completed in `assets/atlas.js` (`indexVar: 'RAG_INDEX'`, `first`, `dist`; still `soon`) and the shell scaffolded with `tools/new-course.cjs`.
- Course shell: home page (4 × 6 dependency map, Python retrieval code-style strip), glossary (74 terms), mock interview (22 problems, Clarify / Data / Retrieval / Generation / Evaluate / Wrap-up phases, 8-row rubric), flashcards, README.
- Needs a shared change at release: add `rag-` (and later `agent-`, `mas-`) to the account-sync allow-lists in `assets/account.js` and `api/src/index.js`, then a Worker redeploy.
- P1 Python for AI Engineering: environments and pinned versions, dataclasses for chunks and hits, httpx calls to a model server, JSON Lines; reproducibility simulator (20 processes each: tied ranking gave all 6 orders, unseeded 8-question sample gave recall@2 0.75-1.0; fixed: 1 output each; full set 0.917)
- P4 Vectors & Similarity: 1,922 glossary terms searched over 4,230 Atlas sections with counts and TF-IDF under dot, cosine, Euclidean and normalised Euclidean (TF-IDF recall@5 0.752 / 0.782 / 0.006 / 0.782; dot top-1 median 883 words vs 263); NumPy 790x faster than a Python loop
- P6 Text Processing: 3,116 extraction artefacts (ligatures, line-break and soft hyphens, zero-width and non-breaking spaces, decomposed accents, full-width letters, curly apostrophes) injected into Atlas text; exact lookup found 4.4% raw, 42% after NFKC, 79% after stripping invisibles, 90.5% after dehyphenation, 100% after quote mapping
