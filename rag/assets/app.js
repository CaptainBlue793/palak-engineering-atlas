/* =========================================================
   Palak Deb Patra's RAG Playlist — shared runtime
   Builds the shell (sidebar, topbar, footer nav) and wires up
   generic components: tabs, steppers, quizzes, flip cards, seg controls.
   Exposes helpers on window.RAG for chapter-specific visualizers.
   ========================================================= */
(function () {
  const CHAPTERS = [
    { n: 0.1, file: 'p1-python-for-ai-engineering.html',     title: 'Python for AI Engineering', level: 'Prerequisites', icon: '🐍', mins: 40, blurb: 'The Python a RAG system is written in: environments, type hints, dataclasses, HTTP clients, JSON and scripts that can be rerun.' },
    { n: 0.2, file: 'p2-talking-to-an-llm.html',             title: 'Talking to an LLM', level: 'Prerequisites', icon: '💬', mins: 40, blurb: 'Chat messages, system prompts, temperature and stopping, with a local model you can run and measure.' },
    { n: 0.3, file: 'p3-tokens-and-context.html',            title: 'Tokens & Context Windows', level: 'Prerequisites', icon: '🔤', mins: 35, blurb: 'What a token is, how text becomes tokens, and why context windows, cost and latency are all counted in them.' },
    { n: 0.4, file: 'p4-vectors-and-similarity.html',        title: 'Vectors & Similarity', level: 'Prerequisites', icon: '📐', mins: 40, blurb: 'Dot products, cosine similarity, normalisation and distance, with NumPy, as retrieval uses them.' },
    { n: 0.5, file: 'p5-embeddings-in-practice.html',        title: 'Embeddings in Practice', level: 'Prerequisites', icon: '🧭', mins: 40, blurb: 'What an embedding model gives you, how to run one, and what nearby vectors do and do not mean.' },
    { n: 0.6, file: 'p6-text-processing.html',               title: 'Text Processing Basics', level: 'Prerequisites', icon: '🧹', mins: 35, blurb: 'Unicode, cleaning, sentence splitting and regular expressions: the unglamorous steps that decide retrieval quality.' },
    { n: 0.7, file: 'p7-keyword-search-basics.html',         title: 'Keyword Search Basics', level: 'Prerequisites', icon: '🔎', mins: 35, blurb: 'Inverted indexes, term frequency and TF-IDF: how search worked before embeddings and why it still matters.' },
    { n: 0.8, file: 'p8-ranking-metrics.html',               title: 'Measuring Search: Precision, Recall & Ranking', level: 'Prerequisites', icon: '📊', mins: 40, blurb: 'Precision, recall, recall@k, MRR and nDCG: the numbers every retrieval decision in this course is judged by.' },
    { n: 1, file: '01-what-rag-is.html',                   title: 'What RAG Is & When to Use It', level: 'Beginner', icon: '🧩', mins: 40, blurb: 'Why models need your data at answer time, and when retrieval beats fine-tuning or a longer prompt.' },
    { n: 2, file: '02-first-rag-pipeline.html',            title: 'Your First RAG Pipeline', level: 'Beginner', icon: '🛠️', mins: 45, blurb: 'Load, chunk, embed, index, retrieve and generate: a complete pipeline in about a hundred lines, measured end to end.' },
    { n: 3, file: '03-loading-documents.html',             title: 'Loading & Parsing Documents', level: 'Beginner', icon: '📄', mins: 40, blurb: 'Getting clean text out of HTML, Markdown and PDFs, keeping structure, tables and metadata.' },
    { n: 4, file: '04-chunking.html',                      title: 'Chunking Strategies', level: 'Beginner', icon: '✂️', mins: 45, blurb: 'Fixed, recursive, structural and semantic chunking, overlap and size, measured by what retrieval finds.' },
    { n: 5, file: '05-embedding-models.html',              title: 'Choosing & Using Embedding Models', level: 'Beginner', icon: '🧬', mins: 45, blurb: 'Benchmarks, dimensions, instruction prefixes, normalisation and multilingual models, compared on the same questions.' },
    { n: 6, file: '06-exact-vector-search.html',           title: 'Exact Vector Search', level: 'Beginner', icon: '🎯', mins: 35, blurb: 'Brute-force nearest neighbours with NumPy and a flat index: the correct answer every approximate index is judged against.' },
    { n: 7, file: '07-hnsw.html',                          title: 'Approximate Search: HNSW', level: 'Beginner', icon: '🕸️', mins: 45, blurb: 'How hierarchical navigable small-world graphs find neighbours fast, and the recall you trade for it.' },
    { n: 8, file: '08-ivf-and-quantisation.html',          title: 'IVF, Product Quantisation & Memory', level: 'Beginner', icon: '🗜️', mins: 45, blurb: 'Clustering vectors into lists, compressing them with product quantisation, and what that does to recall and RAM.' },
    { n: 9, file: '09-vector-databases-and-filters.html',  title: 'Vector Databases & Metadata Filters', level: 'Beginner', icon: '🗄️', mins: 40, blurb: 'What a vector database adds to an index, and why filtering before or after the search changes the results.' },
    { n: 10, file: '10-prompting-with-context.html',        title: 'Prompting with Retrieved Context', level: 'Beginner', icon: '📝', mins: 40, blurb: 'Assembling retrieved chunks into a prompt that answers from them, cites them and says when it cannot.' },
    { n: 11, file: '11-bm25.html',                          title: 'Keyword Retrieval with BM25', level: 'Intermediate', icon: '🔑', mins: 40, blurb: 'BM25 from first principles, its two parameters, and the queries where it beats embeddings.' },
    { n: 12, file: '12-hybrid-search.html',                 title: 'Hybrid Search & Rank Fusion', level: 'Intermediate', icon: '🔀', mins: 40, blurb: 'Combining keyword and vector results with weighted scores or reciprocal rank fusion, and measuring the gain.' },
    { n: 13, file: '13-reranking.html',                     title: 'Reranking with Cross-Encoders', level: 'Intermediate', icon: '🥇', mins: 45, blurb: 'Bi-encoders retrieve, cross-encoders judge: the second stage that fixes the order, and what it costs.' },
    { n: 14, file: '14-query-rewriting.html',               title: 'Query Rewriting & Expansion', level: 'Intermediate', icon: '✍️', mins: 40, blurb: 'Rewriting vague questions, generating several queries, and hypothetical-document embeddings (HyDE).' },
    { n: 15, file: '15-routing-and-decomposition.html',     title: 'Query Routing & Decomposition', level: 'Intermediate', icon: '🧭', mins: 40, blurb: 'Sending each question to the right index, and splitting multi-part questions into answerable pieces.' },
    { n: 16, file: '16-context-assembly.html',              title: 'Context Assembly: Order, Size & Lost in the Middle', level: 'Intermediate', icon: '🧱', mins: 40, blurb: 'How many chunks, in what order, deduplicated and compressed, and where in a long prompt models stop looking.' },
    { n: 17, file: '17-citations-and-grounding.html',       title: 'Citations & Grounded Answers', level: 'Intermediate', icon: '📎', mins: 40, blurb: 'Answers that point to their sources, and checking that each cited source really supports the claim.' },
    { n: 18, file: '18-structured-data.html',               title: 'Tables & Structured Data', level: 'Intermediate', icon: '🧮', mins: 40, blurb: 'When to retrieve rows as text, when to let the model write SQL, and how to keep numbers right.' },
    { n: 19, file: '19-evaluating-retrieval.html',          title: 'Evaluating Retrieval', level: 'Intermediate', icon: '📏', mins: 45, blurb: 'Golden sets, recall@k and nDCG on your own data, and comparing two pipelines without fooling yourself.' },
    { n: 20, file: '20-evaluating-generation.html',         title: 'Evaluating Answers: Faithfulness & Relevance', level: 'Intermediate', icon: '⚖️', mins: 45, blurb: 'Is the answer supported by the context, does it answer the question, and how far to trust a model as judge.' },
    { n: 21, file: '21-building-an-eval-set.html',          title: 'Building an Evaluation Set', level: 'Intermediate', icon: '🧪', mins: 40, blurb: 'Collecting real questions, generating synthetic ones carefully, and keeping the set honest as the corpus changes.' },
    { n: 22, file: '22-indexing-pipelines.html',            title: 'Indexing Pipelines & Updates', level: 'Intermediate', icon: '🔄', mins: 40, blurb: 'Ingesting, deduplicating and re-indexing documents as they change, without stale or duplicated chunks.' },
    { n: 23, file: '23-permissions-and-tenancy.html',       title: 'Permissions & Multi-Tenant Retrieval', level: 'Advanced', icon: '🔐', mins: 40, blurb: 'Never retrieving what the user may not read: access-control filters, tenants and the leaks in between.' },
    { n: 24, file: '24-hierarchical-retrieval.html',        title: 'Long Documents: Hierarchical & Parent–Child Retrieval', level: 'Advanced', icon: '🌳', mins: 40, blurb: 'Searching small chunks and returning their larger context, summaries of sections, and document-level routing.' },
    { n: 25, file: '25-multi-vector-retrieval.html',        title: 'Multi-Vector & Late-Interaction Retrieval', level: 'Advanced', icon: '🧷', mins: 45, blurb: 'Several vectors per document, ColBERT-style late interaction, and what precision they buy at what storage.' },
    { n: 26, file: '26-graph-rag.html',                     title: 'Graph RAG & Knowledge Graphs', level: 'Advanced', icon: '🕸', mins: 45, blurb: 'Extracting entities and relations, retrieving through a graph, and the questions only a graph answers well.' },
    { n: 27, file: '27-rag-over-code.html',                 title: 'Retrieval over Code & Technical Docs', level: 'Advanced', icon: '💻', mins: 40, blurb: 'Chunking by syntax, searching identifiers exactly, and combining code, docs and issue history.' },
    { n: 28, file: '28-latency-and-caching.html',           title: 'Latency & Caching', level: 'Advanced', icon: '⚡', mins: 40, blurb: 'Where a RAG request spends its time, and the embedding, retrieval and answer caches that remove it.' },
    { n: 29, file: '29-cost-and-scale.html',                title: 'Cost & Scale', level: 'Advanced', icon: '💰', mins: 40, blurb: 'Index memory, embedding cost, int8 and binary vectors, and the bill for a million documents.' },
    { n: 30, file: '30-conversations.html',                 title: 'Conversations & Follow-Up Questions', level: 'Advanced', icon: '🗨️', mins: 40, blurb: 'Rewriting follow-ups into standalone queries, carrying history, and not retrieving for every turn.' },
    { n: 31, file: '31-prompt-injection.html',              title: 'Prompt Injection & Untrusted Documents', level: 'Advanced', icon: '🛡️', mins: 45, blurb: 'Why retrieved text can carry instructions, and the layered defences that limit what it can make the system do.' },
    { n: 32, file: '32-hallucination-and-abstention.html',  title: 'Hallucination & Knowing When Not to Answer', level: 'Advanced', icon: '🤐', mins: 40, blurb: 'Detecting unsupported answers and measuring when a system should abstain instead of guessing.' },
    { n: 33, file: '33-fine-tuning-retrievers.html',        title: 'Fine-Tuning Embeddings & Rerankers', level: 'Advanced', icon: '🎛️', mins: 45, blurb: 'Adapting a small embedding model to your domain with contrastive pairs and hard negatives, and checking it helped.' },
    { n: 34, file: '34-agentic-rag.html',                   title: 'Agentic RAG: Retrieval as a Tool', level: 'Advanced', icon: '🤖', mins: 45, blurb: 'Letting the model decide when and what to search, iterate and stop, and the cost of that freedom.' },
    { n: 35, file: '35-production-architecture.html',       title: 'Production RAG Architecture', level: 'Expert', icon: '🏗️', mins: 45, blurb: 'The services, stores, queues and guards of a RAG system that many teams depend on.' },
    { n: 36, file: '36-observability-and-feedback.html',    title: 'Observability & Feedback Loops', level: 'Expert', icon: '📡', mins: 40, blurb: 'Tracing each answer to its retrieval, collecting feedback, and turning failures into evaluation cases.' },
    { n: 37, file: '37-debugging-bad-answers.html',         title: 'Debugging a Bad Answer', level: 'Expert', icon: '🐞', mins: 45, blurb: 'Was it parsing, chunking, retrieval, ranking, context or generation? A method for finding out.' },
    { n: 38, file: '38-choosing-an-approach.html',          title: 'RAG, Long Context or Fine-Tuning: Choosing', level: 'Expert', icon: '🧭', mins: 40, blurb: 'Measured trade-offs between retrieval, putting everything in context, and training the knowledge in.' },
    { n: 39, file: '39-privacy-and-deletion.html',          title: 'Privacy, Retention & Deletion', level: 'Expert', icon: '🗑️', mins: 40, blurb: 'Personal data in indexes, deleting it everywhere it was copied, and what embeddings can leak.' },
    { n: 40, file: '40-interview-playbook.html',            title: 'The RAG Interview Playbook', level: 'Expert', icon: '🎤', mins: 45, blurb: 'Design rounds, concept questions and debugging scenarios for AI engineering interviews, with a framework.' },
    { n: 41, file: '41-case-support-assistant.html',        title: 'Case Study: A Customer-Support Assistant', level: 'Case Studies', icon: '🎧', mins: 45, blurb: 'Answering from help-centre articles and past tickets, with hand-off to people when it should not answer.' },
    { n: 42, file: '42-case-air-canada-chatbot.html',       title: 'Case Study: The Air Canada Chatbot Ruling', level: 'Case Studies', icon: '✈️', mins: 35, blurb: 'A tribunal held an airline to its chatbot\'s wrong answer about a refund policy: grounding and accountability.' },
    { n: 43, file: '43-case-fake-legal-citations.html',     title: 'Case Study: Invented Legal Citations', level: 'Case Studies', icon: '⚖️', mins: 35, blurb: 'Lawyers filed cases a model had made up: why citation verification is not optional.' },
    { n: 44, file: '44-case-enterprise-search.html',        title: 'Case Study: Enterprise Search Across Every App', level: 'Case Studies', icon: '🏢', mins: 45, blurb: 'Connectors, permissions that change daily, and ranking across mail, documents, tickets and chat.' },
    { n: 45, file: '45-case-answer-engine.html',            title: 'Case Study: A Web Answer Engine', level: 'Case Studies', icon: '🌐', mins: 45, blurb: 'Search the web, read pages and answer with citations in seconds: the architecture and its failure modes.' },
    { n: 46, file: '46-case-code-assistant-retrieval.html', title: 'Case Study: Retrieval for a Code Assistant', level: 'Case Studies', icon: '🧑‍💻', mins: 40, blurb: 'Choosing which files, symbols and docs to show a model so it can change a large repository.' },
    { n: 47, file: '47-case-clinical-guidelines.html',      title: 'Case Study: Answering from Clinical Guidelines', level: 'Case Studies', icon: '🩺', mins: 40, blurb: 'High-stakes RAG: versioned guidance, conservative answers, citations and review.' },
    { n: 48, file: '48-case-billion-vector-index.html',     title: 'Case Study: Scaling to a Billion Vectors', level: 'Case Studies', icon: '🗺️', mins: 45, blurb: 'Memory, sharding, quantisation and recall when a vector index outgrows one machine.' },
  ];

  const LEVELS = [
    ['Prerequisites', 'var(--green)', 'Python, talking to an LLM, tokens, vectors, embeddings, text processing, keyword search and ranking metrics.'],
    ['Beginner', 'var(--accent)', 'What RAG is, a first pipeline, documents, chunking, embedding models, exact and approximate vector search, filters and prompting.'],
    ['Intermediate', 'color-mix(in srgb, var(--accent-2) 25%, var(--accent))', 'BM25, hybrid search, reranking, query rewriting and routing, context assembly, citations, tables, evaluation and indexing pipelines.'],
    ['Advanced', 'color-mix(in srgb, var(--accent-2) 50%, var(--accent))', 'Permissions, long documents, multi-vector and graph retrieval, code, latency, cost, conversations, injection, hallucination, fine-tuning and agentic RAG.'],
    ['Expert', 'color-mix(in srgb, var(--accent-2) 75%, var(--accent))', 'Production architecture, observability, debugging bad answers, choosing an approach, privacy and the interview playbook.'],
    ['Case Studies', 'var(--accent-2)', 'Eight real systems and failures, from a chatbot ruling to a billion-vector index.'],
  ];


  // Prerequisites are stored as 0.1…0.8 (so they sort before Chapter 1) and shown as P1…P8.
  const isPre = (n) => n > 0 && n < 1;
  const numOf = (c) => (c && typeof c === 'object' ? c.n : +c);
  const chNum = (c) => { const n = numOf(c); return isPre(n) ? 'P' + Math.round(n * 10) : String(n); };
  const chName = (c) => { const n = numOf(c); return isPre(n) ? 'Prerequisite ' + Math.round(n * 10) : 'Chapter ' + n; };

  const LS = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  };
  // The old single "Chapter 0" became the Prerequisites level: finishing it counts as finishing all of them.
  (function migratePrereqs() {
    const d = LS.get('rag-done', []);
    if (!Array.isArray(d) || !d.includes(0)) return;
    const pre = CHAPTERS.filter((c) => isPre(c.n)).map((c) => c.n);
    LS.set('rag-done', [...new Set(d.filter((n) => n !== 0).concat(pre))]);
    const q = LS.get('rag-quiz', {}); delete q[0]; LS.set('rag-quiz', q);
  })();
  const doneSet = () => new Set(LS.get('rag-done', []));

  /* ---------------- helpers ---------------- */
  const SVGNS = 'http://www.w3.org/2000/svg';
  const RAG = {
    CHAPTERS, LEVELS, LS, chNum, chName,
    $: (s, r = document) => r.querySelector(s),
    $$: (s, r = document) => [...r.querySelectorAll(s)],
    sleep: (ms) => new Promise((r) => setTimeout(r, ms)),
    rand: (a, b) => a + Math.random() * (b - a),
    randInt: (a, b) => Math.floor(a + Math.random() * (b - a + 1)),
    clamp: (v, a, b) => Math.max(a, Math.min(b, v)),
    fmt(n, d = 1) {
      if (!isFinite(n)) return '∞';
      const a = Math.abs(n);
      if (a >= 1e12) return (n / 1e12).toFixed(d).replace(/\.0+$/, '') + 'T';
      if (a >= 1e9) return (n / 1e9).toFixed(d).replace(/\.0+$/, '') + 'B';
      if (a >= 1e6) return (n / 1e6).toFixed(d).replace(/\.0+$/, '') + 'M';
      if (a >= 1e3) return (n / 1e3).toFixed(d).replace(/\.0+$/, '') + 'K';
      return (Math.round(n * 10 ** d) / 10 ** d).toString();
    },
    bytes(b) {
      const u = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
      let i = 0; while (b >= 1000 && i < u.length - 1) { b /= 1000; i++; }
      return (b >= 100 ? b.toFixed(0) : b >= 10 ? b.toFixed(1) : b.toFixed(2)).replace(/\.0+$/, '') + ' ' + u[i];
    },
    svg(tag, attrs = {}, parent) {
      const e = document.createElementNS(SVGNS, tag);
      for (const k in attrs) {
        if (k === 'text') e.textContent = attrs[k];
        else e.setAttribute(k, attrs[k]);
      }
      if (parent) parent.appendChild(e);
      return e;
    },
    /** centre of any element in the coordinate space of its owner <svg> */
    center(svg, el) {
      if (typeof el === 'string') el = svg.querySelector('#' + CSS.escape(el));
      const r = el.getBoundingClientRect();
      const pt = svg.createSVGPoint();
      pt.x = r.left + r.width / 2; pt.y = r.top + r.height / 2;
      const p = pt.matrixTransform(svg.getScreenCTM().inverse());
      return { x: p.x, y: p.y };
    },
    /** animate a glowing dot from (x1,y1) to (x2,y2). resolves when done */
    packet(svg, x1, y1, x2, y2, o = {}) {
      const color = o.color || 'var(--accent)';
      const dur = o.dur || 700;
      const g = RAG.svg('g', { class: 'packet', style: `color:${color}` }, svg);
      const c = RAG.svg('circle', { r: o.r || 6, fill: color }, g);
      let t2;
      if (o.label) t2 = RAG.svg('text', { 'font-size': 10, 'text-anchor': 'middle', fill: color, 'font-weight': 700, text: o.label, style: 'font-family:var(--mono)' }, g);
      const ease = (t) => (t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
      return new Promise((res) => {
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - start) / dur);
          const e = ease(t);
          const x = x1 + (x2 - x1) * e, y = y1 + (y2 - y1) * e;
          c.setAttribute('cx', x); c.setAttribute('cy', y);
          if (t2) { t2.setAttribute('x', x); t2.setAttribute('y', y - 11); }
          if (t < 1) requestAnimationFrame(tick);
          else { if (!o.keep) g.remove(); res(g); }
        };
        requestAnimationFrame(tick);
      });
    },
    packetBetween(svg, a, b, o) {
      const p = RAG.center(svg, a), q = RAG.center(svg, b);
      return RAG.packet(svg, p.x, p.y, q.x, q.y, o);
    },
    /** animate along an existing <path> */
    packetAlong(svg, path, o = {}) {
      const len = path.getTotalLength();
      const dur = o.dur || 900;
      const g = RAG.svg('g', { class: 'packet', style: `color:${o.color || 'var(--accent)'}` }, svg);
      const c = RAG.svg('circle', { r: o.r || 6, fill: o.color || 'var(--accent)' }, g);
      return new Promise((res) => {
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - start) / dur);
          const p = path.getPointAtLength(o.reverse ? len * (1 - t) : len * t);
          c.setAttribute('cx', p.x); c.setAttribute('cy', p.y);
          if (t < 1) requestAnimationFrame(tick); else { g.remove(); res(); }
        };
        requestAnimationFrame(tick);
      });
    },
    log(el, html, cls = '') {
      const d = document.createElement('div');
      if (cls) d.className = cls;
      d.innerHTML = html;
      el.appendChild(d);
      while (el.children.length > 120) el.firstChild.remove();
      el.scrollTop = el.scrollHeight;
    },
    toast(msg) {
      let t = document.getElementById('rag-toast');
      if (!t) {
        t = document.createElement('div'); t.id = 'rag-toast';
        t.style.cssText = 'position:fixed;left:50%;bottom:26px;transform:translateX(-50%) translateY(20px);background:var(--text);color:var(--bg);padding:10px 18px;border-radius:12px;font-weight:600;font-size:14px;z-index:200;opacity:0;transition:.3s;pointer-events:none;box-shadow:var(--shadow-lg)';
        document.body.appendChild(t);
      }
      t.textContent = msg;
      requestAnimationFrame(() => { t.style.opacity = 1; t.style.transform = 'translateX(-50%)'; });
      clearTimeout(t._h);
      t._h = setTimeout(() => { t.style.opacity = 0; t.style.transform = 'translateX(-50%) translateY(20px)'; }, 2200);
    },
  };
  window.RAG = RAG;

  /* ---------------- theme ---------------- */
  function currentTheme() {
    const t = document.documentElement.getAttribute('data-theme');
    if (t) return t;
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function toggleTheme() {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    LS.set('rag-theme', next);
    RAG.$$('.theme-btn').forEach((b) => (b.textContent = next === 'dark' ? '☀️' : '🌙'));
  }

  /* ---------------- shell ---------------- */
  const AUTHOR = 'Palak Deb Patra';
  const ATLAS_WORDMARK = '<svg class="atlas-wordmark" viewBox="0 0 102 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><text x="1" y="25" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="800" letter-spacing="-1.3" fill="currentColor">Engg<tspan class="gold">A</tspan></text></svg>';

  function buildShell() {
    const body = document.body;
    if (!/Palak/.test(document.title)) document.title += ` · RAG by ${AUTHOR}`;
    const chapNum = body.dataset.chapter == null ? -1 : +body.dataset.chapter;   // -1 = not a chapter page (prerequisites are 0.1…0.8)
    const chap = CHAPTERS.find((c) => c.n === chapNum);
    const main = RAG.$('main.content');
    if (!main) return { chap };

    const progress = document.createElement('div');
    progress.className = 'read-progress';

    const layout = document.createElement('div'); layout.className = 'layout';
    const sidebar = document.createElement('aside'); sidebar.className = 'sidebar';
    const scrim = document.createElement('div'); scrim.className = 'scrim';
    const mainWrap = document.createElement('div'); mainWrap.className = 'main';

    // sidebar
    const done = doneSet();
    let html = `<a class="brand" href="index.html"><span class="brand-logo"><svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 2.5H6A1.5 1.5 0 0 0 4.5 4v16A1.5 1.5 0 0 0 6 21.5h5"/><path d="M13 2.5 18 7.5v2M13 2.5v5h5"/><path d="M7.5 10.5h5M7.5 13.5h3"/><circle cx="16.3" cy="15.8" r="3.2"/><path d="M18.6 18.1l2.9 2.9"/></svg></span><span><span class="brand-author">Palak Deb Patra</span><span class="grad brand-course">RAG Playlist</span></span></a>
      <div class="side-progress"><div class="bar"><i style="width:${(done.size / CHAPTERS.length) * 100}%"></i></div><small>${done.size} of ${CHAPTERS.length} chapters complete</small></div>`;
    let lastLevel = '';
    for (const c of CHAPTERS) {
      if (c.level !== lastLevel) { html += `<div class="nav-level">${c.level}</div>`; lastLevel = c.level; }
      const cls = ['nav-link', done.has(c.n) ? 'done' : '', c.n === chapNum ? 'current' : ''].join(' ');
      html += `<a class="${cls}" href="${c.file}"><span class="num">${done.has(c.n) ? '✓' : chNum(c)}</span><span>${c.title}</span></a>`;
      if (c.n === chapNum) html += `<nav class="toc" id="toc"></nav>`;
    }
    html += `<div class="nav-level">Study tools</div>
      <a class="nav-link study" href="glossary.html"><span class="num">📖</span><span>Glossary</span></a>
      <a class="nav-link study" href="flashcards.html"><span class="num">🃏</span><span>Flashcards</span></a>
      <a class="nav-link study" href="mock-interview.html"><span class="num">🎤</span><span>Mock interview</span></a>`;
    sidebar.innerHTML = html;
    const here = location.pathname.split('/').pop();
    RAG.$$('.nav-link.study', sidebar).forEach((a) => { if (a.getAttribute('href') === here) a.classList.add('current'); });

    // topbar
    const top = document.createElement('header'); top.className = 'topbar';
    const theme = currentTheme();
    top.innerHTML = `<button class="icon-btn menu-btn" aria-label="Menu">☰</button>
      <div class="crumb"><a class="atlas-home" href="../index.html" aria-label="Engineering Atlas home">${ATLAS_WORDMARK}</a> / ${chap ? `<a href="index.html">Course</a> / ${chName(chap)} · <b>${chap.title}</b>` : '<b>RAG</b>'}</div>
      <div class="spacer"></div>
      <button class="search-btn" aria-label="Search the course" title="Search (Ctrl+K)">🔎 <span>Search</span> <kbd class="kbd">Ctrl K</kbd></button>
      <button class="icon-btn theme-btn" aria-label="Toggle theme" title="Toggle theme">${theme === 'dark' ? '☀️' : '🌙'}</button>`;

    main.parentNode.insertBefore(layout, main);
    layout.appendChild(sidebar); layout.appendChild(scrim); layout.appendChild(mainWrap);
    mainWrap.appendChild(top); mainWrap.appendChild(main);
    body.insertBefore(progress, body.firstChild);

    top.querySelector('.theme-btn').onclick = toggleTheme;
    const menuBtn = top.querySelector('.menu-btn');
    menuBtn.onclick = () => { sidebar.classList.toggle('open'); scrim.classList.toggle('show'); };
    scrim.onclick = () => { sidebar.classList.remove('open'); scrim.classList.remove('show'); };

    addEventListener('scroll', () => {
      const h = document.documentElement;
      const p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
      progress.style.width = (p * 100).toFixed(2) + '%';
    }, { passive: true });

    // keep current chapter visible in sidebar
    const cur = sidebar.querySelector('.nav-link.current');
    if (cur) setTimeout(() => cur.scrollIntoView({ block: 'center' }), 0);

    return { chap, main, sidebar };
  }

  function buildToc(chap, main) {
    const toc = document.getElementById('toc');
    const h2s = RAG.$$('h2', main);
    h2s.forEach((h, i) => {
      if (!h.id) h.id = 's' + (i + 1) + '-' + h.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
      if (chap && !h.querySelector('.sec-num')) {
        const s = document.createElement('span'); s.className = 'sec-num'; s.textContent = `${chNum(chap)}.${i + 1}`;
        h.prepend(s);
      }
      if (toc) {
        const a = document.createElement('a'); a.href = '#' + h.id;
        a.textContent = h.textContent.replace(/^P?\d+\.\d+/, '').trim();
        toc.appendChild(a);
        a.addEventListener('click', () => { RAG.$('.sidebar').classList.remove('open'); RAG.$('.scrim').classList.remove('show'); });
      }
    });
    if (!toc || !h2s.length) return;
    const links = RAG.$$('a', toc);
    const spy = () => {
      let idx = 0;
      h2s.forEach((h, i) => { if (h.getBoundingClientRect().top < 140) idx = i; });
      links.forEach((l, i) => l.classList.toggle('active', i === idx));
    };
    addEventListener('scroll', spy, { passive: true }); spy();
  }

  function buildFooter(chap, main) {
    if (!chap) return;
    const i = CHAPTERS.indexOf(chap);
    const prev = CHAPTERS[i - 1], next = CHAPTERS[i + 1];
    const box = document.createElement('div');
    const isDone = () => doneSet().has(chap.n);
    const render = () => {
      box.className = 'complete-box' + (isDone() ? ' done' : '');
      box.innerHTML = isDone()
        ? `<p style="font-size:26px;margin:0">🎉</p><p><strong>${chName(chap)} complete!</strong></p><button class="btn sm ghost" data-undo>Mark as not complete</button>`
        : `<p><strong>Finished this chapter?</strong><br><span class="muted small">Track your progress across the course.</span></p><button class="btn primary">✓ Mark chapter complete</button>`;
      box.querySelector('button').onclick = () => {
        const s = doneSet();
        if (isDone()) s.delete(chap.n); else { s.add(chap.n); RAG.toast('Nice work! Progress saved.'); }
        LS.set('rag-done', [...s]);
        render();
        const side = RAG.$('.sidebar .nav-link.current .num');
        if (side) { side.textContent = isDone() ? '✓' : chNum(chap); side.parentElement.classList.toggle('done', isDone()); }
        const bar = RAG.$('.side-progress');
        if (bar) { const n = doneSet().size; bar.querySelector('i').style.width = (n / CHAPTERS.length) * 100 + '%'; bar.querySelector('small').textContent = `${n} of ${CHAPTERS.length} chapters complete`; }
      };
    };
    render();
    main.appendChild(box);
    const nav = document.createElement('nav'); nav.className = 'chapter-nav';
    nav.innerHTML = (prev ? `<a href="${prev.file}"><small>← Previous</small>${prev.title}</a>` : `<a href="index.html"><small>← Back to</small>Course home</a>`)
      + (next ? `<a class="nx" href="${next.file}"><small>Next →</small>${next.title}</a>` : `<a class="nx" href="index.html"><small>🏁 Finished!</small>Back to course home</a>`);
    main.appendChild(nav);
  }

  /* ---------------- components ---------------- */
  function initTabs(root = document) {
    RAG.$$('.tabs', root).forEach((tabs) => {
      if (tabs._init) return; tabs._init = true;
      const btns = RAG.$$(':scope > .tab-list > button', tabs);
      const panels = RAG.$$(':scope > .tab-panel', tabs);
      const go = (i) => {
        btns.forEach((b, j) => b.classList.toggle('active', i === j));
        panels.forEach((p, j) => p.classList.toggle('active', i === j));
        tabs.dispatchEvent(new CustomEvent('tabchange', { detail: { index: i, panel: panels[i] } }));
      };
      btns.forEach((b, i) => (b.onclick = () => go(i)));
      go(Math.max(0, btns.findIndex((b) => b.classList.contains('active'))));
    });
  }

  function initSeg(root = document) {
    RAG.$$('.seg', root).forEach((seg) => {
      if (seg._init) return; seg._init = true;
      const btns = RAG.$$('button', seg);
      if (!btns.some((b) => b.classList.contains('active')) && btns[0]) btns[0].classList.add('active');
      seg.dataset.value = (btns.find((b) => b.classList.contains('active')) || {}).dataset?.v || '';
      btns.forEach((b) => b.addEventListener('click', () => {
        btns.forEach((x) => x.classList.toggle('active', x === b));
        seg.dataset.value = b.dataset.v;
        seg.dispatchEvent(new CustomEvent('segchange', { detail: b.dataset.v }));
      }));
    });
  }

  function initFlips(root = document) {
    RAG.$$('.flip', root).forEach((f) => {
      if (f._init) return; f._init = true;
      f.setAttribute('tabindex', '0');
      const t = () => f.classList.toggle('flipped');
      f.addEventListener('click', t);
      f.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t(); } });
    });
  }

  function initSteppers(root = document) {
    RAG.$$('.stepper', root).forEach((st) => {
      if (st._init) return; st._init = true;
      const diagram = document.getElementById(st.dataset.diagram);
      const steps = RAG.$$('ol.steps > li', st);
      const intro = st.dataset.intro || 'Press <b>Next</b> or <b>Play</b> to walk through this flow step by step.';
      st.insertAdjacentHTML('beforeend', `
        <div class="step-text"><div class="st-title"></div><div class="st-desc"></div></div>
        <div class="stepper-bar">
          <div class="stepper-dots">${steps.map(() => '<i></i>').join('')}</div>
          <span class="count"></span>
          <button class="btn sm" data-a="reset" title="Reset">↺</button>
          <button class="btn sm" data-a="prev">← Prev</button>
          <button class="btn sm" data-a="play">▶ Play</button>
          <button class="btn sm primary" data-a="next">Next →</button>
        </div>`);
      const title = RAG.$('.st-title', st), desc = RAG.$('.st-desc', st), count = RAG.$('.count', st);
      const dots = RAG.$$('.stepper-dots i', st);
      const playBtn = RAG.$('[data-a=play]', st);
      let idx = -1, playing = false, token = 0;

      const clear = () => { if (diagram) RAG.$$('.on', diagram).forEach((e) => e.classList.remove('on')); };
      async function go(i) {
        idx = RAG.clamp(i, -1, steps.length - 1);
        const my = ++token;
        clear();
        dots.forEach((d, j) => { d.classList.toggle('active', j === idx); d.classList.toggle('past', j < idx); });
        count.textContent = idx < 0 ? `${steps.length} steps` : `Step ${idx + 1} / ${steps.length}`;
        RAG.$('[data-a=prev]', st).disabled = idx < 0;
        RAG.$('[data-a=next]', st).disabled = idx >= steps.length - 1;
        if (idx < 0) {
          diagram && diagram.classList.remove('stepping');
          title.innerHTML = '👋 Interactive walkthrough'; desc.innerHTML = intro;
          st.dispatchEvent(new CustomEvent('step', { detail: { index: -1 } }));
          return;
        }
        const li = steps[idx];
        diagram && diagram.classList.add('stepping');
        (li.dataset.on || '').split(/\s+/).filter(Boolean).forEach((id) => {
          const e = diagram && diagram.querySelector('#' + CSS.escape(id));
          if (e) e.classList.add('on');
        });
        title.innerHTML = `<span class="n">${idx + 1}</span>${li.dataset.title || ''}`;
        desc.innerHTML = li.innerHTML;
        desc.style.animation = 'none'; void desc.offsetWidth; desc.style.animation = '';
        st.dispatchEvent(new CustomEvent('step', { detail: { index: idx, li } }));
        if (li.dataset.packet && diagram) {
          for (const seg of li.dataset.packet.split(',')) {
            if (my !== token) return;
            const [a, b] = seg.split('>').map((s) => s.trim());
            const ea = diagram.querySelector('#' + CSS.escape(a)), eb = diagram.querySelector('#' + CSS.escape(b));
            if (ea && eb) await RAG.packetBetween(diagram, ea, eb, { color: li.dataset.color, dur: 650 });
          }
        }
      }
      async function play() {
        if (playing) { playing = false; playBtn.textContent = '▶ Play'; return; }
        playing = true; playBtn.textContent = '⏸ Pause';
        if (idx >= steps.length - 1) idx = -1;
        while (playing && idx < steps.length - 1) {
          await go(idx + 1);
          await RAG.sleep(+st.dataset.delay || 2300);
        }
        playing = false; playBtn.textContent = '▶ Play';
      }
      st.addEventListener('click', (e) => {
        const a = e.target.closest('[data-a]')?.dataset.a;
        if (!a) return;
        if (a !== 'play' && playing) { playing = false; playBtn.textContent = '▶ Play'; }
        if (a === 'next') go(idx + 1);
        if (a === 'prev') go(idx - 1);
        if (a === 'reset') go(-1);
        if (a === 'play') play();
      });
      dots.forEach((d, j) => (d.onclick = () => go(j)));
      st._go = go;
      go(-1);
    });
  }

  function initQuizzes(chap) {
    const quizzes = RAG.$$('.quiz');
    if (!quizzes.length) return;
    let answered = 0, correct = 0;
    const scoreEl = RAG.$('.quiz-score');
    const update = () => {
      if (!scoreEl) return;
      scoreEl.innerHTML = `<span class="big">${correct}/${quizzes.length}</span><span>${answered < quizzes.length ? `Answered ${answered} of ${quizzes.length} — keep going!` : correct === quizzes.length ? 'Perfect score! You nailed this chapter. 🏆' : correct >= quizzes.length * .6 ? 'Solid! Review the ones you missed. 💪' : 'Worth a re-read of the sections above. 📚'}</span>`;
      if (answered === quizzes.length && chap) {
        const best = LS.get('rag-quiz', {});
        best[chap.n] = Math.max(best[chap.n] || 0, correct / quizzes.length);
        LS.set('rag-quiz', best);
      }
    };
    quizzes.forEach((q, qi) => {
      const qp = RAG.$('.q', q);
      if (qp && !qp.querySelector('.qn')) qp.insertAdjacentHTML('afterbegin', `<span class="qn">Q${qi + 1}</span>`);
      const opts = RAG.$$('.opt', q);
      const ans = +q.dataset.answer;
      opts.forEach((o, i) => {
        o.dataset.letter = 'ABCDEFG'[i];
        o.onclick = () => {
          if (q.classList.contains('answered')) return;
          q.classList.add('answered');
          answered++;
          if (i === ans) correct++;
          opts.forEach((x, j) => { x.disabled = true; if (j === ans) x.classList.add('correct'); });
          if (i !== ans) o.classList.add('wrong');
          update();
        };
      });
    });
    update();
  }

  function initReveal() {
    const els = RAG.$$('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { threshold: 0.12 });
    els.forEach((e) => io.observe(e));
  }

  /** Run a callback only while an element is on screen (saves CPU for sims) */
  RAG.whenVisible = function (el, onShow, onHide) {
    if (!('IntersectionObserver' in window)) { onShow(); return; }
    new IntersectionObserver((ents) => ents.forEach((en) => (en.isIntersecting ? onShow() : onHide && onHide())), { threshold: 0.05 }).observe(el);
  };

/* >>> shared visuals (generated by tools/components/install.cjs) */
  /* ---------------- sequence diagrams & workflows (shared visuals) ----------------
     <figure class="seq" data-actors="Client|API|DB">
       <ol>
         <li data-m="0>1">POST /orders<small>optional detail shown under the diagram</small></li>
         <li data-m="1>2">INSERT …</li>
         <li data-m="2>1" data-k="reply">ok</li>        reply  = dashed arrow back
         <li data-m="1>1">validate</li>                 self   = loop on one lifeline
         <li data-m="0-2" data-k="note">note text</li>  note   = box spanning lifelines 0…2
         <li data-m="1>2" data-k="fail">timeout</li>    fail   = red arrow ending in ✕ (lost / refused)
         <li data-m="1>2" data-k="bad">stale write</li> bad    = red arrow that arrives (harmful but delivered)
         <li data-m="1>2" data-k="async">event</li>     async  = open arrowhead, dashed
       </ol>
       <figcaption>…</figcaption>
     </figure>
     <figure class="flow"><ol>
         <li data-k="start|step|decision|store|end|fail"><b>Title</b> short description</li>
     </ol><figcaption>…</figcaption></figure>                                           */
  function initSeq(root = document) {
    RAG.$$('figure.seq', root).forEach((fig) => {
      if (fig._init) return; fig._init = true;
      const actors = (fig.dataset.actors || '').split('|').map((s) => s.trim());
      const items = RAG.$$(':scope > ol > li', fig).map((li) => {
        const small = li.querySelector('small');
        const detail = small ? small.innerHTML : '';
        const clone = li.cloneNode(true); const s2 = clone.querySelector('small'); if (s2) s2.remove();
        const m = li.dataset.m || '0>1';
        const note = m.includes('-') && !m.includes('>');
        const [a, b] = m.split(note ? '-' : '>').map((x) => +x);
        return { a, b, note, kind: li.dataset.k || (note ? 'note' : 'msg'), label: clone.textContent.trim(), detail };
      });
      fig.querySelector(':scope > ol').hidden = true;
      const PADX = 80, TOP = 58, ROW = 46, CH = 7.3;   // CH ≈ width of one mono character
      // Each gap between neighbouring lifelines is wide enough for the labels that live in it.
      const gap = actors.slice(1).map((n, i) => Math.max(140, (n.length + actors[i].length) * 3.9 + 30));
      items.forEach((it) => {
        if (it.note) return;
        const lo = Math.min(it.a, it.b), hi = Math.max(it.a, it.b), need = it.label.length * CH + 44;
        if (lo === hi) { if (lo < gap.length) gap[lo] = Math.max(gap[lo], need + 40); return; }
        const have = gap.slice(lo, hi).reduce((s, g) => s + g, 0);
        if (need > have) for (let g = lo; g < hi; g++) gap[g] += (need - have) / (hi - lo);
      });
      const xs = [PADX]; gap.forEach((g) => xs.push(xs.at(-1) + g));
      const selfLast = items.some((it) => !it.note && it.a === it.b && it.a === actors.length - 1);
      const lastSelf = selfLast ? Math.max(...items.filter((it) => !it.note && it.a === it.b && it.a === actors.length - 1).map((it) => it.label.length * CH + 60)) : 0;
      const W = xs.at(-1) + Math.max(PADX, lastSelf);
      const rowH = (it) => (it.note ? 40 : it.a === it.b ? 54 : ROW);
      const ys = []; let y = TOP + 26;
      items.forEach((it) => { ys.push(y); y += rowH(it); });
      const H = y + 20;
      const X = (i) => xs[i];
      const wrap = document.createElement('div'); wrap.className = 'seq-scroll';
      const svg = RAG.svg('svg', { viewBox: `0 0 ${W} ${H}`, width: W, class: 'seq-svg', role: 'img', 'aria-label': 'Sequence diagram: ' + actors.join(', ') });
      svg.style.minWidth = Math.round(W * 0.82) + 'px';   // shrink to fit, but never below ~82%: scroll instead
      wrap.appendChild(svg);
      const defs = RAG.svg('defs', {}, svg);
      const uid = 'sq' + Math.random().toString(36).slice(2, 8);
      [['h', 'var(--text-2)'], ['r', 'var(--red)'], ['a', 'var(--accent)']].forEach(([k, col]) => {
        const mk = RAG.svg('marker', { id: uid + k, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' }, defs);
        RAG.svg('path', { d: 'M0,0 L10,5 L0,10 z', fill: col }, mk);
      });
      actors.forEach((name, i) => {
        RAG.svg('line', { x1: X(i), y1: TOP, x2: X(i), y2: H - 10, class: 'seq-life' }, svg);
        const g = RAG.svg('g', { class: 'seq-actor' }, svg);
        const w = Math.max(70, name.length * 7.4 + 22);
        RAG.svg('rect', { x: X(i) - w / 2, y: 12, width: w, height: 34, rx: 9 }, g);
        RAG.svg('text', { x: X(i), y: 34, 'text-anchor': 'middle', text: name }, g);
      });
      const els = items.map((it, k) => {
        const g = RAG.svg('g', { class: 'seq-msg k-' + it.kind }, svg);
        const yy = ys[k];
        if (it.note) {
          const x1 = X(Math.min(it.a, it.b)) - 56, x2 = X(Math.max(it.a, it.b)) + 56;
          RAG.svg('rect', { x: x1, y: yy - 12, width: x2 - x1, height: 28, rx: 6, class: 'seq-note' }, g);
          RAG.svg('text', { x: (x1 + x2) / 2, y: yy + 6, 'text-anchor': 'middle', text: it.label }, g);
          return { g, path: null };
        }
        let d;
        if (it.a === it.b) d = `M${X(it.a)},${yy} h44 v22 h-40`;
        else d = `M${X(it.a) + (it.b > it.a ? 4 : -4)},${yy + 8} L${X(it.b) + (it.b > it.a ? -6 : 6)},${yy + 8}`;
        const mk = it.kind === 'fail' || it.kind === 'bad' ? 'r' : 'h';
        const p = RAG.svg('path', { d, class: 'seq-arrow', 'marker-end': it.kind === 'fail' ? '' : `url(#${uid}${mk})` }, g);
        if (it.kind === 'fail') {
          const ex = X(it.b) + (it.b > it.a ? -12 : 12);
          RAG.svg('path', { d: `M${ex - 6},${yy + 2} l12,12 M${ex + 6},${yy + 2} l-12,12`, class: 'seq-x' }, g);
        }
        const tx = it.a === it.b ? X(it.a) + 52 : (X(it.a) + X(it.b)) / 2;
        RAG.svg('text', { x: tx, y: it.a === it.b ? yy + 15 : yy, 'text-anchor': it.a === it.b ? 'start' : 'middle', text: it.label, class: 'seq-label' }, g);
        const nx = X(it.a) + (it.a === it.b || it.b > it.a ? -13 : 13), ny = it.a === it.b ? yy + 11 : yy + 8;
        RAG.svg('circle', { cx: nx, cy: ny, r: 8, class: 'seq-badge' }, g);
        RAG.svg('text', { x: nx, y: ny + 3.5, 'text-anchor': 'middle', text: String(k + 1), class: 'seq-num' }, g);
        return { g, path: p };
      });
      const bar = document.createElement('div'); bar.className = 'seq-bar';
      bar.innerHTML = `<div class="seq-detail"><b class="seq-step">▶ Press Play to animate the ${items.length} steps</b><span></span></div>
        <div class="seq-btns"><button class="btn sm" data-a="prev">←</button><button class="btn sm primary" data-a="play">▶ Play</button><button class="btn sm" data-a="next">→</button><button class="btn sm" data-a="all" title="Show every step">All</button></div>`;
      const cap = fig.querySelector('figcaption');
      fig.insertBefore(wrap, cap || null); fig.insertBefore(bar, cap || null);
      const stepEl = bar.querySelector('.seq-step'), detEl = bar.querySelector('.seq-detail span'), playBtn = bar.querySelector('[data-a=play]');
      let idx = -1, playing = false, tok = 0;
      function show(i, animate) {
        idx = RAG.clamp(i, -1, items.length - 1);
        const my = ++tok;
        els.forEach((e, j) => { e.g.classList.toggle('shown', j <= idx); e.g.classList.toggle('cur', j === idx); });
        fig.classList.toggle('seq-started', idx >= 0);
        if (idx < 0) { stepEl.textContent = `▶ Press Play to animate the ${items.length} steps`; detEl.innerHTML = ''; return; }
        const it = items[idx];
        stepEl.textContent = `${idx + 1}/${items.length} · ${it.note ? '' : actors[it.a] + (it.a === it.b ? '' : ' → ' + actors[it.b]) + ': '}${it.label}`;
        detEl.innerHTML = it.detail;
        const p = els[idx].path;
        svg.querySelectorAll('.packet').forEach((x) => x.remove());
        if (animate && p && my === tok) RAG.packetAlong(svg, p, { dur: 520, r: 5, color: it.kind === 'fail' || it.kind === 'bad' ? 'var(--red)' : 'var(--accent)' });
      }
      async function play() {
        if (playing) { playing = false; playBtn.textContent = '▶ Play'; return; }
        playing = true; playBtn.textContent = '⏸ Pause';
        if (idx >= items.length - 1) show(-1);
        while (playing && idx < items.length - 1) { show(idx + 1, true); await RAG.sleep(+fig.dataset.delay || 1500); }
        playing = false; playBtn.textContent = '↻ Replay';
      }
      bar.addEventListener('click', (e) => {
        const a = e.target.closest('[data-a]')?.dataset.a; if (!a) return;
        if (a !== 'play' && playing) { playing = false; playBtn.textContent = '▶ Play'; }
        if (a === 'play') play();
        if (a === 'next') show(idx + 1, true);
        if (a === 'prev') show(idx - 1);
        if (a === 'all') { show(items.length - 1); playBtn.textContent = '↻ Replay'; }
      });
      els.forEach((e, j) => e.g.addEventListener('click', () => { playing = false; playBtn.textContent = '▶ Play'; show(j, true); }));
      show(-1);
      let auto = false;
      RAG.whenVisible(fig, () => { if (!auto && !matchMedia('(prefers-reduced-motion: reduce)').matches) { auto = true; play(); } });
    });
  }

  function initFlow(root = document) {
    RAG.$$('figure.flow', root).forEach((fig) => {
      if (fig._init) return; fig._init = true;
      const lis = RAG.$$(':scope > ol > li', fig);
      lis.forEach((li, i) => {
        li.classList.add('k-' + (li.dataset.k || 'step'));
        li.insertAdjacentHTML('afterbegin', `<i class="fl-n">${i + 1}</i>`);
      });
      fig.classList.toggle('fl-row', lis.length <= 5);
      let i = -1, timer = null;
      const tick = () => {
        i = (i + 1) % (lis.length + 2);   // two beats of rest after the last step
        lis.forEach((li, j) => { li.classList.toggle('on', j === i); li.classList.toggle('done', j < i); });
      };
      lis.forEach((li, j) => li.addEventListener('mouseenter', () => { clearInterval(timer); timer = null; i = j - 1; tick(); }));
      fig.addEventListener('mouseleave', () => { if (!timer && fig._vis) timer = setInterval(tick, 1100); });
      RAG.whenVisible(fig, () => {
        fig._vis = true;
        if (!timer && !matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(tick, 1100);
      }, () => { fig._vis = false; clearInterval(timer); timer = null; });
    });
  }
  /* <<< shared visuals */

  RAG.initComponents = function (root) { initTabs(root); initSeg(root); initFlips(root); initSteppers(root); initSeq(root); initFlow(root); };

  /* ---------------- command palette (Ctrl+K) ---------------- */
  function initPalette() {
    let box, input, list, results = [], sel = 0, loading = false;

    function build() {
      box = document.createElement('div');
      box.className = 'palette';
      box.innerHTML = `<div class="pal-inner" role="dialog" aria-label="Search the course">
          <div class="pal-top"><span>🔎</span><input id="pal-input" placeholder="Search 46 chapters — principles, patterns, case studies…" autocomplete="off" spellcheck="false"><kbd class="kbd">Esc</kbd></div>
          <div class="pal-list" id="pal-list"></div>
          <div class="pal-foot"><span><kbd class="kbd">↑</kbd><kbd class="kbd">↓</kbd> navigate · <kbd class="kbd">↵</kbd> open</span><span>tip: try “Strategy”, “LRU”, “Liskov”, “thread-safe”</span></div>
        </div>`;
      document.body.appendChild(box);
      input = box.querySelector('#pal-input');
      list = box.querySelector('#pal-list');
      box.addEventListener('click', (e) => { if (e.target === box) close(); });
      input.addEventListener('input', () => { sel = 0; render(); });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { close(); }
        else if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(sel + 1, results.length - 1); render(true); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(sel - 1, 0); render(true); }
        else if (e.key === 'Enter') { e.preventDefault(); go(results[sel]); }
      });
    }

    function search(q) {
      const idx = window.RAG_INDEX || [];
      const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
      if (!terms.length) {
        return CHAPTERS.map((c) => ({ n: c.n, f: c.file, ti: c.title, lv: c.level, t: c.blurb, a: '', k: 'chapter', s: 0 })).slice(0, 12);
      }
      const out = [];
      idx.forEach((c) => {
        const push = (t, a, k, base) => {
          const hay = (t + ' ' + c.ti).toLowerCase();
          let score = 0;
          for (const term of terms) {
            const at = hay.indexOf(term);
            if (at < 0) return;                       // every term must appear
            score += at === 0 ? 12 : hay[at - 1] === ' ' ? 8 : 3;
          }
          if (t.toLowerCase().startsWith(terms[0])) score += 10;
          out.push({ n: c.n, f: c.f, ti: c.ti, lv: c.lv, t, a, k, s: score + base - t.length * 0.01 });
        };
        push(c.ti, '', 'chapter', 22);
        c.e.forEach((e) => push(e.t, e.a, e.k, e.k === 'section' ? 16 : e.k === 'demo' ? 12 : e.k === 'topic' ? 8 : 1));
      });
      const seen = new Set();
      return out.sort((a, b) => b.s - a.s).filter((r) => {
        const key = r.n + '|' + r.t;
        if (seen.has(key)) return false;
        seen.add(key); return true;
      }).slice(0, 30);
    }

    const ICON = { chapter: '📘', section: '§', demo: '🕹️', topic: '•', fact: '💡' };
    function render(keepQuery) {
      if (loading) { list.innerHTML = '<div class="pal-empty">Loading index…</div>'; return; }
      results = search(input.value.trim());
      if (!results.length) { list.innerHTML = '<div class="pal-empty">No matches. Try a broader word.</div>'; return; }
      list.innerHTML = results.map((r, i) => `<a class="pal-item ${i === sel ? 'sel' : ''}" href="${r.f}${r.a ? '#' + r.a : ''}" data-i="${i}">
          <span class="pal-ico">${ICON[r.k] || '•'}</span>
          <span class="pal-text"><b>${esc(r.t)}</b><small>${chName(r.n)} · ${esc(r.ti)}</small></span>
          <span class="pal-lv">${r.lv}</span></a>`).join('');
      RAG.$$('.pal-item', list).forEach((el) => {
        el.addEventListener('mouseenter', () => { sel = +el.dataset.i; RAG.$$('.pal-item', list).forEach((x) => x.classList.toggle('sel', x === el)); });
      });
      const cur = list.querySelector('.sel');
      if (cur && keepQuery) cur.scrollIntoView({ block: 'nearest' });
    }
    const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
    function go(r) { if (r) location.href = r.f + (r.a ? '#' + r.a : ''); }

    function open() {
      if (!box) build();
      box.classList.add('show');
      input.value = ''; sel = 0;
      if (!window.RAG_INDEX) {
        loading = true; render();
        const s = document.createElement('script');
        s.src = 'assets/study-data.js';
        s.onload = () => { loading = false; render(); };
        s.onerror = () => { loading = false; list.innerHTML = '<div class="pal-empty">Could not load the search index.</div>'; };
        document.head.appendChild(s);
      } else render();
      setTimeout(() => input.focus(), 30);
    }
    function close() { if (box) box.classList.remove('show'); }

    addEventListener('keydown', (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target.tagName || '')) || e.target.isContentEditable;
      if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) { e.preventDefault(); box && box.classList.contains('show') ? close() : open(); }
      else if (e.key === '/' && !typing && !(box && box.classList.contains('show'))) { e.preventDefault(); open(); }
      else if (e.key === 'Escape') close();
    });
    RAG.$$('.search-btn').forEach((b) => (b.onclick = open));
    RAG.openSearch = open;
  }

  /* ---------------- boot ---------------- */
  const { chap, main } = buildShell();
  if (main) {
    buildToc(chap, main);
    buildFooter(chap, main);
    const credit = document.createElement('p');
    credit.className = 'muted small';
    credit.style.cssText = 'text-align:center;margin:44px 0 0';
    credit.innerHTML = `◆ <a href="index.html">${AUTHOR}'s RAG Playlist</a> · © 2026 ${AUTHOR}`;
    main.appendChild(credit);
  }
  RAG.chapter = chap;
  RAG.initComponents(document);
  initQuizzes(chap);
  initReveal();
  initPalette();
})();

/* Optional accounts & progress sync (../assets/account.js). Only over http(s): the offline
   single-file edition runs from file:// and simply skips it. Dormant until configured. */
(function () {
  if (!/^https?:$/.test(location.protocol) || window.__atlasAccount) return;
  var s = document.createElement("script");
  s.type = "module"; s.src = "../assets/account.js";
  s.onerror = function () {};
  document.head.appendChild(s);
})();
