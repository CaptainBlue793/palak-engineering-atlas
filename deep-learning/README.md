# Deep Learning — Interactive Course

How neural networks learn, from the chain rule up: a scalar autograd engine and tensor
backpropagation written by hand, the perceptron and MLPs, activations, losses, SGD and
initialisation, then optimisers and learning-rate schedules, regularisation, normalisation layers
and residual connections, the core of CNNs, RNNs and attention, and a transformer built from
scratch. Then training well and fast on one GPU (mixed precision, profiling and torch.compile,
memory, batch size and scaling rules, hyperparameter tuning), why networks generalise (loss
landscapes, memorisation, double descent, grokking), transfer learning, tabular data and graph
networks, and expert topics: uncertainty, compression, continual learning, state-space models,
deep reinforcement learning, μP, custom Triton kernels, reproducibility and debugging.
**48 chapters across five levels, plus an 8-chapter Prerequisites level** (P1–P8: tensors and
broadcasting, matrix calculus, floating point, PyTorch modules and autograd, datasets and
DataLoaders, likelihood and losses, the GPU, and running experiments).

Static site, **zero dependencies**, no build step required to read it. Open `index.html` in a
browser; progress, quiz scores and flashcard state are saved in `localStorage` under `dl-*` keys.

> **Status: in progress.** Chapters are written in order, one commit each. Pages still marked with
> `<!-- dl:placeholder -->` are unwritten; `grep -l dl:placeholder *.html` lists them.

## The levels

| Level | Chapters | What it covers |
|---|---|---|
| **Prerequisites** | P1–P8 | Tensors, shapes and broadcasting, matrix calculus, floating point, PyTorch modules and autograd, datasets and DataLoaders, likelihood and loss functions, the GPU, seeds and learning curves |
| **Beginner** | 1–10 | What deep learning is, the perceptron, autograd from scratch, backpropagation on tensors, MLPs, activation functions, losses, SGD and mini-batches, weight initialisation, training an MLP end to end |
| **Intermediate** | 11–20 | Momentum, RMSProp and Adam, learning-rate schedules, regularisation, normalisation layers, residual connections, CNNs, RNNs and BPTT, attention, a transformer from scratch, embeddings |
| **Advanced** | 21–30 | Mixed precision, profiling and torch.compile, memory, batch size and scaling rules, hyperparameter tuning, loss landscapes, generalisation, transfer learning, tabular data, graph neural networks |
| **Expert** | 31–40 | Uncertainty and calibration, pruning, quantisation and distillation, continual learning, state-space models, deep RL, μP, custom ops and Triton, reproducibility, debugging training, the interview playbook |
| **Case Studies** | 41–48 | Backpropagation (1986), LeNet, dropout, batch normalisation, Adam and AdamW, DQN on Atari, AlphaFold 2, the lottery ticket hypothesis |

Where this course meets the others, each keeps its own angle and links across: ML Fundamentals
covers gradient descent, losses and overfitting for classical models; Computer Vision covers CNN
architectures, augmentation and generative models; NLP covers RNNs and attention for text; LLMs
covers the GPT decoder and LLM-scale training, quantisation and distillation; ML & AI Systems
covers multi-GPU training and serving. This course is about the mechanics every one of those
builds on: how a network computes its gradients, and what makes it train.

## Study tools

- **`glossary.html`**: deep-learning terms, each linked to the chapter that introduces it
- **`flashcards.html`**: spaced-repetition deck generated from the chapter quizzes
- **`mock-interview.html`**: timed room with 24 concept, maths and design problems, a phase timer, an 8-point rubric and notes saved locally

## Tools

```bash
node tools/scaffold.cjs            # create placeholder pages for chapters in tools/chapters.cjs
node tools/build-study-data.js     # regenerate assets/study-data.js (search index + flashcards)
node build.js                      # -> dist/deep-learning-course.html, the single-file offline edition
```

`assets/app.js` holds the `CHAPTERS` registry, the single source of truth for the sidebar, the
navigation and progress. `tools/chapters.cjs` is the original plan (with each chapter's outline);
`node tools/scaffold.cjs --registry` rewrites the registry from it, so only use that flag before
chapters start being edited by hand.

## House style

Listings are Python with PyTorch, run on one 16 GB consumer GPU (RTX 5070 Ti), following the same
five rules: tensor shapes are written in the comments; a new model must overfit one batch before it
sees the full data; every network is compared with a simpler baseline on the same split; results
come from several seeds and differences inside the seed spread are not called wins; and GPU
timings synchronise and skip warm-up. Every simulator is driven by real measurements.
