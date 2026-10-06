# Cloud & DevOps — Interactive Course

Object-oriented design for the OPS interview round, in Java: from "what is a class, really" to a
thread-safe movie-booking system. **46 chapters across four levels, plus an 8-chapter
Prerequisites level** (P1–P8: classes and references, encapsulation, inheritance and dispatch,
interfaces and generics, composition, value objects and immutability, exceptions, reading UML).

Static site, **zero dependencies**, no build step required to read it. Open `index.html` in a
browser; progress, quiz scores and flashcard state are saved in `localStorage` under `ops-*` keys.

> **Status: complete.** All 54 pages are written. Each chapter has at least one interactive panel,
> Java listings in the house style, a comparison table, a real-world use case, a common-mistakes box,
> an interview drill and a five-question quiz. `grep -l ops:placeholder *.html` should print nothing.

## The levels

| Level | Chapters | What it covers |
|---|---|---|
| **Prerequisites** | P1–P8 | The Java object model, encapsulation, inheritance and dynamic dispatch, interfaces and generics, composition, value objects, exceptions, UML |
| **Principles** | 1–8 | The OPS round, requirements to classes, SOLID, coupling and cohesion, relationships, class contracts, dependency injection |
| **Design Patterns** | 9–21 | Singleton, factories, builder, adapter/facade/bridge, decorator/proxy, composite/flyweight, strategy, observer/mediator, command/memento, state, chain/template, iterator/visitor, combining patterns |
| **Advanced OPS** | 22–30 | Thread-safe classes, producer-consumer and pools, extensibility, resilience, persistence, domain modeling, testing, refactoring, the interview playbook |
| **Case Studies** | 31–46 | LRU cache, rate limiter, logger, pub-sub, task scheduler, file system, KV store with transactions, text editor, connection pool, parking lot, elevator, ticket booking, Splitwise, chess, vending machine/ATM, ride-hailing |

Case studies that also appear in the System Design course link to the high-level version:
same problem, different zoom.

## Study tools

- **`glossary.html`**: OPS terms, each linked to the chapter that introduces it
- **`flashcards.html`**: spaced-repetition deck generated from the chapter quizzes (270 cards)
- **`mock-interview.html`**: timed room with 18 OPS problems, a phase timer, an 8-point rubric and notes saved locally

## Tools

```bash
node tools/scaffold.cjs            # create placeholder pages for chapters in tools/chapters.cjs
node tools/build-study-data.js     # regenerate assets/study-data.js (search index + flashcards)
node build.js                      # -> dist/cloud-devops-course.html, the single-file offline edition
```

`assets/app.js` holds the `CHAPTERS` registry, the single source of truth for the sidebar, the
navigation and progress. `tools/chapters.cjs` is the original plan (with each chapter's outline);
`node tools/scaffold.cjs --registry` rewrites the registry from it, so only use that flag before
chapters start being edited by hand.

## House style

Every listing is Java written the same way: interface first, constructor injection into `final`
fields, validation at the boundary, small classes, and each design naming its pattern and the
extension it survives.
