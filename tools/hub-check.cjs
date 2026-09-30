#!/usr/bin/env node
/* Headless check of the Atlas home page.
     node tools/hub-check.cjs [--width 1440] [--height 2600] [--theme light|dark] [--shot out.png]
   Copies index.html to .hub-check.html with a probe injected into <head>. The probe seeds
   localStorage with a fixture and, once the chapter indexes have loaded, writes a JSON summary into
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
/* The page loads each released course's chapter index when the browser is idle; summarise only once
   all four have arrived (plus one tick for the repaint), or after 12 s so a broken load still reports. */
var INDEXES = ['SD_INDEX', 'ML_INDEX', 'DSA_INDEX', 'LLD_INDEX'], waited = 0;
function whenIndexed(f) {
  var ready = INDEXES.every(function (k) { return window[k]; });
  if (ready || waited >= 12000) return setTimeout(f, 100);
  waited += 200; setTimeout(function () { whenIndexed(f); }, 200);
}
window.addEventListener('load', function () { whenIndexed(function () {
  var q = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var chip = function (ch) { var cs = getComputedStyle(ch);
    return { id: ch.dataset.course, link: ch.tagName === 'A', soon: ch.classList.contains('soon'),
    opt: ch.classList.contains('opt'), done: ch.classList.contains('done'),
    fg: cs.color, k1: cs.getPropertyValue('--k1').trim(), k2: cs.getPropertyValue('--k2').trim() }; };
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
  if (window.parent !== window) window.parent.postMessage(pre.textContent, '*');   // phone-width runs (see FRAME)
}); });
</script>`;

const src = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const tmp = path.join(ROOT, '.hub-check.html');
fs.writeFileSync(tmp, src.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n' + PROBE));

/* Headless Chrome won't make a window narrower than ~500 px, so phone widths load the page
   in an iframe of exactly WIDTH px; the probe posts its summary up to this wrapper. */
const FRAME = WIDTH < 520;
const frameFile = path.join(ROOT, '.hub-check-frame.html');
if (FRAME) fs.writeFileSync(frameFile, '<!doctype html><meta charset="utf-8"><body style="margin:0">' +
  '<iframe src=".hub-check.html" style="width:' + WIDTH + 'px;height:' + HEIGHT + 'px;border:0;display:block"></iframe>' +
  '<script>addEventListener("message", function (e) { var p = document.createElement("pre"); p.id = "hub-probe"; ' +
  'p.hidden = true; p.textContent = e.data; document.body.appendChild(p); });</script>');
const fileUrl = 'file:///' + (FRAME ? frameFile : tmp).replace(/\\/g, '/');
const userDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hub-check-'));
const common = ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  '--user-data-dir=' + userDir, '--allow-file-access-from-files',
  '--window-size=' + Math.max(WIDTH, 520) + ',' + HEIGHT, '--virtual-time-budget=15000'];

let dom;
try {
  dom = execFileSync(CHROME, [...common, '--dump-dom', fileUrl], { encoding: 'utf8', maxBuffer: 64 << 20 });
  if (SHOT) execFileSync(CHROME, [...common, '--screenshot=' + path.resolve(SHOT), fileUrl], { stdio: 'ignore' });
} finally {
  fs.rmSync(tmp, { force: true });
  fs.rmSync(frameFile, { force: true });
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
  check('viewport is ' + WIDTH + 'px wide (±24 px of window chrome)', Math.abs(s.innerW - WIDTH) <= 24, s.innerW);
  check('no horizontal scroll', s.scrollW <= s.innerW, [s.scrollW, s.innerW]);
  console.log('paths');
  const GENERAL = ['dsa', 'os', 'networks', 'databases', 'lld', 'system-design', 'distributed-systems', 'cloud-devops', 'ml-ai-systems'];
  check('paths section is visible', !s.pathsHidden);
  check('featured path is the complete order', eq(s.featured.map((c) => c.id), GENERAL), s.featured.map((c) => c.id));
  check('featured: released steps link, unreleased ones are faded spans',
    s.featured.every((c) => c.link === !SOON.includes(c.id) && c.soon === SOON.includes(c.id)), s.featured);
  check('nine role paths in order', eq(s.paths.map((p) => p.id),
    ['campus', 'interview', 'backend', 'sre', 'data', 'ml', 'mlops', 'fundamentals', 'architect']), s.paths.map((p) => p.id));
  const P = Object.fromEntries(s.paths.map((p) => [p.id, p]));
  const ids = (p) => (P[p] ? P[p].chips.map((c) => c.id) : null);
  check('campus path steps', eq(ids('campus'), ['dsa', 'os', 'databases', 'networks', 'lld']), ids('campus'));
  check('backend path steps', eq(ids('backend'), ['databases', 'networks', 'os', 'lld', 'system-design', 'distributed-systems']), ids('backend'));
  check('optional steps are marked', P.interview && eq(P.interview.chips.filter((c) => c.opt).map((c) => c.id), ['distributed-systems']));
  check('a completed course shows a tick', P.interview && P.interview.chips.find((c) => c.id === 'lld').done &&
    !P.interview.chips.find((c) => c.id === 'dsa').done, P.interview);
  check('progress counts released required steps', P.campus && P.campus.prog === '1 of 2 courses complete · 3 coming soon', P.campus && P.campus.prog);
  check('progress with everything released', P.interview && P.interview.prog === '1 of 3 courses complete', P.interview && P.interview.prog);

  // Filled chips put text on the course gradient: it must stay readable at both ends of it.
  // Dark mode: 4.5:1 (WCAG AA). Light mode: 3:1 (AA for bold UI labels), since some light-mode
  // hues (amber, cyan, orange) can't reach 4.5:1 with any single text colour.
  const MIN = THEME === 'dark' ? 4.5 : 3;
  const weak = s.featured.filter((c) => !c.opt).map((c) => [c.id, Math.min(contrast(c.fg, c.k1), contrast(c.fg, c.k2))])
    .filter(([, r]) => r < MIN).map(([id, r]) => id + ' ' + r.toFixed(2));
  check('path chip text contrast ≥ ' + MIN + ':1 (' + THEME + ')', weak.length === 0, weak);
}

function rgb(c) {
  const h = c.match(/^#([0-9a-f]{6})$/i);
  if (h) return [0, 2, 4].map((i) => parseInt(h[1].slice(i, i + 2), 16));
  const m = c.match(/rgba?\(([^)]+)\)/); return m ? m[1].split(',').slice(0, 3).map(Number) : [0, 0, 0];
}
function contrast(a, b) {
  const L = (c) => { const [r, g, bl] = rgb(c).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl; };
  const [x, y] = [L(a), L(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05);
}

checks(s);
console.log(failed ? '\n' + failed + ' check(s) failed' : '\nall checks passed');
process.exit(failed ? 1 : 0);
