#!/usr/bin/env node
/* ---------------------------------------------------------------------------
   Injects the per-chapter "Tips & tricks" section from tools/tips-data.js.

     node tools/add-tips.js            inject / refresh every chapter
     node tools/add-tips.js --report   dry run, write nothing
     node tools/add-tips.js --strip    remove the injected sections again
     node tools/add-tips.js 41 42      limit to specific chapters

   Idempotent: the block is fenced with HTML comments and rebuilt on every run,
   so editing tips-data.js and re-running is the whole workflow.

   Placement: immediately before the "Common mistakes" callout, so the chapter
   reads prose → tips → mistakes → drill → takeaways → practice → quiz. If that
   callout is missing the block goes before the takeaways, and failing that
   before the quiz.
   --------------------------------------------------------------------------- */

'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TIPS = require('./tips-data.js');

const args = process.argv.slice(2);
const REPORT = args.includes('--report');
const STRIP = args.includes('--strip');
const ONLY = args.filter((a) => /^\d+$/.test(a)).map(Number);

const OPEN = '<!-- tips:start -->';
const CLOSE = '<!-- tips:end -->';
const FENCE = new RegExp(OPEN.replace(/[-[\]{}()*+?.,\\^$|#]/g, '\\$&') + '[\\s\\S]*?' + CLOSE.replace(/[-[\]{}()*+?.,\\^$|#]/g, '\\$&') + '\\s*', 'g');

const ICON = { trick: '💡', gotcha: '⛔', speed: '⚡' };

function render(tips) {
  const rows = tips.map(([kind, label, html]) => {
    const cls = kind === 'trick' ? 'trick' : 'trick ' + kind;
    return '    <div class="' + cls + '"><span class="tk">' + ICON[kind] + ' ' + label + '</span><div class="tb">' + html + '</div></div>';
  }).join('\n');
  return OPEN + '\n' +
    '  <h2>Tips &amp; tricks</h2>\n' +
    '  <p class="small muted" style="margin:-4px 0 12px">The things that are muscle memory rather than theory — what to check first, and the line that is wrong the first time you write it.</p>\n' +
    '  <div class="tricks">\n' + rows + '\n  </div>\n' +
    CLOSE + '\n\n';
}

// Anchors tried in order. Each must be a literal that appears once per chapter.
const ANCHORS = [
  '  <div class="callout danger">',
  '  <div class="takeaways">',
  '  <div class="quiz-wrap">',
];

let touched = 0, skipped = 0, missing = [];
let files = fs.readdirSync(ROOT).filter((f) => /^\d\d-.*\.html$/.test(f)).sort();
if (ONLY.length) files = files.filter((f) => ONLY.includes(+f.slice(0, 2)));

for (const file of files) {
  const p = path.join(ROOT, file);
  let src = fs.readFileSync(p, 'utf8');
  const before = src;
  const n = +file.slice(0, 2);

  src = src.replace(FENCE, '');            // always rebuild rather than stack

  if (!STRIP) {
    const tips = TIPS[n];
    if (!tips || !tips.length) { missing.push(file); }
    else {
      const anchor = ANCHORS.find((a) => src.includes(a));
      if (!anchor) { missing.push(file + ' (no anchor)'); }
      else src = src.replace(anchor, render(tips) + anchor);
    }
  }

  const changed = src !== before;
  if (changed) touched++; else skipped++;
  if (!REPORT && changed) fs.writeFileSync(p, src);
  const tipCount = STRIP ? 0 : (TIPS[n] || []).length;
  console.log((changed ? (REPORT ? '  ~ ' : '  ✎ ') : '    ') + file.padEnd(28) +
    (STRIP ? 'stripped' : tipCount + ' tip' + (tipCount === 1 ? '' : 's')));
}

console.log('\n' + (REPORT ? 'REPORT ONLY — nothing written' : touched + ' file(s) written, ' + skipped + ' unchanged'));
if (!STRIP) {
  const total = files.reduce((a, f) => a + (TIPS[+f.slice(0, 2)] || []).length, 0);
  console.log(total + ' tips across ' + files.length + ' chapters');
}
if (missing.length) {
  console.log('\nno tips injected for ' + missing.length + ' chapter(s): ' + missing.join(', '));
  process.exitCode = 1;
}
