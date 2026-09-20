#!/usr/bin/env node
/* =========================================================
   tools/check-chapters.js — structural lint for the course

     node tools/check-chapters.js            # every registered chapter
     node tools/check-chapters.js 07 12      # only those files

   Checks, per chapter, the invariants the runtime and both build
   scripts rely on. Anything this reports would otherwise surface
   as a silently broken page or a broken bundle:

     - the file exists and is registered in assets/app.js
     - the blocking theme bootstrap is present and byte-identical
       (build.js hoists it by exact match and fails without it)
     - exactly one <main class="content"> ... </main>
     - body data-chapter matches the registry number
     - the hero "Chapter N" pill matches too
     - exactly 5 .quiz blocks, each with an in-range data-answer
       and an .explain (the flashcard deck is generated from these)
     - every inline <script> parses as JavaScript
     - no unescaped < or > inside <pre> blocks that would break parsing
     - takeaways block present
   ========================================================= */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const THEME_BOOTSTRAP =
  `try{var t=JSON.parse(localStorage.getItem('dsa-theme'));if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}`;

/* ---------- registry ---------- */
const appJs = fs.readFileSync(path.join(ROOT, 'assets', 'app.js'), 'utf8');
const regBlock = appJs.slice(appJs.indexOf('const CHAPTERS = ['), appJs.indexOf('const LEVELS = ['));
const CHAPTERS = [...regBlock.matchAll(/\{\s*n:\s*(\d+),\s*file:\s*'([^']+)',\s*title:\s*'((?:[^'\\]|\\.)*)'/g)]
  .map((m) => ({ n: +m[1], file: m[2], title: m[3] }));

if (!CHAPTERS.length) fail('could not parse CHAPTERS out of assets/app.js');

/* ---------- which chapters to check ---------- */
const args = process.argv.slice(2);
const wanted = args.length
  ? CHAPTERS.filter((c) => args.some((a) => c.file.startsWith(String(a).padStart(2, '0')) || c.file === a || String(c.n) === a))
  : CHAPTERS;

let problems = 0, missing = 0, checked = 0;

for (const ch of wanted) {
  const p = path.join(ROOT, ch.file);
  if (!fs.existsSync(p)) { missing++; continue; }
  checked++;
  const src = fs.readFileSync(p, 'utf8');
  const errs = [];

  /* theme bootstrap — build.js matches this exactly */
  if (!src.includes(THEME_BOOTSTRAP)) errs.push('theme bootstrap missing or altered (build.js matches it byte for byte)');

  /* one <main class="content"> */
  const mainOpens = (src.match(/<main class="content">/g) || []).length;
  const mainCloses = (src.match(/<\/main>/g) || []).length;
  if (mainOpens !== 1 || mainCloses !== 1) errs.push(`expected one <main class="content"> and one </main>, found ${mainOpens}/${mainCloses}`);

  /* data-chapter */
  const dc = (src.match(/<body[^>]*data-chapter=["']?(\d+)/i) || [])[1];
  if (+dc !== ch.n) errs.push(`data-chapter is ${dc === undefined ? 'absent' : dc}, registry says ${ch.n}`);

  /* hero pill */
  const pill = (src.match(/<span class="pill accent">Chapter (\d+)<\/span>/) || [])[1];
  if (+pill !== ch.n) errs.push(`hero pill says "Chapter ${pill === undefined ? '?' : pill}", registry says ${ch.n}`);

  /* stylesheet + runtime */
  if (!src.includes('href="assets/style.css"')) errs.push('assets/style.css not linked');
  if (!src.includes('src="assets/app.js"')) errs.push('assets/app.js not included');

  /* quizzes */
  const quizzes = [...src.matchAll(/<div class="quiz" data-answer="(\d+)">([\s\S]*?)<\/div>\s*<\/div>/g)];
  const quizCount = (src.match(/<div class="quiz" data-answer=/g) || []).length;
  if (quizCount !== 5) errs.push(`found ${quizCount} quiz blocks, expected exactly 5 (the flashcard deck is built from them)`);

  /* per-quiz: answer in range, has an explain */
  const blocks = src.split('<div class="quiz" data-answer="').slice(1);
  blocks.forEach((b, i) => {
    const ans = +b.slice(0, b.indexOf('"'));
    const body = b.slice(0, b.indexOf('<div class="quiz"') === -1 ? b.length : b.indexOf('<div class="quiz"'));
    const opts = (body.match(/<button class="opt">/g) || []).length;
    if (opts < 2) errs.push(`quiz ${i + 1}: only ${opts} options`);
    else if (ans >= opts) errs.push(`quiz ${i + 1}: data-answer=${ans} but there are only ${opts} options`);
    if (!/<div class="explain">/.test(body)) errs.push(`quiz ${i + 1}: no .explain block`);
    if (!/<p class="q">/.test(body)) errs.push(`quiz ${i + 1}: no <p class="q"> question`);
  });

  /* takeaways */
  if (!src.includes('<div class="takeaways">')) errs.push('no takeaways block');

  /* inline scripts must parse */
  for (const m of src.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/\bsrc=/i.test(m[1])) continue;
    try { new Function(m[2]); }
    catch (e) { errs.push(`inline script does not parse: ${e.message}`); }
  }

  /* raw < or > inside <pre> would end the tag early in an HTML parser */
  for (const m of src.matchAll(/<pre\b[^>]*>([\s\S]*?)<\/pre>/gi)) {
    const inner = m[1].replace(/<\/?(span|b|i|em|strong)\b[^>]*>/gi, '');
    const bad = inner.match(/<(?!\/?(span|b|i|em|strong)\b)[^\s=]/g);
    if (bad) errs.push(`<pre> contains ${bad.length} raw "<" — escape as &lt; (found: ${[...new Set(bad)].slice(0, 4).join(' ')})`);
  }

  if (errs.length) {
    problems += errs.length;
    console.log(`\n✗ ${ch.file}`);
    errs.forEach((e) => console.log(`    - ${e}`));
  }
}

console.log('');
if (missing) console.log(`  ${missing} registered chapter(s) not written yet`);
console.log(problems ? `✗ ${checked} checked, ${problems} problem(s) found` : `✓ ${checked} chapter(s) checked, all clean`);
process.exit(problems ? 1 : 0);

function fail(msg) { console.error('✗ check failed: ' + msg); process.exit(1); }
