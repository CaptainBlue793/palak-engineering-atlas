/* =========================================================
   Palak Deb Patra's System Design Playlist — shared runtime
   Builds the shell (sidebar, topbar, footer nav) and wires up
   generic components: tabs, steppers, quizzes, flip cards, seg controls.
   Exposes helpers on window.SD for chapter-specific simulations.
   ========================================================= */
(function () {
  const CHAPTERS = [
    { n: 0.1, file: 'p1-how-computers-work.html', title: 'How Computers Work', level: 'Prerequisites', icon: '🖥️', mins: 40, blurb: 'CPU, RAM, disk and network: what each part does, how fast it is, and why RAM forgets while disk remembers.' },
    { n: 0.2, file: 'p2-processes-concurrency.html', title: 'Processes, Threads & Concurrency', level: 'Prerequisites', icon: '🧵', mins: 40, blurb: 'The operating system, processes vs threads, race conditions, locks and the event loop — how one server juggles thousands of requests.' },
    { n: 0.3, file: 'p3-clients-servers-web.html', title: 'Clients, Servers & the Web', level: 'Prerequisites', icon: '📨', mins: 35, blurb: 'Requests and responses, frontends and backends, what happens when you open a page, and why servers stay stateless.' },
    { n: 0.4, file: 'p4-networking-basics.html', title: 'Networking Basics', level: 'Prerequisites', icon: '📡', mins: 45, blurb: 'IP addresses, ports, DNS, packets, TCP vs UDP, TLS, and the difference between latency and bandwidth.' },
    { n: 0.5, file: 'p5-http-rest-json.html', title: 'HTTP, REST & JSON', level: 'Prerequisites', icon: '🧾', mins: 45, blurb: 'Read any HTTP exchange: methods, paths, headers, status codes, cookies, REST-style URLs and the JSON format.' },
    { n: 0.6, file: 'p6-databases-sql.html', title: 'Databases & SQL Basics', level: 'Prerequisites', icon: '🗃️', mins: 50, blurb: 'Tables, keys and SQL queries, joins, indexes and transactions — and what a database gives you that plain files do not.' },
    { n: 0.7, file: 'p7-big-o-data-structures.html', title: 'Big-O & Everyday Data Structures', level: 'Prerequisites', icon: '🗂️', mins: 40, blurb: 'How cost grows with size, and the hash tables, sorted trees, queues and logs that every system is built from.' },
    { n: 0.8, file: 'p8-estimation-design-questions.html', title: 'Estimation & Reading a Design Question', level: 'Prerequisites', icon: '🧮', mins: 45, blurb: 'Bits vs bytes, powers of ten, QPS and storage math, latency numbers, and turning a vague prompt into requirements.' },

    { n: 1,  file: '01-foundations.html',          title: 'Foundations of System Design', level: 'Beginner',     icon: '🧭', mins: 25, blurb: 'Client–server, requests, requirements and the qualities every system is judged by.' },
    { n: 2,  file: '02-networking.html',           title: 'Networking Essentials',        level: 'Beginner',     icon: '🌐', mins: 35, blurb: 'IP, DNS, TCP vs UDP, HTTP and TLS — how bytes actually travel.' },
    { n: 3,  file: '03-apis.html',                 title: 'APIs & Communication',         level: 'Beginner',     icon: '🔌', mins: 40, blurb: 'REST, GraphQL, gRPC, WebSockets, pagination, idempotency, versioning and webhooks.' },
    { n: 4,  file: '04-scalability.html',          title: 'Scalability & Performance',    level: 'Beginner',     icon: '📈', mins: 40, blurb: 'Vertical vs horizontal, latency numbers, percentiles, queueing theory and estimation.' },
    { n: 5,  file: '05-load-balancing.html',       title: 'Load Balancing',               level: 'Intermediate', icon: '⚖️', mins: 30, blurb: 'L4 vs L7, algorithms, health checks, sticky sessions — with a live simulator.' },
    { n: 6,  file: '06-caching.html',              title: 'Caching & CDNs',               level: 'Intermediate', icon: '⚡', mins: 40, blurb: 'Cache patterns, eviction policies, invalidation, stampedes and CDNs.' },
    { n: 7,  file: '07-databases.html',            title: 'Databases Deep Dive',          level: 'Intermediate', icon: '🗄️', mins: 50, blurb: 'SQL vs NoSQL, indexes, ACID, isolation, query plans, pooling and locks.' },
    { n: 8,  file: '08-replication-sharding.html', title: 'Replication & Sharding',       level: 'Intermediate', icon: '🧩', mins: 50, blurb: 'Leaders & followers, quorums, partitioning, consistent hashing and live resharding.' },
    { n: 9,  file: '09-object-storage.html',       title: 'Object Storage & Media',       level: 'Intermediate', icon: '🪣', mins: 35, blurb: 'Blob vs block vs file, presigned & multipart uploads, erasure coding, storage tiers.' },
    { n: 10, file: '10-search-indexing.html',      title: 'Search & Specialized Indexes', level: 'Intermediate', icon: '🔎', mins: 40, blurb: 'Inverted indexes, BM25 ranking, geospatial indexes, time-series and vector search.' },
    { n: 11, file: '11-security.html',             title: 'Security, AuthN & AuthZ',      level: 'Intermediate', icon: '🔐', mins: 45, blurb: 'Password hashing, sessions vs JWT, OAuth 2.0 & OIDC, RBAC, encryption and DDoS.' },
    { n: 12, file: '12-graph-social.html',         title: 'Graph & Social Data',          level: 'Intermediate', icon: '🕸️', mins: 40, blurb: 'Modelling relationships, adjacency vs graph databases, traversals, and the social graph at scale.' },
    { n: 13, file: '13-distributed-theory.html',   title: 'Distributed Systems Theory',   level: 'Advanced',     icon: '🧠', mins: 45, blurb: 'CAP, PACELC, consistency models, clocks and Raft consensus.' },
    { n: 14, file: '14-message-queues.html',       title: 'Message Queues & Events',      level: 'Advanced',     icon: '📬', mins: 45, blurb: 'Queues vs pub/sub vs logs, Kafka internals, delivery guarantees, backpressure.' },
    { n: 15, file: '15-microservices.html',        title: 'Microservices & Rate Limiting', level: 'Advanced',    icon: '🧱', mins: 45, blurb: 'Service boundaries, API gateways, discovery, sagas, rate-limit algorithms.' },
    { n: 16, file: '16-reliability.html',          title: 'Reliability & Observability',  level: 'Advanced',     icon: '🛡️', mins: 45, blurb: 'Nines, circuit breakers, retries, logs/metrics/traces, SLOs and incident response.' },
    { n: 17, file: '17-data-patterns.html',        title: 'IDs, Outbox, CDC & Locks',     level: 'Advanced',     icon: '🧬', mins: 45, blurb: 'Snowflake IDs, the dual-write problem, outbox, CDC, event sourcing, CQRS and fencing tokens.' },
    { n: 18, file: '18-stream-batch.html',         title: 'Batch & Stream Processing',    level: 'Advanced',     icon: '🌊', mins: 45, blurb: 'MapReduce, OLTP vs OLAP, columnar storage, windows, watermarks, lambda vs kappa.' },
    { n: 19, file: '19-testing-distributed.html',  title: 'Testing Distributed Systems',  level: 'Advanced',     icon: '🧪', mins: 40, blurb: 'The test pyramid for services, contract tests, fault injection, property & deterministic simulation testing.' },
    { n: 20, file: '20-probabilistic.html',        title: 'Probabilistic Structures & Gossip', level: 'Expert', icon: '🎲', mins: 40, blurb: 'Bloom filters, HyperLogLog, count-min sketch, Merkle trees, gossip and failure detection.' },
    { n: 21, file: '21-infrastructure.html',       title: 'Containers, Kubernetes & Delivery', level: 'Expert', icon: '🚢', mins: 45, blurb: 'Containers, orchestration, autoscaling, CI/CD, canary & blue-green, IaC and serverless.' },
    { n: 22, file: '22-multi-region.html',         title: 'Multi-Region & Disaster Recovery', level: 'Expert',  icon: '🌍', mins: 45, blurb: 'RPO/RTO, backups, active-active, geo-routing, CRDTs, cells and chaos engineering.' },
    { n: 23, file: '23-ml-platforms.html',         title: 'ML Platforms & Feature Stores', level: 'Expert',      icon: '🤖', mins: 45, blurb: 'Training pipelines, feature stores, training/serving skew, model serving, drift and A/B evaluation.' },
    { n: 24, file: '24-cost-engineering.html',     title: 'Cost & Capacity Engineering',  level: 'Expert',       icon: '💰', mins: 40, blurb: 'Unit economics, where cloud money goes, load testing, capacity models and cutting bills without breaking SLOs.' },
    { n: 25, file: '25-interview-playbook.html',   title: 'The System Design Playbook',   level: 'Expert',       icon: '🎯', mins: 40, blurb: 'A repeatable interview method, estimation cheat sheet, trade-off vocabulary and rubrics.' },
    { n: 26, file: '26-case-url-shortener.html',   title: 'Case Study: URL Shortener',    level: 'Case Studies', icon: '🔗', mins: 40, blurb: 'End-to-end design: estimates, IDs, data model, read path at scale.' },
    { n: 27, file: '27-case-news-feed.html',       title: 'Case Study: News Feed',        level: 'Case Studies', icon: '📰', mins: 40, blurb: 'Fan-out on write vs read, the celebrity problem, ranking and caching.' },
    { n: 28, file: '28-case-chat-system.html',     title: 'Case Study: Chat System',      level: 'Case Studies', icon: '💬', mins: 45, blurb: 'Persistent connections, message ordering, delivery receipts and presence.' },
    { n: 29, file: '29-case-notifications.html',   title: 'Case Study: Notification System', level: 'Case Studies', icon: '🔔', mins: 40, blurb: 'Push, SMS & email at scale: priorities, preferences, dedupe, retries and providers.' },
    { n: 30, file: '30-case-web-crawler.html',     title: 'Case Study: Web Crawler',      level: 'Case Studies', icon: '🕷️', mins: 40, blurb: 'URL frontier, politeness, dedupe with Bloom filters, and crawling a billion pages.' },
    { n: 31, file: '31-case-typeahead.html',       title: 'Case Study: Search Autocomplete', level: 'Case Studies', icon: '⌨️', mins: 35, blurb: 'Tries with cached top-K, sampling query logs, sub-100ms suggestions worldwide.' },
    { n: 32, file: '32-case-video-streaming.html', title: 'Case Study: Video Streaming',  level: 'Case Studies', icon: '🎬', mins: 45, blurb: 'Upload pipelines, transcoding DAGs, adaptive bitrate (HLS/DASH) and CDN delivery.' },
    { n: 33, file: '33-case-file-sync.html',       title: 'Case Study: Cloud File Sync',  level: 'Case Studies', icon: '📁', mins: 45, blurb: 'Chunking, content-addressed dedupe, delta sync, conflicts and change notifications.' },
    { n: 34, file: '34-case-collab-editing.html',  title: 'Case Study: Collaborative Editing', level: 'Case Studies', icon: '📝', mins: 45, blurb: 'Google-Docs-style multiplayer: OT vs CRDTs, presence, cursors, offline and history.' },
    { n: 35, file: '35-case-ride-hailing.html',    title: 'Case Study: Ride Hailing',     level: 'Case Studies', icon: '🚕', mins: 45, blurb: 'Live location ingestion, geospatial matching, dispatch, surge and trip state machines.' },
    { n: 36, file: '36-case-ticketing.html',       title: 'Case Study: Ticket Booking',   level: 'Case Studies', icon: '🎟️', mins: 45, blurb: 'Seat inventory without double-booking: holds, waiting rooms, flash-sale load and fairness.' },
    { n: 37, file: '37-case-payments.html',        title: 'Case Study: Payment System',   level: 'Case Studies', icon: '💳', mins: 45, blurb: 'Idempotent charges, double-entry ledgers, PSP webhooks, reconciliation and exactly-once money.' },
    { n: 38, file: '38-case-job-scheduler.html',   title: 'Case Study: Job Scheduler',    level: 'Case Studies', icon: '⏰', mins: 45, blurb: 'Cron at scale: time wheels, leases, exactly-once triggering, retries and long-running workflows.' },
    { n: 39, file: '39-case-kv-store.html',        title: 'Case Study: Distributed Key-Value Store', level: 'Case Studies', icon: '🗝️', mins: 50, blurb: 'Dynamo-style: partitioning, quorums, vector clocks, hinted handoff and anti-entropy.' },
    { n: 40, file: '40-case-ad-click-aggregator.html', title: 'Case Study: Ad Click Aggregator', level: 'Case Studies', icon: '📊', mins: 40, blurb: 'Streaming aggregation of billions of events with exactly-once counts and reconciliation.' },
    { n: 41, file: '41-case-metrics-platform.html', title: 'Case Study: Metrics & Monitoring', level: 'Case Studies', icon: '🔭', mins: 45, blurb: 'Ingesting billions of samples: time-series storage, cardinality, rollups, alerting and self-monitoring.' },
    { n: 42, file: '42-case-llm-platform.html',    title: 'Case Study: LLM Chat Platform', level: 'Case Studies', icon: '🧠', mins: 50, blurb: 'GPU serving, continuous batching, KV cache, token streaming, RAG and cost control.' },
  ];

  const LEVELS = [
    ['Prerequisites', 'var(--green)', 'Computers, networks, HTTP, databases and estimation — everything the course assumes, taught from zero.'],
    ['Beginner', 'var(--accent)', 'The vocabulary and building blocks of every system.'],
    ['Intermediate', 'color-mix(in srgb, var(--accent-2) 25%, var(--accent))', 'The core components you will combine in every design.'],
    ['Advanced', 'color-mix(in srgb, var(--accent-2) 50%, var(--accent))', 'Distributed systems: where things get genuinely hard.'],
    ['Expert', 'color-mix(in srgb, var(--accent-2) 75%, var(--accent))', 'Production-grade techniques, global-scale operations and interview mastery.'],
    ['Case Studies', 'var(--accent-2)', 'Put it all together on real-world design problems.'],
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
  // Chapter numbering has changed twice as the course grew; migrate saved progress in order.
  (function migrate() {
    const MAPS = {
      2: { 9: 12, 10: 13, 11: 14, 12: 15, 13: 22, 14: 23, 15: 24 },
      3: { 12: 13, 13: 14, 14: 15, 15: 16, 16: 17, 17: 18, 18: 20, 19: 21, 20: 22, 21: 25,
           22: 26, 23: 27, 24: 28, 25: 29, 26: 30, 27: 31, 28: 32, 29: 33, 30: 35, 31: 37,
           32: 39, 33: 40, 34: 42 },
    };
    const TARGET = 3;
    let ver = LS.get('sd-ver', 1);
    if (ver >= TARGET) return;
    while (ver < TARGET) {
      const M = MAPS[++ver];
      LS.set('sd-done', LS.get('sd-done', []).map((n) => M[n] || n));
      const q = LS.get('sd-quiz', {}), q2 = {};
      for (const k in q) q2[M[k] || k] = q[k];
      LS.set('sd-quiz', q2);
    }
    LS.set('sd-ver', TARGET);
  })();
  // The old single "Chapter 0" became the Prerequisites level: finishing it counts as finishing all of them.
  (function migratePrereqs() {
    const d = LS.get('sd-done', []);
    if (!Array.isArray(d) || !d.includes(0)) return;
    const pre = CHAPTERS.filter((c) => isPre(c.n)).map((c) => c.n);
    LS.set('sd-done', [...new Set(d.filter((n) => n !== 0).concat(pre))]);
    const q = LS.get('sd-quiz', {}); delete q[0]; LS.set('sd-quiz', q);
  })();
  const doneSet = () => new Set(LS.get('sd-done', []));

  /* ---------------- helpers ---------------- */
  const SVGNS = 'http://www.w3.org/2000/svg';
  const SD = {
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
      const g = SD.svg('g', { class: 'packet', style: `color:${color}` }, svg);
      const c = SD.svg('circle', { r: o.r || 6, fill: color }, g);
      let t2;
      if (o.label) t2 = SD.svg('text', { 'font-size': 10, 'text-anchor': 'middle', fill: color, 'font-weight': 700, text: o.label, style: 'font-family:var(--mono)' }, g);
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
      const p = SD.center(svg, a), q = SD.center(svg, b);
      return SD.packet(svg, p.x, p.y, q.x, q.y, o);
    },
    /** animate along an existing <path> */
    packetAlong(svg, path, o = {}) {
      const len = path.getTotalLength();
      const dur = o.dur || 900;
      const g = SD.svg('g', { class: 'packet', style: `color:${o.color || 'var(--accent)'}` }, svg);
      const c = SD.svg('circle', { r: o.r || 6, fill: o.color || 'var(--accent)' }, g);
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
      let t = document.getElementById('sd-toast');
      if (!t) {
        t = document.createElement('div'); t.id = 'sd-toast';
        t.style.cssText = 'position:fixed;left:50%;bottom:26px;transform:translateX(-50%) translateY(20px);background:var(--text);color:var(--bg);padding:10px 18px;border-radius:12px;font-weight:600;font-size:14px;z-index:200;opacity:0;transition:.3s;pointer-events:none;box-shadow:var(--shadow-lg)';
        document.body.appendChild(t);
      }
      t.textContent = msg;
      requestAnimationFrame(() => { t.style.opacity = 1; t.style.transform = 'translateX(-50%)'; });
      clearTimeout(t._h);
      t._h = setTimeout(() => { t.style.opacity = 0; t.style.transform = 'translateX(-50%) translateY(20px)'; }, 2200);
    },
  };
  window.SD = SD;

  /* ---------------- theme ---------------- */
  function currentTheme() {
    const t = document.documentElement.getAttribute('data-theme');
    if (t) return t;
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function toggleTheme() {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    LS.set('sd-theme', next);
    SD.$$('.theme-btn').forEach((b) => (b.textContent = next === 'dark' ? '☀️' : '🌙'));
  }

  /* ---------------- shell ---------------- */
  const AUTHOR = 'Palak Deb Patra';

  function buildShell() {
    const body = document.body;
    if (!/Palak/.test(document.title)) document.title += ` · System Design by ${AUTHOR}`;
    const chapNum = body.dataset.chapter == null ? -1 : +body.dataset.chapter;   // -1 = not a chapter page (prerequisites are 0.1…0.8)
    const chap = CHAPTERS.find((c) => c.n === chapNum);
    const main = SD.$('main.content');
    if (!main) return { chap };

    const progress = document.createElement('div');
    progress.className = 'read-progress';

    const layout = document.createElement('div'); layout.className = 'layout';
    const sidebar = document.createElement('aside'); sidebar.className = 'sidebar';
    const scrim = document.createElement('div'); scrim.className = 'scrim';
    const mainWrap = document.createElement('div'); mainWrap.className = 'main';

    // sidebar
    const done = doneSet();
    let html = `<a class="brand" href="index.html"><span class="brand-logo"><svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="4.5" rx="1.5"/><path d="M12 7.5v3M4.5 10.5h15M6.75 10.5v3.5M17.25 10.5v3.5"/><rect x="2.75" y="14" width="8" height="5.5" rx="1.6"/><rect x="13.25" y="14" width="8" height="5.5" rx="1.6"/></svg></span><span><span class="brand-author">Palak Deb Patra</span><span class="grad brand-course">System Design Playlist</span></span></a>
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
    SD.$$('.nav-link.study', sidebar).forEach((a) => { if (a.getAttribute('href') === here) a.classList.add('current'); });

    // topbar
    const top = document.createElement('header'); top.className = 'topbar';
    const theme = currentTheme();
    top.innerHTML = `<button class="icon-btn menu-btn" aria-label="Menu">☰</button>
      <div class="crumb"><a href="../index.html">Atlas</a> / ${chap ? `<a href="index.html">Course</a> / ${chName(chap)} · <b>${chap.title}</b>` : '<b>System Design</b>'}</div>
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
    const h2s = SD.$$('h2', main);
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
        a.addEventListener('click', () => { SD.$('.sidebar').classList.remove('open'); SD.$('.scrim').classList.remove('show'); });
      }
    });
    if (!toc || !h2s.length) return;
    const links = SD.$$('a', toc);
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
        if (isDone()) s.delete(chap.n); else { s.add(chap.n); SD.toast('Nice work! Progress saved.'); }
        LS.set('sd-done', [...s]);
        render();
        const side = SD.$('.sidebar .nav-link.current .num');
        if (side) { side.textContent = isDone() ? '✓' : chNum(chap); side.parentElement.classList.toggle('done', isDone()); }
        const bar = SD.$('.side-progress');
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
    SD.$$('.tabs', root).forEach((tabs) => {
      if (tabs._init) return; tabs._init = true;
      const btns = SD.$$(':scope > .tab-list > button', tabs);
      const panels = SD.$$(':scope > .tab-panel', tabs);
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
    SD.$$('.seg', root).forEach((seg) => {
      if (seg._init) return; seg._init = true;
      const btns = SD.$$('button', seg);
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
    SD.$$('.flip', root).forEach((f) => {
      if (f._init) return; f._init = true;
      f.setAttribute('tabindex', '0');
      const t = () => f.classList.toggle('flipped');
      f.addEventListener('click', t);
      f.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t(); } });
    });
  }

  function initSteppers(root = document) {
    SD.$$('.stepper', root).forEach((st) => {
      if (st._init) return; st._init = true;
      const diagram = document.getElementById(st.dataset.diagram);
      const steps = SD.$$('ol.steps > li', st);
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
      const title = SD.$('.st-title', st), desc = SD.$('.st-desc', st), count = SD.$('.count', st);
      const dots = SD.$$('.stepper-dots i', st);
      const playBtn = SD.$('[data-a=play]', st);
      let idx = -1, playing = false, token = 0;

      const clear = () => { if (diagram) SD.$$('.on', diagram).forEach((e) => e.classList.remove('on')); };
      async function go(i) {
        idx = SD.clamp(i, -1, steps.length - 1);
        const my = ++token;
        clear();
        dots.forEach((d, j) => { d.classList.toggle('active', j === idx); d.classList.toggle('past', j < idx); });
        count.textContent = idx < 0 ? `${steps.length} steps` : `Step ${idx + 1} / ${steps.length}`;
        SD.$('[data-a=prev]', st).disabled = idx < 0;
        SD.$('[data-a=next]', st).disabled = idx >= steps.length - 1;
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
            if (ea && eb) await SD.packetBetween(diagram, ea, eb, { color: li.dataset.color, dur: 650 });
          }
        }
      }
      async function play() {
        if (playing) { playing = false; playBtn.textContent = '▶ Play'; return; }
        playing = true; playBtn.textContent = '⏸ Pause';
        if (idx >= steps.length - 1) idx = -1;
        while (playing && idx < steps.length - 1) {
          await go(idx + 1);
          await SD.sleep(+st.dataset.delay || 2300);
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
    const quizzes = SD.$$('.quiz');
    if (!quizzes.length) return;
    let answered = 0, correct = 0;
    const scoreEl = SD.$('.quiz-score');
    const update = () => {
      if (!scoreEl) return;
      scoreEl.innerHTML = `<span class="big">${correct}/${quizzes.length}</span><span>${answered < quizzes.length ? `Answered ${answered} of ${quizzes.length} — keep going!` : correct === quizzes.length ? 'Perfect score! You nailed this chapter. 🏆' : correct >= quizzes.length * .6 ? 'Solid! Review the ones you missed. 💪' : 'Worth a re-read of the sections above. 📚'}</span>`;
      if (answered === quizzes.length && chap) {
        const best = LS.get('sd-quiz', {});
        best[chap.n] = Math.max(best[chap.n] || 0, correct / quizzes.length);
        LS.set('sd-quiz', best);
      }
    };
    quizzes.forEach((q, qi) => {
      const qp = SD.$('.q', q);
      if (qp && !qp.querySelector('.qn')) qp.insertAdjacentHTML('afterbegin', `<span class="qn">Q${qi + 1}</span>`);
      const opts = SD.$$('.opt', q);
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
    const els = SD.$$('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { threshold: 0.12 });
    els.forEach((e) => io.observe(e));
  }

  /** Run a callback only while an element is on screen (saves CPU for sims) */
  SD.whenVisible = function (el, onShow, onHide) {
    if (!('IntersectionObserver' in window)) { onShow(); return; }
    new IntersectionObserver((ents) => ents.forEach((en) => (en.isIntersecting ? onShow() : onHide && onHide())), { threshold: 0.05 }).observe(el);
  };

  SD.initComponents = function (root) { initTabs(root); initSeg(root); initFlips(root); initSteppers(root); };

  /* ---------------- command palette (Ctrl+K) ---------------- */
  function initPalette() {
    let box, input, list, results = [], sel = 0, loading = false;

    function build() {
      box = document.createElement('div');
      box.className = 'palette';
      box.innerHTML = `<div class="pal-inner" role="dialog" aria-label="Search the course">
          <div class="pal-top"><span>🔎</span><input id="pal-input" placeholder="Search 42 chapters — topics, demos, concepts…" autocomplete="off" spellcheck="false"><kbd class="kbd">Esc</kbd></div>
          <div class="pal-list" id="pal-list"></div>
          <div class="pal-foot"><span><kbd class="kbd">↑</kbd><kbd class="kbd">↓</kbd> navigate · <kbd class="kbd">↵</kbd> open</span><span>tip: try “quorum”, “cache stampede”, “watermark”</span></div>
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
      const idx = window.SD_INDEX || [];
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
      SD.$$('.pal-item', list).forEach((el) => {
        el.addEventListener('mouseenter', () => { sel = +el.dataset.i; SD.$$('.pal-item', list).forEach((x) => x.classList.toggle('sel', x === el)); });
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
      if (!window.SD_INDEX) {
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
    SD.$$('.search-btn').forEach((b) => (b.onclick = open));
    SD.openSearch = open;
  }

  /* ---------------- boot ---------------- */
  const { chap, main } = buildShell();
  if (main) {
    buildToc(chap, main);
    buildFooter(chap, main);
    const credit = document.createElement('p');
    credit.className = 'muted small';
    credit.style.cssText = 'text-align:center;margin:44px 0 0';
    credit.innerHTML = `◆ <a href="index.html">${AUTHOR}'s System Design Playlist</a> · © 2026 ${AUTHOR}`;
    main.appendChild(credit);
  }
  SD.chapter = chap;
  SD.initComponents(document);
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
