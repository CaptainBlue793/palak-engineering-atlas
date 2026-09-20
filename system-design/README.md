# Palak's System Design Playlist

An interactive system-design course: **42 chapters** across five levels, each with animated
diagrams, live simulators, a "common mistakes" box, an interview drill and a 5-question quiz —
plus a 174-term glossary, a spaced-repetition flashcard deck and a timed mock-interview room.

No build step, no dependencies, no server, no account. Progress is saved in your browser.

---

## Get the app

### Option 1 — one file, offline (recommended)

**[⬇ Download `system-design-course.html`](https://github.com/CaptainBlue793/palak-system-design-playlist/releases/latest/download/system-design-course.html)** (~2 MB)

Double-click it. The whole course opens in your browser and runs completely offline — every
chapter, simulator, quiz and study tool is inside that single file. Nothing is installed,
nothing phones home. Works on Windows, macOS, Linux, Android and iOS.

Keep it on a USB stick, email it to a friend, read it on a plane.

### Option 2 — read it online

**<https://captainblue793.github.io/palak-system-design-playlist/>**

### Option 3 — run from source

```bash
git clone https://github.com/CaptainBlue793/palak-system-design-playlist.git
cd palak-system-design-playlist
```

Open `index.html` in any browser. That's the whole setup.

---

## What's inside

| Level | Chapters | Covers |
| --- | --- | --- |
| **Beginner** | 1–4 | Client–server, networking, APIs, scalability & estimation |
| **Intermediate** | 5–12 | Load balancing, caching, databases, sharding, storage, search, security, graphs |
| **Advanced** | 13–19 | CAP & consensus, queues, microservices, reliability, CDC, streaming, testing |
| **Expert** | 20–25 | Probabilistic structures, Kubernetes, multi-region, ML platforms, cost, the interview playbook |
| **Case Studies** | 26–42 | URL shortener, news feed, chat, notifications, crawler, typeahead, video, file sync, collaborative editing, ride hailing, ticketing, payments, job scheduler, KV store, ad clicks, metrics, LLM serving |

**Study tools:** a searchable glossary, a flashcard deck generated from every chapter quiz, and a
mock-interview room with a timer and a scoring rubric. `Ctrl`+`K` opens search from anywhere.

---

## Repository layout

```
index.html              home: progress ring, architecture map, roadmap
NN-slug.html            one self-contained chapter per file (42 of them)
glossary.html           ~174 terms, filterable
flashcards.html         spaced-repetition deck
mock-interview.html     timed drill + rubric
assets/
  app.js                chapter registry, page shell, Ctrl+K search, shared SD.* helpers
  style.css             design system, light + dark themes
  study-data.js         generated: search index + flashcard deck
build.js                bundles everything into the single-file edition
src/router.js           hash router used only by the single-file build
dist/                   build output: system-design-course.html
```

## Building the single-file edition

```bash
node build.js        # -> dist/system-design-course.html
```

Requires Node (any recent version) and nothing else — no `npm install`, no dependencies.

The bundler inlines the stylesheet, the runtime and every page's markup, styles and scripts into
one document, then adds a small hash router (`src/router.js`) that swaps pages in and out of
`<body>` and re-runs the shared runtime, so each page boots exactly as it does when served as its
own file. It asserts on the three places the runtime hard-codes multi-file navigation, so if those
lines ever change the build fails loudly instead of shipping a broken bundle.

Re-run it after editing any chapter. If you change the quizzes or headings, regenerate
`assets/study-data.js` first so search and flashcards stay in sync.

## Contributing a chapter

- Register it in `CHAPTERS` in `assets/app.js`; the filename number, the `data-chapter`
  attribute and the hero `Chapter N` pill must all agree.
- Reuse the shared classes (`panel`, `stepper`, `diagram`, `stat`, `callout`, `quiz`) instead of
  adding new CSS.
- Keep 5 quiz questions per chapter — the flashcard deck is generated from them.

---

## License

MIT — see [LICENSE](LICENSE).

Written by **Palak Deb Patra**.
