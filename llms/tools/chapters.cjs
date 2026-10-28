/* =========================================================
   tools/chapters.cjs — the LLMs chapter plan.

   Source for tools/scaffold.cjs, which writes the CHAPTERS
   registry into assets/app.js and creates a placeholder page
   for every chapter that doesn't exist yet. Once a chapter is
   written, assets/app.js is the source of truth for its
   title/blurb; `cover` is only the planned outline.
   APPROVED by the owner (2026-10-21); trained and measured locally.
   Scope: how a large language model is built and run, from the
   inside: tokenisers, attention and the transformer, training a
   small GPT, scaling, fine-tuning and alignment, decoding, the KV
   cache, quantisation, serving and evaluation. Every chapter is
   measured on this machine (PyTorch on an RTX 5070 Ti, 16 GB).
   Where other courses go deeper it links rather than re-teaches:
   ML & AI Systems (the one-chapter survey of each topic, and the
   platform around models), Deep Learning (backprop and training
   in general), NLP (language tasks before transformers), RAG
   (retrieval), Single Agent (tool use).
   Code: Python with PyTorch and Hugging Face; a tiny GPT trained
   from scratch, and small open models (GPT-2, Qwen2.5 0.5B–1.5B)
   fine-tuned and measured.
   ========================================================= */
'use strict';

const P = 'Prerequisites', B = 'Beginner', I = 'Intermediate', A = 'Advanced', E = 'Expert', CS = 'Case Studies';

module.exports = [
  // ---------- Prerequisites ----------
  { n: 0.1, slug: 'p1-pytorch-tensors', title: 'PyTorch Tensors on a GPU', level: P, icon: '🔢', mins: 40,
    blurb: 'Tensors, shapes, broadcasting, dtypes and moving work to the GPU: the arrays every later chapter is written in.',
    cover: ['Tensors and shapes', 'Broadcasting', 'dtypes: fp32, bf16, int8', 'CPU and GPU, and timing them', 'Common shape bugs'] },
  { n: 0.2, slug: 'p2-autograd-and-training-loops', title: 'Autograd & the Training Loop', level: P, icon: '🔁', mins: 40,
    blurb: 'Gradients computed for you, an optimiser step, and the five lines every training loop repeats.',
    cover: ['Computation graphs and backward()', 'Gradient descent by hand', 'nn.Module and parameters', 'The training loop', 'Overfitting one batch on purpose'] },
  { n: 0.3, slug: 'p3-neural-network-building-blocks', title: 'Linear Layers, Softmax & Cross-Entropy', level: P, icon: '🧱', mins: 40,
    blurb: 'The layers a transformer is assembled from: linear maps, activations, softmax, cross-entropy and normalisation.',
    cover: ['Linear layers as matrix multiplies', 'Activations: ReLU, GELU, SiLU', 'Softmax and its overflow', 'Cross-entropy loss', 'LayerNorm and RMSNorm'] },
  { n: 0.4, slug: 'p4-probability-for-language-models', title: 'Probability for Language Models', level: P, icon: '🎲', mins: 35,
    blurb: 'Distributions over a vocabulary, sampling, log-likelihood, entropy and perplexity, with numbers from a real model.',
    cover: ['A distribution over tokens', 'Sampling from it', 'Log-likelihood and why logs', 'Entropy and perplexity', 'Chain rule of probability'] },
  { n: 0.5, slug: 'p5-text-bytes-and-unicode', title: 'Text as Bytes: Unicode & UTF-8', level: P, icon: '🔤', mins: 35,
    blurb: 'Code points, UTF-8 bytes and normalisation: what a tokeniser actually receives, and why emoji and Hindi cost more.',
    cover: ['Code points and encodings', 'UTF-8 byte by byte', 'Normalisation forms', 'Whitespace and invisible characters', 'Bytes per character by language'] },
  { n: 0.6, slug: 'p6-matrix-multiplies-and-flops', title: 'Matrix Multiplies & Counting FLOPs', level: P, icon: '✖️', mins: 35,
    blurb: 'Dot products, batched matmuls and the arithmetic that sets training and inference cost.',
    cover: ['Dot products as similarity', 'Batched matrix multiplies', 'Counting FLOPs', 'Measured TFLOPS on this GPU', 'Memory-bound vs compute-bound'] },
  { n: 0.7, slug: 'p7-gpu-memory-budgets', title: 'GPU Memory Budgets', level: P, icon: '💾', mins: 35,
    blurb: 'Bytes per parameter, activations, optimiser state and the KV cache: whether a model fits in 16 GB, worked out before it runs out.',
    cover: ['Bytes per parameter by dtype', 'Weights, gradients and Adam state', 'Activations', 'Reading nvidia-smi and torch.cuda stats', 'Out-of-memory errors'] },
  { n: 0.8, slug: 'p8-hugging-face-and-model-files', title: 'Hugging Face & Model Files', level: P, icon: '📦', mins: 35,
    blurb: 'Loading a model and its tokeniser, what is inside safetensors and config.json, and pinning a revision.',
    cover: ['The Hub and model cards', 'config.json and safetensors', 'Tokeniser files', 'Loading on a GPU', 'Revisions, licences and pickle files'] },

  // ---------- Beginner ----------
  { n: 1, slug: '01-what-an-llm-is', title: 'What a Language Model Is', level: B, icon: '🔮', mins: 40,
    blurb: 'A model that predicts the next token, and everything else built on that: looking at the real probabilities a small model assigns.',
    cover: ['Next-token prediction', 'Logits to probabilities', 'Generating by repeating it', 'Base models and chat models', 'What the course builds'] },
  { n: 2, slug: '02-tokenisation-bpe', title: 'Tokenisation: Byte-Pair Encoding from Scratch', level: B, icon: '✂️', mins: 50,
    blurb: 'Train a byte-level BPE tokeniser on code and logs, then measure tokens per line, per language and per dollar.',
    cover: ['Why not characters or words', 'The BPE merge loop', 'Byte-level BPE', 'Vocabulary size trade-offs', 'Tokeniser surprises: numbers, spaces, languages'] },
  { n: 3, slug: '03-embeddings', title: 'Embeddings & the Vocabulary Matrix', level: B, icon: '🧭', mins: 40,
    blurb: 'The lookup table that turns token ids into vectors, the output matrix that turns them back, and tying the two.',
    cover: ['Embedding lookup', 'What nearby vectors mean', 'The unembedding (LM head)', 'Weight tying', 'Parameters spent on the vocabulary'] },
  { n: 4, slug: '04-self-attention', title: 'Self-Attention from Scratch', level: B, icon: '👀', mins: 55,
    blurb: 'Queries, keys and values, scaled dot products and the causal mask, written in PyTorch and checked against the library.',
    cover: ['Mixing information between tokens', 'Queries, keys and values', 'Scaling and softmax', 'The causal mask', 'Checking against F.scaled_dot_product_attention'] },
  { n: 5, slug: '05-multi-head-attention-and-positions', title: 'Multi-Head Attention & Position', level: B, icon: '🎯', mins: 50,
    blurb: 'Several attention heads at once, and the ways a model learns word order: learned, sinusoidal and rotary positions.',
    cover: ['Splitting into heads', 'Why order is invisible to attention', 'Learned and sinusoidal positions', 'Rotary embeddings (RoPE)', 'What different heads attend to'] },
  { n: 6, slug: '06-the-transformer-block', title: 'The Transformer Block', level: B, icon: '🧩', mins: 45,
    blurb: 'Attention, the MLP, residual connections and normalisation, and why pre-norm trains where post-norm diverges.',
    cover: ['The residual stream', 'The MLP and its width', 'Pre-norm vs post-norm', 'Dropout and when to drop it', 'Stacking blocks'] },
  { n: 7, slug: '07-build-a-tiny-gpt', title: 'Build a Tiny GPT', level: B, icon: '🛠️', mins: 50,
    blurb: 'Assemble the pieces into a working GPT, count its parameters, and load GPT-2’s real weights into the same code.',
    cover: ['The model class', 'Counting parameters', 'A forward pass end to end', 'Loading GPT-2 weights', 'Matching the reference outputs'] },
  { n: 8, slug: '08-training-a-tiny-gpt', title: 'Training a Tiny GPT', level: B, icon: '🏋️', mins: 55,
    blurb: 'Train the model on this GPU from random weights, watch the loss fall, and read its samples at each stage.',
    cover: ['Batches of token windows', 'The loss curve', 'Train vs validation loss', 'Samples as training goes', 'Overfitting a small corpus'] },
  { n: 9, slug: '09-decoding', title: 'Decoding: Greedy, Temperature, Top-k & Top-p', level: B, icon: '🎛️', mins: 45,
    blurb: 'How the next token is chosen, and how each setting changes repetition, diversity and correctness, measured.',
    cover: ['Greedy and its loops', 'Temperature', 'Top-k and top-p', 'Repetition penalties', 'Beam search and when it helps'] },
  { n: 10, slug: '10-measuring-a-language-model', title: 'Loss, Perplexity & Bits per Byte', level: B, icon: '📏', mins: 40,
    blurb: 'The numbers that say how good a language model is, and why comparing them across tokenisers misleads.',
    cover: ['Cross-entropy as the score', 'Perplexity', 'Bits per byte', 'Comparing models with different tokenisers', 'Held-out data that is really held out'] },

  // ---------- Intermediate ----------
  { n: 11, slug: '11-scaling-laws', title: 'Scaling Laws', level: I, icon: '📈', mins: 50,
    blurb: 'Train a family of models from tiny to small, fit the curve, and see how far it predicts the next size.',
    cover: ['Loss against parameters, data and compute', 'Fitting a power law', 'Compute-optimal sizes (Chinchilla)', 'Where the curve bends', 'Using it to plan a run'] },
  { n: 12, slug: '12-pretraining-data', title: 'Pretraining Data', level: I, icon: '🗂️', mins: 45,
    blurb: 'Collecting, cleaning, deduplicating and mixing text, and measuring what each step does to the model.',
    cover: ['Where the text comes from', 'Quality filters', 'Exact and near-duplicate removal', 'Data mixtures', 'Test-set contamination'] },
  { n: 13, slug: '13-training-efficiently-on-one-gpu', title: 'Training Efficiently on One GPU', level: I, icon: '⚡', mins: 50,
    blurb: 'Mixed precision, gradient accumulation, activation checkpointing and torch.compile, each measured in tokens per second and gigabytes.',
    cover: ['bf16 mixed precision', 'Gradient accumulation', 'Activation checkpointing', 'torch.compile and fused kernels', 'Tokens per second and MFU'] },
  { n: 14, slug: '14-optimisers-and-schedules', title: 'Optimisers, Schedules & Stability', level: I, icon: '🎚️', mins: 45,
    blurb: 'AdamW, warm-up and cosine decay, gradient clipping and the loss spikes that wreck long runs.',
    cover: ['SGD to AdamW', 'Learning-rate warm-up and decay', 'Finding a learning rate', 'Gradient clipping', 'Loss spikes and divergence'] },
  { n: 15, slug: '15-inside-a-modern-open-model', title: 'Inside a Modern Open Model', level: I, icon: '🔬', mins: 50,
    blurb: 'Open a current open-weights model layer by layer: RMSNorm, SwiGLU, RoPE and grouped-query attention, and what changed since GPT-2.',
    cover: ['Reading the config', 'RMSNorm and SwiGLU', 'Rotary positions in practice', 'Grouped-query attention', 'GPT-2 vs a 2025 model, side by side'] },
  { n: 16, slug: '16-the-kv-cache', title: 'The KV Cache', level: I, icon: '🗃️', mins: 45,
    blurb: 'Why generation recomputes nothing it has seen: implement the cache, then measure the speed it buys and the memory it costs.',
    cover: ['Recomputing everything vs caching', 'Implementing the cache', 'Prefill and decode', 'Memory per token', 'GQA and the cache'] },
  { n: 17, slug: '17-efficient-attention', title: 'Efficient Attention: FlashAttention & Friends', level: I, icon: '🏎️', mins: 50,
    blurb: 'Attention’s memory problem and the kernels and variants that solve it, timed on this GPU.',
    cover: ['Why naive attention is memory-bound', 'FlashAttention’s tiling', 'Multi-query and grouped-query attention', 'Sliding-window attention', 'Measured speed and memory'] },
  { n: 18, slug: '18-long-context', title: 'Long Context', level: I, icon: '📜', mins: 45,
    blurb: 'Stretching a model past the length it was trained on, and testing whether it can still find what is in the middle.',
    cover: ['Where the length limit comes from', 'RoPE scaling and interpolation', 'Needle-in-a-haystack tests', 'Lost in the middle', 'Cost of long prompts'] },
  { n: 19, slug: '19-supervised-fine-tuning', title: 'Supervised Fine-Tuning', level: I, icon: '🎓', mins: 50,
    blurb: 'Turn a base model into one that follows instructions: the data, the loss masking and a full fine-tune of a small model.',
    cover: ['Base vs instruction-tuned', 'Instruction data', 'Masking the prompt in the loss', 'A full fine-tune', 'Forgetting what it knew'] },
  { n: 20, slug: '20-chat-templates-and-special-tokens', title: 'Chat Templates & Special Tokens', level: I, icon: '🏷️', mins: 35,
    blurb: 'How a conversation becomes one token stream, and what a mismatched template does to a model’s answers.',
    cover: ['Role tokens and the template', 'Generation prompts and stop tokens', 'Mismatched templates, measured', 'Tool-call formats', 'Special tokens as an attack surface'] },
  { n: 21, slug: '21-lora-and-peft', title: 'LoRA & Parameter-Efficient Fine-Tuning', level: I, icon: '🪶', mins: 50,
    blurb: 'Implement LoRA, then measure how rank, target layers and learning rate trade quality for memory.',
    cover: ['Low-rank updates', 'Implementing LoRA', 'Rank and alpha', 'Which layers to adapt', 'Merging and swapping adapters'] },
  { n: 22, slug: '22-qlora-fine-tuning-in-16gb', title: 'QLoRA: Fine-Tuning in 16 GB', level: I, icon: '🧮', mins: 45,
    blurb: 'Fine-tune a model bigger than the GPU could hold in 16-bit by quantising the frozen weights, and measure what it costs.',
    cover: ['4-bit NF4 weights', 'Paged optimisers', 'Memory, step by step', 'Quality vs a 16-bit LoRA', 'When it is worth it'] },
  { n: 23, slug: '23-rlhf-and-reward-models', title: 'RLHF & Reward Models', level: I, icon: '🏅', mins: 50,
    blurb: 'Preferences as data, a reward model trained on them, and the reinforcement-learning loop that optimises against it.',
    cover: ['Preference pairs', 'Training a reward model', 'PPO in outline', 'Reward hacking', 'What RLHF changes in outputs'] },
  { n: 24, slug: '24-dpo-and-preference-tuning', title: 'DPO & Direct Preference Tuning', level: I, icon: '⚖️', mins: 45,
    blurb: 'Preference tuning without a reward model or RL: train DPO on a small model and compare it with SFT alone.',
    cover: ['From RLHF to DPO', 'The DPO loss', 'Training it', 'Measured against SFT', 'Variants: IPO, KTO, ORPO'] },

  // ---------- Advanced ----------
  { n: 25, slug: '25-quantisation', title: 'Quantisation', level: A, icon: '🗜️', mins: 50,
    blurb: 'int8 and int4 weights, GPTQ, AWQ and GGUF, measured in gigabytes, tokens per second and lost accuracy.',
    cover: ['Rounding weights', 'Per-channel and group scales', 'Outliers', 'GPTQ, AWQ and GGUF', 'Quality, size and speed measured'] },
  { n: 26, slug: '26-inference-engines-and-batching', title: 'Inference Engines & Batching', level: A, icon: '🚚', mins: 50,
    blurb: 'Static and continuous batching and paged KV memory: throughput and latency of one GPU serving many requests.',
    cover: ['One request at a time', 'Static batching', 'Continuous batching', 'Paged attention', 'Throughput vs time to first token'] },
  { n: 27, slug: '27-speculative-decoding', title: 'Speculative Decoding', level: A, icon: '🏇', mins: 40,
    blurb: 'A small model drafts, the big one checks: implement it and measure the speed-up and when it disappears.',
    cover: ['Why decoding is slow', 'Draft and verify', 'The acceptance rule', 'Measured speed-up', 'Self-speculation and Medusa heads'] },
  { n: 28, slug: '28-constrained-generation', title: 'Structured & Constrained Generation', level: A, icon: '🧷', mins: 45,
    blurb: 'Forcing valid JSON or a grammar by masking logits during decoding, built from scratch and compared with asking nicely.',
    cover: ['Asking vs constraining', 'Masking logits with a state machine', 'JSON schemas and grammars', 'Tokenisation pitfalls', 'Cost of constraints'] },
  { n: 29, slug: '29-distillation', title: 'Distillation', level: A, icon: '🧪', mins: 45,
    blurb: 'Teach a small model from a large one’s outputs and probabilities, and measure how much of the teacher survives.',
    cover: ['Hard labels vs soft targets', 'Logit distillation', 'Distilling from generated data', 'Measured student vs teacher', 'Licences and terms'] },
  { n: 30, slug: '30-evaluating-llms', title: 'Evaluating LLMs', level: A, icon: '📊', mins: 50,
    blurb: 'Benchmarks, contamination and LLM-as-judge, and how prompt format alone moves a score.',
    cover: ['What benchmarks measure', 'Prompt format sensitivity', 'Contamination', 'LLM-as-judge and its biases', 'Building your own eval'] },
  { n: 31, slug: '31-hallucination-and-calibration', title: 'Hallucination & Calibration', level: A, icon: '🌫️', mins: 45,
    blurb: 'When a model makes things up, whether its probabilities know, and the methods that reduce it.',
    cover: ['Kinds of hallucination', 'Token probabilities as confidence', 'Calibration curves', 'Sampling consistency checks', 'Training to say "I don’t know"'] },
  { n: 32, slug: '32-interpretability', title: 'Looking Inside: Interpretability', level: A, icon: '🔍', mins: 50,
    blurb: 'The logit lens, attention patterns, probes and activation patching, applied to the tiny GPT and GPT-2.',
    cover: ['The logit lens', 'Attention patterns', 'Linear probes', 'Activation patching', 'Induction heads'] },
  { n: 33, slug: '33-mixture-of-experts', title: 'Mixture of Experts', level: A, icon: '🔀', mins: 45,
    blurb: 'Many MLPs and a router that picks a few per token: more parameters for the same compute, and the balancing problem.',
    cover: ['Sparse MLPs and routing', 'Top-k routing', 'Load balancing', 'Memory vs compute', 'Training a small MoE'] },
  { n: 34, slug: '34-multimodal-llms', title: 'Multimodal LLMs', level: A, icon: '🖼️', mins: 40,
    blurb: 'How images become tokens a language model reads: vision encoders, projectors and their costs.',
    cover: ['Patches as tokens', 'Vision encoders and projectors', 'Image tokens per picture', 'Audio in outline', 'Where it fails'] },
  { n: 35, slug: '35-safety-tuning-and-refusals', title: 'Safety Tuning, Jailbreaks & Refusals', level: A, icon: '🛡️', mins: 45,
    blurb: 'How models are trained to refuse, how that training is undone, and measuring over- and under-refusal with harmless probes.',
    cover: ['Refusal training', 'Over-refusal', 'Jailbreak patterns', 'Fine-tuning removes safety', 'Measuring with harmless probes'] },
  { n: 36, slug: '36-reasoning-and-test-time-compute', title: 'Reasoning Models & Test-Time Compute', level: A, icon: '🧠', mins: 50,
    blurb: 'Chains of thought, thinking tokens and RL on verifiable answers: what more compute at answer time buys, measured.',
    cover: ['Chain of thought', 'Self-consistency', 'Thinking tokens', 'RL with verifiable rewards', 'Accuracy vs tokens spent'] },

  // ---------- Expert ----------
  { n: 37, slug: '37-debugging-training', title: 'Debugging a Training Run', level: E, icon: '🐞', mins: 50,
    blurb: 'NaNs, loss spikes, a loss that will not fall and a model that only repeats itself: diagnosed on runs broken on purpose.',
    cover: ['Overfit one batch first', 'NaNs and infs', 'Loss spikes', 'A flat loss', 'Data bugs that look like model bugs'] },
  { n: 38, slug: '38-cost-and-capacity', title: 'Training & Serving Cost', level: E, icon: '💰', mins: 45,
    blurb: 'GPU-hours for a training run and tokens per dollar for serving, worked out from FLOPs and checked against measurements.',
    cover: ['FLOPs for a training run', 'GPU-hours and utilisation', 'Serving cost per million tokens', 'Self-hosting vs an API', 'Planning a budget'] },
  { n: 39, slug: '39-model-supply-chain-and-poisoning', title: 'Model Supply Chain & Data Poisoning', level: E, icon: '🔐', mins: 40,
    blurb: 'Pickled weights that run code, poisoned training data and backdoors, with harmless demonstrations and the defences.',
    cover: ['Pickle vs safetensors', 'Poisoned data', 'Backdoor triggers', 'Provenance and signing', 'Checking a model before use'] },
  { n: 40, slug: '40-interview-playbook', title: 'The LLM Interview Playbook', level: E, icon: '🎤', mins: 45,
    blurb: 'How LLM questions are asked, the derivations to know by heart, and design prompts with model answers.',
    cover: ['Concept questions', 'Back-of-envelope maths', 'Debugging scenarios', 'Design prompts', 'What interviewers listen for'] },

  // ---------- Case studies ----------
  { n: 41, slug: '41-case-gpt-2-and-gpt-3', title: 'Case Study: GPT-2 and GPT-3', level: CS, icon: '📰', mins: 45,
    blurb: 'From a 1.5B-parameter model judged too risky to release to a 175B one that learned tasks from examples in the prompt.',
    cover: ['The models', 'Data', 'Few-shot learning', 'Staged release', 'What carried forward'] },
  { n: 42, slug: '42-case-chinchilla', title: 'Case Study: Chinchilla', level: CS, icon: '🐭', mins: 40,
    blurb: 'A smaller model on more data beat a far larger one, and changed how every lab sized its runs.',
    cover: ['The question', 'The experiments', 'The rule of thumb', 'What it got wrong', 'Training past compute-optimal'] },
  { n: 43, slug: '43-case-instructgpt', title: 'Case Study: InstructGPT', level: CS, icon: '🗣️', mins: 40,
    blurb: 'The SFT and RLHF recipe that made a 1.3B model preferred over a 175B one.',
    cover: ['Labellers and data', 'SFT', 'Reward model', 'PPO', 'The alignment tax'] },
  { n: 44, slug: '44-case-llama', title: 'Case Study: Llama and Open Weights', level: CS, icon: '🦙', mins: 45,
    blurb: 'An open-weights family and the architecture choices that most open models now copy.',
    cover: ['The architecture', 'Training data', 'Release and leak', 'The fine-tuning ecosystem', 'Later versions'] },
  { n: 45, slug: '45-case-mixtral', title: 'Case Study: Mistral and Mixtral', level: CS, icon: '🌬️', mins: 40,
    blurb: 'Sliding-window attention, then a sparse mixture of experts that ran like a much smaller model.',
    cover: ['Mistral 7B', 'Sliding windows', 'Mixtral’s experts', 'Serving costs', 'Routing in practice'] },
  { n: 46, slug: '46-case-deepseek-v3-and-r1', title: 'Case Study: DeepSeek-V3 and R1', level: CS, icon: '🐋', mins: 50,
    blurb: 'A frontier-level MoE trained cheaply, then a reasoning model trained largely by reinforcement learning.',
    cover: ['Multi-head latent attention', 'MoE at scale', 'FP8 training', 'R1-Zero and RL', 'Distilled reasoners'] },
  { n: 47, slug: '47-case-flashattention', title: 'Case Study: FlashAttention', level: CS, icon: '⚡', mins: 40,
    blurb: 'An exact attention kernel that won by moving less memory, and became standard everywhere.',
    cover: ['The memory hierarchy', 'Tiling and recomputation', 'Versions 2 and 3', 'Adoption', 'Lessons for kernels'] },
  { n: 48, slug: '48-case-reproducing-gpt-2', title: 'Case Study: Reproducing GPT-2 on a Budget', level: CS, icon: '🧾', mins: 45,
    blurb: 'Open reproductions that trained GPT-2 for a few hundred dollars, and what that took.',
    cover: ['The target', 'Data and tokens', 'Speed tricks', 'Cost', 'What a hobbyist can train'] },
];

module.exports.levels = {
  Prerequisites: 'PyTorch tensors and training loops, the layers transformers use, probability, text as bytes, FLOPs, GPU memory and model files.',
  Beginner: 'Next-token prediction, tokenisers, embeddings, attention, the transformer block, building, training and decoding a tiny GPT.',
  Intermediate: 'Scaling laws, data, efficient training, optimisers, a modern open model, the KV cache, long context, fine-tuning, LoRA and preference tuning.',
  Advanced: 'Quantisation, serving and batching, speculative and constrained decoding, distillation, evaluation, hallucination, interpretability, MoE and reasoning.',
  Expert: 'Debugging training, cost and capacity, the model supply chain and the interview playbook.',
  'Case Studies': 'Eight models and papers that shaped the field, from GPT-2 to DeepSeek-R1.',
};
