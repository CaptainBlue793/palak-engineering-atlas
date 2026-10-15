# RAG — Interactive Course

Retrieval-augmented generation that actually answers from your data: parsing and chunking
documents, embedding models and vector indexes (exact, HNSW, IVF and quantisation), keyword and
hybrid search, reranking, query rewriting and routing, prompting with context and citations,
evaluation, and running it in production. **48 chapters across five levels, plus an 8-chapter
Prerequisites level** (P1–P8: Python for AI engineering, talking to an LLM, tokens and context
windows, vectors and similarity, embeddings in practice, text processing, keyword search, and
ranking metrics).

Static site, **zero dependencies**, no build step required to read it. Open `index.html` in a
browser; progress, quiz scores and flashcard state are saved in `localStorage` under `rag-*` keys.

> **Status: in progress.** Chapters are written in order, one commit each. Pages still marked with
> `<!-- rag:placeholder -->` are unwritten; `grep -l rag:placeholder *.html` lists them.

## The levels

| Level | Chapters | What it covers |
|---|---|---|
| **Prerequisites** | P1–P8 | Python for AI engineering, talking to an LLM, tokens and context windows, vectors and similarity, embeddings in practice, text processing, keyword search basics, precision, recall and ranking metrics |
| **Beginner** | 1–10 | What RAG is, a first pipeline, loading documents, chunking, embedding models, exact vector search, HNSW, IVF and quantisation, vector databases and filters, prompting with context |
| **Intermediate** | 11–22 | BM25, hybrid search and rank fusion, reranking, query rewriting, routing and decomposition, context assembly, citations, tables and structured data, evaluating retrieval and answers, building an evaluation set, indexing pipelines |
| **Advanced** | 23–34 | Permissions and tenants, hierarchical retrieval, multi-vector retrieval, graph RAG, code, latency and caching, cost and scale, conversations, prompt injection, hallucination and abstention, fine-tuning retrievers, agentic RAG |
| **Expert** | 35–40 | Production architecture, observability and feedback, debugging a bad answer, choosing between RAG, long context and fine-tuning, privacy and deletion, the interview playbook |
| **Case Studies** | 41–48 | A support assistant, the Air Canada chatbot ruling, invented legal citations, enterprise search, a web answer engine, retrieval for a code assistant, clinical guidelines, a billion-vector index |

Where this course meets the others, each keeps its own angle and links across: ML & AI Systems
covers how transformers, embeddings and LLMs work inside and surveys RAG in one chapter; Databases
covers inverted indexes and vector databases from the storage side; System Design covers search at
scale; the Single Agent course picks up where agentic RAG ends. This course is about building
retrieval that can be trusted.

## Study tools

- **`glossary.html`**: RAG terms, each linked to the chapter that introduces it
- **`flashcards.html`**: spaced-repetition deck generated from the chapter quizzes
- **`mock-interview.html`**: timed room with 22 concept and RAG-design problems, a phase timer, an 8-point rubric and notes saved locally

## Tools

```bash
node tools/scaffold.cjs            # create placeholder pages for chapters in tools/chapters.cjs
node tools/build-study-data.js     # regenerate assets/study-data.js (search index + flashcards)
node build.js                      # -> dist/rag-course.html, the single-file offline edition
```

`assets/app.js` holds the `CHAPTERS` registry, the single source of truth for the sidebar, the
navigation and progress. `tools/chapters.cjs` is the original plan (with each chapter's outline);
`node tools/scaffold.cjs --registry` rewrites the registry from it, so only use that flag before
chapters start being edited by hand.

## House style

Listings are Python with sentence-transformers, faiss and a local model served by Ollama, following
the same five rules: measure every change on a fixed set of questions; normalise embeddings and use
each model's query and passage prefixes; keep source, position and permissions beside every vector;
answer only from the retrieved context, with citations and a way to say the answer is not there; and
treat retrieved text as data, never as instructions. Every simulator is driven by real measurements.
