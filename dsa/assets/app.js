/* =========================================================
   Palak Deb Patra's DSA Playlist — shared runtime
   Builds the shell (sidebar, topbar, footer nav) and wires up
   generic components: tabs, steppers, quizzes, flip cards, seg controls.
   Exposes helpers on window.DSA for chapter-specific visualizers.
   ========================================================= */
(function () {
  const CHAPTERS = [
    { n: 1,  file: '01-how-to-think.html',          title: 'How to Think in DSA (& My House Style)',   level: 'Foundations',   icon: '🧭', mins: 30, blurb: 'The method: read constraints first, name the pattern, then write it — plus the exact C++ conventions every chapter uses.' },
    { n: 2,  file: '02-complexity.html',            title: 'Complexity: Time, Space & Amortized',      level: 'Foundations',   icon: '📈', mins: 40, blurb: 'Big-O from first principles, the complexity ladder, amortized analysis, and reading a budget straight off the constraints.' },
    { n: 3,  file: '03-arrays-memory.html',         title: 'Arrays & How Memory Actually Works',       level: 'Foundations',   icon: '🧱', mins: 35, blurb: 'Contiguous memory, cache lines, vector growth, and why an O(n) array beats an O(1) linked list in practice.' },
    { n: 4,  file: '04-two-pointers.html',          title: 'Two Pointers',                             level: 'Foundations',   icon: '👉', mins: 35, blurb: 'Opposite ends, same direction, fast/slow — the three shapes, and how to spot which one a problem wants.' },
    { n: 5,  file: '05-sliding-window.html',        title: 'Sliding Window',                           level: 'Foundations',   icon: '🪟', mins: 40, blurb: 'Fixed and variable windows, the shrink condition, and the counting trick for "at most K" problems.' },
    { n: 6,  file: '06-prefix-sums.html',           title: 'Prefix Sums & Difference Arrays',          level: 'Foundations',   icon: '➕', mins: 35, blurb: 'Range sums in O(1), 2D prefix sums, difference arrays for range updates, and prefix-XOR with a hashmap.' },
    { n: 7,  file: '07-binary-search.html',         title: 'Binary Search (And On The Answer)',        level: 'Foundations',   icon: '🎯', mins: 45, blurb: 'One invariant, four boundary variants, then the real skill: turning an optimization problem into a monotone predicate.' },
    { n: 8,  file: '08-sorting.html',            title: 'Sorting: Every Algorithm & Comparators',   level: 'Foundations',   icon: '🔀', mins: 45, blurb: 'Bubble to radix with a live racer, stability, and the custom-comparator pattern you use in every hard problem.' },
    { n: 9,  file: '09-hashing.html',               title: 'Hashing: Maps, Sets & Frequency',          level: 'Foundations',   icon: '🗂️', mins: 40, blurb: 'How a hash table really works, ordered vs unordered, the frequency-map family, and hashing your own keys.' },
    { n: 10, file: '10-strings.html',               title: 'Strings & Character Counting',             level: 'Foundations',   icon: '🔤', mins: 35, blurb: 'Immutability costs, the 26-bucket count, anagrams, palindromes, parsing, and stringstream tricks.' },
    { n: 11, file: '11-recursion.html',             title: 'Recursion & The Call Stack',               level: 'Foundations',   icon: '🌀', mins: 45, blurb: 'The stack frame model, base case discipline, recursion trees, and converting any recursion to a loop.' },

    { n: 12, file: '12-linked-lists.html',          title: 'Linked Lists',                             level: 'Data Structures', icon: '🔗', mins: 45, blurb: 'Singly, doubly, dummy heads, reversal, cycle detection, merge and the in-place patterns interviewers love.' },
    { n: 13, file: '13-stacks.html',                title: 'Stacks & Monotonic Stacks',                level: 'Data Structures', icon: '📚', mins: 45, blurb: 'LIFO, expression parsing, and the monotonic stack: next greater element, histogram, stock span, trapping rain.' },
    { n: 14, file: '14-queues-deques.html',         title: 'Queues, Deques & Monotonic Deques',        level: 'Data Structures', icon: '🚶', mins: 40, blurb: 'Circular buffers, deque internals, sliding-window maximum in O(n), and implementing each from the other.' },
    { n: 15, file: '15-heaps.html',                 title: 'Heaps & Priority Queues',                  level: 'Data Structures', icon: '⛰️', mins: 45, blurb: 'Sift up/down, heapify in O(n), top-K, K-way merge, and the two-heap running median.' },
    { n: 16, file: '16-binary-trees.html',          title: 'Binary Trees & DFS Traversals',            level: 'Data Structures', icon: '🌳', mins: 45, blurb: 'The node struct, preorder/inorder/postorder, their iterative twins, and Morris traversal in O(1) space.' },
    { n: 17, file: '17-tree-bfs-views.html',        title: 'Level Order, ZigZag, Vertical & Views',    level: 'Data Structures', icon: '🪜', mins: 45, blurb: 'One BFS skeleton, six problems: level order, zigzag, vertical order, and the top/bottom/left/right views.' },
    { n: 18, file: '18-tree-problems.html',         title: 'Tree Problems: Height, LCA, Paths',        level: 'Data Structures', icon: '🧩', mins: 50, blurb: 'Height, balance, diameter, LCA, path sums, serialize/deserialize and rebuilding a tree from traversals.' },
    { n: 19, file: '19-bst.html',                   title: 'Binary Search Trees',                      level: 'Data Structures', icon: '🔍', mins: 40, blurb: 'The BST invariant, insert/delete, validation, inorder successor, Kth smallest and range queries.' },
    { n: 20, file: '20-balanced-trees.html',        title: 'Balanced Trees: AVL, Red-Black, Treap',     level: 'Data Structures', icon: '⚖️', mins: 45, blurb: 'Why rotations exist, the four AVL cases, red-black invariants, treaps, B-trees and what std::map really is.' },
    { n: 21, file: '21-tries.html',                 title: 'Tries & Prefix Structures',                level: 'Data Structures', icon: '🌲', mins: 40, blurb: 'Prefix trees, autocomplete, the binary trie for max-XOR, and Aho-Corasick for multi-pattern search.' },
    { n: 22, file: '22-dsu.html',                   title: 'Union-Find (DSU)',                         level: 'Data Structures', icon: '🧷', mins: 40, blurb: 'Path compression, union by rank, the inverse-Ackermann bound, and DSU on a grid, with rollback and small-to-large.' },
    { n: 23, file: '23-segment-trees.html',         title: 'Segment Trees & Lazy Propagation',         level: 'Data Structures', icon: '🌴', mins: 55, blurb: 'Build, query, point update, then lazy range updates — and how to pick the merge function for any problem.' },
    { n: 24, file: '24-fenwick-sparse.html',        title: 'Fenwick Trees & Sparse Tables',            level: 'Data Structures', icon: '📊', mins: 45, blurb: 'The BIT in twelve lines, the low-bit trick, 2D BIT, sparse tables for O(1) RMQ, and when each beats a segment tree.' },

    { n: 25, file: '25-graph-basics.html',          title: 'Graphs: Representation, DFS & BFS',        level: 'Graphs & Paradigms', icon: '🕸️', mins: 45, blurb: 'Adjacency list vs matrix, directed/weighted variants, and the two traversals every graph algorithm is built from.' },
    { n: 26, file: '26-toposort.html',              title: 'Topological Sort',                         level: 'Graphs & Paradigms', icon: '📐', mins: 40, blurb: 'DFS with a stack, Kahn with indegrees, lexicographically smallest order, and the longest path in a DAG.' },
    { n: 27, file: '27-cycle-detection.html',       title: 'Cycle Detection',                          level: 'Graphs & Paradigms', icon: '🔄', mins: 40, blurb: 'Directed cycles with a recursion stack, undirected with a parent check, Kahn counting, and finding the cycle itself.' },
    { n: 28, file: '28-bipartite.html',             title: 'Bipartite Graphs & Coloring',              level: 'Graphs & Paradigms', icon: '🎨', mins: 35, blurb: 'Two-coloring with DFS and BFS, odd cycles, and why graph coloring in general is a different beast.' },
    { n: 29, file: '29-shortest-paths-1.html',      title: 'Shortest Paths I: BFS, 0-1 BFS, Dijkstra', level: 'Graphs & Paradigms', icon: '🛣️', mins: 50, blurb: 'Unweighted BFS, the deque trick for 0/1 weights, Dijkstra with a lazy heap, and path reconstruction.' },
    { n: 30, file: '30-shortest-paths-2.html',      title: 'Shortest Paths II: Bellman-Ford, Floyd',   level: 'Graphs & Paradigms', icon: '➖', mins: 45, blurb: 'Negative edges, detecting negative cycles, all-pairs Floyd-Warshall, transitive closure and Johnson.' },
    { n: 31, file: '31-mst.html',                   title: 'Minimum Spanning Trees: Prim & Kruskal',   level: 'Graphs & Paradigms', icon: '🌉', mins: 45, blurb: 'The cut property, Prim with a heap, Kruskal with DSU, second-best MST and the Steiner distinction.' },
    { n: 32, file: '32-scc-bridges.html',           title: 'SCC, Bridges & Articulation Points',       level: 'Graphs & Paradigms', icon: '🧬', mins: 50, blurb: 'Kosaraju, Tarjan lowlink, the condensation DAG, bridges, cut vertices and 2-SAT.' },
    { n: 33, file: '33-flows-matching.html',        title: 'Max Flow & Bipartite Matching',            level: 'Graphs & Paradigms', icon: '🚰', mins: 50, blurb: 'Ford-Fulkerson, residual graphs, Edmonds-Karp, Dinic, max-flow min-cut and Hopcroft-Karp matching.' },
    { n: 34, file: '34-grids.html',                 title: 'Grids: Flood Fill & Multi-Source BFS',     level: 'Graphs & Paradigms', icon: '🗺️', mins: 40, blurb: 'The grid-as-graph translation, direction arrays, islands, rotting oranges, and Dijkstra on a weighted grid.' },
    { n: 35, file: '35-backtracking.html',          title: 'Backtracking',                             level: 'Graphs & Paradigms', icon: '♟️', mins: 50, blurb: 'The choose/explore/unchoose skeleton, subsets, permutations with duplicates, N-Queens, Sudoku and pruning.' },
    { n: 36, file: '36-greedy.html',                title: 'Greedy Algorithms & Proving Them',         level: 'Graphs & Paradigms', icon: '🪙', mins: 45, blurb: 'The exchange argument, interval scheduling, jump game, Huffman coding, and how to tell greedy from DP.' },
    { n: 37, file: '37-divide-conquer.html',        title: 'Divide & Conquer',                         level: 'Graphs & Paradigms', icon: '✂️', mins: 45, blurb: 'The Master Theorem, merge-sort counting tricks, quickselect, matrix exponentiation and closest pair.' },

    { n: 38, file: '38-dp-foundations.html',        title: 'DP Foundations: The Five-Step Method',     level: 'DP & Advanced', icon: '🧠', mins: 50, blurb: 'State, transition, base case, order, answer — then memo → tabulation → rolling array, on one problem.' },
    { n: 39, file: '39-dp-1d.html',                 title: 'DP on Sequences (1D)',                     level: 'DP & Advanced', icon: '1️⃣', mins: 45, blurb: 'Climbing stairs, house robber, decode ways, LIS in O(n log n), and maximum subarray as DP.' },
    { n: 40, file: '40-dp-knapsack.html',           title: 'The Knapsack Family',                      level: 'DP & Advanced', icon: '🎒', mins: 50, blurb: '0/1, unbounded, bounded, subset sum, partition, coin change — one recurrence, six disguises.' },
    { n: 41, file: '41-dp-strings.html',            title: 'DP on Strings',                            level: 'DP & Advanced', icon: '📝', mins: 50, blurb: 'LCS, edit distance, palindromic subsequences, wildcard and regex matching, and reconstructing the answer.' },
    { n: 42, file: '42-dp-grids.html',              title: 'DP on Grids & Paths',                      level: 'DP & Advanced', icon: '🔲', mins: 40, blurb: 'Unique paths, min path sum, maximal square, cherry pickup and the two-agent state trick.' },
    { n: 43, file: '43-dp-trees.html',              title: 'DP on Trees & Rerooting',                  level: 'DP & Advanced', icon: '🌿', mins: 50, blurb: 'Post-order DP, include/exclude on trees, tree diameter as DP, and rerooting for all-roots answers.' },
    { n: 44, file: '44-dp-bitmask.html',            title: 'Bitmask DP & Held-Karp',                   level: 'DP & Advanced', icon: '🎭', mins: 50, blurb: 'Subsets as integers, assignment problems, TSP in O(2ⁿ·n²), broken profile DP and submask enumeration.' },
    { n: 45, file: '45-dp-intervals.html',          title: 'Interval DP & Matrix Chain',               level: 'DP & Advanced', icon: '📏', mins: 45, blurb: 'Split-point recurrences, matrix chain multiplication, burst balloons, and Knuth optimization.' },
    { n: 46, file: '46-dp-digit-prob.html',         title: 'Digit DP, Probability & Expectation',      level: 'DP & Advanced', icon: '🎲', mins: 45, blurb: 'Counting numbers with a tight flag, expected-value recurrences, and DP over game states with minimax.' },
    { n: 47, file: '47-bit-manipulation.html',      title: 'Bit Manipulation',                         level: 'DP & Advanced', icon: '💡', mins: 45, blurb: 'The eight tricks worth memorising, XOR properties, popcount, subsets, and the single-number family.' },
    { n: 48, file: '48-math.html',                  title: 'Math for DSA',                             level: 'DP & Advanced', icon: '🔢', mins: 55, blurb: 'GCD, sieves, modular arithmetic, fast power, modular inverse, nCr, CRT and matrix exponentiation.' },
    { n: 49, file: '49-geometry-random.html',        title: 'Geometry & Randomized Algorithms',         level: 'DP & Advanced', icon: '📐', mins: 45, blurb: 'Cross products, orientation, convex hull, sweep line, reservoir sampling and randomized quickselect.' },

    { n: 50, file: '50-string-algorithms.html',     title: 'String Algorithms: KMP, Z, Manacher',      level: 'Mastery',       icon: '🧵', mins: 55, blurb: 'The prefix function, Z-algorithm, Rabin-Karp rolling hash, Manacher, suffix arrays and LCP.' },
    { n: 51, file: '51-design-structures.html',     title: 'Design-a-Structure Problems',              level: 'Mastery',       icon: '🏗️', mins: 50, blurb: 'LRU, LFU, min-stack, randomized set, skip lists, Bloom filters, sqrt decomposition and Mo&#39;s algorithm.' },
    { n: 52, file: '52-pattern-playbook.html',      title: 'The Pattern Playbook',                     level: 'Mastery',       icon: '🗝️', mins: 45, blurb: 'A decision engine: constraints and phrasing in, pattern out — with the 24 patterns that cover almost everything.' },
    { n: 53, file: '53-debugging.html',             title: 'Debugging, Invariants & Stress Testing',   level: 'Mastery',       icon: '🐞', mins: 45, blurb: 'The real bug catalogue (including the ones in my own first drafts), invariants, and brute-force stress testing.' },
    { n: 54, file: '54-interview-playbook.html',    title: 'The Interview Playbook',                   level: 'Mastery',       icon: '🎤', mins: 45, blurb: 'How to run a 45-minute round: clarify, brute force, optimize, code, test — and what each signal is worth.' },
    { n: 55, file: '55-walkthrough-graph.html',     title: 'Walkthrough: A Hard Graph Problem',        level: 'Mastery',       icon: '🧗', mins: 50, blurb: 'One hard problem from blank page to accepted, narrating every decision, dead end and complexity check.' },
    { n: 56, file: '56-walkthrough-dp.html',        title: 'Walkthrough: A Hard DP Problem',           level: 'Mastery',       icon: '🏁', mins: 50, blurb: 'The same treatment for DP: find the state, kill the dimensions, and leave with a roadmap for the next year.' },
  ];

  const LEVELS = [
    ['Foundations', 'var(--accent)', 'The method, complexity, and the array/string/search patterns everything else rests on.'],
    ['Data Structures', 'color-mix(in srgb, var(--accent-2) 25%, var(--accent))', 'Every structure you will ever be asked to use or build, from linked lists to lazy segment trees.'],
    ['Graphs & Paradigms', 'color-mix(in srgb, var(--accent-2) 50%, var(--accent))', 'Graph algorithms end to end, plus backtracking, greedy and divide & conquer.'],
    ['DP & Advanced', 'color-mix(in srgb, var(--accent-2) 75%, var(--accent))', 'Dynamic programming in every shape, bit tricks, number theory and geometry.'],
    ['Mastery', 'var(--accent-2)', 'String algorithms, design problems, the pattern playbook, debugging and the interview itself.'],
  ];

  const LS = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  };
  const doneSet = () => new Set(LS.get('dsa-done', []));

  /* ---------------- helpers ---------------- */
  const SVGNS = 'http://www.w3.org/2000/svg';
  const DSA = {
    CHAPTERS, LEVELS, LS,
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
      const g = DSA.svg('g', { class: 'packet', style: `color:${color}` }, svg);
      const c = DSA.svg('circle', { r: o.r || 6, fill: color }, g);
      let t2;
      if (o.label) t2 = DSA.svg('text', { 'font-size': 10, 'text-anchor': 'middle', fill: color, 'font-weight': 700, text: o.label, style: 'font-family:var(--mono)' }, g);
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
      const p = DSA.center(svg, a), q = DSA.center(svg, b);
      return DSA.packet(svg, p.x, p.y, q.x, q.y, o);
    },
    /** animate along an existing <path> */
    packetAlong(svg, path, o = {}) {
      const len = path.getTotalLength();
      const dur = o.dur || 900;
      const g = DSA.svg('g', { class: 'packet', style: `color:${o.color || 'var(--accent)'}` }, svg);
      const c = DSA.svg('circle', { r: o.r || 6, fill: o.color || 'var(--accent)' }, g);
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
      let t = document.getElementById('dsa-toast');
      if (!t) {
        t = document.createElement('div'); t.id = 'dsa-toast';
        t.style.cssText = 'position:fixed;left:50%;bottom:26px;transform:translateX(-50%) translateY(20px);background:var(--text);color:var(--bg);padding:10px 18px;border-radius:12px;font-weight:600;font-size:14px;z-index:200;opacity:0;transition:.3s;pointer-events:none;box-shadow:var(--shadow-lg)';
        document.body.appendChild(t);
      }
      t.textContent = msg;
      requestAnimationFrame(() => { t.style.opacity = 1; t.style.transform = 'translateX(-50%)'; });
      clearTimeout(t._h);
      t._h = setTimeout(() => { t.style.opacity = 0; t.style.transform = 'translateX(-50%) translateY(20px)'; }, 2200);
    },
  };
  window.DSA = DSA;

  /* ---------------- theme ---------------- */
  function currentTheme() {
    const t = document.documentElement.getAttribute('data-theme');
    if (t) return t;
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function toggleTheme() {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    LS.set('dsa-theme', next);
    DSA.$$('.theme-btn').forEach((b) => (b.textContent = next === 'dark' ? '☀️' : '🌙'));
  }

  /* ---------------- shell ---------------- */
  const AUTHOR = 'Palak Deb Patra';

  function buildShell() {
    const body = document.body;
    if (!/Palak/.test(document.title)) document.title += ` · DSA Playlist by ${AUTHOR}`;
    const chapNum = +body.dataset.chapter || 0;
    const chap = CHAPTERS.find((c) => c.n === chapNum);
    const main = DSA.$('main.content');
    if (!main) return { chap };

    const progress = document.createElement('div');
    progress.className = 'read-progress';

    const layout = document.createElement('div'); layout.className = 'layout';
    const sidebar = document.createElement('aside'); sidebar.className = 'sidebar';
    const scrim = document.createElement('div'); scrim.className = 'scrim';
    const mainWrap = document.createElement('div'); mainWrap.className = 'main';

    // sidebar
    const done = doneSet();
    let html = `<a class="brand" href="index.html"><span class="brand-logo"><svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="4.3" r="2.1"/><circle cx="6.2" cy="11.7" r="2.1"/><circle cx="17.8" cy="11.7" r="2.1"/><circle cx="3.3" cy="19.5" r="1.6"/><circle cx="9.1" cy="19.5" r="1.6"/><path d="M10.7 5.9 7.5 10.1M13.3 5.9l3.2 4.2M5 13.4l-.9 4.5M7.4 13.4l.9 4.5"/></svg></span><span><span class="grad">DSA Playlist</span><br><small style="font-weight:500;color:var(--muted);font-size:12px">by Palak Deb Patra</small></span></a>
      <div class="side-progress"><div class="bar"><i style="width:${(done.size / CHAPTERS.length) * 100}%"></i></div><small>${done.size} of ${CHAPTERS.length} chapters complete</small></div>`;
    let lastLevel = '';
    for (const c of CHAPTERS) {
      if (c.level !== lastLevel) { html += `<div class="nav-level">${c.level}</div>`; lastLevel = c.level; }
      const cls = ['nav-link', done.has(c.n) ? 'done' : '', c.n === chapNum ? 'current' : ''].join(' ');
      html += `<a class="${cls}" href="${c.file}"><span class="num">${done.has(c.n) ? '✓' : c.n}</span><span>${c.title}</span></a>`;
      if (c.n === chapNum) html += `<nav class="toc" id="toc"></nav>`;
    }
    html += `<div class="nav-level">Study tools</div>
      <a class="nav-link study" href="glossary.html"><span class="num">📖</span><span>Glossary</span></a>
      <a class="nav-link study" href="flashcards.html"><span class="num">🃏</span><span>Flashcards</span></a>
      <a class="nav-link study" href="mock-interview.html"><span class="num">🎤</span><span>Mock interview</span></a>`;
    sidebar.innerHTML = html;
    const here = location.pathname.split('/').pop();
    DSA.$$('.nav-link.study', sidebar).forEach((a) => { if (a.getAttribute('href') === here) a.classList.add('current'); });

    // topbar
    const top = document.createElement('header'); top.className = 'topbar';
    const theme = currentTheme();
    top.innerHTML = `<button class="icon-btn menu-btn" aria-label="Menu">☰</button>
      <div class="crumb">${chap ? `<a href="index.html">Course</a> / Chapter ${chap.n} · <b>${chap.title}</b>` : '<b>DSA Playlist</b>'}</div>
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
    const h2s = DSA.$$('h2', main);
    h2s.forEach((h, i) => {
      if (!h.id) h.id = 's' + (i + 1) + '-' + h.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
      if (chap && !h.querySelector('.sec-num')) {
        const s = document.createElement('span'); s.className = 'sec-num'; s.textContent = `${chap.n}.${i + 1}`;
        h.prepend(s);
      }
      if (toc) {
        const a = document.createElement('a'); a.href = '#' + h.id;
        a.textContent = h.textContent.replace(/^\d+\.\d+/, '').trim();
        toc.appendChild(a);
        a.addEventListener('click', () => { DSA.$('.sidebar').classList.remove('open'); DSA.$('.scrim').classList.remove('show'); });
      }
    });
    if (!toc || !h2s.length) return;
    const links = DSA.$$('a', toc);
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
        ? `<p style="font-size:26px;margin:0">🎉</p><p><strong>Chapter ${chap.n} complete!</strong></p><button class="btn sm ghost" data-undo>Mark as not complete</button>`
        : `<p><strong>Finished this chapter?</strong><br><span class="muted small">Track your progress across the course.</span></p><button class="btn primary">✓ Mark chapter complete</button>`;
      box.querySelector('button').onclick = () => {
        const s = doneSet();
        if (isDone()) s.delete(chap.n); else { s.add(chap.n); DSA.toast('Nice work! Progress saved.'); }
        LS.set('dsa-done', [...s]);
        render();
        const side = DSA.$('.sidebar .nav-link.current .num');
        if (side) { side.textContent = isDone() ? '✓' : chap.n; side.parentElement.classList.toggle('done', isDone()); }
        const bar = DSA.$('.side-progress');
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
    DSA.$$('.tabs', root).forEach((tabs) => {
      if (tabs._init) return; tabs._init = true;
      const btns = DSA.$$(':scope > .tab-list > button', tabs);
      const panels = DSA.$$(':scope > .tab-panel', tabs);
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
    DSA.$$('.seg', root).forEach((seg) => {
      if (seg._init) return; seg._init = true;
      const btns = DSA.$$('button', seg);
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
    DSA.$$('.flip', root).forEach((f) => {
      if (f._init) return; f._init = true;
      f.setAttribute('tabindex', '0');
      const t = () => f.classList.toggle('flipped');
      f.addEventListener('click', t);
      f.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t(); } });
    });
  }

  function initSteppers(root = document) {
    DSA.$$('.stepper', root).forEach((st) => {
      if (st._init) return; st._init = true;
      const diagram = document.getElementById(st.dataset.diagram);
      const steps = DSA.$$('ol.steps > li', st);
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
      const title = DSA.$('.st-title', st), desc = DSA.$('.st-desc', st), count = DSA.$('.count', st);
      const dots = DSA.$$('.stepper-dots i', st);
      const playBtn = DSA.$('[data-a=play]', st);
      let idx = -1, playing = false, token = 0;

      const clear = () => { if (diagram) DSA.$$('.on', diagram).forEach((e) => e.classList.remove('on')); };
      async function go(i) {
        idx = DSA.clamp(i, -1, steps.length - 1);
        const my = ++token;
        clear();
        dots.forEach((d, j) => { d.classList.toggle('active', j === idx); d.classList.toggle('past', j < idx); });
        count.textContent = idx < 0 ? `${steps.length} steps` : `Step ${idx + 1} / ${steps.length}`;
        DSA.$('[data-a=prev]', st).disabled = idx < 0;
        DSA.$('[data-a=next]', st).disabled = idx >= steps.length - 1;
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
            if (ea && eb) await DSA.packetBetween(diagram, ea, eb, { color: li.dataset.color, dur: 650 });
          }
        }
      }
      async function play() {
        if (playing) { playing = false; playBtn.textContent = '▶ Play'; return; }
        playing = true; playBtn.textContent = '⏸ Pause';
        if (idx >= steps.length - 1) idx = -1;
        while (playing && idx < steps.length - 1) {
          await go(idx + 1);
          await DSA.sleep(+st.dataset.delay || 2300);
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
    const quizzes = DSA.$$('.quiz');
    if (!quizzes.length) return;
    let answered = 0, correct = 0;
    const scoreEl = DSA.$('.quiz-score');
    const update = () => {
      if (!scoreEl) return;
      scoreEl.innerHTML = `<span class="big">${correct}/${quizzes.length}</span><span>${answered < quizzes.length ? `Answered ${answered} of ${quizzes.length} — keep going!` : correct === quizzes.length ? 'Perfect score! You nailed this chapter. 🏆' : correct >= quizzes.length * .6 ? 'Solid! Review the ones you missed. 💪' : 'Worth a re-read of the sections above. 📚'}</span>`;
      if (answered === quizzes.length && chap) {
        const best = LS.get('dsa-quiz', {});
        best[chap.n] = Math.max(best[chap.n] || 0, correct / quizzes.length);
        LS.set('dsa-quiz', best);
      }
    };
    quizzes.forEach((q, qi) => {
      const qp = DSA.$('.q', q);
      if (qp && !qp.querySelector('.qn')) qp.insertAdjacentHTML('afterbegin', `<span class="qn">Q${qi + 1}</span>`);
      const opts = DSA.$$('.opt', q);
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
    const els = DSA.$$('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { threshold: 0.12 });
    els.forEach((e) => io.observe(e));
  }

  /** Run a callback only while an element is on screen (saves CPU for sims) */
  DSA.whenVisible = function (el, onShow, onHide) {
    if (!('IntersectionObserver' in window)) { onShow(); return; }
    new IntersectionObserver((ents) => ents.forEach((en) => (en.isIntersecting ? onShow() : onHide && onHide())), { threshold: 0.05 }).observe(el);
  };

  DSA.initComponents = function (root) { initTabs(root); initSeg(root); initFlips(root); initSteppers(root); };

  /* ---------------- command palette (Ctrl+K) ---------------- */
  function initPalette() {
    let box, input, list, results = [], sel = 0, loading = false;

    function build() {
      box = document.createElement('div');
      box.className = 'palette';
      box.innerHTML = `<div class="pal-inner" role="dialog" aria-label="Search the course">
          <div class="pal-top"><span>🔎</span><input id="pal-input" placeholder="Search 56 chapters — patterns, algorithms, code…" autocomplete="off" spellcheck="false"><kbd class="kbd">Esc</kbd></div>
          <div class="pal-list" id="pal-list"></div>
          <div class="pal-foot"><span><kbd class="kbd">↑</kbd><kbd class="kbd">↓</kbd> navigate · <kbd class="kbd">↵</kbd> open</span><span>tip: try “monotonic stack”, “Dijkstra”, “bitmask”, “KMP”</span></div>
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
      const idx = window.DSA_INDEX || [];
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
          <span class="pal-text"><b>${esc(r.t)}</b><small>Chapter ${r.n} · ${esc(r.ti)}</small></span>
          <span class="pal-lv">${r.lv}</span></a>`).join('');
      DSA.$$('.pal-item', list).forEach((el) => {
        el.addEventListener('mouseenter', () => { sel = +el.dataset.i; DSA.$$('.pal-item', list).forEach((x) => x.classList.toggle('sel', x === el)); });
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
      if (!window.DSA_INDEX) {
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
    DSA.$$('.search-btn').forEach((b) => (b.onclick = open));
    DSA.openSearch = open;
  }

  /* ---------------- boot ---------------- */
  const { chap, main } = buildShell();
  if (main) {
    buildToc(chap, main);
    buildFooter(chap, main);
    const credit = document.createElement('p');
    credit.className = 'muted small';
    credit.style.cssText = 'text-align:center;margin:44px 0 0';
    credit.innerHTML = `◆ <a href="index.html">${AUTHOR}'s DSA Playlist</a> · © 2026 ${AUTHOR}`;
    main.appendChild(credit);
  }
  DSA.chapter = chap;
  DSA.initComponents(document);
  initQuizzes(chap);
  initReveal();
  initPalette();
})();
