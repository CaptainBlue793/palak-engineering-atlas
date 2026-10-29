/* =========================================================
   tools/chapters.cjs — the NLP chapter plan.

   Source for tools/scaffold.cjs, which writes the CHAPTERS
   registry into assets/app.js and creates a placeholder page
   for every chapter that doesn't exist yet. Once a chapter is
   written, assets/app.js is the source of truth for its
   title/blurb; `cover` is only the planned outline.
   APPROVED by the owner (2026-10-29); trained and measured locally.
   Scope: text as data, up to encoder and encoder-decoder models:
   text processing, sparse and dense representations, linear and
   neural classifiers, word embeddings, RNNs and LSTMs, sequence
   labelling and CRFs, seq2seq with attention, translation, BERT and
   its variants, NER, question answering, sentence embeddings, T5 and
   summarisation, multilingual models, retrieval, evaluation, bias,
   robustness and production text pipelines. Every chapter is trained
   or measured on this machine (PyTorch on an RTX 5070 Ti, 16 GB).
   Where other courses go deeper it links rather than re-teaches:
   LLMs (BPE internals, self-attention and the GPT decoder, decoding,
   instruction tuning), RAG (vector search and RAG systems), ML
   Fundamentals (linear models and evaluation in general), Deep
   Learning (backprop and optimisation in general).
   Code: Python with PyTorch, scikit-learn and Hugging Face; word2vec,
   LSTMs, a CRF, a seq2seq translator and a small BERT trained from
   scratch; pretrained encoders (BERT, RoBERTa, DeBERTa, T5) measured
   and fine-tuned.
   ========================================================= */
'use strict';

const P = 'Prerequisites', B = 'Beginner', I = 'Intermediate', A = 'Advanced', E = 'Expert', CS = 'Case Studies';

module.exports = [
  // ---------- Prerequisites ----------
  { n: 0.1, slug: 'p1-text-unicode-and-normalisation', title: 'Text, Unicode & Normalisation', level: P, icon: '🔤', mins: 35,
    blurb: 'Code points, encodings, case folding and Unicode normalisation: why two strings that look identical compare unequal.',
    cover: ['Code points and encodings', 'NFC, NFD and NFKC', 'Case folding', 'Accents, emoji and zero-width characters', 'Normalisation bugs in pipelines'] },
  { n: 0.2, slug: 'p2-pytorch-for-text', title: 'PyTorch for Text: Batches, Padding & Masks', level: P, icon: '🔁', mins: 40,
    blurb: 'The training loop, plus what text adds: variable-length sequences, padding, masks and packed batches on a GPU.',
    cover: ['The training loop', 'Integer token IDs', 'Padding and attention masks', 'Bucketing by length', 'Overfitting one batch'] },
  { n: 0.3, slug: 'p3-regex-and-text-cleaning', title: 'Regular Expressions & Text Cleaning', level: P, icon: '🧹', mins: 35,
    blurb: 'Regex for extraction and cleaning, and the cleaning steps that help or quietly destroy signal.',
    cover: ['Regex syntax that matters', 'Extracting dates, emails and IDs', 'HTML and boilerplate', 'What cleaning removes', 'Catastrophic backtracking'] },
  { n: 0.4, slug: 'p4-counting-and-probability', title: 'Counting & Probability for Language', level: P, icon: '🎲', mins: 35,
    blurb: 'Word frequencies, Zipf’s law, conditional probability and log-probabilities: the arithmetic every language model rests on.',
    cover: ['Counting tokens', 'Zipf’s law', 'Conditional probability', 'Log-probabilities and underflow', 'Entropy and surprise'] },
  { n: 0.5, slug: 'p5-sparse-vectors-and-similarity', title: 'Sparse Vectors & Similarity', level: P, icon: '📐', mins: 35,
    blurb: 'Documents as vectors, dot products, cosine similarity and the sparse matrices that make it fast.',
    cover: ['Vectors from text', 'Dot product and cosine', 'Sparse CSR matrices', 'Nearest neighbours', 'Normalising vectors'] },
  { n: 0.6, slug: 'p6-linear-classifiers', title: 'Linear Classifiers & Cross-Entropy', level: P, icon: '📈', mins: 35,
    blurb: 'Logistic regression, softmax and cross-entropy on text features, trained by gradient descent.',
    cover: ['Logistic regression', 'Softmax over classes', 'Cross-entropy loss', 'Regularisation', 'Reading the weights'] },
  { n: 0.7, slug: 'p7-metrics-for-nlp', title: 'Metrics for NLP Tasks', level: P, icon: '🎯', mins: 35,
    blurb: 'Precision, recall and F1, micro vs macro averaging, span-level scoring and annotator agreement.',
    cover: ['Precision, recall and F1', 'Micro vs macro', 'Span-level scoring', 'Confusion matrices', 'Inter-annotator agreement'] },
  { n: 0.8, slug: 'p8-datasets-and-hugging-face', title: 'Datasets, Splits & Hugging Face', level: P, icon: '🤗', mins: 35,
    blurb: 'Loading corpora with Hugging Face datasets and tokenizers, honest splits, and the model hub.',
    cover: ['The datasets library', 'Train, validation and test splits', 'Tokenizers and the hub', 'Caching and streaming', 'Licences and data cards'] },

  // ---------- Beginner ----------
  { n: 1, slug: '01-what-nlp-is', title: 'What NLP Is', level: B, icon: '🗺️', mins: 40,
    blurb: 'The map of tasks, from classification to translation, and why language is hard for machines.',
    cover: ['Tasks and their outputs', 'Ambiguity and context', 'Rules, statistics and neural models', 'Where encoders and LLMs fit', 'Baselines first'] },
  { n: 2, slug: '02-tokenisation-for-nlp', title: 'Tokenisation, Stemming & Lemmas', level: B, icon: '✂️', mins: 45,
    blurb: 'Words, subwords and characters, stemming and lemmatisation, and what each choice does to vocabulary and accuracy.',
    cover: ['Word and rule-based tokenisers', 'Subword tokenisers in practice', 'Stemming vs lemmatisation', 'Out-of-vocabulary words', 'Vocabulary size trade-offs'] },
  { n: 3, slug: '03-bag-of-words-and-tf-idf', title: 'Bag of Words & TF-IDF', level: B, icon: '🎒', mins: 45,
    blurb: 'Counting words into vectors, weighting them by rarity, and n-grams: the strongest cheap baseline in NLP.',
    cover: ['Bag of words', 'TF-IDF weighting', 'N-gram features', 'Stop words', 'Vocabulary pruning'] },
  { n: 4, slug: '04-text-classification', title: 'Text Classification with Linear Models', level: B, icon: '🏷️', mins: 45,
    blurb: 'Sentiment and topic classifiers with naive Bayes and logistic regression, measured against each other.',
    cover: ['Naive Bayes', 'Logistic regression on TF-IDF', 'Class imbalance', 'Calibration', 'Error analysis'] },
  { n: 5, slug: '05-n-gram-language-models', title: 'N-gram Language Models & Smoothing', level: B, icon: '🔮', mins: 45,
    blurb: 'Predicting the next word by counting, perplexity, and smoothing so unseen sequences do not get zero probability.',
    cover: ['N-gram probabilities', 'Perplexity', 'Add-k and Kneser–Ney smoothing', 'Backoff', 'Generating text from counts'] },
  { n: 6, slug: '06-word2vec-from-scratch', title: 'Word Embeddings: word2vec from Scratch', level: B, icon: '🧭', mins: 50,
    blurb: 'Skip-gram with negative sampling, written and trained here, and what the learned vectors capture.',
    cover: ['The distributional hypothesis', 'Skip-gram and CBOW', 'Negative sampling', 'Training on a corpus', 'Nearest neighbours and analogies'] },
  { n: 7, slug: '07-glove-fasttext-and-evaluation', title: 'GloVe, fastText & Evaluating Embeddings', level: B, icon: '📏', mins: 45,
    blurb: 'Count-based and subword embeddings, intrinsic tests, and the social biases embeddings absorb.',
    cover: ['GloVe', 'fastText and subwords', 'Similarity and analogy benchmarks', 'Intrinsic vs extrinsic evaluation', 'Bias in embeddings'] },
  { n: 8, slug: '08-neural-text-classifiers', title: 'Neural Text Classifiers', level: B, icon: '🧠', mins: 45,
    blurb: 'Averaged embeddings and 1-D CNNs over text, trained here and compared with TF-IDF.',
    cover: ['Embedding bags', 'CNNs over text', 'Pretrained vs learned embeddings', 'Regularisation', 'When TF-IDF still wins'] },
  { n: 9, slug: '09-rnns-and-lstms', title: 'Recurrent Networks & LSTMs from Scratch', level: B, icon: '🔄', mins: 50,
    blurb: 'An RNN and an LSTM cell written by hand, vanishing gradients measured, and bidirectional encoders.',
    cover: ['The recurrent cell', 'Backpropagation through time', 'Vanishing gradients', 'LSTM and GRU gates', 'Bidirectional RNNs'] },
  { n: 10, slug: '10-sequence-labelling', title: 'Sequence Labelling: POS Tagging & NER', level: B, icon: '🔖', mins: 45,
    blurb: 'Tagging every token with BIO labels using a BiLSTM, and scoring entities as spans.',
    cover: ['Part-of-speech tagging', 'BIO and BIOES schemes', 'A BiLSTM tagger', 'Span-level F1', 'Common tagging errors'] },

  // ---------- Intermediate ----------
  { n: 11, slug: '11-crfs-and-viterbi', title: 'CRFs & Structured Prediction', level: I, icon: '🧩', mins: 50,
    blurb: 'Conditional random fields and Viterbi decoding: making tag sequences consistent instead of independent.',
    cover: ['Why independent tags fail', 'HMMs vs CRFs', 'The Viterbi algorithm', 'A BiLSTM-CRF', 'Measured gains on NER'] },
  { n: 12, slug: '12-seq2seq-encoder-decoder', title: 'Seq2Seq: Encoder–Decoder RNNs', level: I, icon: '↔️', mins: 50,
    blurb: 'Mapping one sequence to another with an encoder and a decoder RNN, teacher forcing and greedy decoding.',
    cover: ['Encoder and decoder', 'Teacher forcing', 'The bottleneck vector', 'Greedy and beam search', 'Exposure bias'] },
  { n: 13, slug: '13-attention-for-seq2seq', title: 'Attention for Seq2Seq', level: I, icon: '👁️', mins: 50,
    blurb: 'Bahdanau and Luong attention added to the translator, alignment maps, and why the bottleneck mattered.',
    cover: ['Additive attention', 'Multiplicative attention', 'Alignment maps', 'Long sentences', 'From attention to transformers'] },
  { n: 14, slug: '14-machine-translation-and-bleu', title: 'Machine Translation & BLEU', level: I, icon: '🌐', mins: 45,
    blurb: 'Training a small translator, scoring it with BLEU, chrF and COMET, and where each metric misleads.',
    cover: ['Parallel corpora', 'BLEU from scratch', 'chrF and learned metrics', 'Human vs automatic scores', 'Common translation errors'] },
  { n: 15, slug: '15-transformer-encoders', title: 'Transformer Encoders for NLP', level: I, icon: '🧱', mins: 50,
    blurb: 'Self-attention encoders for understanding tasks: bidirectional context, padding masks and the [CLS] token.',
    cover: ['Encoder vs decoder stacks', 'Bidirectional self-attention', 'Padding masks', 'Pooling for classification', 'A small encoder trained here'] },
  { n: 16, slug: '16-bert-masked-language-modelling', title: 'BERT & Masked Language Modelling', level: I, icon: '🎭', mins: 50,
    blurb: 'Pre-training an encoder by filling in masked words: a small BERT trained here, then the real one probed.',
    cover: ['Masked language modelling', 'Next-sentence prediction and its removal', 'WordPiece', 'Pre-training a small BERT', 'What BERT knows'] },
  { n: 17, slug: '17-fine-tuning-bert', title: 'Fine-Tuning BERT for Classification', level: I, icon: '🎛️', mins: 45,
    blurb: 'Adding a head, learning rates, epochs and seeds: fine-tuning measured against the TF-IDF baseline.',
    cover: ['Classification heads', 'Learning rate and warm-up', 'Seed variance', 'Freezing layers', 'Gains over baselines'] },
  { n: 18, slug: '18-ner-with-bert', title: 'Token Classification: NER with BERT', level: I, icon: '🏢', mins: 45,
    blurb: 'Entity recognition with subword tokens: label alignment, span decoding and errors by entity type.',
    cover: ['Subword–label alignment', 'Token classification heads', 'Decoding spans', 'Errors by entity type', 'BERT vs BiLSTM-CRF'] },
  { n: 19, slug: '19-extractive-question-answering', title: 'Extractive Question Answering', level: I, icon: '❓', mins: 45,
    blurb: 'Predicting answer spans in a passage, long-context windows, and exact-match and F1 scoring.',
    cover: ['Span start and end', 'Sliding windows over long passages', 'Unanswerable questions', 'Exact match and F1', 'What QA models exploit'] },
  { n: 20, slug: '20-sentence-embeddings', title: 'Sentence Embeddings & Semantic Similarity', level: I, icon: '🔗', mins: 45,
    blurb: 'Why raw BERT vectors make poor sentence embeddings, and contrastive training that fixes them.',
    cover: ['Pooling BERT outputs', 'Bi-encoders vs cross-encoders', 'Contrastive training', 'STS benchmarks', 'Anisotropy'] },
  { n: 21, slug: '21-encoder-variants', title: 'Encoder Variants: RoBERTa to DeBERTa', level: I, icon: '🧬', mins: 45,
    blurb: 'RoBERTa, DistilBERT, ELECTRA and DeBERTa: what changed, and what it is worth, measured on the same tasks.',
    cover: ['RoBERTa’s training changes', 'DistilBERT and distillation', 'ELECTRA’s replaced-token detection', 'DeBERTa’s disentangled attention', 'Accuracy vs size'] },
  { n: 22, slug: '22-t5-and-bart', title: 'Encoder–Decoder Transformers: T5 & BART', level: I, icon: '🔀', mins: 45,
    blurb: 'Text-to-text models: span corruption, denoising pre-training and one model for many tasks.',
    cover: ['Text-to-text framing', 'Span corruption', 'BART’s denoising', 'Fine-tuning T5', 'Encoder–decoder vs decoder-only'] },
  { n: 23, slug: '23-summarisation-and-rouge', title: 'Summarisation & ROUGE', level: I, icon: '📝', mins: 45,
    blurb: 'Extractive and abstractive summaries, ROUGE from scratch, and faithfulness errors no metric catches.',
    cover: ['Extractive baselines', 'Abstractive summarisation', 'ROUGE from scratch', 'Faithfulness and hallucination', 'Length and lead bias'] },
  { n: 24, slug: '24-multilingual-nlp', title: 'Multilingual NLP & Cross-Lingual Transfer', level: I, icon: '🌍', mins: 45,
    blurb: 'One encoder for 100 languages, zero-shot transfer, and the tokenisation tax on low-resource languages.',
    cover: ['Multilingual BERT and XLM-R', 'Zero-shot cross-lingual transfer', 'Tokenisation across scripts', 'Low-resource languages', 'Translate-train vs translate-test'] },

  // ---------- Advanced ----------
  { n: 25, slug: '25-topic-models-and-clustering', title: 'Topic Models & Clustering Text', level: A, icon: '🗂️', mins: 45,
    blurb: 'LDA, embedding-based clustering and what “a topic” means, measured on a news corpus.',
    cover: ['LDA', 'Embedding clustering', 'Topic coherence', 'Choosing the number of topics', 'Reading topics honestly'] },
  { n: 26, slug: '26-information-retrieval', title: 'Information Retrieval: BM25 to Dense', level: A, icon: '🔎', mins: 50,
    blurb: 'Inverted indexes, BM25, dense bi-encoders and cross-encoder re-ranking, scored with nDCG and MRR.',
    cover: ['Inverted indexes', 'BM25', 'Dense retrieval', 'Re-ranking', 'nDCG, MRR and recall@k'] },
  { n: 27, slug: '27-weak-supervision-and-augmentation', title: 'Data Augmentation & Weak Supervision', level: A, icon: '🧪', mins: 45,
    blurb: 'Back-translation, synonym swaps and labelling functions: getting more training signal without more annotators.',
    cover: ['Text augmentation', 'Back-translation', 'Labelling functions', 'Combining noisy labels', 'When augmentation hurts'] },
  { n: 28, slug: '28-few-shot-nlp', title: 'Low-Resource & Few-Shot NLP', level: A, icon: '🌱', mins: 45,
    blurb: 'Learning a classifier from 8 to 64 labelled examples: SetFit, pattern-based training and their limits.',
    cover: ['Learning curves by labels', 'SetFit', 'Pattern-exploiting training', 'Active learning', 'Variance with few examples'] },
  { n: 29, slug: '29-zero-shot-with-nli', title: 'Zero-Shot Classification with NLI', level: A, icon: '🎯', mins: 40,
    blurb: 'Natural-language inference models as zero-shot classifiers, and how label wording changes the answer.',
    cover: ['Natural-language inference', 'Entailment as classification', 'Label templates', 'Calibration of zero-shot scores', 'NLI vs a small LLM'] },
  { n: 30, slug: '30-evaluating-nlp-models', title: 'Evaluating NLP Models Beyond Accuracy', level: A, icon: '🧾', mins: 45,
    blurb: 'Behavioural tests, slices and contrast sets: finding what a 92%-accurate model gets systematically wrong.',
    cover: ['Benchmarks and saturation', 'CheckList behavioural tests', 'Slices and subgroups', 'Contrast sets', 'Annotation artefacts'] },
  { n: 31, slug: '31-bias-and-fairness', title: 'Bias & Fairness in Text Models', level: A, icon: '⚖️', mins: 45,
    blurb: 'Measuring gender, dialect and identity bias in classifiers and embeddings, and what mitigation actually changes.',
    cover: ['Where bias enters', 'Template-based bias tests', 'Toxicity false positives on dialects', 'Mitigation', 'Reporting'] },
  { n: 32, slug: '32-robustness-and-adversarial-text', title: 'Robustness & Adversarial Text', level: A, icon: '🛡️', mins: 45,
    blurb: 'Typos, paraphrases and word-substitution attacks against classifiers, and defences measured.',
    cover: ['Natural noise', 'Character and word attacks', 'Paraphrase robustness', 'Adversarial training', 'Certified robustness for text'] },
  { n: 33, slug: '33-interpreting-text-models', title: 'Interpreting Text Models', level: A, icon: '🔬', mins: 45,
    blurb: 'Attention maps, gradients, integrated gradients and probing classifiers: what each explanation can claim.',
    cover: ['Is attention explanation?', 'Gradient saliency', 'Integrated gradients', 'Probing classifiers', 'Faithfulness tests'] },
  { n: 34, slug: '34-long-documents', title: 'Long Documents & Hierarchical Models', level: A, icon: '📚', mins: 45,
    blurb: 'Classifying and searching documents longer than 512 tokens: chunking, hierarchy and long-context encoders.',
    cover: ['The 512-token limit', 'Chunk and aggregate', 'Hierarchical encoders', 'Longformer-style attention', 'Cost vs length'] },
  { n: 35, slug: '35-information-extraction', title: 'Information Extraction: Relations & Linking', level: A, icon: '🕸️', mins: 45,
    blurb: 'Relation extraction, entity linking and building a small knowledge graph from text.',
    cover: ['Relation extraction', 'Entity linking', 'Coreference', 'Distant supervision', 'From text to a graph'] },
  { n: 36, slug: '36-encoders-vs-llms', title: 'Encoders vs LLMs: Choosing the Tool', level: A, icon: '⚖️', mins: 45,
    blurb: 'A fine-tuned encoder against a prompted small LLM on the same tasks: accuracy, latency and cost per million texts.',
    cover: ['Same task, two approaches', 'Accuracy with and without labels', 'Latency and throughput', 'Cost per million', 'When to use which'] },

  // ---------- Expert ----------
  { n: 37, slug: '37-serving-nlp-models', title: 'Serving NLP Models', level: E, icon: '🚀', mins: 45,
    blurb: 'Distillation, quantisation, ONNX, dynamic padding and batching for encoders, latency measured end to end.',
    cover: ['Latency budgets', 'Dynamic padding and batching', 'Distillation', 'Quantisation and ONNX', 'Tokenisation cost'] },
  { n: 38, slug: '38-text-pipelines-in-production', title: 'Text Pipelines in Production', level: E, icon: '🏭', mins: 45,
    blurb: 'Labelling workflows, drift in vocabulary and topics, monitoring and retraining for text models.',
    cover: ['Labelling workflows', 'Vocabulary and topic drift', 'Monitoring without labels', 'Retraining triggers', 'Privacy and PII'] },
  { n: 39, slug: '39-debugging-nlp-pipelines', title: 'Debugging NLP Pipelines & Datasets', level: E, icon: '🐞', mins: 45,
    blurb: 'Tokeniser mismatches, truncation, leakage, label noise and annotation artefacts: bugs planted and found.',
    cover: ['Tokeniser and casing mismatches', 'Silent truncation', 'Leakage and duplicates', 'Label noise', 'A debugging checklist'] },
  { n: 40, slug: '40-interview-playbook', title: 'The NLP Interview Playbook', level: E, icon: '🎤', mins: 45,
    blurb: 'How NLP interviews run, the questions they ask, and how to answer them with numbers from this course.',
    cover: ['Interview formats', 'Fundamentals questions', 'System design for text', 'Debugging questions', 'Talking about trade-offs'] },

  // ---------- Case Studies ----------
  { n: 41, slug: '41-case-word2vec', title: 'Case Study: word2vec', level: CS, icon: '🧭', mins: 45,
    blurb: 'The 2013 papers that made word vectors practical, and what they got right and wrong.',
    cover: ['The problem', 'The tricks', 'Results', 'Criticism', 'Legacy'] },
  { n: 42, slug: '42-case-google-neural-machine-translation', title: 'Case Study: Google Neural Machine Translation', level: CS, icon: '🌐', mins: 45,
    blurb: 'Replacing phrase-based translation with a deep LSTM seq2seq system in production.',
    cover: ['The old system', 'The architecture', 'Wordpieces', 'Serving at scale', 'Human evaluation'] },
  { n: 43, slug: '43-case-attention-is-all-you-need', title: 'Case Study: The Transformer for Translation', level: CS, icon: '⚡', mins: 45,
    blurb: 'The 2017 paper as a translation paper: what it measured, what it cost and why it spread.',
    cover: ['The setting', 'The design choices', 'Results and cost', 'What changed afterwards', 'Lessons'] },
  { n: 44, slug: '44-case-bert', title: 'Case Study: BERT', level: CS, icon: '🎭', mins: 45,
    blurb: 'How a pre-trained encoder reset eleven benchmarks in 2018, and what followed.',
    cover: ['Before BERT', 'Pre-training choices', 'The benchmarks', 'Follow-ups', 'Lessons'] },
  { n: 45, slug: '45-case-spam-filtering', title: 'Case Study: Spam Filtering at Scale', level: CS, icon: '📧', mins: 45,
    blurb: 'From naive Bayes to neural filters in an adversarial setting that never stops changing.',
    cover: ['The problem', 'Naive Bayes era', 'Adversaries adapt', 'Modern filters', 'Measuring at scale'] },
  { n: 46, slug: '46-case-bert-in-search', title: 'Case Study: BERT in Web Search', level: CS, icon: '🔎', mins: 45,
    blurb: 'Bringing a transformer into query understanding and ranking within a latency budget.',
    cover: ['The query problem', 'Where BERT was used', 'Latency and cost', 'Measuring relevance', 'Lessons'] },
  { n: 47, slug: '47-case-nllb', title: 'Case Study: No Language Left Behind', level: CS, icon: '🌍', mins: 45,
    blurb: 'Translation for 200 languages: data mining, evaluation and the low-resource problem.',
    cover: ['The goal', 'Mining parallel data', 'The model', 'Evaluation across 200 languages', 'Lessons'] },
  { n: 48, slug: '48-case-glue-and-benchmark-saturation', title: 'Case Study: GLUE & Benchmark Saturation', level: CS, icon: '🏁', mins: 45,
    blurb: 'How GLUE and SuperGLUE were built, beaten within months, and what that taught about benchmarks.',
    cover: ['Building a benchmark', 'Rapid progress', 'Annotation artefacts', 'Human baselines', 'What replaced them'] },
];

module.exports.levels = {
  Prerequisites: 'Unicode and normalisation, PyTorch for text, regex, counting and probability, sparse vectors, linear classifiers, metrics and Hugging Face.',
  Beginner: 'Tokenisation, bag of words and TF-IDF, text classification, n-gram language models, word embeddings, neural classifiers, RNNs and sequence labelling.',
  Intermediate: 'CRFs, seq2seq and attention, translation, transformer encoders, BERT and fine-tuning, NER, question answering, sentence embeddings, T5, summarisation and multilingual models.',
  Advanced: 'Topic models, retrieval, weak supervision, few-shot and zero-shot, evaluation, bias, robustness, interpretation, long documents, information extraction and encoders vs LLMs.',
  Expert: 'Serving, production pipelines, debugging NLP pipelines and the interview playbook.',
  'Case Studies': 'Eight systems that shaped the field, from word2vec to benchmark saturation.',
};
