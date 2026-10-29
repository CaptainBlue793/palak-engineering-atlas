/* =========================================================
   The Engineering Atlas — hub runtime
   Renders the course grid, the combined progress card, the
   learning paths, the study-tool grid and the cross-course
   search palette.

   ---------------------------------------------------------
   TO ADD A COURSE: add one object to COURSES below.
   Everything on the page (cards, progress, paths, tools,
   search, reset) is derived from this array.

     id        unique slug, used by PATHS and METRO
     tab       which home-page tab the card sits in: an id from TABS below
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
     short     short name for path chips and metro stations ("LLD", "OS")
     lang      optional: the course's code language, shown on "Coming soon" cards
     soon      true while the course is planned or being written: the card is
               muted and unlinked, and the course is left out of progress, the
               tracker, search and tools. A "soon" course needs only id, tab,
               title, short, mark, blurb, topics, colours, store and dir; lang is
               optional, and chapters/hours are shown only once they are set.
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
      id: 'dsa',
      tab: 'cs',
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
      id: 'os',
      tab: 'cs',
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
      hours: 41,
      c1: '#dc2626', c2: '#d97706', d1: '#f87171', d2: '#fbbf24',
      store: 'os',
      indexVar: 'OS_INDEX',
      dir: 'os',
      first: 'p1-c-for-systems.html',
      dist: 'os-course.html',
      release: null,
    },
    {
      id: 'networks',
      tab: 'cs',
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
    },
    {
      id: 'databases',
      tab: 'cs',
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
      hours: 41,
      c1: '#a16207', c2: '#4d7c0f', d1: '#facc15', d2: '#a3e635',
      store: 'db',
      indexVar: 'DB_INDEX',
      dir: 'databases',
      first: 'p1-tables-and-keys.html',
      dist: 'databases-course.html',
      release: null,
    },
    {
      id: 'lld',
      tab: 'systems',
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
      id: 'backend-api',
      tab: 'systems',
      title: 'Backend & API',
      short: 'Backend & API',
      // A request arrow inside a pair of braces: the service and the contract it exposes.
      mark: '<path d="M8 3.5c-2 0-3 1-3 3v2.2c0 1.4-.9 2.6-2.5 3.3 1.6.7 2.5 1.9 2.5 3.3v2.2c0 2 1 3 3 3"/>' +
            '<path d="M16 3.5c2 0 3 1 3 3v2.2c0 1.4.9 2.6 2.5 3.3-1.6.7-2.5 1.9-2.5 3.3v2.2c0 2-1 3-3 3"/>' +
            '<path d="M9 12h6M12.6 9.6 15 12l-2.4 2.4"/>',
      blurb: 'Building the service itself: HTTP and API design, REST and gRPC, authentication, validation, pagination, idempotency, rate limiting and background jobs, then testing and shipping it.',
      topics: ['HTTP & REST', 'gRPC', 'Auth', 'Idempotency', 'Rate limiting', 'Background jobs'],
      lang: 'Python + FastAPI',
      c1: '#047857', c2: '#0369a1', d1: '#34d399', d2: '#38bdf8',
      chapters: 56,
      hours: 39,
      store: 'api',
      indexVar: 'API_INDEX',
      dir: 'backend-api',
      first: 'p1-python-for-backend.html',
      dist: 'backend-api-course.html',
      release: null,
    },
    {
      id: 'system-design',
      tab: 'systems',
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
      id: 'distributed-systems',
      tab: 'systems',
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
      hours: 41,
      c1: '#9333ea', c2: '#db2777', d1: '#c084fc', d2: '#f472b6',
      store: 'dist',
      indexVar: 'DIST_INDEX',
      dir: 'distributed-systems',
      first: 'p1-java-concurrency.html',
      dist: 'distributed-systems-course.html',
      release: null,
    },
    {
      id: 'cloud-devops',
      tab: 'systems',
      title: 'Cloud & DevOps',
      short: 'Cloud & DevOps',
      // The build → deploy → operate loop.
      mark: '<path d="M12 12c-2-2.7-3.6-4.5-6-4.5a4.5 4.5 0 0 0 0 9c2.4 0 4-1.8 6-4.5zm0 0c2 2.7 3.6 4.5 6 4.5a4.5 4.5 0 0 0 0-9c-2.4 0-4 1.8-6 4.5z"/>',
      tagline: 'From a Dockerfile to a multi-region Kubernetes platform.',
      blurb: 'Containers, Kubernetes, CI/CD, Terraform and observability, then running it for real: SLOs, autoscaling, disaster recovery, cost and incident response.',
      topics: ['Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Observability', '8 case studies'],
      lang: 'Bash · Docker · K8s · Terraform',
      chapters: 56,
      hours: 39,
      c1: '#334155', c2: '#ea580c', d1: '#94a3b8', d2: '#fb923c',
      store: 'ops',
      indexVar: 'OPS_INDEX',
      dir: 'cloud-devops',
      first: 'p1-linux-command-line.html',
      dist: 'cloud-devops-course.html',
      release: null,
    },
    {
      id: 'ml-fundamentals',
      tab: 'ml',
      title: 'ML Fundamentals',
      short: 'ML Fundamentals',
      // Points scattered around a fitted line.
      mark: '<path d="M3.5 3v17.5H21"/><path d="M6.5 17.5 19.5 6"/>' +
            '<circle cx="8.5" cy="12.5" r="1.4"/><circle cx="11.5" cy="16" r="1.4"/><circle cx="13.5" cy="9.5" r="1.4"/><circle cx="17.5" cy="11.5" r="1.4"/>',
      blurb: 'Machine learning before neural networks: regression, classification, trees and ensembles, clustering, feature engineering and honest evaluation, with the maths in the prerequisites.',
      topics: ['Regression', 'Trees & ensembles', 'Clustering', 'Evaluation'],
      lang: 'Python + scikit-learn',
      c1: '#0369a1', c2: '#0d9488', d1: '#38bdf8', d2: '#2dd4bf',
      chapters: 56,
      hours: 38,
      store: 'mlf',
      indexVar: 'MLF_INDEX',
      dir: 'ml-fundamentals',
      first: 'p1-python-for-data.html',
      dist: 'ml-fundamentals-course.html',
      release: null,
    },
    {
      id: 'deep-learning',
      tab: 'ml',
      title: 'Deep Learning',
      short: 'Deep Learning',
      // Three layers of a small network.
      mark: '<circle cx="4" cy="7" r="1.9"/><circle cx="4" cy="17" r="1.9"/>' +
            '<circle cx="12" cy="4" r="1.9"/><circle cx="12" cy="12" r="1.9"/><circle cx="12" cy="20" r="1.9"/><circle cx="20" cy="12" r="1.9"/>' +
            '<path d="M5.8 6.3l4.4-1.6M5.7 8.1l4.6 3M5.7 15.9l4.6-3M5.8 17.7l4.4 1.6M13.5 5.4l5 5.1M13.9 12h4.2M13.5 18.6l5-5.1"/>',
      blurb: 'Neural networks from the ground up: backpropagation, optimisers and initialisation, CNNs, sequence models and attention, ending with a transformer built from scratch.',
      topics: ['Backprop', 'Optimisers', 'CNNs', 'Transformers'],
      lang: 'Python + PyTorch',
      c1: '#7c3aed', c2: '#c026d3', d1: '#a78bfa', d2: '#e879f9',
      soon: true,
      store: 'dl',
      dir: 'deep-learning',
    },
    {
      id: 'computer-vision',
      tab: 'ml',
      title: 'Computer Vision',
      short: 'CV',
      // An eye inside a camera's focus brackets.
      mark: '<path d="M3 7V3h4M17 3h4v4M21 17v4h-4M7 21H3v-4"/>' +
            '<path d="M5.5 12s2.6-4.2 6.5-4.2 6.5 4.2 6.5 4.2-2.6 4.2-6.5 4.2S5.5 12 5.5 12z"/><circle cx="12" cy="12" r="2"/>',
      blurb: 'Teaching models to see: convolutions in depth, detection and segmentation, vision transformers, self-supervised learning and diffusion models.',
      topics: ['Detection', 'Segmentation', 'Vision transformers', 'Diffusion'],
      lang: 'Python + PyTorch',
      c1: '#ea580c', c2: '#db2777', d1: '#fb923c', d2: '#f472b6',
      chapters: 56,
      hours: 42,
      store: 'cv',
      indexVar: 'CV_INDEX',
      dir: 'computer-vision',
      first: 'p1-images-as-tensors.html',
      dist: 'computer-vision-course.html',
    },
    {
      id: 'nlp',
      tab: 'ml',
      title: 'NLP',
      short: 'NLP',
      // A speech bubble with two lines of text.
      mark: '<path d="M4 4.5h16A1.5 1.5 0 0 1 21.5 6v9.5A1.5 1.5 0 0 1 20 17h-9.5L6 20.5V17H4a1.5 1.5 0 0 1-1.5-1.5V6A1.5 1.5 0 0 1 4 4.5z"/>' +
            '<path d="M7 9.2h10M7 12.6h6"/>',
      blurb: 'Text as data, up to encoder models: tokenisation, embeddings, sequence-to-sequence models and attention, BERT, named-entity recognition, translation and retrieval.',
      topics: ['Tokenisation', 'Embeddings', 'BERT', 'Translation'],
      lang: 'Python + PyTorch',
      c1: '#4d7c0f', c2: '#0f766e', d1: '#a3e635', d2: '#2dd4bf',
      chapters: 56,
      hours: 41,
      store: 'nlp',
      indexVar: 'NLP_INDEX',
      dir: 'nlp',
      first: 'p1-text-unicode-and-normalisation.html',
      dist: 'nlp-course.html',
    },
    {
      id: 'llms',
      tab: 'ml',
      title: 'LLMs',
      short: 'LLMs',
      // Two tokens and the dashed slot for the next one the model predicts.
      mark: '<rect x="2" y="8.5" width="5.4" height="7" rx="1.4"/><rect x="9.3" y="8.5" width="5.4" height="7" rx="1.4"/>' +
            '<rect x="16.6" y="8.5" width="5.4" height="7" rx="1.4" stroke-dasharray="2.2 1.8"/><path d="M14.7 4.5h4.6v2.2"/>',
      blurb: 'How large language models are made: pretraining and scaling laws, fine-tuning and PEFT, alignment, decoding, quantisation and evaluation.',
      topics: ['Pretraining', 'Fine-tuning & PEFT', 'Alignment', 'Decoding'],
      lang: 'Python + PyTorch',
      c1: '#4338ca', c2: '#0891b2', d1: '#818cf8', d2: '#22d3ee',
      chapters: 56,
      hours: 42,
      store: 'llm',
      indexVar: 'LLM_INDEX',
      dir: 'llms',
      first: 'p1-pytorch-tensors.html',
      dist: 'llms-course.html',
    },
    {
      id: 'ml-ai-systems',
      tab: 'ml',
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
      id: 'rag',
      tab: 'agents',
      title: 'RAG',
      short: 'RAG',
      // A document and the lens that finds the right part of it.
      mark: '<path d="M13 2.5H6A1.5 1.5 0 0 0 4.5 4v16A1.5 1.5 0 0 0 6 21.5h5"/><path d="M13 2.5 18 7.5v2M13 2.5v5h5"/>' +
            '<path d="M7.5 10.5h5M7.5 13.5h3"/><circle cx="16.3" cy="15.8" r="3.2"/><path d="M18.6 18.1l2.9 2.9"/>',
      blurb: 'Grounding a model in your own data: chunking, embeddings and vector indexes, hybrid search, reranking, query rewriting and evaluating what comes back.',
      topics: ['Chunking', 'Vector indexes', 'Hybrid search', 'Reranking'],
      lang: 'Python',
      c1: '#b45309', c2: '#15803d', d1: '#fbbf24', d2: '#4ade80',
      chapters: 56,
      hours: 39,
      store: 'rag',
      indexVar: 'RAG_INDEX',
      dir: 'rag',
      first: 'p1-python-for-ai-engineering.html',
      dist: 'rag-course.html',
      release: null,
    },
    {
      id: 'single-agent',
      tab: 'agents',
      title: 'Single Agent',
      short: 'Single Agent',
      // One model at the centre of its think, act, observe loop.
      mark: '<circle cx="12" cy="12" r="2.8"/><path d="M12 3.5a8.5 8.5 0 1 1-8.1 5.9"/><path d="M3.4 4.4l.5 5 5-.5"/>',
      blurb: 'One model with tools: prompting and context engineering, tool calling, planning, memory, sandboxing, and evaluating an agent that acts on its own.',
      topics: ['Tool calling', 'Planning', 'Memory', 'Agent evals'],
      lang: 'Python',
      c1: '#be123c', c2: '#7c3aed', d1: '#fb7185', d2: '#a78bfa',
      chapters: 56,
      hours: 38,
      store: 'agent',
      indexVar: 'AGENT_INDEX',
      dir: 'single-agent',
      first: 'p1-python-for-agents.html',
      dist: 'single-agent-course.html',
      release: null,
    },
    {
      id: 'multi-agent',
      tab: 'agents',
      title: 'Multi-Agent Systems',
      short: 'Multi-Agent',
      // An orchestrator handing work to three agents.
      mark: '<rect x="8.5" y="2.5" width="7" height="5.5" rx="1.5"/>' +
            '<circle cx="4.5" cy="18.5" r="2.4"/><circle cx="12" cy="18.5" r="2.4"/><circle cx="19.5" cy="18.5" r="2.4"/>' +
            '<path d="M12 8v8.1M10 8 5.6 16.3M14 8l4.4 8.3"/>',
      blurb: 'Several agents working together: orchestration patterns, hand-offs, shared state, agent protocols, coordination failures, cost and evaluation.',
      topics: ['Orchestration', 'Hand-offs', 'Protocols', 'Failure modes'],
      lang: 'Python',
      c1: '#1d4ed8', c2: '#9333ea', d1: '#60a5fa', d2: '#c084fc',
      chapters: 30,
      hours: 20,
      store: 'mas',
      indexVar: 'MAS_INDEX',
      dir: 'multi-agent',
      first: 'p1-one-agent-recap.html',
      dist: 'multi-agent-course.html',
      release: null,
    },
  ];

  /* The home-page tabs, in order. Each course names its tab with `tab`; the cards in a tab
     keep the order of COURSES above. The last tab holds the learning paths, not courses. */
  var TABS = [
    { id: 'cs', title: 'CS Fundamentals',
      blurb: 'The four subjects everything else assumes: algorithms, the machine, the network and storage.' },
    { id: 'systems', title: 'Systems & Infra',
      blurb: 'Design at class and system level, the service itself, then consensus, scale and running it all in production.' },
    { id: 'ml', title: 'AI/ML',
      blurb: 'How models learn: ML fundamentals, then deep learning, then a specialisation (vision, language or LLMs), then the systems that train and serve them.' },
    { id: 'agents', title: 'Agents',
      blurb: 'Building on top of a model: retrieval first, then one agent with tools, then many agents working together.' },
    { id: 'paths', title: 'Learning paths', paths: true },
  ];

  /* Released courses drive progress, search and tools; "soon" courses only get a muted card. */
  var LIVE = COURSES.filter(function (c) { return !c.soon; });
  var SOON = COURSES.filter(function (c) { return c.soon; });

  /* Role paths, drawn as lines on the metro map: `steps` in order, then `optional` "go further"
     courses, which branch off the end of the line. Every course is on at least one line. */
  var FAMILIES = [
    { id: 'found', title: 'Interviews & foundations' },
    { id: 'eng', title: 'Engineering' },
    { id: 'ai', title: 'AI & ML' },
  ];
  var PATHS = [
    { id: 'campus', family: 'found', icon: '🎓', title: 'Campus placements / SDE-1',
      blurb: 'The fresher loop: coding rounds, then the core-CS viva (OS, DBMS, networks), then a light class-design round.',
      steps: ['dsa', 'os', 'databases', 'networks', 'lld'], optional: [] },
    { id: 'interview', family: 'found', icon: '🎯', title: 'Cracking the SDE-2+ interview',
      blurb: 'Coding, then the class-level design round, then the architecture round. Distributed Systems for senior and staff loops, Backend & API for backend loops.',
      steps: ['dsa', 'lld', 'system-design'], optional: ['distributed-systems', 'backend-api'] },
    { id: 'fundamentals', family: 'found', icon: '🧱', title: 'CS fundamentals (self-taught / career switch)',
      blurb: 'The four subjects everything else assumes, in the order they build on each other.',
      steps: ['dsa', 'os', 'networks', 'databases'], optional: ['lld'] },
    { id: 'backend', family: 'eng', icon: '🛠️', title: 'Backend engineer',
      blurb: 'What your service sits on (the database, the network, the OS), then building the service and its API, then how to structure it and how to scale it.',
      steps: ['databases', 'networks', 'os', 'backend-api', 'lld', 'system-design'], optional: ['distributed-systems'] },
    { id: 'fullstack', family: 'eng', icon: '🧩', title: 'Full-stack / product engineer',
      blurb: 'Building the service and its API, then the database and the network under it, then designing the whole product to scale.',
      steps: ['backend-api', 'databases', 'networks', 'system-design'], optional: ['cloud-devops'] },
    { id: 'systems', family: 'eng', icon: '🔩', title: 'Systems / infrastructure engineer',
      blurb: 'The machine, the network and the storage engine, then how they behave when spread across many machines.',
      steps: ['os', 'networks', 'databases', 'distributed-systems'], optional: ['cloud-devops'] },
    { id: 'sre', family: 'eng', icon: '🚦', title: 'SRE / platform / DevOps',
      blurb: 'Linux and networking first, then containers, Kubernetes, CI/CD and observability, then designing for reliability.',
      steps: ['os', 'networks', 'cloud-devops', 'system-design'], optional: ['distributed-systems'] },
    { id: 'data', family: 'eng', icon: '🗄️', title: 'Data engineer',
      blurb: 'Storage engines and SQL, then replication, partitioning and streams, then running pipelines in the cloud.',
      steps: ['databases', 'distributed-systems', 'cloud-devops', 'system-design'], optional: ['ml-fundamentals', 'ml-ai-systems'] },
    { id: 'architect', family: 'eng', icon: '🏛️', title: 'Senior / staff / architect',
      blurb: 'Trade-offs at scale: architecture, consensus and consistency, storage internals, and running it all in production.',
      steps: ['system-design', 'distributed-systems', 'databases', 'cloud-devops'], optional: ['lld'] },
    { id: 'agent', family: 'ai', icon: '🤖', title: 'AI agent engineer',
      blurb: 'Services and APIs first, then grounding a model in your own data, then one agent with tools, then teams of agents, then running them in production.',
      steps: ['backend-api', 'rag', 'single-agent', 'multi-agent', 'cloud-devops'], optional: ['system-design'] },
    { id: 'llm', family: 'ai', icon: '💬', title: 'LLM / GenAI engineer',
      blurb: 'Classical ML and honest evaluation, then deep learning, then language and large language models from the inside, then grounding them in your own data.',
      steps: ['ml-fundamentals', 'deep-learning', 'nlp', 'llms', 'rag'], optional: ['single-agent'] },
    { id: 'ml', family: 'ai', icon: '🧠', title: 'ML / AI engineer',
      blurb: 'Classical machine learning first, then deep learning, then the systems that train and serve models, then large language models. Distributed Systems and DevOps for training clusters and serving.',
      steps: ['ml-fundamentals', 'deep-learning', 'ml-ai-systems', 'llms'], optional: ['distributed-systems', 'cloud-devops'] },
    { id: 'vision', family: 'ai', icon: '👁️', title: 'Computer vision engineer',
      blurb: 'Classical ML, then deep learning, then images and video, then the systems that train and serve vision models.',
      steps: ['ml-fundamentals', 'deep-learning', 'computer-vision', 'ml-ai-systems'], optional: ['cloud-devops'] },
    { id: 'datasci', family: 'ai', icon: '📊', title: 'Data scientist',
      blurb: 'SQL and how data is stored, then classical ML with honest evaluation, then deep learning, then putting models into production.',
      steps: ['databases', 'ml-fundamentals', 'deep-learning', 'ml-ai-systems'], optional: ['nlp'] },
    { id: 'mlops', family: 'ai', icon: '⚙️', title: 'ML infrastructure / MLOps',
      blurb: 'GPUs, memory and processes, then the ML stack, then the distributed training and deployment it runs on.',
      steps: ['os', 'ml-ai-systems', 'distributed-systems', 'cloud-devops'], optional: ['system-design'] },
  ];

  /* Where each course sits on the metro map, and which side its name goes. The positions are on a
     145 × 150 grid, chosen by a layout search for short lines, few crossings and bends, no line through
     a station it skips, and no name over a line; the map's frame fits whatever area they cover.
     CS and systems end up on the left, ML on the right, agents below it. */
  var METRO = {
    'dsa': [245, 110, 'e'], 'os': [390, 260, 'n'], 'networks': [390, 410, 'w'], 'databases': [535, 410, 'e'],
    'lld': [245, 260, 'e'], 'backend-api': [535, 110, 'n'], 'system-design': [390, 560, 'w'], 'distributed-systems': [680, 410, 'n'],
    'cloud-devops': [680, 560, 's'], 'ml-fundamentals': [825, 110, 'n'], 'deep-learning': [970, 110, 'n'], 'computer-vision': [970, 410, 's'],
    'nlp': [1115, 110, 'n'], 'llms': [1115, 260, 'e'], 'ml-ai-systems': [825, 410, 's'], 'rag': [825, 260, 's'],
    'single-agent': [1115, 410, 'w'], 'multi-agent': [1115, 560, 's'],
  };

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
      // A planned course may not have a size yet: show only what is known.
      var meta = [c.chapters && '~' + c.chapters + ' chapters', c.hours && '~' + c.hours + ' h', c.lang && esc(c.lang)]
        .filter(Boolean).join(' · ');
      el.innerHTML =
        '<div class="c-no">' + String(i + 1).padStart(2, '0') + '</div>' +
        '<div class="c-head"><span class="ic">' + markSvg(c, 36) + '</span><h3><span class="nm">' + esc(c.title) + '</span></h3></div>' +
        (meta ? '<div class="c-meta">' + meta + '</div>' : '') +
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
     The mosaic: one square per chapter, one subject-area tab at a time.
     Released courses link each square to its chapter; a course still
     being written shows its planned size as faint outlines.
     --------------------------------------------------------- */
  // A planned course is drawn at the standard size: 8 prerequisites + 40 chapters + 8 case studies.
  var PLANNED = 56;
  function trackTotal(c) { return c.soon ? (c.chapters || PLANNED) : countOf(c); }
  function trackDone(c) { return c.soon ? 0 : doneCount(c); }
  var COURSE_TABS = TABS.filter(function (t) { return !t.paths; });
  var trackTab = null;

  function chapterAt(c, n) {
    if (!c.data) return null;
    if (!c.byN) { c.byN = {}; c.data.forEach(function (ch) { c.byN[ch.n] = ch; }); }
    return c.byN[n] || null;
  }

  function mosaicTab(t) {
    var list = inTab(t), done = 0, total = 0;
    list.forEach(function (c) { done += trackDone(c); total += trackTotal(c); });
    var on = t.id === trackTab;
    return '<button type="button" class="mtab" role="tab" id="mtab-' + t.id + '" aria-controls="mpanel-' + t.id + '" ' +
      'aria-selected="' + on + '" tabindex="' + (on ? 0 : -1) + '" data-mtab="' + t.id + '">' +
      '<span>' + esc(t.title) + '</span><span class="mct">' + done + '/' + total + '</span></button>';
  }

  function renderMosaic() {
    if (!trackTab) {
      // Open on the tab of the course you are furthest into, else the one you last chose, else the first.
      var saved = LS.get('atlas-track-tab', null), going = LIVE.filter(function (c) { return doneCount(c) > 0 && doneCount(c) < countOf(c); })
        .sort(function (a, b) { return doneCount(b) - doneCount(a); })[0];
      trackTab = COURSE_TABS.some(function (t) { return t.id === saved; }) ? saved : going ? going.tab : COURSE_TABS[0].id;
    }
    // Every tab's panel is drawn into the same grid cell and only the open one is visible, so the tracker
    // always has the height of its tallest tab: switching tabs never resizes it or moves the hero beside it.
    $('#mosaic').innerHTML = '<div class="mtabs" role="tablist" aria-label="Progress by subject area">' + COURSE_TABS.map(mosaicTab).join('') + '</div>' +
      '<div class="mpanels">' + COURSE_TABS.map(function (t) {
        return '<div class="mpanel" id="mpanel-' + t.id + '" role="tabpanel" aria-labelledby="mtab-' + t.id + '"' +
          (t.id === trackTab ? '' : ' inert aria-hidden="true"') + '>' + trackRows(t) + '</div>';
      }).join('') + '</div>';
  }

  function trackRows(tab) {
    return inTab(tab).map(function (c) {
      if (c.soon) {
        var n = trackTotal(c);
        return '<div class="mgroup tint soon" style="' + tintVars(c) + '">' +
          '<div class="gh"><span class="nm">' + esc(c.title) + '</span>' +
          '<span class="rule"></span><span class="ct">coming soon · 0/' + n + '</span></div>' +
          '<div class="mosaic" role="img" aria-label="' + esc(c.title) + ': coming soon, ' + n + ' chapters planned">' + new Array(n + 1).join('<span></span>') + '</div></div>';
      }
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

  // Switching only flips which panel is visible (nothing is redrawn), and opens the same subject area
  // in the course tabs below, so the tracker and the cards stay on one subject.
  function selectTrackTab(id, focus) {
    trackTab = id;
    LS.set('atlas-track-tab', id);
    COURSE_TABS.forEach(function (t) {
      var on = t.id === id, b = $('#mtab-' + t.id), p = $('#mpanel-' + t.id);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
      p.inert = !on;
      if (on) p.removeAttribute('aria-hidden'); else p.setAttribute('aria-hidden', 'true');
    });
    if (isTab(id)) selectTab(id);
    if (focus) $('#mtab-' + id).focus();
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
      SOON.length ? [SOON.length, 'on the way'] : null,
      [total, 'chapters'],
      [LIVE.reduce(function (s, c) { return s + preCount(c); }, 0), 'prerequisites'],
      ['~' + hours, 'hours'],
    ].filter(Boolean).map(function (s) { return '<div class="stat"><b>' + s[0] + '</b><span>' + s[1] + '</span></div>'; }).join('');

    renderLead();
    renderPaths();
  }

  /* "Nine courses, four out now and five on the way," from the registry, so releasing a
     course (removing `soon`) needs no copy change. */
  function renderLead() {
    var el = $('#leadCount'); if (!el) return;
    var W = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
      'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
    var w = function (n) { return W[n] || String(n); };
    var all = w(COURSES.length);
    el.textContent = all.charAt(0).toUpperCase() + all.slice(1) + ' courses' +
      (SOON.length ? ', ' + w(LIVE.length) + ' out now and ' + w(SOON.length) + ' on the way,' : ',');
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
    // Fading, dashes and the tick are visual only; screen readers get the same states as words.
    var states = [optional && 'optional', c.soon && 'coming soon', done && 'complete'].filter(Boolean);
    var label = esc(c.short || c.title) + (done ? '<span aria-hidden="true"> ✓</span>' : '') +
      (states.length ? '<span class="sr-only"> (' + states.join(', ') + ')</span>' : '');
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
  /* ---------------------------------------------------------
     The metro map: every course is a station in its own colours, every role is a line through
     its courses in order. One role is lit at a time (hovering another previews it); the rest
     stay as faint lines, so shared stretches show which roles overlap.
     --------------------------------------------------------- */
  var activePath = null, previewPath = null;
  function pathById(id) { return PATHS.filter(function (p) { return p.id === id; })[0]; }
  function routeOf(p) { return p.steps.concat(p.optional); }
  function r1(n) { return Math.round(n * 10) / 10; }

  // Every segment of every line, keyed by the pair of courses it joins (lines sharing a stretch share a key).
  function metroSegments() {
    var segs = [];
    PATHS.forEach(function (p) {
      p.steps.forEach(function (id, i) { if (i) segs.push({ p: p, a: p.steps[i - 1], b: id, opt: false }); });
      p.optional.forEach(function (id) { segs.push({ p: p, a: p.steps[p.steps.length - 1], b: id, opt: true }); });
    });
    segs.forEach(function (s) { s.key = [s.a, s.b].sort().join('|'); });
    return segs;
  }

  // Each pair of courses has one route, used by every line that joins them, as on a metro map: straight
  // when the stations line up across, down or at 45°, otherwise a 45° leg and a straight leg meeting at a
  // rounded bend, in whichever order keeps clear of the other stations. Only when neither order does is
  // the route a curve bowing round the station in the way.
  var CLEAR = 30, BEND = 28, routes = {};
  function distToSeg(P, A, B) {
    var dx = B[0] - A[0], dy = B[1] - A[1], L2 = dx * dx + dy * dy;
    var t = L2 ? Math.max(0, Math.min(1, ((P[0] - A[0]) * dx + (P[1] - A[1]) * dy) / L2)) : 0;
    var x = A[0] + t * dx - P[0], y = A[1] + t * dy - P[1];
    return Math.sqrt(x * x + y * y);
  }
  // How close a route of straight legs comes to any station other than its two ends.
  function clearance(pts, a, b) {
    var min = Infinity;
    Object.keys(METRO).forEach(function (id) {
      if (id === a || id === b) return;
      for (var i = 1; i < pts.length; i++) min = Math.min(min, distToSeg(METRO[id], pts[i - 1], pts[i]));
    });
    return min;
  }
  function legsPath(pts) {
    var d = 'M' + r1(pts[0][0]) + ' ' + r1(pts[0][1]);
    for (var i = 1; i < pts.length - 1; i++) {
      var P = pts[i], A = pts[i - 1], B = pts[i + 1];
      var la = Math.hypot(P[0] - A[0], P[1] - A[1]), lb = Math.hypot(B[0] - P[0], B[1] - P[1]), r = Math.min(BEND, la / 2, lb / 2);
      d += ' L' + r1(P[0] + (A[0] - P[0]) * r / la) + ' ' + r1(P[1] + (A[1] - P[1]) * r / la) +
        ' Q' + r1(P[0]) + ' ' + r1(P[1]) + ' ' + r1(P[0] + (B[0] - P[0]) * r / lb) + ' ' + r1(P[1] + (B[1] - P[1]) * r / lb);
    }
    var E = pts[pts.length - 1];
    return d + ' L' + r1(E[0]) + ' ' + r1(E[1]);
  }
  // The fallback: a curve bowing away from the nearest station that sits close to the straight line.
  function bowPath(A, B, ab) {
    var dx = B[0] - A[0], dy = B[1] - A[1], L = Math.sqrt(dx * dx + dy * dy), nx = -dy / L, ny = dx / L, bow = 0, near = Infinity;
    Object.keys(METRO).forEach(function (id) {
      if (id === ab[0] || id === ab[1]) return;
      var S = METRO[id], t = ((S[0] - A[0]) * dx + (S[1] - A[1]) * dy) / (L * L);
      if (t < 0.06 || t > 0.94) return;
      var d = (S[0] - A[0]) * nx + (S[1] - A[1]) * ny;
      if (Math.abs(d) < 44 && Math.abs(d) < near) {
        near = Math.abs(d);
        // A quadratic curve strays 2t(1-t) of its control offset from the chord at the station's t.
        bow = (d > 0 ? -1 : 1) * Math.min(190, Math.max(30, (44 - Math.abs(d)) / (2 * t * (1 - t))));
      }
    });
    return 'M' + A[0] + ' ' + A[1] + ' Q' + r1((A[0] + B[0]) / 2 + nx * bow) + ' ' + r1((A[1] + B[1]) / 2 + ny * bow) + ' ' + B[0] + ' ' + B[1];
  }
  function segPath(s) {
    if (routes[s.key]) return routes[s.key];
    var ab = s.key.split('|'), A = METRO[ab[0]].slice(0, 2), B = METRO[ab[1]].slice(0, 2);
    var dx = B[0] - A[0], dy = B[1] - A[1], m = Math.min(Math.abs(dx), Math.abs(dy)), sx = Math.sign(dx), sy = Math.sign(dy);
    var options = !dx || !dy || Math.abs(dx) === Math.abs(dy) ? [[A, B]]
      : [[A, [A[0] + sx * m, A[1] + sy * m], B], [A, [B[0] - sx * m, B[1] - sy * m], B]];
    var best = null, room = -1;
    options.forEach(function (pts) { var c = clearance(pts, ab[0], ab[1]); if (c > room) { room = c; best = pts; } });
    return (routes[s.key] = room >= CLEAR ? legsPath(best) : bowPath(A, B, ab));
  }

  // A station: the course's colour, a ring showing how much of it you've read, its name, and its
  // place in the lit route (+ for an optional extra). Planned courses are dashed rings, not links.
  function metroStation(c, step) {
    var P = METRO[c.id]; if (!P) return '';
    var x = P[0], y = P[1], side = P[2];
    var done = c.soon ? 0 : doneCount(c), total = c.soon ? 0 : countOf(c), frac = total ? done / total : 0;
    var lx = x + (side === 'e' ? 24 : side === 'w' ? -24 : 0), ly = y + (side === 'n' ? -26 : side === 's' ? 36 : 5);
    var anchor = side === 'e' ? 'start' : side === 'w' ? 'end' : 'middle', C = 2 * Math.PI * 17;
    var body = '<circle class="mring" cx="' + x + '" cy="' + y + '" r="17"/>' +
      (frac ? '<circle class="mprog" cx="' + x + '" cy="' + y + '" r="17" stroke-dasharray="' + r1(C * frac) + ' ' + r1(C) + '" ' +
        'transform="rotate(-90 ' + x + ' ' + y + ')"/>' : '') +
      '<circle class="mdot" cx="' + x + '" cy="' + y + '" r="11"/>' +
      (step ? '<text class="mnum" x="' + x + '" y="' + (y + 4) + '">' + step + '</text>' : '') +
      '<text class="mlab" x="' + lx + '" y="' + ly + '" text-anchor="' + anchor + '">' + esc(c.short || c.title) + '</text>';
    var cls = 'mst tint' + (c.soon ? ' soon' : '') + (step ? ' on' : '');
    var said = c.title + (c.soon ? ' (coming soon)' : ': ' + done + ' of ' + total + ' chapters read');
    var attrs = ' class="' + cls + '" style="' + tintVars(c) + '" data-course="' + c.id + '"';
    return c.soon ? '<g' + attrs + '><title>' + esc(said) + '</title>' + body + '</g>'
      : '<a' + attrs + ' href="' + url(c, 'index.html') + '" aria-label="' + esc(said) + '"><title>' + esc(said) + '</title>' + body + '</a>';
  }

  // The map's frame: the box around every station's ring and name (names measured roughly at 8 px a
  // character), plus a margin, so the map fills its panel whatever area the layout covers.
  function metroFrame() {
    var x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    COURSES.forEach(function (c) {
      var P = METRO[c.id]; if (!P) return;
      var w = (c.short || c.title).length * 8, x = P[0], y = P[1];
      var b = P[2] === 'e' ? [x - 20, y - 20, x + 24 + w, y + 20] : P[2] === 'w' ? [x - 24 - w, y - 20, x + 20, y + 20]
        : P[2] === 'n' ? [Math.min(x - 20, x - w / 2), y - 44, Math.max(x + 20, x + w / 2), y + 20]
        : [Math.min(x - 20, x - w / 2), y - 20, Math.max(x + 20, x + w / 2), y + 42];
      x0 = Math.min(x0, b[0]); y0 = Math.min(y0, b[1]); x1 = Math.max(x1, b[2]); y1 = Math.max(y1, b[3]);
    });
    var m = 22;
    return [x0 - m, y0 - m, x1 - x0 + 2 * m, y1 - y0 + 2 * m].map(Math.round).join(' ');
  }

  function renderMetro() {
    var p = pathById(previewPath || activePath), segs = metroSegments(), defs = '', lit = '';
    segs.filter(function (s) { return s.p === p; }).forEach(function (s, i) {
      var A = METRO[s.a], B = METRO[s.b];
      // Each lit segment fades from the colour of the course it leaves to the colour of the one it reaches.
      defs += '<linearGradient id="mg-' + i + '" gradientUnits="userSpaceOnUse" x1="' + A[0] + '" y1="' + A[1] + '" x2="' + B[0] + '" y2="' + B[1] + '">' +
        '<stop offset="0" class="tint" style="' + tintVars(byId(s.a)) + ';stop-color:var(--k1)"/>' +
        '<stop offset="1" class="tint" style="' + tintVars(byId(s.b)) + ';stop-color:var(--k1)"/></linearGradient>';
      lit += '<path class="mline on' + (s.opt ? ' opt' : '') + '" data-a="' + s.a + '" data-b="' + s.b + '" d="' + segPath(s) + '" style="stroke:url(#mg-' + i + ')"/>';
    });
    // The faint network: each route once, however many roles use it.
    var seen = {}, faint = segs.filter(function (s) { return !s.opt && !seen[s.key] && (seen[s.key] = true); }).map(function (s) {
      return '<path class="mline" data-a="' + s.a + '" data-b="' + s.b + '" d="' + segPath(s) + '"/>';
    }).join('');
    var stations = COURSES.map(function (c) {
      var i = p.steps.indexOf(c.id);
      return metroStation(c, i >= 0 ? String(i + 1) : p.optional.indexOf(c.id) >= 0 ? '+' : '');
    }).join('');
    $('#metroMap').innerHTML =
      '<svg viewBox="' + metroFrame() + '" role="group" aria-label="' + esc(PATHS.length + ' roles drawn as lines through ' + COURSES.length + ' courses, with ' + p.title + ' highlighted') + '">' +
      '<defs>' + defs + '</defs><g class="mfaint">' + faint + '</g><g class="mlit">' + lit + '</g>' + stations + '</svg>';
  }

  // The next thing to read on a route: the next chapter of its first unfinished released course.
  function pathNext(p) {
    var req = p.steps.map(byId).filter(Boolean), c = req.filter(function (c) { return !c.soon && !isComplete(c); })[0];
    if (!c) return '<p class="md-next">' + (req.some(function (c) { return !c.soon; })
      ? 'Every released course on this route is complete.' : 'Every course on this route is still being written.') + '</p>';
    var ch = nextChapter(c);
    return '<p class="md-next">' + (doneCount(c) ? 'Continue with ' : 'Start with ') +
      '<a href="' + url(c, ch ? ch.f : 'index.html') + '">' + esc(c.title) + (ch ? ' · ' + esc(chShort(ch.n)) + ': ' + esc(ch.ti) : '') + ' →</a></p>';
  }
  function renderPathDetail() {
    var p = pathById(activePath), fam = FAMILIES.filter(function (f) { return f.id === p.family; })[0];
    $('#metroDetail').innerHTML = '<div class="md-head"><span class="ico" aria-hidden="true">' + p.icon + '</span>' +
      '<div><div class="md-fam">' + esc(fam.title) + '</div><h4>' + esc(p.title) + '</h4></div>' +
      '<span class="pprog">' + pathProgress(p) + '</span></div><p>' + esc(p.blurb) + '</p>' + pathFlow(p) + pathNext(p);
  }
  function renderPaths() {
    if (!activePath) { var saved = LS.get('atlas-path', null); activePath = pathById(saved) ? saved : PATHS[0].id; }
    $('#metroRoles').innerHTML = FAMILIES.map(function (f) {
      return '<div class="mfam"><div class="mfam-t">' + esc(f.title) + '</div><div class="mfam-r">' +
        PATHS.filter(function (p) { return p.family === f.id; }).map(function (p) {
          var on = p.id === activePath;
          return '<button type="button" class="mrole" role="radio" id="role-' + p.id + '" aria-checked="' + on + '" ' +
            'tabindex="' + (on ? 0 : -1) + '" data-path="' + p.id + '"><span class="mrole-i" aria-hidden="true">' + p.icon + '</span>' +
            '<span>' + esc(p.title) + '</span></button>';
        }).join('') + '</div></div>';
    }).join('');
    renderMetro();
    renderPathDetail();
  }
  // Choosing a role keeps the buttons (and focus) in place and redraws only the map and the detail.
  function selectPath(id, focus) {
    activePath = id; previewPath = null;
    LS.set('atlas-path', id);
    PATHS.forEach(function (p) {
      var b = $('#role-' + p.id), on = p.id === id;
      b.setAttribute('aria-checked', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1;
    });
    renderMetro();
    renderPathDetail();
    if (focus) $('#role-' + id).focus();
  }
  function previewOn(id) {
    var next = id === activePath ? null : id;
    if (next !== previewPath) { previewPath = next; renderMetro(); }
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
     Tabs: one per subject area, plus the learning paths
     --------------------------------------------------------- */
  function inTab(t) { return COURSES.filter(function (c) { return c.tab === t.id; }); }

  /* Each course tab shows one dot per course: filled when released, a ring while on the way. */
  function tabButton(t) {
    var list = inTab(t), soon = list.filter(function (c) { return c.soon; }).length, out = list.length - soon;
    var dots = t.paths ? '' : '<span class="tab-dots" aria-hidden="true">' + list.map(function (c) {
      return '<i class="tint' + (c.soon ? ' soon' : '') + '" style="' + tintVars(c) + '"></i>';
    }).join('') + '</span>';
    var said = t.paths ? PATHS.length + ' roles' :
      [out && out + (out === 1 ? ' course' : ' courses'), soon && soon + ' coming soon'].filter(Boolean).join(', ');
    return '<button type="button" class="tab' + (t.paths ? ' tab-paths' : '') + '" role="tab" id="tab-' + t.id + '" ' +
      'aria-controls="panel-' + t.id + '" aria-selected="false" tabindex="-1" data-tab="' + t.id + '">' +
      (t.paths ? '<span aria-hidden="true">🧭</span>' : '') +
      '<span class="tab-nm">' + esc(t.title) + '</span>' + dots +
      '<span class="sr-only">, ' + said + '</span></button>';
  }

  function renderTabs() {
    $('#tabList').innerHTML = TABS.map(tabButton).join('');
    // Course panels go in front of the static learning-paths panel.
    var paths = $('#panel-paths');
    TABS.filter(function (t) { return !t.paths; }).forEach(function (t) {
      var panel = document.createElement('section');
      panel.className = 'tab-panel';
      panel.id = 'panel-' + t.id;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', 'tab-' + t.id);
      panel.tabIndex = 0;
      panel.hidden = true;
      panel.innerHTML = '<p class="sec-sub">' + esc(t.blurb) + '</p><div class="courses"></div>';
      var grid = $('.courses', panel);
      inTab(t).forEach(function (c, i) { c.el = courseCard(c, i); grid.appendChild(c.el); });
      paths.parentNode.insertBefore(panel, paths);
    });
  }

  function isTab(id) { return TABS.some(function (t) { return t.id === id; }); }

  function selectTab(id, focus) {
    TABS.forEach(function (t) {
      var on = t.id === id, b = $('#tab-' + t.id);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
      $('#panel-' + t.id).hidden = !on;
    });
    if (focus) $('#tab-' + id).focus();
    LS.set('atlas-tab', id);
  }

  /* A link to #ml, #paths and so on opens that tab and scrolls to the tab bar. */
  function tabFromHash() {
    var id = location.hash.slice(1);
    if (!isTab(id)) return false;
    selectTab(id);
    $('#courses').scrollIntoView();
    return true;
  }

  /* ---------------------------------------------------------
     Boot
     --------------------------------------------------------- */
  renderTabs();
  if (!tabFromHash()) { var saved = LS.get('atlas-tab', null); selectTab(isTab(saved) ? saved : TABS[0].id); }
  COURSES.forEach(paintCard);
  paintProgress();
  renderStatic();
  renderFilters();
  $('#themeBtn').textContent = currentTheme() === 'dark' ? '☀️' : '🌙';

  $('#themeBtn').addEventListener('click', function () { setTheme(currentTheme() === 'dark' ? 'light' : 'dark'); });

  document.querySelectorAll('[data-search]').forEach(function (b) { b.addEventListener('click', openPal); });

  $('#tabList').addEventListener('click', function (e) {
    var b = e.target.closest('[data-tab]'); if (!b) return;
    selectTab(b.dataset.tab);
    // Drop a tab hash (#paths) so a reload reopens the tab last chosen, not the one linked to.
    if (isTab(location.hash.slice(1))) history.replaceState(null, '', location.pathname + location.search);
  });
  // Arrow keys move between tabs (and open them), as in any tab list.
  $('#tabList').addEventListener('keydown', function (e) {
    var b = e.target.closest('[data-tab]'); if (!b) return;
    var ids = TABS.map(function (t) { return t.id; }), i = ids.indexOf(b.dataset.tab);
    var j = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: ids.length - 1 }[e.key];
    if (j === undefined) return;
    e.preventDefault();
    selectTab(ids[(j + ids.length) % ids.length], true);
  });
  window.addEventListener('hashchange', tabFromHash);

  // The tracker's own tabs: click or arrow keys switch the subject area shown.
  $('#mosaic').addEventListener('click', function (e) {
    var b = e.target.closest('[data-mtab]'); if (b) selectTrackTab(b.dataset.mtab);
  });
  $('#mosaic').addEventListener('keydown', function (e) {
    var b = e.target.closest('[data-mtab]'); if (!b) return;
    var ids = COURSE_TABS.map(function (t) { return t.id; }), i = ids.indexOf(b.dataset.mtab);
    var j = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: ids.length - 1 }[e.key];
    if (j === undefined) return;
    e.preventDefault();
    selectTrackTab(ids[(j + ids.length) % ids.length], true);
  });

  // The metro map's roles: click or arrow keys choose one; hovering one previews its line.
  $('#metroRoles').addEventListener('click', function (e) {
    var b = e.target.closest('[data-path]'); if (b) selectPath(b.dataset.path);
  });
  $('#metroRoles').addEventListener('keydown', function (e) {
    var b = e.target.closest('[data-path]'); if (!b) return;
    var ids = PATHS.map(function (p) { return p.id; }), i = ids.indexOf(b.dataset.path);
    var j = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: ids.length - 1 }[e.key];
    if (j === undefined) return;
    e.preventDefault();
    selectPath(ids[(j + ids.length) % ids.length], true);
  });
  $('#metroRoles').addEventListener('mouseover', function (e) {
    var b = e.target.closest('[data-path]'); if (b) previewOn(b.dataset.path);
  });
  $('#metroRoles').addEventListener('mouseleave', function () { previewOn(null); });

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
