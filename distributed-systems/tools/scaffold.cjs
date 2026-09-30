#!/usr/bin/env node
/* =========================================================
   tools/scaffold.cjs — creates a placeholder page for every
   chapter in tools/chapters.cjs that isn't on disk yet.

     node tools/scaffold.cjs              # add missing placeholder pages
     node tools/scaffold.cjs --registry   # also rewrite CHAPTERS in assets/app.js

   Never overwrites an existing chapter file. Placeholders carry
   the PLACEHOLDER marker below, so `grep -l dist:placeholder *.html`
   lists the chapters still to write.
   ========================================================= */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PLAN = require('./chapters.cjs');
const PLACEHOLDER = '<!-- dist:placeholder -->';

// The registry regex in build-study-data.js stops at a straight quote, so titles use ’.
const title = (c) => c.title.replace(/'/g, '’');
const file = (c) => c.slug + '.html';
const isPre = (n) => n > 0 && n < 1;
const chName = (c) => (isPre(c.n) ? 'Prerequisite ' + Math.round(c.n * 10) : 'Chapter ' + c.n);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const js = (s) => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");

/* ---------- 1. the CHAPTERS registry ---------- */
if (process.argv.includes('--registry')) {
  const appPath = path.join(ROOT, 'assets', 'app.js');
  const app = fs.readFileSync(appPath, 'utf8');
  const a = app.indexOf('  const CHAPTERS = [');
  const b = app.indexOf('  ];', a);
  if (a < 0 || b < 0) fail('could not find the CHAPTERS block in assets/app.js');
  const w = Math.max(...PLAN.map((c) => file(c).length)) + 3;
  const lines = PLAN.map((c) =>
    `    { n: ${c.n}, file: ${("'" + file(c) + "',").padEnd(w)} title: '${js(title(c))}', level: '${c.level}', icon: '${c.icon}', mins: ${c.mins}, blurb: '${js(c.blurb)}' },`);
  fs.writeFileSync(appPath, app.slice(0, a) + '  const CHAPTERS = [\n' + lines.join('\n') + '\n' + app.slice(b));
  console.log(`✓ assets/app.js: CHAPTERS rewritten (${PLAN.length} entries)`);
}

/* ---------- 2. placeholder pages ---------- */
let made = 0;
for (const c of PLAN) {
  const p = path.join(ROOT, file(c));
  if (fs.existsSync(p)) continue;
  fs.writeFileSync(p, page(c));
  made++;
}
console.log(`✓ ${made} placeholder page(s) created, ${PLAN.length - made} already on disk`);

function page(c) {
  const t = title(c);
  // Gradient on the part after the colon, else on the last word.
  const colon = t.indexOf(': ');
  const h1 = colon > 0
    ? `${esc(t.slice(0, colon + 1))} <span class="grad">${esc(t.slice(colon + 2))}</span>`
    : t.includes(' ')
      ? `${esc(t.slice(0, t.lastIndexOf(' ')))} <span class="grad">${esc(t.slice(t.lastIndexOf(' ') + 1))}</span>`
      : `<span class="grad">${esc(t)}</span>`;
  const lvl = isPre(c.n) ? '<span class="pill green">Prerequisites</span>'
    : c.level === 'Case Studies' ? '<span class="pill" style="background:var(--pink-soft);color:var(--pink);border-color:transparent">Case Study</span>'
    : `<span class="pill">${esc(c.level)}</span>`;
  const hld = c.hld ? `
  <div class="callout analogy">
    <div class="ico">🏗️</div>
    <div class="body"><div class="title">Same problem, different zoom</div>
      The System Design course covers the architecture of this system — services, storage and scale. This chapter zooms into the classes inside one of those services. See <a href="../system-design/${c.hld}">the high-level design</a>.
    </div>
  </div>
` : '';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(t)}</title>
<link rel="stylesheet" href="assets/style.css">
<script>try{var t=JSON.parse(localStorage.getItem('dist-theme'));if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}</script>
</head>
<body data-chapter="${c.n}">
${PLACEHOLDER}
<main class="content">

  <section class="hero">
    <div class="eyebrow"><span class="pill accent">${chName(c)}</span>${lvl}<span class="pill">⏱ ${c.mins} min</span></div>
    <h1>${h1}</h1>
    <p class="lead">${esc(c.blurb)}</p>
  </section>

  <div class="callout warn">
    <div class="ico">🚧</div>
    <div class="body"><b>This chapter is being written.</b>
      The outline below is the plan. Diagrams, a simulator, Java listings, an interview drill and a five-question quiz are on the way.
    </div>
  </div>
${hld}
  <h2>What this chapter will cover</h2>
  <ol>
${c.cover.map((x) => `    <li>${esc(x)}</li>`).join('\n')}
  </ol>

</main>
<script src="assets/app.js"></script>
</body>
</html>
`;
}

function fail(msg) { console.error('✗ scaffold failed: ' + msg); process.exit(1); }
