# Course playbook: building a new Atlas course

Five courses are built in parallel, one Claude Code session per course, each in its own git
worktree and branch. This file is the shared recipe. The plan of record is
[the expansion spec](superpowers/specs/2026-09-30-atlas-expansion-design.md) (§5 has each course's outline).

| Course | Folder | Branch | Worktree | Code |
|---|---|---|---|---|
| OS & Concurrency | `os/` | `feature/os-course` | `C:\Users\StarBlue\atlas-courses\os` | C (POSIX) |
| Computer Networks | `networks/` | `feature/networks-course` | `…\atlas-courses\networks` | Python sockets + CLI |
| Database Internals & SQL | `databases/` | `feature/databases-course` | `…\atlas-courses\databases` | PostgreSQL SQL + Python |
| Distributed Systems | `distributed-systems/` | `feature/distributed-course` | `…\atlas-courses\distributed-systems` | Java |
| Cloud & DevOps | `cloud-devops/` | `feature/devops-course` | `…\atlas-courses\cloud-devops` | Bash, Dockerfile, K8s YAML, Terraform, GitHub Actions |

## Ground rules

- **Touch only your course folder** and your log `docs/sessions/<folder>.md`. Everything else is shared by
  five sessions: `assets/atlas.js`, `assets/account.js`, `index.html`, `tools/*`, `README.md`,
  other course folders. If a shared file needs a change, write it in your log under "Needs a shared change"
  and carry on; it is done at release time, one course at a time.
- **Never push `main`, merge into `main`, delete branches, or publish a release without the owner's go-ahead.**
  Pushing your own feature branch is fine (it's a backup).
- **Commit every chapter as soon as it passes its checks** (one commit per chapter). OneDrive and crashes have
  zeroed uncommitted files before; the worktrees live outside OneDrive, but commit anyway.
- Keep `main` flowing in: `git fetch origin && git merge origin/main` at the start of each session.
- End commit messages with the attribution lines your session's system reminder gives.

## Owner preferences (apply to every chapter)

- **Computing examples, not everyday analogies.** Web servers, caches, schedulers, packets, databases, real
  incidents. A non-CS analogy is fine only occasionally.
- **Visual:** sequence diagrams (`figure.seq`), workflows (`figure.flow`), animations and simulators; comparison
  tables (`table.t.cmp`) and small real-world use cases (`.callout.usecase`).
- **No double-teaching:** beginner chapters don't re-teach the Prerequisites (P1–P8). Where two courses meet,
  each keeps its own angle and links to the other (e.g. OS explains how containers work; DevOps runs them).
- **Plain, direct English.** Short sentences, jargon explained on first use, facts checked.
- British spelling in prose, as the existing courses use ("colour", "optimise").

## Step 1 — agree the chapter list (first session only)

`<folder>/tools/chapters.cjs` holds a **draft** plan (P1–P8 + 48 chapters) written from the spec. Show it to the
owner as a table grouped by level and get approval or changes before writing anything.

- Keep the P1 slug unless the owner asks; `assets/atlas.js` points `first` at it (a shared file).
- After edits: `node <folder>/tools/scaffold.cjs --registry` rewrites the registry in `assets/app.js` and creates
  placeholder pages for new slugs. Delete placeholder files for slugs you removed or renamed.
- Chapter numbers are progress keys once published, so don't renumber after release.

## Step 2 — the course shell (Task 0)

`tools/new-course.cjs` already cloned the LLD shell and applied the name, colours, logo, storage keys and levels.
These parts are still LLD content and must be rewritten for the course. `os/index.html` is a finished example of
the home page.

- [ ] `index.html`: the pill (chapter counts), the lead paragraph, the "whole map" dependency SVG (4 layers × 6
      nodes, real edges, plus the `routes` array in the page script), the "One code style" strip in the course's
      language, the interview-playbook link, the footer tagline.
- [ ] `glossary.html`: replace the `T` list with the course's terms (start with ~60; add terms as chapters land).
      Each entry is `[term, one-sentence definition, chapter number]`.
- [ ] `mock-interview.html`: replace the problem list `P` (`[title, difficulty e/m/h, tags, chapter, prompt]`), the
      phase checklists `PROMPTS`, and the rubric rows `RUB` with ones for this subject.
- [ ] `flashcards.html`: check the intro copy (the deck itself is generated from quizzes).
- [ ] `README.md`: describe the course.
- [ ] Commit: "<Course>: course home, glossary, mock interview".

## Step 3 — chapters, one per commit, in order

Read one complete finished chapter first to absorb the format: `lld/23-producer-consumer.html` (concurrency) or any
System Design chapter. Every chapter file:

- **Head:** title, `assets/style.css`, the theme bootstrap line (already in the placeholder), a page-local `<style>`
  whose classes use a short chapter prefix (`pq-…`). Never use the global `.yes` / `.no` / `.meh` classes as state
  classes in widgets.
- **Body:** `<body data-chapter="N">` (prerequisites use 0.1–0.8), `<main class="content">`, then:
  1. `section.hero`: eyebrow pills (chapter, level, minutes), `h1` with a `span.grad`, a lead paragraph,
     `ul.objectives` (4–5 outcomes).
  2. `.callout.tip` "What you need before this chapter" with links to earlier chapters (and other courses).
  3. The teaching sections (`h2`s) with code listings in `pre.code` using the highlight spans
     `k` (keyword) `t` (type) `f` (function) `c` (comment) `s` (string) `m` (number).
  4. **One interactive panel** (`div.panel` with `panel-head`/`panel-body`/`panel-foot`): a simulator or
     step-through the learner can drive and break, driven by the page script.
  5. At least one `figure.seq` or `figure.flow`, one `table.t.cmp`, one `.callout.usecase`.
  6. `.callout.danger` "Common mistakes", `.callout.interview` "Interview drill" (two questions with
     `details.ans` model answers), `.takeaways` (5–6 bullets).
  7. `.quiz-wrap` with **exactly 5** `.quiz` blocks (`data-answer` = index of the right option, 4 options each,
     an `.explain` line). The flashcard deck is generated from these.
- **Scripts:** `<script src="assets/app.js"></script>` then the page script, an IIFE using the course runtime
  (`const { $, $$ } = NS;` where NS is `OS`, `NET`, `DB`, `DIST` or `OPS`).
- Remove the `<!-- <prefix>:placeholder -->` marker when the chapter is real.
- Typical size: 25–40 KB of HTML. Depth over breadth; accuracy over flourish.

**Checks before each commit:**
1. Open the chapter headlessly and drive the panel. Chrome is at
   `C:/Program Files/Google/Chrome/Application/chrome.exe`; `--headless=new --dump-dom` or `--screenshot`,
   with a temporary copy of the page that scripts a few clicks and prints the panel's state, then look at it.
   No console errors.
2. `node tools/content-audit.cjs check <folder>`: 0 errors (placeholders are only warnings).
3. `node <folder>/tools/build-study-data.js` (search index + flashcards).
4. No null bytes: `node -e "const fs=require('fs');process.argv.slice(1).forEach(f=>{if(fs.readFileSync(f).includes(0))throw f})" <files>`.
5. Commit: "<NS> <N>: <title>". Append a line to `docs/sessions/<folder>.md`.

Line endings: the checkout uses CRLF (`core.autocrlf=true`). If a rebuild flips line endings on files you didn't
change, restore them with `git checkout -- <file>`.

## Step 4 — release (only when every chapter is written, and only with the owner's go-ahead)

1. `git fetch origin && git merge origin/main`.
2. Rebuild: `node <folder>/tools/build-study-data.js` and `(cd <folder> && node build.js)`.
3. In `assets/atlas.js` (shared file, touched only now): remove `soon: true` from the course, set `chapters`
   (P + main) and `hours` to the real numbers. Nothing else on the home page needs changing.
4. `README.md`: add the course to the table; remove it from the "On the way" line.
5. Checks: `node tools/content-audit.cjs check`, `node tools/content-audit.cjs bundle`,
   `node tools/palette-check.cjs`, `node tools/hub-check.cjs`, `--theme dark`, `--width 390`.
6. Ask the owner, then merge into `main`, push, wait for GitHub Pages, and
   `gh release create <folder>-v1.0.0 <folder>/dist/<dist-file> --title "<Course> v1.0.0"`.
7. Final entry in `docs/sessions/<folder>.md`.

## Session log format (`docs/sessions/<folder>.md`)

```
## YYYY-MM-DD — session N
- Done: P1–P4, Ch 1 (commits abc1234..def5678)
- Decisions: …
- Needs a shared change: …
- Next: Ch 2
```
