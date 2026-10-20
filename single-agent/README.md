# Single Agent — Interactive Course

One model in a loop with tools, built so that it finishes the job and then stops: tool calling and
tool design, system prompts, ReAct, stopping and error recovery, structured output, context
engineering, planning, reflection, memory, code execution, MCP, sandboxing, approvals, prompt
injection, guardrails, evaluation and reliability, and running agents in production. **48 chapters
across five levels, plus an 8-chapter Prerequisites level** (P1–P8: Python for agent code, chat
messages and roles, JSON and JSON Schema, tokens and cost, calling APIs, processes and isolation,
state machines, and measuring systems that vary).

Static site, **zero dependencies**, no build step required to read it. Open `index.html` in a
browser; progress, quiz scores and flashcard state are saved in `localStorage` under `agent-*` keys.

> **Status: in progress.** Chapters are written in order, one commit each. Pages still marked with
> `<!-- agent:placeholder -->` are unwritten; `grep -l agent:placeholder *.html` lists them.

## The levels

| Level | Chapters | What it covers |
|---|---|---|
| **Prerequisites** | P1–P8 | Python for agent code, chat messages and roles, JSON and JSON Schema, tokens and cost, calling APIs with timeouts and retries, processes and isolation, loops and state machines, measuring systems that vary |
| **Beginner** | 1–10 | What an agent is, a first agent loop, tool calling, designing tools, system prompts, ReAct, stopping and step limits, tool errors, structured output, the growing transcript |
| **Intermediate** | 11–22 | Context engineering, planning, task decomposition, reflection, short- and long-term memory, search tools, code execution, APIs and databases, MCP, frameworks vs plain code, choosing a model |
| **Advanced** | 23–34 | Sandboxing, permissions and approval, prompt injection, guardrails, evaluating agents, building a benchmark, reliability, latency, cost, long-running agents, coding agents, browser and computer-use agents |
| **Expert** | 35–40 | Production architecture, observability and tracing, debugging a failing agent, fine-tuning for tool use, agent safety, the interview playbook |
| **Case Studies** | 41–48 | A support agent with refund powers, the agent that deleted a production database, the one-dollar car, SWE-agent, a deep-research agent, a data-analysis agent, a browser agent, Voyager |

Where this course meets the others, each keeps its own angle and links across: ML & AI Systems
covers how models work inside and surveys agents in one chapter; RAG covers retrieval, including
retrieval as a tool; OS covers processes and containers; Cloud & DevOps covers running services;
Multi-Agent Systems picks up where one agent is not enough. This course is about building one agent
you can leave alone.

## Study tools

- **`glossary.html`**: agent terms, each linked to the chapter that introduces it
- **`flashcards.html`**: spaced-repetition deck generated from the chapter quizzes
- **`mock-interview.html`**: timed room with 22 concept and agent-design problems, a phase timer, an 8-point rubric and notes saved locally

## Tools

```bash
node tools/scaffold.cjs            # create placeholder pages for chapters in tools/chapters.cjs
node tools/build-study-data.js     # regenerate assets/study-data.js (search index + flashcards)
node build.js                      # -> dist/single-agent-course.html, the single-file offline edition
```

`assets/app.js` holds the `CHAPTERS` registry, the single source of truth for the sidebar, the
navigation and progress. `tools/chapters.cjs` is the original plan (with each chapter's outline);
`node tools/scaffold.cjs --registry` rewrites the registry from it, so only use that flag before
chapters start being edited by hand.

## House style

Listings are Python with a local model (qwen3:14b) served by Ollama, following the same five rules:
measure every change on a fixed set of tasks, run more than once; give tools typed arguments and
errors the model can act on; give every loop step, time and token limits; give tools least
privilege and put irreversible actions behind approval; and treat tool output as data, never as
instructions. Every simulator is driven by real measurements.
