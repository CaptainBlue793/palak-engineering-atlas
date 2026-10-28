# LLMs — Interactive Course

How a large language model is built and run, from the inside: tokenisers, embeddings, attention and
the transformer block, a small GPT trained from random weights, scaling laws and pretraining data,
efficient training on one GPU, a modern open model layer by layer, the KV cache, long context,
supervised fine-tuning, LoRA and QLoRA, RLHF and DPO, decoding, quantisation, batching, speculative
and constrained decoding, distillation, evaluation, interpretability and reasoning models.
**48 chapters across five levels, plus an 8-chapter Prerequisites level** (P1–P8: PyTorch tensors,
autograd and the training loop, the layers transformers use, probability for language models, text
as bytes, matrix multiplies and FLOPs, GPU memory budgets, and Hugging Face model files).

Static site, **zero dependencies**, no build step required to read it. Open `index.html` in a
browser; progress, quiz scores and flashcard state are saved in `localStorage` under `llm-*` keys.

> **Status: in progress.** Chapters are written in order, one commit each. Pages still marked with
> `<!-- llm:placeholder -->` are unwritten; `grep -l llm:placeholder *.html` lists them.

## The levels

| Level | Chapters | What it covers |
|---|---|---|
| **Prerequisites** | P1–P8 | PyTorch tensors on a GPU, autograd and the training loop, linear layers, softmax and cross-entropy, probability for language models, text as bytes, matrix multiplies and FLOPs, GPU memory budgets, Hugging Face model files |
| **Beginner** | 1–10 | Next-token prediction, BPE tokenisation from scratch, embeddings, self-attention, multi-head attention and positions, the transformer block, building and training a tiny GPT, decoding, loss and perplexity |
| **Intermediate** | 11–24 | Scaling laws, pretraining data, training efficiently on one GPU, optimisers and stability, a modern open model, the KV cache, efficient attention, long context, supervised fine-tuning, chat templates, LoRA, QLoRA, RLHF, DPO |
| **Advanced** | 25–36 | Quantisation, inference engines and batching, speculative decoding, constrained generation, distillation, evaluation, hallucination and calibration, interpretability, mixture of experts, multimodal models, safety tuning, reasoning and test-time compute |
| **Expert** | 37–40 | Debugging a training run, training and serving cost, the model supply chain and data poisoning, the interview playbook |
| **Case Studies** | 41–48 | GPT-2 and GPT-3, Chinchilla, InstructGPT, Llama, Mistral and Mixtral, DeepSeek-V3 and R1, FlashAttention, reproducing GPT-2 on a budget |

Where this course meets the others, each keeps its own angle and links across: ML & AI Systems
surveys each of these topics in a chapter and covers the platform around models; Deep Learning
covers backpropagation and training networks in general; NLP covers language tasks before
transformers; RAG covers retrieval; Single Agent covers tool use. This course is about the model
itself: building one, training it, adapting it and running it.

## Study tools

- **`glossary.html`**: LLM terms, each linked to the chapter that introduces it
- **`flashcards.html`**: spaced-repetition deck generated from the chapter quizzes
- **`mock-interview.html`**: timed room with 22 concept, maths and design problems, a phase timer, an 8-point rubric and notes saved locally

## Tools

```bash
node tools/scaffold.cjs            # create placeholder pages for chapters in tools/chapters.cjs
node tools/build-study-data.js     # regenerate assets/study-data.js (search index + flashcards)
node build.js                      # -> dist/llms-course.html, the single-file offline edition
```

`assets/app.js` holds the `CHAPTERS` registry, the single source of truth for the sidebar, the
navigation and progress. `tools/chapters.cjs` is the original plan (with each chapter's outline);
`node tools/scaffold.cjs --registry` rewrites the registry from it, so only use that flag before
chapters start being edited by hand.

## House style

Listings are Python with PyTorch and Hugging Face, run on one 16 GB consumer GPU (RTX 5070 Ti),
following the same five rules: every tensor line says its shape; model revisions, library versions
and seeds are pinned; times and memory are measured on the GPU, never guessed; weights run in bf16
while softmax and losses use fp32; and a new model overfits one batch and matches a reference before
any long run. Every simulator is driven by real measurements.
