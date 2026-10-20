/* =========================================================
   tools/chapters.cjs — the Multi-Agent Systems chapter plan.

   Source for tools/scaffold.cjs, which writes the CHAPTERS
   registry into assets/app.js and creates a placeholder page
   for every chapter that doesn't exist yet. Once a chapter is
   written, assets/app.js is the source of truth for its
   title/blurb; `cover` is only the planned outline.
   DRAFT (2026-10-20): waiting for the owner's approval; changes
   welcome before chapters are written. A shorter course by the
   owner's choice (~30 lessons): P1–P4 + 26 chapters.
   Scope: several agents working together: when that beats one
   agent, orchestration patterns, hand-offs, shared state, agent
   protocols, coordination failures, cost and evaluation.
   Where other courses go deeper it links rather than re-teaches:
   Single Agent (the loop, tools, memory, sandboxing, evaluating
   one agent), Distributed Systems (consensus, failures, queues),
   RAG (retrieval).
   Code: Python with asyncio and a local model through Ollama;
   every simulator is measured.
   ========================================================= */
'use strict';

const P = 'Prerequisites', B = 'Beginner', I = 'Intermediate', A = 'Advanced', E = 'Expert', CS = 'Case Studies';

module.exports = [
  // ---------- Prerequisites ----------
  { n: 0.1, slug: 'p1-one-agent-recap', title: 'One Agent in One Page', level: P, icon: '🤖', mins: 35,
    blurb: 'The loop, tools, context and stopping from the Single Agent course, compressed into what this course assumes.',
    cover: ['The agent loop', 'Tools', 'Context', 'Stopping', 'Measuring an agent'] },
  { n: 0.2, slug: 'p2-asyncio', title: 'Concurrency with asyncio', level: P, icon: '⚙️', mins: 40,
    blurb: 'Running several model calls at once: tasks, gather, timeouts and cancellation, measured against a local model.',
    cover: ['Coroutines and tasks', 'gather and as_completed', 'Timeouts', 'Cancellation', 'Concurrency limits'] },
  { n: 0.3, slug: 'p3-messages-and-queues', title: 'Messages, Queues & Events', level: P, icon: '📬', mins: 35,
    blurb: 'Message passing, queues and publish–subscribe: the plumbing agents talk through.',
    cover: ['Messages vs shared state', 'Queues', 'Publish–subscribe', 'Ordering', 'Delivery guarantees'] },
  { n: 0.4, slug: 'p4-failure-in-distributed-work', title: 'Failure in Distributed Work', level: P, icon: '🧯', mins: 35,
    blurb: 'Timeouts, partial failure, retries and idempotency: what goes wrong when work is split across workers.',
    cover: ['Partial failure', 'Timeouts', 'Retries', 'Idempotency', 'Cascading failure'] },

  // ---------- Beginner ----------
  { n: 1, slug: '01-why-multiple-agents', title: 'Why More Than One Agent (and When Not)', level: B, icon: '👥', mins: 40,
    blurb: 'Parallel work, separate contexts and specialisation vs the cost and coordination they bring, measured against one agent.',
    cover: ['What one agent runs out of', 'Separate contexts', 'Parallel work', 'The coordination tax', 'When one agent wins'] },
  { n: 2, slug: '02-first-two-agent-system', title: 'Your First Two-Agent System', level: B, icon: '🛠️', mins: 45,
    blurb: 'A writer and a reviewer passing work back and forth, in plain Python, run end to end and measured.',
    cover: ['Two loops', 'Passing messages', 'Turn-taking', 'Stopping', 'Was it better than one?'] },
  { n: 3, slug: '03-roles-and-specialisation', title: 'Roles & Specialisation', level: B, icon: '🎭', mins: 40,
    blurb: 'Role prompts, specialised tool sets and what a "role" changes in the model\'s behaviour.',
    cover: ['Role prompts', 'Specialised tools', 'Different models per role', 'Role drift', 'Measuring specialisation'] },
  { n: 4, slug: '04-orchestrator-worker', title: 'Orchestrator and Workers', level: B, icon: '🎯', mins: 45,
    blurb: 'A lead agent that splits a task, sends pieces to workers and combines what comes back.',
    cover: ['The lead agent', 'Writing task briefs', 'Dispatching workers', 'Combining results', 'Where it breaks'] },
  { n: 5, slug: '05-hand-offs', title: 'Hand-offs Between Agents', level: B, icon: '🤝', mins: 40,
    blurb: 'Passing a conversation or task to another agent: what context travels with it and what gets lost.',
    cover: ['Transfer of control', 'What context to pass', 'Hand-off as a tool', 'Lost context', 'Handing back'] },
  { n: 6, slug: '06-communication', title: 'Messages vs Shared State', level: B, icon: '📨', mins: 40,
    blurb: 'Agents talking directly, through a shared transcript, or through a shared store, and what each costs in tokens.',
    cover: ['Direct messages', 'A shared transcript', 'A shared store', 'Token cost of talking', 'Choosing'] },

  // ---------- Intermediate ----------
  { n: 7, slug: '07-pipelines-and-routing', title: 'Pipelines & Routing', level: I, icon: '🔀', mins: 40,
    blurb: 'Fixed chains of agents and routers that pick which agent handles a request, and how errors flow down a chain.',
    cover: ['Sequential pipelines', 'Routers', 'Errors down the chain', 'Checks between stages', 'Workflows vs agents'] },
  { n: 8, slug: '08-parallel-fan-out', title: 'Parallel Fan-Out & Aggregation', level: I, icon: '🌿', mins: 45,
    blurb: 'Running many agents at once on independent pieces, then merging, deduplicating and resolving conflicts.',
    cover: ['Independent subtasks', 'Running in parallel', 'Merging results', 'Conflicts and duplicates', 'Speed-up vs cost'] },
  { n: 9, slug: '09-critique-and-debate', title: 'Critique & Debate', level: I, icon: '🗣️', mins: 40,
    blurb: 'Generator–critic loops and agents arguing to an answer: when a second opinion helps and when it just agrees.',
    cover: ['Generator and critic', 'Multi-agent debate', 'Sycophancy between agents', 'Judges', 'Measuring the lift'] },
  { n: 10, slug: '10-voting-and-ensembles', title: 'Voting & Ensembles', level: I, icon: '🗳️', mins: 35,
    blurb: 'Sampling several answers and voting, mixing models, and how much accuracy each extra agent buys.',
    cover: ['Self-consistency', 'Majority vote', 'Mixing models', 'Diminishing returns', 'Correlated mistakes'] },
  { n: 11, slug: '11-shared-memory', title: 'Shared Memory & Blackboards', level: I, icon: '📋', mins: 40,
    blurb: 'A common workspace several agents read and write: structure, conflicts and stale reads.',
    cover: ['Blackboards', 'Structured shared state', 'Concurrent writes', 'Stale reads', 'Artefacts on disk'] },
  { n: 12, slug: '12-agent-protocols', title: 'Agent Protocols: MCP & A2A', level: I, icon: '🔌', mins: 45,
    blurb: 'MCP for tools, Agent2Agent for agents: discovery, tasks and messages across process and company boundaries.',
    cover: ['Why protocols', 'MCP in one page', 'Agent cards and discovery', 'Tasks and messages', 'Trust across boundaries'] },
  { n: 13, slug: '13-frameworks', title: 'Multi-Agent Frameworks Compared', level: I, icon: '🏗️', mins: 40,
    blurb: 'One task built in plain asyncio and in graph- and conversation-based frameworks: what each makes easy or hides.',
    cover: ['Plain code', 'Graph-based', 'Conversation-based', 'Role/crew-based', 'Choosing'] },

  // ---------- Advanced ----------
  { n: 14, slug: '14-coordination-failures', title: 'Coordination Failures', level: A, icon: '💥', mins: 45,
    blurb: 'Agents that loop, repeat each other, ignore input or stop early: a taxonomy of how multi-agent runs fail.',
    cover: ['Specification failures', 'Misalignment between agents', 'Verification failures', 'Loops and deadlocks', 'Measuring failure rates'] },
  { n: 15, slug: '15-context-isolation', title: 'Context Isolation & Information Loss', level: A, icon: '🧊', mins: 40,
    blurb: 'Separate contexts keep agents focused but hide decisions from each other: what to share and what to summarise.',
    cover: ['Why isolate', 'What workers never see', 'Conflicting decisions', 'Summaries between agents', 'Shared decision logs'] },
  { n: 16, slug: '16-cost-and-latency', title: 'Cost & Latency of Many Agents', level: A, icon: '💰', mins: 40,
    blurb: 'Tokens multiply with every agent: measuring cost and wall-clock time against the quality gained.',
    cover: ['Tokens per agent', 'Wall-clock vs total time', 'Concurrency limits', 'Smaller models for workers', 'When it pays'] },
  { n: 17, slug: '17-trust-and-security', title: 'Trust & Security Between Agents', level: A, icon: '🛡️', mins: 45,
    blurb: 'Injection that spreads from agent to agent, privilege between agents and keeping the blast radius small.',
    cover: ['Injection that spreads', 'Privilege per agent', 'Untrusted agents', 'Isolation', 'Testing attacks'] },
  { n: 18, slug: '18-evaluating-multi-agent-systems', title: 'Evaluating Multi-Agent Systems', level: A, icon: '📏', mins: 45,
    blurb: 'End-to-end success, per-agent contribution, and comparing against a strong single-agent baseline.',
    cover: ['End-to-end outcomes', 'Per-agent checks', 'The single-agent baseline', 'Variance', 'Cost-adjusted results'] },
  { n: 19, slug: '19-humans-in-the-team', title: 'Humans in a Team of Agents', level: A, icon: '🙋', mins: 35,
    blurb: 'Where a person reviews, approves or steers, and how to show them what several agents did.',
    cover: ['Checkpoints for people', 'Approvals', 'Steering mid-run', 'Explaining a run', 'Workload'] },
  { n: 20, slug: '20-simulations-and-agent-societies', title: 'Simulations & Agent Societies', level: A, icon: '🏘️', mins: 40,
    blurb: 'Many agents as simulated users, markets or players: what simulations show and where they mislead.',
    cover: ['Simulated users', 'Emergent behaviour', 'Testing with simulated users', 'Scale', 'Limits of simulation'] },

  // ---------- Expert ----------
  { n: 21, slug: '21-production-architecture', title: 'Production Multi-Agent Architecture', level: E, icon: '🏛️', mins: 45,
    blurb: 'Durable orchestration, queues, state stores and observability for teams of agents users depend on.',
    cover: ['Durable orchestration', 'Queues and workers', 'State', 'Retries and idempotency', 'Failure modes'] },
  { n: 22, slug: '22-debugging-multi-agent-runs', title: 'Debugging a Multi-Agent Run', level: E, icon: '🐞', mins: 45,
    blurb: 'Tracing messages across agents and finding which agent, message or decision sent a run wrong.',
    cover: ['Traces across agents', 'Finding the first bad step', 'Blame between agents', 'Replaying a run', 'Fix and add a test'] },
  { n: 23, slug: '23-interview-playbook', title: 'The Multi-Agent Interview Playbook', level: E, icon: '🎤', mins: 40,
    blurb: 'Design rounds and concept questions on multi-agent systems, with a framework for choosing one agent or many.',
    cover: ['Design rounds', 'Concept questions', 'One agent or many', 'Debugging scenarios', 'A design framework'] },

  // ---------- Case Studies ----------
  { n: 24, slug: '24-case-research-system', title: 'Case Study: A Multi-Agent Research System', level: CS, icon: '🔬', mins: 40,
    blurb: 'A lead agent and parallel subagents searching and writing a cited answer: the design and its token bill.',
    cover: ['The design', 'Briefing subagents', 'Parallel search', 'Citations', 'Cost and lessons'] },
  { n: 25, slug: '25-case-software-company-agents', title: 'Case Study: Agents as a Software Company', level: CS, icon: '🏢', mins: 40,
    blurb: 'ChatDev and MetaGPT: product manager, architect, engineer and tester agents, and what the roles really added.',
    cover: ['The roles', 'Standard procedures', 'Shared artefacts', 'Results', 'What later work found'] },
  { n: 26, slug: '26-case-generative-agents', title: 'Case Study: Generative Agents in a Simulated Town', level: CS, icon: '🏡', mins: 35,
    blurb: 'Twenty-five agents with memory, reflection and plans living in a small town, and what emerged.',
    cover: ['The town', 'Memory stream', 'Reflection', 'Planning', 'Emergent behaviour'] },
];

module.exports.levels = {
  Prerequisites: 'One agent in one page, asyncio, messages and queues, and failure in distributed work.',
  Beginner: 'Why several agents, a first two-agent system, roles, orchestrator and workers, hand-offs and communication.',
  Intermediate: 'Pipelines, fan-out, critique and debate, voting, shared memory, agent protocols and frameworks.',
  Advanced: 'Coordination failures, context isolation, cost, security, evaluation, humans in the team and simulations.',
  Expert: 'Production architecture, debugging multi-agent runs and the interview playbook.',
  'Case Studies': 'Three well-known multi-agent systems, from a research system to a simulated town.',
};
