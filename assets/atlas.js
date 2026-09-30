/* =========================================================
   The Engineering Atlas — hub runtime
   Renders the course grid, the combined progress card, the
   learning paths, the study-tool grid and the cross-course
   search palette.

   ---------------------------------------------------------
   TO ADD A COURSE: add one object to COURSES below.
   Everything on the page (cards, progress, paths, tools,
   search, reset) is derived from this array.

     id        unique slug, used by FEATURED and PATHS
     title     course name as it should appear
     mark      inner SVG of the course's logo, drawn on a 24x24 viewBox
               (stroked paths; it inherits the course's two colours)
     tagline   one line under the title
     blurb     two-line description
     topics    a few chips
     chapters  chapter count (fallback until the index loads)
     hours     rough total reading time
     c1 / c2   the course's own two accent colours
     d1 / d2   the same two colours for dark mode
     short     short name for path chips ("LLD", "OS")
     lang      optional: the course's code language, shown on "Coming soon" cards
     soon      true while the course is being written: the card is muted and
               unlinked, and the course is left out of progress, search and tools
     store     localStorage prefix -> `<store>-done`, `<store>-theme`
     indexVar  global that assets/study-data.js defines (e.g. SD_INDEX)
     dir       the course's folder, next to this file (use a url-safe slug)
     first     filename of the first page to read (Prerequisite 1)
     dist      single-file offline build inside <dir>/dist/
     release   download URL, or null to link the in-repo dist/ file
     repo      GitHub URL, or null (omit inside the monorepo)
   ========================================================= */
(function () {
  'use strict';

  var COURSES = [
    {
      id: 'system-design',
      title: 'System Design',
      // A tier fanning out across two services — the shape of every design here.
      mark: '<rect x="3" y="3" width="18" height="4.5" rx="1.5"/>' +
            '<path d="M12 7.5v3M4.5 10.5h15M6.75 10.5v3.5M17.25 10.5v3.5"/>' +
            '<rect x="2.75" y="14" width="8" height="5.5" rx="1.6"/>' +
            '<rect x="13.25" y="14" width="8" height="5.5" rx="1.6"/>',
      tagline: 'From "what happens when I type a URL" to multi-region failover.',
      blurb: 'The vocabulary and the building blocks of every large system — then consensus, stream processing and global scale, finishing with 17 full case studies.',
      topics: ['Caching', 'Sharding', 'Queues', 'Consensus', 'Multi-region', '17 case studies'],
      chapters: 50,
      hours: 36,
      c1: '#2563eb',
      c2: '#0891b2',
      d1: '#60a5fa',
      d2: '#22d3ee',
      short: 'System Design',
      store: 'sd',
      indexVar: 'SD_INDEX',
      dir: 'system-design',
      first: 'p1-how-computers-work.html',
      dist: 'system-design-course.html',
      release: null,
    },
    {
      id: 'ml-ai-systems',
      title: 'ML & AI Systems',
      // A loss curve descending to its minimum — what "learning" actually is.
      mark: '<path d="M3.5 3v15.5h17"/>' +
            '<path d="M6.5 6.2c2.6.3 2.4 9.1 5.6 9.1 2.9 0 3-4.6 5.9-6.3"/>' +
            '<circle cx="12.1" cy="15.3" r="1.8" fill="currentColor" stroke="none"/>',
      tagline: 'How learning actually works, up to a 10,000-GPU training run.',
      blurb: 'Data, gradients and evaluation first; then transformers, RAG, agents, distributed training and serving — and what it takes to keep all of it alive in production.',
      topics: ['Transformers', 'RAG', 'Agents', 'Distributed training', 'Inference', '12 case studies'],
      chapters: 60,
      hours: 45,
      c1: '#0d9488',
      c2: '#8b5cf6',
      d1: '#2dd4bf',
      d2: '#a78bfa',
      short: 'ML & AI',
      store: 'ml',
      indexVar: 'ML_INDEX',
      dir: 'ml-ai-systems',
      first: 'p1-python-for-ml.html',
      dist: 'ml-ai-systems-course.html',
      release: null,
    },
    {
      id: 'dsa',
      title: 'DSA',
      // A binary tree — the structure half the course is built on.
      mark: '<circle cx="12" cy="4.3" r="2.1"/><circle cx="6.2" cy="11.7" r="2.1"/><circle cx="17.8" cy="11.7" r="2.1"/>' +
            '<circle cx="3.3" cy="19.5" r="1.6"/><circle cx="9.1" cy="19.5" r="1.6"/>' +
            '<path d="M10.7 5.9 7.5 10.1M13.3 5.9l3.2 4.2M5 13.4l-.9 4.5M7.4 13.4l.9 4.5"/>',
      tagline: 'From "what is this loop doing" to bitmask DP and suffix arrays.',
      blurb: 'Every data structure and algorithm you will be asked about, in one consistent C++ house style — with a visualiser, a practice set and an interview drill per chapter.',
      topics: ['Two pointers', 'Graphs', 'Segment trees', 'DP', 'Bitmask & math', 'C++ house style'],
      chapters: 64,
      hours: 48,
      c1: '#c026d3',
      c2: '#e11d48',
      d1: '#e879f9',
      d2: '#fb7185',
      short: 'DSA',
      store: 'dsa',
      indexVar: 'DSA_INDEX',
      dir: 'dsa',
      first: 'p1-setup-judges.html',
      dist: 'dsa-course.html',
      release: null,
    },
    {
      id: 'lld',
      title: 'Low-Level Design',
      // A UML class box composed with a second class — the unit every design here is drawn in.
      mark: '<rect x="3" y="2.5" width="12" height="11" rx="1.6"/><path d="M3 6.2h12M3 9.8h12"/>' +
            '<path d="M9 13.5l1.4 1.6L9 16.7l-1.4-1.6z" fill="currentColor"/><path d="M9 16.7v2.3h4"/>' +
            '<rect x="13" y="16" width="8" height="5.5" rx="1.5"/>',
      tagline: 'From "what is a class, really" to a thread-safe booking system.',
      blurb: 'Object-oriented design for the LLD round, in Java: SOLID, the design patterns that actually come up, concurrency and testing — then 16 case studies, each ending with the "now extend it" follow-up.',
      topics: ['SOLID', 'Design patterns', 'Concurrency', 'UML', 'Java', '16 case studies'],
      chapters: 54,
      hours: 39,
      c1: '#4f46e5',
      c2: '#7c3aed',
      d1: '#818cf8',
      d2: '#a78bfa',
      short: 'LLD',
      store: 'lld',
      indexVar: 'LLD_INDEX',
      dir: 'lld',
      first: 'p1-classes-objects.html',
      dist: 'lld-course.html',
      release: null,
    },
    {
      id: 'os',
      title: 'OS & Concurrency',
      short: 'OS',
      // A CPU die with its pins: the thing the operating system shares out.
      mark: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/>' +
            '<path d="M9 2.5v3.5M15 2.5v3.5M9 18v3.5M15 18v3.5M2.5 9h3.5M2.5 15h3.5M18 9h3.5M18 15h3.5"/>',
      tagline: 'From "what is a process" to a lock-free queue.',
      blurb: 'Processes, threads, scheduling, virtual memory and file systems in C, then the concurrency that trips everyone up: locks, deadlock, atomics and event loops.',
      topics: ['Processes', 'Virtual memory', 'Scheduling', 'Locks & deadlock', 'epoll', '8 case studies'],
      lang: 'C',
      chapters: 56,
      hours: 42,
      c1: '#dc2626', c2: '#d97706', d1: '#f87171', d2: '#fbbf24',
      store: 'os',
      indexVar: 'OS_INDEX',
      dir: 'os',
      first: 'p1-c-for-systems.html',
      dist: 'os-course.html',
      release: null,
      soon: true,
    },
    {
      id: 'networks',
      title: 'Computer Networks',
      short: 'Networks',
      // Three hosts and the links between them.
      mark: '<circle cx="12" cy="4.5" r="2.5"/><circle cx="4.5" cy="18" r="2.5"/><circle cx="19.5" cy="18" r="2.5"/>' +
            '<path d="M10.8 6.7L5.7 15.8M13.2 6.7l5.1 9.1M7 18h10"/>',
      tagline: 'From a single Ethernet frame to a packet crossing the internet.',
      blurb: 'The TCP/IP stack layer by layer: addressing, routing, TCP, DNS, TLS and HTTP/3, then CDNs, BGP, data-centre networks and debugging with a packet capture.',
      topics: ['TCP/IP', 'DNS', 'TLS', 'HTTP/2 & 3', 'BGP & CDNs', '8 case studies'],
      lang: 'Python + CLI',
      chapters: 56,
      hours: 40,
      c1: '#15803d', c2: '#0e7490', d1: '#4ade80', d2: '#22d3ee',
      store: 'net',
      indexVar: 'NET_INDEX',
      dir: 'networks',
      first: 'p1-bytes-and-encoding.html',
      dist: 'networks-course.html',
      release: null,
      soon: true,
    },
    {
      id: 'databases',
      title: 'Database Internals & SQL',
      short: 'Databases',
      // A stacked disk: rows at rest.
      mark: '<ellipse cx="12" cy="5" rx="8" ry="2.8"/><path d="M4 5v14c0 1.55 3.58 2.8 8 2.8s8-1.25 8-2.8V5"/>' +
            '<path d="M4 12c0 1.55 3.58 2.8 8 2.8s8-1.25 8-2.8"/>',
      tagline: 'From your first JOIN to how MVCC keeps readers and writers apart.',
      blurb: 'SQL you will actually write, then what happens underneath: pages, B-trees and LSM trees, query plans, WAL, isolation levels, replication and sharding.',
      topics: ['SQL', 'Indexes', 'Query plans', 'Transactions & MVCC', 'Replication', '8 case studies'],
      lang: 'SQL + Python',
      chapters: 56,
      hours: 42,
      c1: '#a16207', c2: '#4d7c0f', d1: '#facc15', d2: '#a3e635',
      store: 'db',
      indexVar: 'DB_INDEX',
      dir: 'databases',
      first: 'p1-tables-and-keys.html',
      dist: 'databases-course.html',
      release: null,
      soon: true,
    },
    {
      id: 'distributed-systems',
      title: 'Distributed Systems',
      short: 'Distributed',
      // Four replicas in a ring, agreeing on one value in the middle.
      mark: '<circle cx="12" cy="3.8" r="2.2"/><circle cx="20.2" cy="12" r="2.2"/><circle cx="12" cy="20.2" r="2.2"/><circle cx="3.8" cy="12" r="2.2"/>' +
            '<path d="M13.6 5.4l5 5M18.6 13.6l-5 5M10.4 18.6l-5-5M5.4 10.4l5-5"/>' +
            '<circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/>',
      tagline: 'From "why is this so hard" to Raft, CRDTs and Spanner.',
      blurb: 'Clocks, replication, consensus and consistency models in Java: Paxos and Raft, quorums, two-phase commit, CRDTs and Kafka, then how Spanner and Dynamo put it together.',
      topics: ['Raft & Paxos', 'Consistency', 'Clocks', 'CRDTs', 'Kafka', '8 case studies'],
      lang: 'Java',
      chapters: 56,
      hours: 44,
      c1: '#9333ea', c2: '#db2777', d1: '#c084fc', d2: '#f472b6',
      store: 'dist',
      indexVar: 'DIST_INDEX',
      dir: 'distributed-systems',
      first: 'p1-java-concurrency.html',
      dist: 'distributed-systems-course.html',
      release: null,
      soon: true,
    },
    {
      id: 'cloud-devops',
      title: 'Cloud & DevOps',
      short: 'Cloud & DevOps',
      // The build → deploy → operate loop.
      mark: '<path d="M12 12c-2-2.7-3.6-4.5-6-4.5a4.5 4.5 0 0 0 0 9c2.4 0 4-1.8 6-4.5zm0 0c2 2.7 3.6 4.5 6 4.5a4.5 4.5 0 0 0 0-9c-2.4 0-4 1.8-6 4.5z"/>',
      tagline: 'From a Dockerfile to a multi-region Kubernetes platform.',
      blurb: 'Containers, Kubernetes, CI/CD, Terraform and observability, then running it for real: SLOs, autoscaling, disaster recovery, cost and incident response.',
      topics: ['Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Observability', '8 case studies'],
      lang: 'Bash · Docker · K8s · Terraform',
      chapters: 56,
      hours: 40,
      c1: '#334155', c2: '#ea580c', d1: '#94a3b8', d2: '#fb923c',
      store: 'ops',
      indexVar: 'OPS_INDEX',
      dir: 'cloud-devops',
      first: 'p1-linux-command-line.html',
      dist: 'cloud-devops-course.html',
      release: null,
      soon: true,
    },
  ];

  /* Released courses drive progress, search and tools; "soon" courses only get a muted card. */
  var LIVE = COURSES.filter(function (c) { return !c.soon; });
  var SOON = COURSES.filter(function (c) { return c.soon; });

  /* The general order for the whole Atlas, shown as a featured strip. */
  var FEATURED = {
    icon: '🧭',
    title: 'The complete Atlas',
    blurb: 'Fundamentals first (algorithms, the machine, the network, storage), then design at class and system level, then scale and operations. ML comes last because it builds on all of it, but it also stands on its own.',
    steps: ['dsa', 'os', 'networks', 'databases', 'lld', 'system-design', 'distributed-systems', 'cloud-devops', 'ml-ai-systems'],
    optional: [],
  };

  /* Role paths: `steps` in order, then `optional` "go further" courses. */
  var PATHS = [
    { id: 'campus', icon: '🎓', title: 'Campus placements / SDE-1',
      blurb: 'The fresher loop: coding rounds, then the core-CS viva (OS, DBMS, networks), then a light class-design round.',
      steps: ['dsa', 'os', 'databases', 'networks', 'lld'], optional: [] },
    { id: 'interview', icon: '🎯', title: 'Cracking the SDE-2+ interview',
      blurb: 'Coding, then the class-level design round, then the architecture round. Distributed Systems for senior and staff loops.',
      steps: ['dsa', 'lld', 'system-design'], optional: ['distributed-systems'] },
    { id: 'backend', icon: '🛠️', title: 'Backend engineer',
      blurb: 'What your service sits on (the database, the network, the OS), then how to structure it and how to scale it.',
      steps: ['databases', 'networks', 'os', 'lld', 'system-design'], optional: ['distributed-systems'] },
    { id: 'sre', icon: '🚦', title: 'SRE / platform / DevOps',
      blurb: 'Linux and networking first, then containers, Kubernetes, CI/CD and observability, then designing for reliability.',
      steps: ['os', 'networks', 'cloud-devops', 'system-design'], optional: ['distributed-systems'] },
    { id: 'data', icon: '🗄️', title: 'Data engineer',
      blurb: 'Storage engines and SQL, then replication, partitioning and streams, then running pipelines in the cloud.',
      steps: ['databases', 'distributed-systems', 'cloud-devops', 'system-design'], optional: ['ml-ai-systems'] },
    { id: 'ml', icon: '🧠', title: 'ML / AI engineer',
      blurb: 'Models first, then the systems around them. Add Distributed Systems and DevOps for training clusters and serving.',
      steps: ['ml-ai-systems', 'system-design'], optional: ['distributed-systems', 'cloud-devops'] },
    { id: 'mlops', icon: '⚙️', title: 'ML infrastructure / MLOps',
      blurb: 'GPUs, memory and processes, then the ML stack, then the distributed training and deployment it runs on.',
      steps: ['os', 'ml-ai-systems', 'distributed-systems', 'cloud-devops'], optional: ['system-design'] },
    { id: 'fundamentals', icon: '🧱', title: 'CS fundamentals (self-taught / career switch)',
      blurb: 'The four subjects everything else assumes, in the order they build on each other.',
      steps: ['dsa', 'os', 'networks', 'databases'], optional: ['lld'] },
    { id: 'architect', icon: '🏛️', title: 'Senior / staff / architect',
      blurb: 'Trade-offs at scale: architecture, consensus and consistency, storage internals, and running it all in production.',
      steps: ['system-design', 'distributed-systems', 'databases', 'cloud-devops'], optional: ['lld'] },
  ];

  /* The three tools every course ships. */
  var TOOLS = [
    { icon: '📖', file: 'glossary.html', title: 'Glossaries', blurb: 'Every term a course uses, defined in one place and cross-linked back to the chapter that introduces it.' },
    { icon: '🃏', file: 'flashcards.html', title: 'Flashcard decks', blurb: 'A spaced-repetition deck generated from the quiz questions, so revision follows whatever you got wrong.' },
    { icon: '🎤', file: 'mock-interview.html', title: 'Mock-interview rooms', blurb: 'A timed room with a prompt, a scratchpad and the rubric an interviewer would actually score you against.' },
  ];

  var LS = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} },
  };

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); };

  /* Each course opens with a Prerequisites level stored as 0.1…0.8 and shown as P1…P8. */
  function isPre(n) { return n > 0 && n < 1; }
  function chShort(n) { return isPre(n) ? 'P' + Math.round(n * 10) : 'Ch ' + n; }
  function chLong(n) { return isPre(n) ? 'Prerequisite ' + Math.round(n * 10) : 'Chapter ' + n; }

  /* One repo, one site: every course is a folder next to this file. */
  function baseOf(c) { return c.dir + '/'; }
  function url(c, file) { return baseOf(c) + (file || ''); }

  function doneOf(c) {
    var raw = LS.get(c.store + '-done', []);
    var set = new Set();
    if (Array.isArray(raw)) raw.forEach(function (n) { if (typeof n === 'number') set.add(n); });
    return set;
  }
  function countOf(c) { return (c.data && c.data.length) || c.chapters; }
  function doneCount(c) {
    var d = doneOf(c), total = countOf(c), n = 0;
    d.forEach(function (x) {
      if (c.data ? !!chapterAt(c, x) : (x >= 1 && x <= total)) n++;
    });
    return n;
  }
  function preCount(c) { return c.data ? c.data.filter(function (ch) { return isPre(ch.n); }).length : 8; }
  function pct(a, b) { return b ? Math.round((a / b) * 100) : 0; }

  /* Both colour pairs as CSS variables; the page's CSS picks --k1/--k2 for the current theme. */
  function tintVars(c) {
    return '--c1:' + c.c1 + ';--c2:' + c.c2 + ';--d1:' + (c.d1 || c.c1) + ';--d2:' + (c.d2 || c.c2);
  }

  /* The course's own mark, stroked in its own two colours. */
  function markSvg(c, size) {
    return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="none" ' +
      'stroke="url(#mk-' + c.id + ')" style="color:var(--k1)" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="' + esc(c.title) + '">' +
      '<defs><linearGradient id="mk-' + c.id + '" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" style="stop-color:var(--k1)"/><stop offset="1" style="stop-color:var(--k2)"/>' +
      '</linearGradient></defs>' + c.mark + '</svg>';
  }


  /* ---------------------------------------------------------
     Course cards
     --------------------------------------------------------- */
  function courseCard(c, i) {
    var el = document.createElement('article');
    el.className = 'course tint reveal' + (c.soon ? ' soon' : '');
    el.setAttribute('style', tintVars(c));
    el.dataset.course = c.id;
    if (c.soon) {
      el.innerHTML =
        '<div class="c-no">' + String(i + 1).padStart(2, '0') + '</div>' +
        '<div class="c-head"><span class="ic">' + markSvg(c, 36) + '</span><h3><span class="nm">' + esc(c.title) + '</span></h3></div>' +
        '<div class="c-meta">~' + c.chapters + ' chapters · ~' + c.hours + ' h' + (c.lang ? ' · ' + esc(c.lang) : '') + '</div>' +
        '<p class="soon-blurb">' + esc(c.blurb) + '</p>' +
        '<div class="soon-foot"><span class="soon-badge">Coming soon</span>' +
        '<span class="soon-topics">' + c.topics.slice(0, 4).map(esc).join(' · ') + '</span></div>';
      return el;
    }
    el.innerHTML =
      '<div class="c-no">' + String(i + 1).padStart(2, '0') + '</div>' +
      '<div class="c-head">' +
        '<span class="ic">' + markSvg(c, 36) + '</span>' +
        '<h3><a href="' + url(c, 'index.html') + '">' + esc(c.title) + '</a></h3>' +
        '' +
      '</div>' +
      '<div class="c-meta" data-meta></div>' +
      '' +
      '<div class="pctline"><b data-pct>0%</b><span data-pcttxt></span></div>' +
      '<div class="meter" data-meter></div>' +
      '<div class="legend" data-legend></div>' +
      '<div class="c-next" data-next><span class="lbl">Next</span><span class="nm">…</span></div>' +
      '<div class="c-actions">' +
        '<a class="btn primary sm" data-start href="' + url(c, c.first) + '">Start with the prerequisites →</a>' +
        '<a class="btn sm" href="' + url(c, 'index.html') + '">All chapters</a>' +
        '<a class="btn sm" href="' + url(c, 'glossary.html') + '">Glossary</a>' +
      '</div>';
    return el;
  }

  /* Chapters grouped by level, in the order the course's own index lists them. */
  function levelGroups(c) {
    if (!c.data) return null;
    var order = [], by = {}, d = doneOf(c);
    c.data.forEach(function (ch) {
      var lv = ch.lv || 'Chapters';
      if (!by[lv]) { by[lv] = { name: lv, total: 0, done: 0 }; order.push(by[lv]); }
      by[lv].total++;
      if (d.has(ch.n)) by[lv].done++;
    });
    return order;
  }

  /* Each level sits somewhere on the course's own two-colour ramp. */
  function rampColor(c, i, n) {
    var t = n < 2 ? 0 : Math.round((i / (n - 1)) * 100);
    return 'color-mix(in srgb, var(--k2) ' + t + '%, var(--k1))';
  }

  function paintCard(c) {
    var el = c.el; if (!el || c.soon) return;
    var total = countOf(c), done = doneCount(c), p = pct(done, total);
    var groups = levelGroups(c);

    $('[data-pct]', el).textContent = p + '%';
    $('[data-pcttxt]', el).textContent = done + ' of ' + total + ' chapters read';
    var pre = preCount(c);
    $('[data-meta]', el).textContent = (pre ? pre + ' prerequisites + ' + (total - pre) + ' chapters' : total + ' chapters') + ' · ~' + c.hours + ' h' + (groups ? ' · ' + groups.length + ' levels' : '');

    if (groups) {
      $('[data-meter]', el).innerHTML = groups.map(function (g, i) {
        return '<span class="seg" style="flex:' + g.total + '" title="' + esc(g.name) + ' — ' + g.done + '/' + g.total + '">' +
          '<i style="width:' + pct(g.done, g.total) + '%;background:' + rampColor(c, i, groups.length) + '"></i></span>';
      }).join('');
      $('[data-legend]', el).innerHTML = groups.map(function (g, i) {
        return '<span><i style="background:' + rampColor(c, i, groups.length) + '"></i>' + esc(g.name) + ' ' + g.done + '/' + g.total + '</span>';
      }).join('');
    } else {
      $('[data-meter]', el).innerHTML = '<span class="seg" style="flex:1"><i style="width:' + p +
        '%;background:linear-gradient(90deg,var(--k1),var(--k2))"></i></span>';
    }

    var next = nextChapter(c), nextEl = $('[data-next]', el), startEl = $('[data-start]', el);
    if (!c.data) {
      nextEl.innerHTML = '<span class="lbl">Next</span><span class="nm">' + (done ? 'Chapter ' + (done + 1) : 'Prerequisite 1') + '</span>';
      startEl.textContent = done ? 'Continue →' : 'Start with the prerequisites →';
      startEl.href = url(c, done ? 'index.html' : c.first);
    } else if (next) {
      nextEl.innerHTML = '<span class="lbl">Next</span><span class="nm">' + chShort(next.n) + ' · ' + esc(next.ti) + '</span>';
      startEl.textContent = (done ? 'Continue' : 'Start') + ' → ' + chShort(next.n);
      startEl.href = url(c, next.f);
    } else {
      nextEl.innerHTML = '<span class="lbl">Done</span><span class="nm">All ' + total + ' chapters complete 🎉</span>';
      startEl.textContent = 'Revise →';
      startEl.href = url(c, 'flashcards.html');
    }
  }

  /* ---------------------------------------------------------
     The mosaic: one square per chapter, 150 in total.
     --------------------------------------------------------- */
  function chapterAt(c, n) {
    if (!c.data) return null;
    if (!c.byN) { c.byN = {}; c.data.forEach(function (ch) { c.byN[ch.n] = ch; }); }
    return c.byN[n] || null;
  }

  function renderMosaic() {
    $('#mosaic').innerHTML = LIVE.map(function (c) {
      var total = countOf(c), d = doneOf(c), next = nextChapter(c), sq = '';
      var chapters = c.data ? c.data.slice().sort(function (a, b) { return a.n - b.n; }) :
        Array.from({ length: total }, function (_, i) { return { n: i + 1 }; });
      chapters.forEach(function (ch) {
        var n = ch.n;
        var cls = d.has(n) ? ' done' : (next && next.n === n ? ' next' : '');
        sq += '<a class="' + cls.trim() + '" href="' + url(c, ch ? ch.f : 'index.html') + '" ' +
          'title="' + chShort(n) + (ch ? ' · ' + (ch.ti || ch.title || '').replace(/"/g, '') : '') + (d.has(n) ? ' ✓' : '') + '" ' +
          'aria-label="' + esc(c.title) + ' chapter ' + n + '"></a>';
      });
      return '<div class="mgroup tint" style="' + tintVars(c) + '">' +
        '<div class="gh"><a class="nm" href="' + url(c, 'index.html') + '">' + esc(c.title) + '</a>' +
        '<span class="rule"></span><span class="ct">' + doneCount(c) + '/' + total + '</span></div>' +
        '<div class="mosaic">' + sq + '</div></div>';
    }).join('');
  }

  function nextChapter(c) {
    if (!c.data) return null;
    var d = doneOf(c);
    var list = c.data.slice().sort(function (a, b) { return a.n - b.n; });
    for (var i = 0; i < list.length; i++) if (!d.has(list[i].n)) return list[i];
    return null;
  }

  /* ---------------------------------------------------------
     Combined progress
     --------------------------------------------------------- */
  function paintProgress() {
    var total = 0, done = 0;
    LIVE.forEach(function (c) { total += countOf(c); done += doneCount(c); });
    var p = pct(done, total);

    $('#ringFg').setAttribute('stroke-dashoffset', String(326.7 * (1 - p / 100)));
    $('#ringTxt').textContent = p + '%';
    $('#progTxt').textContent = done + ' of ' + total + ' chapters read';

    renderMosaic();

    // Resume = the started-but-unfinished course you are furthest into.
    var live = LIVE.filter(function (c) { return doneCount(c) > 0 && doneCount(c) < countOf(c); })
      .sort(function (a, b) { return doneCount(b) - doneCount(a); });
    var hint = $('#progHint');

    if (live.length) {
      var c = live[0], next = nextChapter(c);
      hint.innerHTML = next
        ? 'Next: <b>' + chShort(next.n) + ' · ' + esc(next.ti) + '</b>'
        : 'Pick up where you left off in <b>' + esc(c.title) + '</b>';
    } else if (done === total && total > 0) {
      hint.textContent = 'Nothing left to read.';
    } else {
      hint.innerHTML = '<span class="muted">Nothing read yet — every square below is a chapter.</span>';
    }

    var hours = LIVE.reduce(function (s, c) { return s + c.hours; }, 0);
    $('#stats').innerHTML = [
      [LIVE.length, 'courses'],
      [SOON.length, 'on the way'],
      [total, 'chapters'],
      [LIVE.reduce(function (s, c) { return s + preCount(c); }, 0), 'prerequisites'],
      ['~' + hours, 'hours'],
    ].map(function (s) { return '<div class="stat"><b>' + s[0] + '</b><span>' + s[1] + '</span></div>'; }).join('');

    renderPaths();
  }

  /* ---------------------------------------------------------
     Paths + tools
     --------------------------------------------------------- */
  function byId(id) { return COURSES.filter(function (c) { return c.id === id; })[0]; }

  function isComplete(c) { var t = countOf(c); return t > 0 && doneCount(c) >= t; }

  /* One course as a chip: a link when released, a faded span while it is being written. */
  function pathChip(id, optional) {
    var c = byId(id); if (!c) return '';
    var done = !c.soon && isComplete(c);
    var cls = 'pchip tint' + (optional ? ' opt' : '') + (c.soon ? ' soon' : '') + (done ? ' done' : '');
    var attrs = ' class="' + cls + '" data-course="' + c.id + '" style="' + tintVars(c) + '"';
    var label = esc(c.short || c.title) + (done ? ' ✓' : '');
    return c.soon
      ? '<span' + attrs + ' title="' + esc(c.title) + ' (coming soon)">' + label + '</span>'
      : '<a' + attrs + ' href="' + url(c, 'index.html') + '" title="' + esc(c.title) + '">' + label + '</a>';
  }
  function pathFlow(p) {
    var chips = p.steps.map(function (id) { return pathChip(id, false); })
      .concat(p.optional.map(function (id) { return pathChip(id, true); }));
    return '<div class="pflow">' + chips.join('<span class="arr" aria-hidden="true">→</span>') + '</div>';
  }
  /* "N of M courses complete" over the released required steps; unreleased ones are counted separately. */
  function pathProgress(p) {
    var req = p.steps.map(byId).filter(Boolean);
    var live = req.filter(function (c) { return !c.soon; });
    var soon = req.length - live.length;
    if (!live.length) return 'Coming soon';
    return live.filter(isComplete).length + ' of ' + live.length + ' courses complete' +
      (soon ? ' · ' + soon + ' coming soon' : '');
  }
  function renderPaths() {
    $('#pathFeatured').innerHTML =
      '<div class="pf-head"><span class="ico" aria-hidden="true">' + FEATURED.icon + '</span>' +
      '<div><h4>' + esc(FEATURED.title) + '</h4><p>' + esc(FEATURED.blurb) + '</p></div>' +
      '<span class="pprog">' + pathProgress(FEATURED) + '</span></div>' + pathFlow(FEATURED);
    $('#pathGrid').innerHTML = PATHS.map(function (p, pi) {
      return '<div class="path reveal in" data-path="' + p.id + '">' +
        '<div class="num">' + String(pi + 1).padStart(2, '0') + '</div>' +
        '<div class="ico" aria-hidden="true">' + p.icon + '</div>' +
        '<h4>' + esc(p.title) + '</h4><p>' + esc(p.blurb) + '</p>' +
        pathFlow(p) + '<div class="pprog">' + pathProgress(p) + '</div></div>';
    }).join('');
  }

  function renderStatic() {

    function tool(icon, title, blurb, links) {
      return '<div class="tool reveal"><div class="ico" aria-hidden="true">' + icon + '</div><div>' +
        '<h4>' + esc(title) + '</h4><p>' + esc(blurb) + '</p>' +
        '<div class="links">' + links + '</div></div></div>';
    }

    var tools = TOOLS.map(function (t) {
      return tool(t.icon, t.title, t.blurb, LIVE.map(function (c) {
        return '<a class="btn sm" href="' + url(c, t.file) + '">' + esc(c.title) + '</a>';
      }).join(''));
    }).join('');

    tools += tool('⬇️', 'Offline single file',
      'Each course also builds into one self-contained HTML file — every chapter, simulator and quiz inside it. Double-click and it runs with no internet at all.',
      LIVE.map(function (c) {
        return '<a class="btn sm" href="' + (c.release || url(c, 'dist/' + c.dist)) + '">' + esc(c.title) + '</a>';
      }).join(''));

    $('#toolGrid').innerHTML = tools;
  }

  /* ---------------------------------------------------------
     Lazy-load each course's generated search index
     (script tags, not fetch, so this also works from file://)
     --------------------------------------------------------- */
  var indexState = 'idle'; // idle | loading | ready
  var onIndexes = [];

  function loadIndexes(cb) {
    if (cb) onIndexes.push(cb);
    if (indexState === 'ready') return flushIndexes();
    if (indexState === 'loading') return;
    indexState = 'loading';
    var left = LIVE.length;
    LIVE.forEach(function (c) {
      var s = document.createElement('script');
      s.src = url(c, 'assets/study-data.js');
      s.async = true;
      s.onload = s.onerror = function () {
        c.data = window[c.indexVar] || null;
        if (c.data) { paintCard(c); }
        if (--left === 0) { indexState = 'ready'; paintProgress(); buildSearch(); flushIndexes(); }
      };
      document.head.appendChild(s);
    });
  }
  function flushIndexes() { var q = onIndexes; onIndexes = []; q.forEach(function (f) { f(); }); }

  /* ---------------------------------------------------------
     Cross-course search palette
     --------------------------------------------------------- */
  var ITEMS = [], filter = 'all', sel = 0, rows = [];

  function buildSearch() {
    ITEMS = [];
    LIVE.forEach(function (c) {
      if (!c.data) return;
      c.data.forEach(function (ch) {
        ITEMS.push({ c: c, f: ch.f, a: '', label: ch.ti, sub: chLong(ch.n) + ' · ' + (ch.lv || ''), kind: 'chapter', n: ch.n, boost: 14 });
        (ch.e || []).forEach(function (e) {
          ITEMS.push({ c: c, f: ch.f, a: e.a || '', label: e.t, sub: chShort(ch.n) + ' · ' + ch.ti, kind: e.k || 'section', n: ch.n, boost: e.k === 'section' ? 4 : 0 });
        });
      });
    });
    ITEMS.forEach(function (it) { it.hay = (it.label + ' ' + it.sub + ' ' + it.c.title).toLowerCase(); });
    if ($('#pal').classList.contains('open')) runSearch();
  }

  function renderFilters() {
    var chips = ['<span class="chip' + (filter === 'all' ? ' on' : '') + '" data-f="all" role="button" tabindex="0">All courses</span>'];
    LIVE.forEach(function (c) {
      chips.push('<span class="chip' + (filter === c.id ? ' on' : '') + '" data-f="' + c.id + '" role="button" tabindex="0">' +
        '<span class="dot" style="display:inline-block;width:7px;height:7px;border-radius:50%;background:' + c.c1 + '"></span>' + esc(c.title) + '</span>');
    });
    $('#palFilters').innerHTML = chips.join('');
  }

  function score(it, q, tokens) {
    if (tokens.length > 1) {
      for (var i = 0; i < tokens.length; i++) if (it.hay.indexOf(tokens[i]) < 0) return -1;
    }
    var i0 = it.hay.indexOf(q);
    if (tokens.length === 1 && i0 < 0) return -1;
    var lab = it.label.toLowerCase(), s = it.boost;
    if (lab.indexOf(q) === 0) s += 46;
    else if (new RegExp('\\b' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(lab)) s += 28;
    else if (lab.indexOf(q) > 0) s += 16;
    if (i0 >= 0) s += Math.max(0, 24 - i0 / 4);
    return s;
  }

  function mark(text, q) {
    var i = text.toLowerCase().indexOf(q);
    if (i < 0 || !q) return esc(text);
    return esc(text.slice(0, i)) + '<mark>' + esc(text.slice(i, i + q.length)) + '</mark>' + esc(text.slice(i + q.length));
  }

  function runSearch() {
    var q = $('#palInput').value.trim().toLowerCase();
    var pool = ITEMS.filter(function (it) { return filter === 'all' || it.c.id === filter; });
    var out;

    if (indexState !== 'ready') {
      $('#palList').innerHTML = '<div class="pal-empty">Indexing ' + LIVE.length + ' courses…</div>';
      $('#palCount').textContent = '';
      rows = [];
      return;
    }

    if (!q) {
      // Nothing typed: offer the next chapter of each course, then chapter 1s.
      out = [];
      LIVE.forEach(function (c) {
        if (filter !== 'all' && c.id !== filter) return;
        var n = nextChapter(c);
        if (n) out.push({ c: c, f: n.f, a: '', label: n.ti, sub: 'Continue · ' + chLong(n.n), kind: 'next' });
      });
      pool.forEach(function (it) { if (it.kind === 'chapter' && out.length < 26) out.push(it); });
    } else {
      var tokens = q.split(/\s+/);
      out = pool.map(function (it) { return { it: it, s: score(it, q, tokens) }; })
        .filter(function (r) { return r.s >= 0; })
        .sort(function (a, b) { return b.s - a.s; })
        .slice(0, 40)
        .map(function (r) { return r.it; });
    }

    rows = out;
    sel = 0;
    $('#palCount').textContent = q ? out.length + ' result' + (out.length === 1 ? '' : 's') : ITEMS.length + ' entries indexed';
    $('#palList').innerHTML = out.length ? out.map(function (it, i) {
      return '<a class="pal-item' + (i === 0 ? ' sel' : '') + '" href="' + url(it.c, it.f) + (it.a ? '#' + it.a : '') + '" data-i="' + i + '">' +
        '<span class="dot" style="background:' + it.c.c1 + '"></span>' +
        '<span class="txt"><span class="t">' + mark(it.label, q) + '</span>' +
        '<span class="s">' + esc(it.c.title) + ' · ' + esc(it.sub) + '</span></span>' +
        '<span class="k">' + esc(it.kind) + '</span></a>';
    }).join('') : '<div class="pal-empty">No match for “' + esc($('#palInput').value) + '”.</div>';
  }

  function moveSel(d) {
    var items = $('#palList').querySelectorAll('.pal-item');
    if (!items.length) return;
    items[sel] && items[sel].classList.remove('sel');
    sel = (sel + d + items.length) % items.length;
    items[sel].classList.add('sel');
    items[sel].scrollIntoView({ block: 'nearest' });
  }

  function openPal() {
    $('#pal').classList.add('open');
    $('#palInput').value = '';
    $('#palInput').focus();
    loadIndexes(runSearch);
    runSearch();
  }
  function closePal() { $('#pal').classList.remove('open'); }

  /* ---------------------------------------------------------
     Theme — mirrored into every course so it carries across
     --------------------------------------------------------- */
  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') ||
      (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }
  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    LS.set('atlas-theme', t);
    COURSES.forEach(function (c) { LS.set(c.store + '-theme', t); });
    $('#themeBtn').textContent = t === 'dark' ? '☀️' : '🌙';
  }

  /* ---------------------------------------------------------
     Boot
     --------------------------------------------------------- */
  var grid = $('#courseGrid');
  COURSES.forEach(function (c, i) { c.el = courseCard(c, i); grid.appendChild(c.el); });
  COURSES.forEach(paintCard);
  paintProgress();
  renderStatic();
  renderFilters();
  $('#themeBtn').textContent = currentTheme() === 'dark' ? '☀️' : '🌙';

  $('#themeBtn').addEventListener('click', function () { setTheme(currentTheme() === 'dark' ? 'light' : 'dark'); });

  document.querySelectorAll('[data-search]').forEach(function (b) { b.addEventListener('click', openPal); });

  $('#pal').addEventListener('click', function (e) { if (e.target === $('#pal')) closePal(); });
  $('#palInput').addEventListener('input', runSearch);
  $('#palFilters').addEventListener('click', function (e) {
    var chip = e.target.closest('[data-f]'); if (!chip) return;
    filter = chip.dataset.f; renderFilters(); runSearch(); $('#palInput').focus();
  });
  $('#palList').addEventListener('mousemove', function (e) {
    var row = e.target.closest('.pal-item'); if (!row) return;
    var items = $('#palList').querySelectorAll('.pal-item');
    items[sel] && items[sel].classList.remove('sel');
    sel = +row.dataset.i; row.classList.add('sel');
  });

  document.addEventListener('keydown', function (e) {
    var open = $('#pal').classList.contains('open');
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target.tagName || '')) || e.target.isContentEditable;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open ? closePal() : openPal(); return; }
    if (!open && e.key === '/' && !typing) { e.preventDefault(); openPal(); return; }
    if (!open) return;
    if (e.key === 'Escape') { e.preventDefault(); closePal(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); moveSel(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); moveSel(-1); }
    else if (e.key === 'Enter') {
      var items = $('#palList').querySelectorAll('.pal-item');
      if (items[sel]) { e.preventDefault(); location.href = items[sel].getAttribute('href'); }
    }
  });

  $('#resetBtn').addEventListener('click', function () {
    if (!confirm('Clear your saved progress for all ' + LIVE.length + ' courses? This cannot be undone.')) return;
    LIVE.forEach(function (c) { LS.del(c.store + '-done'); });
    COURSES.forEach(paintCard);
    paintProgress();
  });

  // Progress may change in another tab (a chapter ticked off in a course).
  window.addEventListener('storage', function (e) {
    if (!e.key || e.key.indexOf('-done') < 0) return;
    COURSES.forEach(paintCard);
    paintProgress();
  });
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState !== 'visible') return;
    COURSES.forEach(paintCard);
    paintProgress();
  });

  // Reveal-on-scroll
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.reveal:not(.in)').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  // Pull in the chapter indexes once the page is idle: they power the level
  // bars, the "next up" lines and the search palette.
  // The timeout makes sure a page that never goes idle still gets its indexes.
  var idle = window.requestIdleCallback
    ? function (f) { return window.requestIdleCallback(f, { timeout: 2000 }); }
    : function (f) { return setTimeout(f, 700); };
  window.addEventListener('load', function () { idle(function () { loadIndexes(); }); });
})();
