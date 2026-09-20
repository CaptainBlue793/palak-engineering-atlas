# DSA — Interactive Course

A complete data structures and algorithms course, from "what is a loop doing" to bitmask DP,
suffix arrays and interview technique. **56 chapters across five levels**, each self-contained,
with animated visualizers, simulators, a practice set, an interview drill and a five-question quiz.

Static site, **zero dependencies**, no build step required to read it. Open `index.html` in a
browser; progress, quiz scores and flashcard state are saved in `localStorage`.

Every code block is C++ written in one consistent house style — the same style, the same naming
vocabulary and the same helper + driver structure from chapter 1 to chapter 56.

---

## Getting started

```bash
# just open it
start index.html          # Windows
open index.html           # macOS
```

Keyboard: **Ctrl+K** opens the search palette (1,078 indexed entries across all chapters).

## The five levels

| Level | Chapters | What it covers |
|---|---|---|
| **Foundations** | 1–11 | How to think about a problem, complexity, arrays, strings, hashing, prefix sums, two pointers, sliding window, binary search, sorting |
| **Data Structures** | 12–24 | Stacks, queues, linked lists, monotonic stacks, heaps, trees, BSTs, tries, segment trees, Fenwick, union-find |
| **Graphs & Paradigms** | 25–37 | DFS, BFS, topological sort, cycles, bipartite, Dijkstra, Bellman-Ford, Floyd-Warshall, MST, SCC, recursion, backtracking, greedy, divide & conquer |
| **DP & Advanced** | 38–51 | DP foundations, 1D, knapsack, strings, grids, trees, bitmask, intervals, digit/probability/game DP, bit manipulation, number theory, geometry, string algorithms, structure design |
| **Mastery** | 52–56 | The pattern playbook, debugging & correctness, the interview playbook, and two full end-to-end walkthroughs |

## Study tools

- **`glossary.html`** — ~170 terms, each linked to the chapter that introduces it
- **`flashcards.html`** — spaced-repetition deck of **280 cards**, generated from the chapter quizzes
- **`mock-interview.html`** — timed 45-minute room: 55 problems, phase timer, 8-point rubric, notes saved locally
- **Practice links** — every practice item carries a chip linking straight to the problem: 644 LeetCode
  links (problem number on the chip, title on hover), plus cp-algorithms, GeeksforGeeks and Wikipedia
  for the classics LeetCode does not cover. Premium problems are flagged amber with a ★.

---

## Build the single-file edition

The only build step. Produces one ~2.9 MB HTML file that runs **fully offline from `file://`** with
all 56 chapters, the study tools, the search index and the flashcard deck inlined.

```bash
node tools/build-study-data.js    # regenerate the search index + flashcard deck
node build.js                     # -> dist/dsa-course.html
```

Run both, in that order, after editing any chapter. `build-study-data.js` parses the chapter HTML
(headings, panel titles, takeaways for the index; `.quiz` blocks for the cards), so an un-regenerated
`assets/study-data.js` means Ctrl+K and the flashcards are stale.

## Practice-item links

```bash
node tools/lc-links.js             # inject / refresh links in every chapter
node tools/lc-links.js --report    # dry run: show what would change, write nothing
node tools/lc-links.js --refresh   # re-download the LeetCode problem list first
node tools/lc-links.js 41 42       # limit to specific chapters
```

Idempotent — it strips the chips it previously injected and rebuilds them, so re-run it after
editing a practice set or `tools/lc-map.js`.

**How a link is chosen.** `tools/lc-map.js` maps lowercase phrases to a LeetCode slug or a full URL.
Matching is longest-needle-first over non-overlapping spans, so "Stone game I and II; predict the
winner" produces two links, while "Single number III" matches only LC 260 and not also LC 136. An
item can carry up to three chips.

**No dead links.** `tools/lc-slugs.json` holds every real LeetCode slug with its problem number,
title and premium flag, fetched from `leetcode.com/api/problems/all/`. Any slug in the map that is
not in that file aborts the run and is named, so a typo fails loudly instead of shipping. That file
is committed, so the tool works offline; `--refresh` updates it. External URLs are passed through
as-is, and were verified once with a link check.

**Coverage:** 577 of 621 practice items, 761 links. The 44 unlinked items are deliberately
open-ended — "implement all six sorts from memory", "take one problem and write all four
implementations" — and every run lists them at the end so the gap stays visible.

## Validate chapters

```bash
node tools/check-chapters.js        # all chapters
node tools/check-chapters.js 41 42  # just these
```

Per chapter it checks: the file exists and is registered in `CHAPTERS`; the theme bootstrap is
byte-identical; exactly one `<main class="content">`; `data-chapter` matches the registry; the hero
`Chapter N` pill agrees; `style.css` and `app.js` are linked; exactly five `.quiz` blocks each with
an in-range `data-answer`, an `.explain` and a `<p class="q">`; a takeaways block is present; every
inline `<script>` parses; and no raw `<` appears inside a `<pre>`.

It catches real breakage — a missing paren in a visualizer, a stray closing tag, an undefined CSS
class — before it ships. Run it after every chapter edit.

---

## Layout

```
index.html              home: progress ring, dependency map, learning paths, roadmap
NN-slug.html            one self-contained chapter per file
glossary.html           ~170 terms
flashcards.html         280-card spaced-repetition deck
mock-interview.html     timed interview room with rubric
assets/
  app.js                CHAPTERS / LEVELS registry (single source of truth), page shell,
                        Ctrl+K palette, shared DSA.* helpers
  study-data.js         GENERATED — search index + flashcard deck
  style.css             design system, all shared component classes, light/dark themes
src/router.js           used only by the single-file build (scopes listeners/timers per page)
tools/
  build-study-data.js   regenerates assets/study-data.js
  check-chapters.js     chapter validator
  lc-links.js           injects practice-item links (idempotent)
  lc-map.js             phrase -> LeetCode slug / URL map
  lc-slugs.json         every real LeetCode slug + number + premium flag
build.js                single-file bundler -> dist/dsa-course.html
```

## Conventions when adding or editing a chapter

- Register it in `CHAPTERS` in `assets/app.js`. Filename number, `data-chapter` and the hero
  `Chapter N` pill must all agree.
- Reuse the shared classes (`panel`, `codebox`, `callout`, `stat`, `quiz`, `plist`, `takeaways`)
  rather than inventing CSS. Page-local `<style>` is for genuinely page-specific visualizers only.
- **Exactly 5 quiz questions per chapter** — the flashcard deck is generated from them.
- Every chapter ends with: a `callout danger` "Common mistakes", a `callout interview`
  "Interview drill" (two questions with `<details class="ans">` model answers), a `.takeaways`
  block, a practice set, and the quiz block.
- After adding or editing practice items, run `node tools/lc-links.js` so they pick up their links.
- Storage keys are namespaced `dsa-*`. Use `DSA.LS.get(key, default)` / `DSA.LS.set(key, value)` —
  there is no `DSA.save` / `DSA.load`.
- `build.js` asserts on the three lines where the runtime hard-codes multi-file navigation (the
  palette's `go()` and `here` in `assets/app.js`, the architecture-map click handler in
  `index.html`). Change one of those and the build fails naming the line it expected — update the
  patch in `build.js` rather than working around it.

## The house style

Every code block follows one C++ style, deliberately, so that the *difference* between two
algorithms is visible rather than buried in formatting differences:

```cpp
// Guard clause first, one line, unbraced. State by reference; the driver owns it.
void dfs(int node,int parent,unordered_map<int,vector<int>> &graph,vector<int> &size){
	size[node]=1;

	for(auto &neighbour:graph[node]){
		if(neighbour==parent)continue;

		dfs(neighbour,node,graph,size);

		size[node]+=size[neighbour];
	}
}
```

- Tabs for indentation; brace on the same line
- No spaces around `=`, `<`, `>`, `,`, `:`
- Guard clause first, on one line, unbraced: `if(!root)return;` / `if(!root)return {};`
- Single-statement `if` bodies on the next line, unbraced
- **Helper + driver**: a recursive helper taking all state by reference, plus a small public driver
  that owns it. No globals.
- `and` / `or` rather than `&&` / `||`
- `unordered_map<int,vector<int>> graph` adjacency lists, always passed by reference
- `auto [d,node]=pq.top();` structured bindings; `greater<>` min-heaps with the **sort key first**
- Naming: `ans`, `result`, `temp`, `node`, `neighbour`, `st`, `q`, `pq`, `visited`, `dist`,
  `indegree`, `parent`, `rank`, `mini`, `maxi`, `N` (problem node count), `n` (local length)

**Skeleton reuse is used as a teaching device.** Chapter 17 derives level-order, zig-zag, left view,
right view, top view and bottom view as *the same BFS loop* with one highlighted line changed;
chapter 42 writes path-counting and min-path-sum with identical shape so that "count vs. optimise"
is one visible line; chapter 47 keeps `ans` as the accumulator across the whole single-number family.
Transcription bugs found in the source notes were kept and turned into "Common mistakes" content
rather than silently corrected — the `visited[node]` vs `visited[neighbour]` BFS bug in chapter 25
and the whole catalogue in chapter 53.
