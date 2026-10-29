# NLP — Interactive Course

How machines read, from the byte up: Unicode and normalisation, tokenisers, bag of words and TF-IDF,
naive Bayes and logistic regression, n-gram language models, word2vec trained from scratch, GloVe
and fastText, neural text classifiers, RNNs and LSTMs, sequence labelling and CRFs, seq2seq with
attention and machine translation, then transformer encoders: BERT pre-trained here and fine-tuned,
NER, extractive question answering, sentence embeddings, RoBERTa to DeBERTa, T5 and BART,
summarisation, multilingual models, retrieval, few-shot and zero-shot learning, evaluation, bias,
robustness, interpretation, long documents, information extraction and serving.
**48 chapters across five levels, plus an 8-chapter Prerequisites level** (P1–P8: text, Unicode and
normalisation, PyTorch for text, regex and cleaning, counting and probability, sparse vectors and
similarity, linear classifiers, metrics for NLP, datasets and Hugging Face).

Static site, **zero dependencies**, no build step required to read it. Open `index.html` in a
browser; progress, quiz scores and flashcard state are saved in `localStorage` under `nlp-*` keys.

> **Status: in progress.** Chapters are written in order, one commit each. Pages still marked with
> `<!-- nlp:placeholder -->` are unwritten; `grep -l nlp:placeholder *.html` lists them.

## The levels

| Level | Chapters | What it covers |
|---|---|---|
| **Prerequisites** | P1–P8 | Text, Unicode and normalisation, PyTorch for text (padding and masks), regular expressions and cleaning, counting and probability, sparse vectors and similarity, linear classifiers and cross-entropy, metrics for NLP tasks, datasets and Hugging Face |
| **Beginner** | 1–10 | What NLP is, tokenisation, stemming and lemmas, bag of words and TF-IDF, text classification, n-gram language models, word2vec from scratch, GloVe and fastText, neural text classifiers, RNNs and LSTMs, sequence labelling |
| **Intermediate** | 11–24 | CRFs and Viterbi, seq2seq, attention for seq2seq, machine translation and BLEU, transformer encoders, BERT, fine-tuning, NER with BERT, extractive QA, sentence embeddings, encoder variants, T5 and BART, summarisation and ROUGE, multilingual NLP |
| **Advanced** | 25–36 | Topic models, information retrieval, augmentation and weak supervision, few-shot and zero-shot NLP, evaluation beyond accuracy, bias and fairness, robustness, interpreting text models, long documents, information extraction, encoders vs LLMs |
| **Expert** | 37–40 | Serving NLP models, text pipelines in production, debugging NLP pipelines, the interview playbook |
| **Case Studies** | 41–48 | word2vec, Google Neural Machine Translation, the Transformer for translation, BERT, spam filtering, BERT in search, No Language Left Behind, GLUE and benchmark saturation |

Where this course meets the others, each keeps its own angle and links across: LLMs covers BPE in
depth, the GPT decoder, decoding and instruction tuning; RAG covers vector search and RAG systems;
ML Fundamentals covers linear models and evaluation in general; Deep Learning covers backpropagation
and training in general. This course is about text: how it becomes numbers, which models read it
best for a given job, and how to tell whether they do.

## Study tools

- **`glossary.html`**: NLP terms, each linked to the chapter that introduces it
- **`flashcards.html`**: spaced-repetition deck generated from the chapter quizzes
- **`mock-interview.html`**: timed room with 24 concept, maths and design problems, a phase timer, an 8-point rubric and notes saved locally

## Tools

```bash
node tools/scaffold.cjs            # create placeholder pages for chapters in tools/chapters.cjs
node tools/build-study-data.js     # regenerate assets/study-data.js (search index + flashcards)
node build.js                      # -> dist/nlp-course.html, the single-file offline edition
```

`assets/app.js` holds the `CHAPTERS` registry, the single source of truth for the sidebar, the
navigation and progress. `tools/chapters.cjs` is the original plan (with each chapter's outline);
`node tools/scaffold.cjs --registry` rewrites the registry from it, so only use that flag before
chapters start being edited by hand.

## House style

Listings are Python with PyTorch, scikit-learn and Hugging Face, run on one 16 GB consumer GPU
(RTX 5070 Ti), following the same five rules: listings show what the tokeniser produced; maximum
length, padding and truncation are written down; model names, library versions and seeds are
pinned; every neural model is compared with a TF-IDF baseline on the same split; and metrics come
with a hand-read sample of the errors. Every simulator is driven by real measurements.
