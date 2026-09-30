#!/usr/bin/env node
/* =========================================================
   tools/new-course.cjs — create a course shell from the LLD course.

     node tools/new-course.cjs <course-id>

   Reads the course from assets/atlas.js (title, colours, mark, store
   prefix, runtime namespace, first page, dist name, code language) and
   its plan from <dir>/tools/chapters.cjs, then:
     1. copies the LLD shell (runtime, styles, study tools, build, tools)
        into <dir>/, skipping files that already exist;
     2. renames the runtime namespace, storage keys, title and dist file;
     3. applies the course's two-hue palette (light c1/c2, dark d1/d2);
     4. swaps in the course logo and the six standard levels;
     5. runs <dir>/tools/scaffold.cjs --registry (registry + placeholder
        pages) and builds the study data.
   Course-specific copy (home page, glossary, mock interview, README) is
   left for the course session: see docs/course-playbook.md.
   ========================================================= */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { ROOT, byId, ns } = require('./registry.cjs');

const id = process.argv[2];
const c = id && byId(id);
if (!c) { console.error('usage: node tools/new-course.cjs <course-id>   (an id from assets/atlas.js)'); process.exit(1); }
const DIR = path.join(ROOT, c.dir);
const PLAN_FILE = path.join(DIR, 'tools/chapters.cjs');
if (!fs.existsSync(PLAN_FILE)) { console.error('✗ write ' + path.relative(ROOT, PLAN_FILE) + ' first (the chapter plan)'); process.exit(1); }
const PLAN = require(PLAN_FILE);

const SHELL = ['assets/app.js', 'assets/style.css', 'build.js', 'index.html', 'glossary.html', 'flashcards.html',
  'mock-interview.html', 'README.md', 'LICENSE', 'src/router.js', 'tools/build-study-data.js', 'tools/scaffold.cjs'];
const LLD_MARK = '<rect x="3" y="2.5" width="12" height="11" rx="1.6"/><path d="M3 6.2h12M3 9.8h12"/><path d="M9 13.5l1.4 1.6L9 16.7l-1.4-1.6z" fill="currentColor"/><path d="M9 16.7v2.3h4"/><rect x="13" y="16" width="8" height="5.5" rx="1.5"/>';
const NS = ns(c), P = c.store;

const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
const LEVEL_TEXT = PLAN.levels || {};
const LEVELS = `  const LEVELS = [
    ['Prerequisites', 'var(--green)', '${esc(LEVEL_TEXT.Prerequisites || 'The basics every chapter assumes, taught from zero.')}'],
    ['Beginner', 'var(--accent)', '${esc(LEVEL_TEXT.Beginner || 'The core ideas, one at a time.')}'],
    ['Intermediate', 'color-mix(in srgb, var(--accent-2) 25%, var(--accent))', '${esc(LEVEL_TEXT.Intermediate || 'How it really works underneath.')}'],
    ['Advanced', 'color-mix(in srgb, var(--accent-2) 50%, var(--accent))', '${esc(LEVEL_TEXT.Advanced || 'Scale, performance and the hard parts.')}'],
    ['Expert', 'color-mix(in srgb, var(--accent-2) 75%, var(--accent))', '${esc(LEVEL_TEXT.Expert || 'Debugging, tuning and the interview playbook.')}'],
    ['Case Studies', 'var(--accent-2)', '${esc(LEVEL_TEXT['Case Studies'] || 'Real systems, traced end to end.')}'],
  ];
`;
function esc(s) { return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'"); }

let copied = 0;
for (const f of SHELL) {
  const to = path.join(DIR, f);
  if (fs.existsSync(to)) continue;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  let s = fs.readFileSync(path.join(ROOT, 'lld', f), 'utf8');
  s = s.replace(/lld-course\.html/g, c.dist)
    .replace(/lld:placeholder/g, P + ':placeholder')
    .replace(/__LLD/g, '__' + NS).replace(/LLD_/g, NS + '_').replace(/\bLLD\b/g, NS)
    .replace(/\[lld\]/g, '[' + P + ']').replace(/lld-/g, P + '-')
    .replace(/Low-Level Design/g, c.title)
    .split(LLD_MARK).join(c.mark);
  if (f === 'assets/style.css') {
    const light = [['--accent: #4f46e5;', `--accent: ${c.c1};`], ['--accent-soft: rgba(79,70,229,.12);', `--accent-soft: ${rgba(c.c1, '.12')};`],
      ['--accent-2: #7c3aed;', `--accent-2: ${c.c2};`], ['--accent-2-soft: rgba(124,58,237,.12);', `--accent-2-soft: ${rgba(c.c2, '.12')};`]];
    const dark = [['--accent: #818cf8;', `--accent: ${c.d1};`], ['--accent-soft: rgba(129,140,248,.15);', `--accent-soft: ${rgba(c.d1, '.15')};`],
      ['--accent-2: #a78bfa;', `--accent-2: ${c.d2};`], ['--accent-2-soft: rgba(167,139,250,.13);', `--accent-2-soft: ${rgba(c.d2, '.13')};`]];
    for (const [a, b] of light.concat(dark)) { if (!s.includes(a)) throw new Error('style.css: token not found: ' + a); s = s.split(a).join(b); }
  }
  if (f === 'assets/app.js') {
    const a = s.indexOf('  const LEVELS = ['), b = s.indexOf('  ];', a) + 5;
    s = s.slice(0, a) + LEVELS + s.slice(b);
  }
  if (f === 'tools/scaffold.cjs') s = s.replace('a simulator, Java listings,', `a simulator, ${c.lang || 'code'} listings,`);
  if (f === 'build.js') s = s.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="Palak Deb Patra's ${c.title} Playlist — ${c.blurb.replace(/"/g, '&quot;')} Single-file offline edition.">`);
  if (f === 'index.html') s = s.replace('href="p1-classes-objects.html"', `href="${c.first}"`)
    .replace('linear-gradient(100deg,#4f46e5,#7c3aed)', `linear-gradient(100deg,${c.c1},${c.c2})`);   // hero title
  fs.writeFileSync(to, s);
  copied++;
}
fs.mkdirSync(path.join(DIR, 'dist'), { recursive: true });
console.log(`✓ ${c.dir}/: ${copied} shell file(s) copied from lld/ (${SHELL.length - copied} already there)`);

if (PLAN[0].slug + '.html' !== c.first) console.warn(`! atlas.js "first" is ${c.first} but the plan's first page is ${PLAN[0].slug}.html`);
execFileSync(process.execPath, [path.join(DIR, 'tools/scaffold.cjs'), '--registry'], { stdio: 'inherit' });
execFileSync(process.execPath, [path.join(DIR, 'tools/build-study-data.js')], { stdio: 'inherit', cwd: DIR });
