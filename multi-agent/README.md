# Multi-Agent Systems — Interactive Course

Several agents working on one job: when that beats one agent and when it does not, orchestrators
and workers, roles, hand-offs, messages and shared state, pipelines and routing, parallel fan-out,
critique, debate and voting, blackboards, agent protocols (MCP and A2A), frameworks, coordination
failures, lost context, cost and latency, trust between agents, evaluation against a single-agent
baseline, people in the loop, simulations, production architecture and debugging. **23 chapters
across four levels plus 3 case studies, and a 4-chapter Prerequisites level** (P1–P4: one agent in
one page, concurrency with asyncio, messages and queues, and failure in distributed work).

Static site, **zero dependencies**, no build step required to read it. Open `index.html` in a
browser; progress, quiz scores and flashcard state are saved in `localStorage` under `mas-*` keys.

> **Status: in progress.** Chapters are written in order, one commit each. Pages still marked with
> `<!-- mas:placeholder -->` are unwritten; `grep -l mas:placeholder *.html` lists them.

## The levels

| Level | Chapters | What it covers |
|---|---|---|
| **Prerequisites** | P1–P4 | One agent in one page, concurrency with asyncio, messages, queues and events, failure in distributed work |
| **Beginner** | 1–6 | Why more than one agent (and when not), a first two-agent system, roles, orchestrator and workers, hand-offs, messages vs shared state |
| **Intermediate** | 7–13 | Pipelines and routing, parallel fan-out, critique and debate, voting and ensembles, shared memory and blackboards, agent protocols, frameworks compared |
| **Advanced** | 14–20 | Coordination failures, context isolation, cost and latency, trust and security, evaluating multi-agent systems, humans in the team, simulations |
| **Expert** | 21–23 | Production architecture, debugging a multi-agent run, the interview playbook |
| **Case Studies** | 24–26 | A multi-agent research system, agents as a software company, generative agents in a simulated town |

Where this course meets the others, each keeps its own angle and links across: Single Agent covers
the loop, tools, memory, sandboxing and evaluating one agent; Distributed Systems covers consensus,
failure and queues in depth; RAG covers retrieval. This course is about deciding when several agents
are worth it, and building them so they actually beat one.

## Study tools

- **`glossary.html`**: 62 multi-agent terms, each linked to the chapter that introduces it
- **`flashcards.html`**: spaced-repetition deck generated from the chapter quizzes
- **`mock-interview.html`**: timed room with 18 concept and design problems, a phase timer, an 8-point rubric and notes saved locally

## Tools

```bash
node tools/scaffold.cjs            # create placeholder pages for chapters in tools/chapters.cjs
node tools/build-study-data.js     # regenerate assets/study-data.js (search index + flashcards)
node build.js                      # -> dist/multi-agent-course.html, the single-file offline edition
```

`assets/app.js` holds the `CHAPTERS` registry, the single source of truth for the sidebar, the
navigation and progress. `tools/chapters.cjs` is the original plan (with each chapter's outline);
`node tools/scaffold.cjs --registry` rewrites the registry from it, so only use that flag before
chapters start being edited by hand.

## House style

Listings are Python with asyncio and a local model (qwen3:14b) served by Ollama, following the same
five rules: compare every multi-agent design with one agent on the same tasks; give every worker a
brief with the goal, inputs, method and expected output; pass typed, schema-checked messages between
agents; bound steps, time, tokens and concurrency per agent and per run; and give each agent only its
own privileges, treating text from other agents as data. Every simulator is driven by real measurements.
