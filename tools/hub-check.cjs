#!/usr/bin/env node
/* Headless check of the Atlas home page.
     node tools/hub-check.cjs [--width 1440] [--height 2600] [--theme light|dark] [--shot out.png]
   Copies index.html to .hub-check.html with a probe injected into <head>. The probe seeds
   localStorage with a fixture, and 4 s after load writes a JSON summary of the page into
   <pre id="hub-probe">. Chrome's --dump-dom returns the DOM; the checks run on that summary. */
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i < 0 ? d : args[i + 1]; };
const WIDTH = +opt('width', 1440), HEIGHT = +opt('height', 2600), THEME = opt('theme', 'light'), SHOT = opt('shot', null);

const CHROME = [process.env.CHROME,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find((p) => p && fs.existsSync(p));
if (!CHROME) { console.error('No Chrome found; set CHROME=/path/to/chrome'); process.exit(2); }

/* Chapter numbers of a released course, read from its generated study-data.js. */
function chapters(dir, v) {
  const w = {};
  new Function('window', fs.readFileSync(path.join(ROOT, dir, 'assets/study-data.js'), 'utf8'))(w);
  return w[v].map((c) => c.n);
}
const RELEASED = [['system-design', 'SD_INDEX'], ['ml-ai-systems', 'ML_INDEX'], ['dsa', 'DSA_INDEX'], ['lld', 'LLD_INDEX']];
const LLD_ALL = chapters('lld', 'LLD_INDEX');
const TOTAL = RELEASED.reduce((s, [d, v]) => s + chapters(d, v).length, 0);

const FIXTURE = {
  'atlas-theme': JSON.stringify(THEME),
  'sd-done': '[1,2,3]',
  'lld-done': JSON.stringify(LLD_ALL),   // LLD complete
  'os-done': '[1,2,3,4,5]',              // not released yet: must be ignored everywhere
};

const PROBE = `<script>
localStorage.clear();
Object.entries(${JSON.stringify(FIXTURE)}).forEach(function (e) { localStorage.setItem(e[0], e[1]); });
window.addEventListener('load', function () { setTimeout(function () {
  var q = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var chip = function (ch) { return { id: ch.dataset.course, link: ch.tagName === 'A', soon: ch.classList.contains('soon'),
    opt: ch.classList.contains('opt'), done: ch.classList.contains('done') }; };
  var grid = document.getElementById('pathGrid');
  var devops = document.querySelector('#courseGrid [data-course="cloud-devops"]');
  var s = {
    cards: q('#courseGrid article.course').map(function (a) { return { id: a.dataset.course, soon: a.classList.contains('soon'), links: q('a[href]', a).length }; }),
    featured: q('#pathFeatured .pchip').map(chip),
    paths: q('#pathGrid .path').map(function (p) { return { id: p.dataset.path, chips: q('.pchip', p).map(chip), prog: ((p.querySelector('.pprog') || {}).textContent || '').trim() }; }),
    pathsHidden: grid ? grid.hidden : true,
    progTxt: document.getElementById('progTxt').textContent,
    mosaic: q('#mosaic .mgroup .nm').map(function (a) { return a.textContent; }),
    filters: q('#palFilters [data-f]').map(function (c) { return c.dataset.f; }),
    studyScripts: q('script[src]').map(function (x) { return x.getAttribute('src'); }).filter(function (x) { return /study-data/.test(x); }),
    devopsK1: devops ? getComputedStyle(devops).getPropertyValue('--k1').trim() : '',
    scrollW: document.documentElement.scrollWidth, innerW: window.innerWidth,
    theme: document.documentElement.getAttribute('data-theme'),
  };
  var pre = document.createElement('pre'); pre.id = 'hub-probe'; pre.hidden = true; pre.textContent = JSON.stringify(s);
  document.body.appendChild(pre);
}, 4000); });
</script>`;

const src = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const tmp = path.join(ROOT, '.hub-check.html');
fs.writeFileSync(tmp, src.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n' + PROBE));
const fileUrl = 'file:///' + tmp.replace(/\\/g, '/');
const userDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hub-check-'));
const common = ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  '--user-data-dir=' + userDir, '--allow-file-access-from-files',
  '--window-size=' + WIDTH + ',' + HEIGHT, '--virtual-time-budget=15000'];

let dom;
try {
  dom = execFileSync(CHROME, [...common, '--dump-dom', fileUrl], { encoding: 'utf8', maxBuffer: 64 << 20 });
  if (SHOT) execFileSync(CHROME, [...common, '--screenshot=' + path.resolve(SHOT), fileUrl], { stdio: 'ignore' });
} finally {
  fs.rmSync(tmp, { force: true });
}

const m = dom.match(/<pre id="hub-probe"[^>]*>([\s\S]*?)<\/pre>/);
if (!m) { console.error('The probe never ran (no #hub-probe in the DOM).'); process.exit(1); }
const s = JSON.parse(m[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&'));

let failed = 0;
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function check(name, ok, detail) {
  if (ok) console.log('  ✓', name);
  else { failed++; console.log('  ✗', name, detail === undefined ? '' : JSON.stringify(detail)); }
}

const ORDER = ['system-design', 'ml-ai-systems', 'dsa', 'lld', 'os', 'networks', 'databases', 'distributed-systems', 'cloud-devops'];
const SOON = ORDER.slice(4);

function checks(s) {
  console.log('courses (' + WIDTH + 'px, ' + THEME + ')');
  check('nine course cards in palette order', eq(s.cards.map((c) => c.id), ORDER), s.cards.map((c) => c.id));
  check('the five new courses are "coming soon"', eq(s.cards.filter((c) => c.soon).map((c) => c.id), SOON));
  check('coming-soon cards have no links', s.cards.filter((c) => c.soon).every((c) => c.links === 0), s.cards);
  check('released cards keep their links', s.cards.filter((c) => !c.soon).every((c) => c.links >= 3), s.cards);
  check('combined progress counts released courses only', s.progTxt === (3 + LLD_ALL.length) + ' of ' + TOTAL + ' chapters read', s.progTxt);
  check('mosaic shows released courses only', eq(s.mosaic, ['System Design', 'ML & AI Systems', 'DSA', 'Low-Level Design']), s.mosaic);
  check('search filters list released courses only', eq(s.filters, ['all', 'system-design', 'ml-ai-systems', 'dsa', 'lld']), s.filters);
  check('no study-data requested for unreleased courses',
    s.studyScripts.length === 4 && s.studyScripts.every((x) => !SOON.some((d) => x.startsWith(d + '/'))), s.studyScripts);
  check('theme colours: Cloud & DevOps uses its ' + THEME + ' pair',
    s.devopsK1.toLowerCase() === (THEME === 'dark' ? '#94a3b8' : '#334155'), s.devopsK1);
  check('no horizontal scroll', s.scrollW <= s.innerW, [s.scrollW, s.innerW]);
}

checks(s);
console.log(failed ? '\n' + failed + ' check(s) failed' : '\nall checks passed');
process.exit(failed ? 1 : 0);
