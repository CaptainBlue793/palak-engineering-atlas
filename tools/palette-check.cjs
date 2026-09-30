#!/usr/bin/env node
/* Checks each course's second accent colour against the Set C palette
   (docs/superpowers/specs/2026-09-30-atlas-expansion-design.md §3).
   style.css defines --accent-2 three times: light, then dark (media query), then dark ([data-theme]).
     node tools/palette-check.cjs */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');

// dir: [light accent-2, light soft, dark accent-2, dark soft]
const EXPECT = {
  'system-design': ['#0891b2', 'rgba(8,145,178,.12)', '#22d3ee', 'rgba(34,211,238,.13)'],
  'dsa': ['#e11d48', 'rgba(225,29,72,.12)', '#fb7185', 'rgba(251,113,133,.13)'],
  'lld': ['#7c3aed', 'rgba(124,58,237,.12)', '#a78bfa', 'rgba(167,139,250,.13)'],
};
// Course home pages that hard-code their hero title gradient: dir -> [c1, c2].
const HERO = { 'dsa': ['#c026d3', '#e11d48'], 'lld': ['#4f46e5', '#7c3aed'] };

let failed = 0;
const check = (name, ok, detail) => { console.log((ok ? '  ✓ ' : '  ✗ ') + name + (ok ? '' : '  ' + detail)); if (!ok) failed++; };

for (const [dir, [l, ls, d, ds]] of Object.entries(EXPECT)) {
  const css = fs.readFileSync(path.join(ROOT, dir, 'assets/style.css'), 'utf8');
  const a2 = [...css.matchAll(/--accent-2:\s*([^;]+);/g)].map((m) => m[1].trim());
  const soft = [...css.matchAll(/--accent-2-soft:\s*([^;]+);/g)].map((m) => m[1].replace(/\s+/g, ''));
  check(dir + ' --accent-2 light/dark/dark', JSON.stringify(a2) === JSON.stringify([l, d, d]), JSON.stringify(a2));
  check(dir + ' --accent-2-soft light/dark/dark', JSON.stringify(soft) === JSON.stringify([ls, ds, ds]), JSON.stringify(soft));
}
for (const [dir, [c1, c2]] of Object.entries(HERO)) {
  const html = fs.readFileSync(path.join(ROOT, dir, 'index.html'), 'utf8');
  check(dir + ' hero title gradient', html.includes('linear-gradient(100deg,' + c1 + ',' + c2 + ')'), 'not found');
}
console.log(failed ? failed + ' check(s) failed' : 'all checks passed');
process.exit(failed ? 1 : 0);
