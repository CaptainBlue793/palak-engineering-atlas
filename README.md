# The Engineering Atlas

**[captainblue793.github.io/palak-engineering-atlas](https://captainblue793.github.io/palak-engineering-atlas/)**

Every interactive engineering course I've written, in one place — **150 chapters, ~111 hours,
zero dependencies**. No walls of text: every chapter has animated diagrams, simulators you can
break, an interview drill and a quiz. It all runs in your browser, offline, with no account and
no build step.

| Course | Chapters | Covers |
|---|---|---|
| **[System Design](system-design/)** | 42 | Caching, sharding, queues, consensus, multi-region — plus 17 case studies |
| **[ML & AI Systems](ml-ai-systems/)** | 52 | Transformers, RAG, agents, distributed training, inference, MLOps |
| **[DSA](dsa/)** | 56 | Every structure and algorithm, in one consistent C++ house style |

```
palak-engineering-atlas/
├── index.html          ← the Atlas (start here)
├── assets/atlas.js     ← the COURSES registry + hub runtime
├── system-design/      ← each course is a self-contained site
├── ml-ai-systems/
└── dsa/
```

## What the Atlas adds

The courses are **not** merged into one file — each stays a standalone site with its own sidebar,
search, progress, glossary, flashcards and mock-interview room. The Atlas joins them at the
entry point:

- **Combined progress** — reads each course's own `localStorage` key (`sd-done`, `ml-done`,
  `dsa-done`), so ticking a chapter off inside a course shows up on the hub, and vice versa.
  The chapter mosaic on the home page is one square per chapter, all 150 of them.
- **Resume** — deep-links to the next unread chapter of whichever course you're furthest into.
- **Cross-course search** — `Ctrl+K` (or `/`) searches ~3,500 chapter, section and demo entries
  across all three courses at once, filterable by course, deep-linking to the exact anchor.
  The indexes load lazily after first paint, so the page opens instantly.
- **Shared theme** — the toggle writes every course's theme key, so it carries across.

## Running it

Open `index.html` in a browser. That's it — no install, no server, no build step.

Each course also builds into a single self-contained HTML file you can keep offline:

```bash
cd system-design && node build.js    # -> dist/system-design-course.html
```

Re-run that after editing any chapter in that course, and commit the `dist/` file.

## Adding a course

Everything on the hub is derived from the `COURSES` array at the top of `assets/atlas.js`.
Drop the course folder next to the others (use a url-safe slug) and add one object — cards,
progress, the mosaic, search, filters, study-tool links and the hero counts all pick it up.
Optionally add it to a track in `PATHS` just below. The full field list is documented in that
file's header comment.

A course only needs the house layout for this to work: `index.html`, `glossary.html`,
`flashcards.html`, `mock-interview.html`, numbered chapter files, and an `assets/study-data.js`
that sets `window.<INDEX_VAR>` to `[{ n, f, ti, lv, e: [{ t, a, k }] }]`.

## History

These three courses previously lived in their own repositories
([system design](https://github.com/CaptainBlue793/palak-system-design-playlist),
[ML & AI systems](https://github.com/CaptainBlue793/palak_ML_AI_system_playlist),
[DSA](https://github.com/CaptainBlue793/palak-DSA-playlist)). Those are archived and kept only
so existing links keep working.

---

Written by **Palak Deb Patra**.
