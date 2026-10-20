/* =========================================================
   Palak Deb Patra's Single Agent Playlist — shared runtime
   Builds the shell (sidebar, topbar, footer nav) and wires up
   generic components: tabs, steppers, quizzes, flip cards, seg controls.
   Exposes helpers on window.AGENT for chapter-specific visualizers.
   ========================================================= */
(function () {
  const CHAPTERS = [
    { n: 0.1, file: 'p1-python-for-agents.html',               title: 'Python for Agent Code', level: 'Prerequisites', icon: '🐍', mins: 40, blurb: 'The Python an agent is written in: type hints, dataclasses, async calls, subprocesses and scripts that can be rerun.' },
    { n: 0.2, file: 'p2-chat-messages-and-roles.html',         title: 'Chat Messages, Roles & Turns', level: 'Prerequisites', icon: '💬', mins: 35, blurb: 'System, user, assistant and tool messages: the transcript an agent keeps appending to, with a local model.' },
    { n: 0.3, file: 'p3-json-and-json-schema.html',            title: 'JSON & JSON Schema', level: 'Prerequisites', icon: '🧾', mins: 35, blurb: 'The format every tool call travels in: JSON types, schemas, required fields and validation errors.' },
    { n: 0.4, file: 'p4-tokens-and-cost.html',                 title: 'Tokens, Context & Cost', level: 'Prerequisites', icon: '🔤', mins: 35, blurb: 'Counting tokens, context windows, and why an agent\'s cost grows with every step it takes.' },
    { n: 0.5, file: 'p5-http-apis-and-errors.html',            title: 'Calling APIs: Timeouts, Retries & Rate Limits', level: 'Prerequisites', icon: '🌐', mins: 40, blurb: 'HTTP calls that fail the way real tools fail, and the timeouts, retries and backoff that keep a loop alive.' },
    { n: 0.6, file: 'p6-processes-and-isolation.html',         title: 'Processes, Files & Isolation Basics', level: 'Prerequisites', icon: '📦', mins: 40, blurb: 'What a process can touch: files, environment variables, network and the limits you can put on them.' },
    { n: 0.7, file: 'p7-state-machines-and-loops.html',        title: 'Loops, State Machines & Graphs', level: 'Prerequisites', icon: '🔁', mins: 35, blurb: 'States, transitions and termination: the control flow every agent framework is built on.' },
    { n: 0.8, file: 'p8-measuring-random-systems.html',        title: 'Measuring Systems That Vary', level: 'Prerequisites', icon: '📊', mins: 40, blurb: 'Success rates, repeated runs, confidence intervals and paired comparisons: how every claim in this course is checked.' },
    { n: 1, file: '01-what-an-agent-is.html',                title: 'What an Agent Is (and When Not to Build One)', level: 'Beginner', icon: '🤖', mins: 40, blurb: 'Fixed workflows vs a model that chooses its own steps, and the tasks where that freedom pays.' },
    { n: 2, file: '02-first-agent-loop.html',                title: 'Your First Agent Loop', level: 'Beginner', icon: '🛠️', mins: 45, blurb: 'A model, two tools and a loop in about a hundred lines, run end to end and measured.' },
    { n: 3, file: '03-tool-calling.html',                    title: 'Tool Calling', level: 'Beginner', icon: '🔧', mins: 45, blurb: 'Native tool calls vs parsing text, what the model really sees, and how often it calls tools correctly.' },
    { n: 4, file: '04-designing-tools.html',                 title: 'Designing Tools a Model Can Use', level: 'Beginner', icon: '🧰', mins: 40, blurb: 'Names, descriptions, arguments and return values: the interface design that decides whether a tool gets used right.' },
    { n: 5, file: '05-system-prompts-for-agents.html',       title: 'System Prompts & Instructions for Agents', level: 'Beginner', icon: '📝', mins: 40, blurb: 'Role, rules, tool guidance and examples: what belongs in an agent\'s prompt and what each part changes.' },
    { n: 6, file: '06-react.html',                           title: 'Reasoning and Acting: ReAct', level: 'Beginner', icon: '💭', mins: 40, blurb: 'Interleaving thoughts with actions, what the reasoning text buys, and reasoning models that think first.' },
    { n: 7, file: '07-stopping-and-limits.html',             title: 'Stopping, Step Limits & Loops', level: 'Beginner', icon: '🛑', mins: 35, blurb: 'How an agent decides it is done, why it repeats itself, and the limits that stop a runaway loop.' },
    { n: 8, file: '08-tool-errors-and-recovery.html',        title: 'Tool Errors & Recovery', level: 'Beginner', icon: '🩹', mins: 40, blurb: 'Timeouts, bad arguments and failing services: what the model should see, and when the code should retry instead.' },
    { n: 9, file: '09-structured-output.html',               title: 'Structured Output & Validation', level: 'Beginner', icon: '✅', mins: 40, blurb: 'JSON mode, schema-constrained decoding and validate-and-retry, measured on the same tasks.' },
    { n: 10, file: '10-the-growing-transcript.html',          title: 'The Growing Transcript', level: 'Beginner', icon: '📜', mins: 35, blurb: 'Every step adds to the prompt: tokens, latency and accuracy as an agent run gets longer.' },
    { n: 11, file: '11-context-engineering.html',             title: 'Context Engineering', level: 'Intermediate', icon: '🧱', mins: 45, blurb: 'Choosing what the model sees at each step: instructions, history, tool results and state, ordered and trimmed.' },
    { n: 12, file: '12-planning.html',                        title: 'Planning: Plan-then-Execute vs Step by Step', level: 'Intermediate', icon: '🗺️', mins: 45, blurb: 'Writing a plan first, following it, and replanning when an observation proves it wrong.' },
    { n: 13, file: '13-task-decomposition.html',              title: 'Task Decomposition & Subgoals', level: 'Intermediate', icon: '🧩', mins: 40, blurb: 'Breaking a large task into checked pieces, to-do lists the agent maintains, and tasks too large for one run.' },
    { n: 14, file: '14-reflection-and-self-correction.html',  title: 'Reflection & Self-Correction', level: 'Intermediate', icon: '🪞', mins: 40, blurb: 'Asking the agent to check its own work, and the difference between checking against a test and checking against itself.' },
    { n: 15, file: '15-short-term-memory.html',               title: 'Short-Term Memory: Summaries & Compaction', level: 'Intermediate', icon: '🗜️', mins: 40, blurb: 'Summarising old steps, keeping a scratchpad, and what gets lost when a long run is compacted.' },
    { n: 16, file: '16-long-term-memory.html',                title: 'Long-Term Memory Across Sessions', level: 'Intermediate', icon: '🧠', mins: 45, blurb: 'Writing facts to a store, recalling them later, updating and forgetting them, and memories that go wrong.' },
    { n: 17, file: '17-search-and-knowledge-tools.html',      title: 'Search & Knowledge Tools', level: 'Intermediate', icon: '🔎', mins: 40, blurb: 'Giving an agent search over documents and the web, and reading what comes back critically.' },
    { n: 18, file: '18-code-execution.html',                  title: 'Code Execution as a Tool', level: 'Intermediate', icon: '🐍', mins: 45, blurb: 'Letting the agent write and run code to compute, check and transform, and catching what goes wrong.' },
    { n: 19, file: '19-agents-over-apis-and-data.html',       title: 'Agents over APIs & Databases', level: 'Intermediate', icon: '🗄️', mins: 40, blurb: 'Wrapping real APIs and SQL as tools: pagination, write operations and read-only defaults.' },
    { n: 20, file: '20-model-context-protocol.html',          title: 'The Model Context Protocol (MCP)', level: 'Intermediate', icon: '🔌', mins: 45, blurb: 'Tools, resources and prompts served over a standard protocol: writing a server and connecting a client.' },
    { n: 21, file: '21-frameworks.html',                      title: 'Agent Frameworks vs Plain Code', level: 'Intermediate', icon: '🏗️', mins: 40, blurb: 'The same agent in plain Python and in a graph framework: what a framework gives you and what it hides.' },
    { n: 22, file: '22-choosing-a-model.html',                title: 'Choosing a Model for an Agent', level: 'Intermediate', icon: '⚖️', mins: 40, blurb: 'Small vs large, reasoning vs not, local vs hosted: tool-call accuracy, task success, latency and cost measured.' },
    { n: 23, file: '23-sandboxing.html',                      title: 'Sandboxing & Isolation', level: 'Advanced', icon: '🧪', mins: 45, blurb: 'Containers, restricted users, network rules and resource limits for code an agent writes and runs.' },
    { n: 24, file: '24-permissions-and-approval.html',        title: 'Permissions, Approval & Human in the Loop', level: 'Advanced', icon: '🙋', mins: 40, blurb: 'Which actions need a person, how to ask without asking too often, and least privilege for tools.' },
    { n: 25, file: '25-prompt-injection-against-agents.html', title: 'Prompt Injection Against Agents', level: 'Advanced', icon: '🛡️', mins: 45, blurb: 'Instructions hidden in web pages, files and tool results, and why an agent that can act raises the stakes.' },
    { n: 26, file: '26-guardrails-and-policies.html',         title: 'Guardrails & Policy Checks', level: 'Advanced', icon: '🚧', mins: 40, blurb: 'Checks on inputs, tool calls and outputs, in code and by model, and what each kind catches.' },
    { n: 27, file: '27-evaluating-agents.html',               title: 'Evaluating Agents: Outcomes & Trajectories', level: 'Advanced', icon: '📏', mins: 45, blurb: 'Did it finish the task, and did it get there sensibly? Outcome checks, trajectory checks and model judges.' },
    { n: 28, file: '28-building-an-agent-benchmark.html',     title: 'Building an Agent Benchmark', level: 'Advanced', icon: '🧪', mins: 45, blurb: 'Tasks with checkable end states, environments that reset, and keeping a benchmark honest.' },
    { n: 29, file: '29-reliability.html',                     title: 'Reliability: pass@k, pass^k & Variance', level: 'Advanced', icon: '🎲', mins: 40, blurb: 'Why an agent that succeeds once may fail the next time, and measuring consistency rather than luck.' },
    { n: 30, file: '30-latency-and-parallel-tools.html',      title: 'Latency & Parallel Tool Calls', level: 'Advanced', icon: '⚡', mins: 40, blurb: 'Where an agent run spends its time, parallel tool calls, streaming and smaller models for small steps.' },
    { n: 31, file: '31-cost-and-budgets.html',                title: 'Cost Control & Budgets', level: 'Advanced', icon: '💰', mins: 40, blurb: 'Tokens per task, runaway runs and the budgets, caching and model choices that keep the bill predictable.' },
    { n: 32, file: '32-long-running-agents.html',             title: 'Long-Running Agents: Checkpoints & Resumption', level: 'Advanced', icon: '⏳', mins: 45, blurb: 'Agents that work for hours: saving state, resuming after a crash, and handing progress to a fresh context.' },
    { n: 33, file: '33-coding-agents.html',                   title: 'Coding Agents: Read, Edit, Test', level: 'Advanced', icon: '💻', mins: 45, blurb: 'Finding the right code, editing it safely, running the tests and knowing when the change is done.' },
    { n: 34, file: '34-computer-use-agents.html',             title: 'Browser & Computer-Use Agents', level: 'Advanced', icon: '🖱️', mins: 45, blurb: 'Agents that read pages and click: accessibility trees vs screenshots, and why GUIs are hard.' },
    { n: 35, file: '35-production-architecture.html',         title: 'Production Agent Architecture', level: 'Expert', icon: '🏛️', mins: 45, blurb: 'The services, queues, sandboxes, stores and guards around an agent that real users depend on.' },
    { n: 36, file: '36-observability-and-tracing.html',       title: 'Observability & Tracing Agent Runs', level: 'Expert', icon: '📡', mins: 40, blurb: 'Tracing every step and tool call, what to log, and turning failed runs into test cases.' },
    { n: 37, file: '37-debugging-agents.html',                title: 'Debugging a Failing Agent', level: 'Expert', icon: '🐞', mins: 45, blurb: 'Was it the prompt, a tool, the context, the model or the environment? A method for finding out.' },
    { n: 38, file: '38-fine-tuning-for-tools.html',           title: 'Fine-Tuning a Model for Tool Use', level: 'Expert', icon: '🎛️', mins: 45, blurb: 'Training a small model on tool-call traces with LoRA, and checking it helped without breaking anything else.' },
    { n: 39, file: '39-agent-safety.html',                    title: 'Agent Safety & Misbehaviour', level: 'Expert', icon: '⚠️', mins: 40, blurb: 'Agents that game their checks, overreach their task or claim success they did not reach, and how to catch it.' },
    { n: 40, file: '40-interview-playbook.html',              title: 'The Agent Interview Playbook', level: 'Expert', icon: '🎤', mins: 45, blurb: 'Design rounds, concept questions and debugging scenarios for agent engineering interviews, with a framework.' },
    { n: 41, file: '41-case-support-agent.html',              title: 'Case Study: A Customer-Support Agent with Refund Powers', level: 'Case Studies', icon: '🎧', mins: 45, blurb: 'An agent that can look up orders and issue refunds: tools, limits, approvals and escalation.' },
    { n: 42, file: '42-case-replit-database-deletion.html',   title: 'Case Study: The Agent That Deleted a Production Database', level: 'Case Studies', icon: '💥', mins: 35, blurb: 'A coding agent ran destructive commands during a code freeze and then misreported it: permissions and environments.' },
    { n: 43, file: '43-case-dollar-car-chatbot.html',         title: 'Case Study: The One-Dollar Car', level: 'Case Studies', icon: '🚗', mins: 30, blurb: 'Users talked a dealership chatbot into "legally binding" offers: authority, instructions and what an agent may promise.' },
    { n: 44, file: '44-case-swe-agent.html',                  title: 'Case Study: SWE-agent and Real GitHub Issues', level: 'Case Studies', icon: '🧑‍💻', mins: 45, blurb: 'How an agent-computer interface made a coding agent solve real issues, and what SWE-bench measures.' },
    { n: 45, file: '45-case-deep-research-agent.html',        title: 'Case Study: A Deep-Research Agent', level: 'Case Studies', icon: '📚', mins: 45, blurb: 'Searching, reading and writing a cited report over dozens of steps: planning, context and verification.' },
    { n: 46, file: '46-case-data-analysis-agent.html',        title: 'Case Study: A Data-Analysis Agent', level: 'Case Studies', icon: '📈', mins: 40, blurb: 'An agent that queries data, runs code and charts results: sandboxed execution and trustworthy numbers.' },
    { n: 47, file: '47-case-browser-agent.html',              title: 'Case Study: A Browser Agent That Books Travel', level: 'Case Studies', icon: '🧳', mins: 40, blurb: 'Navigating real sites, filling forms and stopping before payment: computer use under constraints.' },
    { n: 48, file: '48-case-voyager.html',                    title: 'Case Study: Voyager and a Skill Library', level: 'Case Studies', icon: '⛏️', mins: 40, blurb: 'A Minecraft agent that wrote, tested and reused its own skills as code: open-ended learning without training.' },
  ];

  const LEVELS = [
    ['Prerequisites', 'var(--green)', 'Python, chat messages, JSON Schema, tokens and cost, calling APIs, processes and isolation, state machines and measuring systems that vary.'],
    ['Beginner', 'var(--accent)', 'What an agent is, a first loop, tool calling and tool design, prompts, ReAct, stopping, errors, structured output and the growing transcript.'],
    ['Intermediate', 'color-mix(in srgb, var(--accent-2) 25%, var(--accent))', 'Context engineering, planning, decomposition, reflection, memory, search, code and data tools, MCP, frameworks and choosing a model.'],
    ['Advanced', 'color-mix(in srgb, var(--accent-2) 50%, var(--accent))', 'Sandboxing, approvals, prompt injection, guardrails, evaluation, benchmarks, reliability, latency, cost, long runs, coding and computer-use agents.'],
    ['Expert', 'color-mix(in srgb, var(--accent-2) 75%, var(--accent))', 'Production architecture, tracing, debugging, fine-tuning for tool use, agent safety and the interview playbook.'],
    ['Case Studies', 'var(--accent-2)', 'Eight real agents and failures, from a deleted production database to a Minecraft skill library.'],
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
    const d = LS.get('agent-done', []);
    if (!Array.isArray(d) || !d.includes(0)) return;
    const pre = CHAPTERS.filter((c) => isPre(c.n)).map((c) => c.n);
    LS.set('agent-done', [...new Set(d.filter((n) => n !== 0).concat(pre))]);
    const q = LS.get('agent-quiz', {}); delete q[0]; LS.set('agent-quiz', q);
  })();
  const doneSet = () => new Set(LS.get('agent-done', []));

  /* ---------------- helpers ---------------- */
  const SVGNS = 'http://www.w3.org/2000/svg';
  const AGENT = {
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
      const g = AGENT.svg('g', { class: 'packet', style: `color:${color}` }, svg);
      const c = AGENT.svg('circle', { r: o.r || 6, fill: color }, g);
      let t2;
      if (o.label) t2 = AGENT.svg('text', { 'font-size': 10, 'text-anchor': 'middle', fill: color, 'font-weight': 700, text: o.label, style: 'font-family:var(--mono)' }, g);
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
      const p = AGENT.center(svg, a), q = AGENT.center(svg, b);
      return AGENT.packet(svg, p.x, p.y, q.x, q.y, o);
    },
    /** animate along an existing <path> */
    packetAlong(svg, path, o = {}) {
      const len = path.getTotalLength();
      const dur = o.dur || 900;
      const g = AGENT.svg('g', { class: 'packet', style: `color:${o.color || 'var(--accent)'}` }, svg);
      const c = AGENT.svg('circle', { r: o.r || 6, fill: o.color || 'var(--accent)' }, g);
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
      let t = document.getElementById('agent-toast');
      if (!t) {
        t = document.createElement('div'); t.id = 'agent-toast';
        t.style.cssText = 'position:fixed;left:50%;bottom:26px;transform:translateX(-50%) translateY(20px);background:var(--text);color:var(--bg);padding:10px 18px;border-radius:12px;font-weight:600;font-size:14px;z-index:200;opacity:0;transition:.3s;pointer-events:none;box-shadow:var(--shadow-lg)';
        document.body.appendChild(t);
      }
      t.textContent = msg;
      requestAnimationFrame(() => { t.style.opacity = 1; t.style.transform = 'translateX(-50%)'; });
      clearTimeout(t._h);
      t._h = setTimeout(() => { t.style.opacity = 0; t.style.transform = 'translateX(-50%) translateY(20px)'; }, 2200);
    },
  };
  window.AGENT = AGENT;

  /* ---------------- theme ---------------- */
  function currentTheme() {
    const t = document.documentElement.getAttribute('data-theme');
    if (t) return t;
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function toggleTheme() {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    LS.set('agent-theme', next);
    AGENT.$$('.theme-btn').forEach((b) => (b.textContent = next === 'dark' ? '☀️' : '🌙'));
  }

  /* ---------------- shell ---------------- */
  const AUTHOR = 'Palak Deb Patra';
  const ATLAS_WORDMARK = '<svg class="atlas-wordmark" viewBox="0 0 102 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><text x="1" y="25" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="800" letter-spacing="-1.3" fill="currentColor">Engg<tspan class="gold">A</tspan></text></svg>';

  function buildShell() {
    const body = document.body;
    if (!/Palak/.test(document.title)) document.title += ` · Single Agent by ${AUTHOR}`;
    const chapNum = body.dataset.chapter == null ? -1 : +body.dataset.chapter;   // -1 = not a chapter page (prerequisites are 0.1…0.8)
    const chap = CHAPTERS.find((c) => c.n === chapNum);
    const main = AGENT.$('main.content');
    if (!main) return { chap };

    const progress = document.createElement('div');
    progress.className = 'read-progress';

    const layout = document.createElement('div'); layout.className = 'layout';
    const sidebar = document.createElement('aside'); sidebar.className = 'sidebar';
    const scrim = document.createElement('div'); scrim.className = 'scrim';
    const mainWrap = document.createElement('div'); mainWrap.className = 'main';

    // sidebar
    const done = doneSet();
    let html = `<a class="brand" href="index.html"><span class="brand-logo"><svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="2.8"/><path d="M12 3.5a8.5 8.5 0 1 1-8.1 5.9"/><path d="M3.4 4.4l.5 5 5-.5"/></svg></span><span><span class="brand-author">Palak Deb Patra</span><span class="grad brand-course">Single Agent Playlist</span></span></a>
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
    AGENT.$$('.nav-link.study', sidebar).forEach((a) => { if (a.getAttribute('href') === here) a.classList.add('current'); });

    // topbar
    const top = document.createElement('header'); top.className = 'topbar';
    const theme = currentTheme();
    top.innerHTML = `<button class="icon-btn menu-btn" aria-label="Menu">☰</button>
      <div class="crumb"><a class="atlas-home" href="../index.html" aria-label="Engineering Atlas home">${ATLAS_WORDMARK}</a> / ${chap ? `<a href="index.html">Course</a> / ${chName(chap)} · <b>${chap.title}</b>` : '<b>Single Agent</b>'}</div>
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
    const h2s = AGENT.$$('h2', main);
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
        a.addEventListener('click', () => { AGENT.$('.sidebar').classList.remove('open'); AGENT.$('.scrim').classList.remove('show'); });
      }
    });
    if (!toc || !h2s.length) return;
    const links = AGENT.$$('a', toc);
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
        if (isDone()) s.delete(chap.n); else { s.add(chap.n); AGENT.toast('Nice work! Progress saved.'); }
        LS.set('agent-done', [...s]);
        render();
        const side = AGENT.$('.sidebar .nav-link.current .num');
        if (side) { side.textContent = isDone() ? '✓' : chNum(chap); side.parentElement.classList.toggle('done', isDone()); }
        const bar = AGENT.$('.side-progress');
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
    AGENT.$$('.tabs', root).forEach((tabs) => {
      if (tabs._init) return; tabs._init = true;
      const btns = AGENT.$$(':scope > .tab-list > button', tabs);
      const panels = AGENT.$$(':scope > .tab-panel', tabs);
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
    AGENT.$$('.seg', root).forEach((seg) => {
      if (seg._init) return; seg._init = true;
      const btns = AGENT.$$('button', seg);
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
    AGENT.$$('.flip', root).forEach((f) => {
      if (f._init) return; f._init = true;
      f.setAttribute('tabindex', '0');
      const t = () => f.classList.toggle('flipped');
      f.addEventListener('click', t);
      f.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t(); } });
    });
  }

  function initSteppers(root = document) {
    AGENT.$$('.stepper', root).forEach((st) => {
      if (st._init) return; st._init = true;
      const diagram = document.getElementById(st.dataset.diagram);
      const steps = AGENT.$$('ol.steps > li', st);
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
      const title = AGENT.$('.st-title', st), desc = AGENT.$('.st-desc', st), count = AGENT.$('.count', st);
      const dots = AGENT.$$('.stepper-dots i', st);
      const playBtn = AGENT.$('[data-a=play]', st);
      let idx = -1, playing = false, token = 0;

      const clear = () => { if (diagram) AGENT.$$('.on', diagram).forEach((e) => e.classList.remove('on')); };
      async function go(i) {
        idx = AGENT.clamp(i, -1, steps.length - 1);
        const my = ++token;
        clear();
        dots.forEach((d, j) => { d.classList.toggle('active', j === idx); d.classList.toggle('past', j < idx); });
        count.textContent = idx < 0 ? `${steps.length} steps` : `Step ${idx + 1} / ${steps.length}`;
        AGENT.$('[data-a=prev]', st).disabled = idx < 0;
        AGENT.$('[data-a=next]', st).disabled = idx >= steps.length - 1;
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
            if (ea && eb) await AGENT.packetBetween(diagram, ea, eb, { color: li.dataset.color, dur: 650 });
          }
        }
      }
      async function play() {
        if (playing) { playing = false; playBtn.textContent = '▶ Play'; return; }
        playing = true; playBtn.textContent = '⏸ Pause';
        if (idx >= steps.length - 1) idx = -1;
        while (playing && idx < steps.length - 1) {
          await go(idx + 1);
          await AGENT.sleep(+st.dataset.delay || 2300);
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
    const quizzes = AGENT.$$('.quiz');
    if (!quizzes.length) return;
    let answered = 0, correct = 0;
    const scoreEl = AGENT.$('.quiz-score');
    const update = () => {
      if (!scoreEl) return;
      scoreEl.innerHTML = `<span class="big">${correct}/${quizzes.length}</span><span>${answered < quizzes.length ? `Answered ${answered} of ${quizzes.length} — keep going!` : correct === quizzes.length ? 'Perfect score! You nailed this chapter. 🏆' : correct >= quizzes.length * .6 ? 'Solid! Review the ones you missed. 💪' : 'Worth a re-read of the sections above. 📚'}</span>`;
      if (answered === quizzes.length && chap) {
        const best = LS.get('agent-quiz', {});
        best[chap.n] = Math.max(best[chap.n] || 0, correct / quizzes.length);
        LS.set('agent-quiz', best);
      }
    };
    quizzes.forEach((q, qi) => {
      const qp = AGENT.$('.q', q);
      if (qp && !qp.querySelector('.qn')) qp.insertAdjacentHTML('afterbegin', `<span class="qn">Q${qi + 1}</span>`);
      const opts = AGENT.$$('.opt', q);
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
    const els = AGENT.$$('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { threshold: 0.12 });
    els.forEach((e) => io.observe(e));
  }

  /** Run a callback only while an element is on screen (saves CPU for sims) */
  AGENT.whenVisible = function (el, onShow, onHide) {
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
    AGENT.$$('figure.seq', root).forEach((fig) => {
      if (fig._init) return; fig._init = true;
      const actors = (fig.dataset.actors || '').split('|').map((s) => s.trim());
      const items = AGENT.$$(':scope > ol > li', fig).map((li) => {
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
      const svg = AGENT.svg('svg', { viewBox: `0 0 ${W} ${H}`, width: W, class: 'seq-svg', role: 'img', 'aria-label': 'Sequence diagram: ' + actors.join(', ') });
      svg.style.minWidth = Math.round(W * 0.82) + 'px';   // shrink to fit, but never below ~82%: scroll instead
      wrap.appendChild(svg);
      const defs = AGENT.svg('defs', {}, svg);
      const uid = 'sq' + Math.random().toString(36).slice(2, 8);
      [['h', 'var(--text-2)'], ['r', 'var(--red)'], ['a', 'var(--accent)']].forEach(([k, col]) => {
        const mk = AGENT.svg('marker', { id: uid + k, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' }, defs);
        AGENT.svg('path', { d: 'M0,0 L10,5 L0,10 z', fill: col }, mk);
      });
      actors.forEach((name, i) => {
        AGENT.svg('line', { x1: X(i), y1: TOP, x2: X(i), y2: H - 10, class: 'seq-life' }, svg);
        const g = AGENT.svg('g', { class: 'seq-actor' }, svg);
        const w = Math.max(70, name.length * 7.4 + 22);
        AGENT.svg('rect', { x: X(i) - w / 2, y: 12, width: w, height: 34, rx: 9 }, g);
        AGENT.svg('text', { x: X(i), y: 34, 'text-anchor': 'middle', text: name }, g);
      });
      const els = items.map((it, k) => {
        const g = AGENT.svg('g', { class: 'seq-msg k-' + it.kind }, svg);
        const yy = ys[k];
        if (it.note) {
          const x1 = X(Math.min(it.a, it.b)) - 56, x2 = X(Math.max(it.a, it.b)) + 56;
          AGENT.svg('rect', { x: x1, y: yy - 12, width: x2 - x1, height: 28, rx: 6, class: 'seq-note' }, g);
          AGENT.svg('text', { x: (x1 + x2) / 2, y: yy + 6, 'text-anchor': 'middle', text: it.label }, g);
          return { g, path: null };
        }
        let d;
        if (it.a === it.b) d = `M${X(it.a)},${yy} h44 v22 h-40`;
        else d = `M${X(it.a) + (it.b > it.a ? 4 : -4)},${yy + 8} L${X(it.b) + (it.b > it.a ? -6 : 6)},${yy + 8}`;
        const mk = it.kind === 'fail' || it.kind === 'bad' ? 'r' : 'h';
        const p = AGENT.svg('path', { d, class: 'seq-arrow', 'marker-end': it.kind === 'fail' ? '' : `url(#${uid}${mk})` }, g);
        if (it.kind === 'fail') {
          const ex = X(it.b) + (it.b > it.a ? -12 : 12);
          AGENT.svg('path', { d: `M${ex - 6},${yy + 2} l12,12 M${ex + 6},${yy + 2} l-12,12`, class: 'seq-x' }, g);
        }
        const tx = it.a === it.b ? X(it.a) + 52 : (X(it.a) + X(it.b)) / 2;
        AGENT.svg('text', { x: tx, y: it.a === it.b ? yy + 15 : yy, 'text-anchor': it.a === it.b ? 'start' : 'middle', text: it.label, class: 'seq-label' }, g);
        const nx = X(it.a) + (it.a === it.b || it.b > it.a ? -13 : 13), ny = it.a === it.b ? yy + 11 : yy + 8;
        AGENT.svg('circle', { cx: nx, cy: ny, r: 8, class: 'seq-badge' }, g);
        AGENT.svg('text', { x: nx, y: ny + 3.5, 'text-anchor': 'middle', text: String(k + 1), class: 'seq-num' }, g);
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
        idx = AGENT.clamp(i, -1, items.length - 1);
        const my = ++tok;
        els.forEach((e, j) => { e.g.classList.toggle('shown', j <= idx); e.g.classList.toggle('cur', j === idx); });
        fig.classList.toggle('seq-started', idx >= 0);
        if (idx < 0) { stepEl.textContent = `▶ Press Play to animate the ${items.length} steps`; detEl.innerHTML = ''; return; }
        const it = items[idx];
        stepEl.textContent = `${idx + 1}/${items.length} · ${it.note ? '' : actors[it.a] + (it.a === it.b ? '' : ' → ' + actors[it.b]) + ': '}${it.label}`;
        detEl.innerHTML = it.detail;
        const p = els[idx].path;
        svg.querySelectorAll('.packet').forEach((x) => x.remove());
        if (animate && p && my === tok) AGENT.packetAlong(svg, p, { dur: 520, r: 5, color: it.kind === 'fail' || it.kind === 'bad' ? 'var(--red)' : 'var(--accent)' });
      }
      async function play() {
        if (playing) { playing = false; playBtn.textContent = '▶ Play'; return; }
        playing = true; playBtn.textContent = '⏸ Pause';
        if (idx >= items.length - 1) show(-1);
        while (playing && idx < items.length - 1) { show(idx + 1, true); await AGENT.sleep(+fig.dataset.delay || 1500); }
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
      AGENT.whenVisible(fig, () => { if (!auto && !matchMedia('(prefers-reduced-motion: reduce)').matches) { auto = true; play(); } });
    });
  }

  function initFlow(root = document) {
    AGENT.$$('figure.flow', root).forEach((fig) => {
      if (fig._init) return; fig._init = true;
      const lis = AGENT.$$(':scope > ol > li', fig);
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
      AGENT.whenVisible(fig, () => {
        fig._vis = true;
        if (!timer && !matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(tick, 1100);
      }, () => { fig._vis = false; clearInterval(timer); timer = null; });
    });
  }
  /* <<< shared visuals */

  AGENT.initComponents = function (root) { initTabs(root); initSeg(root); initFlips(root); initSteppers(root); initSeq(root); initFlow(root); };

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
      const idx = window.AGENT_INDEX || [];
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
      AGENT.$$('.pal-item', list).forEach((el) => {
        el.addEventListener('mouseenter', () => { sel = +el.dataset.i; AGENT.$$('.pal-item', list).forEach((x) => x.classList.toggle('sel', x === el)); });
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
      if (!window.AGENT_INDEX) {
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
    AGENT.$$('.search-btn').forEach((b) => (b.onclick = open));
    AGENT.openSearch = open;
  }

  /* ---------------- boot ---------------- */
  const { chap, main } = buildShell();
  if (main) {
    buildToc(chap, main);
    buildFooter(chap, main);
    const credit = document.createElement('p');
    credit.className = 'muted small';
    credit.style.cssText = 'text-align:center;margin:44px 0 0';
    credit.innerHTML = `◆ <a href="index.html">${AUTHOR}'s Single Agent Playlist</a> · © 2026 ${AUTHOR}`;
    main.appendChild(credit);
  }
  AGENT.chapter = chap;
  AGENT.initComponents(document);
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
