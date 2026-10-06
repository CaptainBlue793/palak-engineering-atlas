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
function chapters(c) {
  const w = {};
  new Function('window', fs.readFileSync(path.join(ROOT, c.dir, 'assets/study-data.js'), 'utf8'))(w);
  return w[c.indexVar].map((x) => x.n);
}
// Everything expected below comes from the Atlas registry (assets/atlas.js), so releasing a course
// (removing `soon`) needs no change here.
const REG = require('./registry.cjs');
const LIVE = REG.COURSES.filter((c) => !c.soon), SOON = REG.COURSES.filter((c) => c.soon);
const COMPLETE = REG.byId('lld').soon ? LIVE[LIVE.length - 1] : REG.byId('lld');   // one released course marked complete
const PARTIAL = LIVE.find((c) => c !== COMPLETE);                                   // one with 3 chapters read
const STALE = SOON[0];                                                              // progress saved for an unreleased course
const COMPLETE_ALL = chapters(COMPLETE);
const TOTAL = LIVE.reduce((n, c) => n + chapters(c).length, 0);

const FIXTURE = {
  'atlas-theme': JSON.stringify(THEME),
  [PARTIAL.store + '-done']: '[1,2,3]',
  [COMPLETE.store + '-done']: JSON.stringify(COMPLETE_ALL),
};
if (STALE) FIXTURE[STALE.store + '-done'] = '[1,2,3,4,5]';   // must be ignored everywhere

const PROBE = `<script>
localStorage.clear();
Object.entries(${JSON.stringify(FIXTURE)}).forEach(function (e) { localStorage.setItem(e[0], e[1]); });
/* The page loads each released course's chapter index when the browser is idle; summarise only once
   all four have arrived (plus one tick for the repaint), or after 12 s so a broken load still reports. */
var INDEXES = ${JSON.stringify(LIVE.map((c) => c.indexVar))}, waited = 0;
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
    fg: cs.color, k1: cs.getPropertyValue('--k1').trim(), k2: cs.getPropertyValue('--k2').trim(),
    text: ch.textContent.replace(/[ \\t\\n]+/g, ' ').trim() }; };
  var grid = document.getElementById('pathGrid');
  var s = {
    cards: q('#courseGrid article.course').map(function (a) { return { id: a.dataset.course, soon: a.classList.contains('soon'), links: q('a[href]', a).length, k1: getComputedStyle(a).getPropertyValue('--k1').trim() }; }),
    featured: q('#pathFeatured .pchip').map(chip),
    paths: q('#pathGrid .path').map(function (p) { return { id: p.dataset.path, chips: q('.pchip', p).map(chip), prog: ((p.querySelector('.pprog') || {}).textContent || '').trim() }; }),
    pathsHidden: grid ? grid.hidden : true,
    progTxt: document.getElementById('progTxt').textContent,
    mosaic: q('#mosaic .mgroup').map(function (g) { var nm = g.querySelector('.nm'), ct = g.querySelector('.ct');
      return { name: nm ? nm.textContent : '', soon: g.classList.contains('soon'), links: q('a[href]', g).length,
        squares: q('.mosaic > *', g).length, done: q('.mosaic .done', g).length, ct: ct ? ct.textContent : '',
        lines: new Set(q('.mosaic > *', g).map(function (sq) { return Math.round(sq.getBoundingClientRect().top); })).size,
        size: (function () { var f = g.querySelector('.mosaic > *'); return f ? Math.round(f.getBoundingClientRect().width * 10) / 10 : 0; })() }; }),
    filters: q('#palFilters [data-f]').map(function (c) { return c.dataset.f; }),
    studyScripts: q('script[src]').map(function (x) { return x.getAttribute('src'); }).filter(function (x) { return /study-data/.test(x); }),
    scrollW: document.documentElement.scrollWidth, innerW: window.innerWidth,
    theme: document.documentElement.getAttribute('data-theme'),
    lead: ((document.getElementById('leadCount') || {}).textContent || '').trim(),
    // Right edge of the widest line of the hero title vs the left edge of the tracker beside it.
    titleGap: (function () {
      var h = document.querySelector('.hero h1'), m = document.querySelector('.hero .map'); if (!h || !m) return null;
      var r = document.createRange(); r.selectNodeContents(h);
      var right = Math.max.apply(null, Array.prototype.map.call(r.getClientRects(), function (x) { return x.right; }));
      var mt = m.getBoundingClientRect(), ht = h.getBoundingClientRect();
      return mt.top < ht.bottom && mt.bottom > ht.top ? Math.round(mt.left - right) : 999;   // 999: stacked, not side by side
    })(),
    stats: q('#stats .stat').map(function (x) { return q('b, span', x).map(function (e) { return e.textContent; }).join(' '); }),
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
  // Chrome can hold the profile for a moment after exiting; retry, then give up quietly.
  try { fs.rmSync(userDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }); } catch (e) {}
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

const isSoon = (id) => SOON.some((c) => c.id === id);
const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const word = (n) => WORDS[n] || String(n);
// The same rule as atlas.js pathProgress: released required steps complete, plus unreleased ones counted.
function expectedProg(p) {
  const req = p.steps.map(REG.byId).filter(Boolean), live = req.filter((c) => !c.soon);
  if (!live.length) return 'Coming soon';
  const done = live.filter((c) => c === COMPLETE).length, soon = req.length - live.length;
  return done + ' of ' + live.length + ' courses complete' + (soon ? ' · ' + soon + ' coming soon' : '');
}

function checks(s) {
  console.log('courses (' + WIDTH + 'px, ' + THEME + ')');
  check('every course card, in registry order', eq(s.cards.map((c) => c.id), REG.COURSES.map((c) => c.id)), s.cards.map((c) => c.id));
  check('unreleased courses are "coming soon"', eq(s.cards.filter((c) => c.soon).map((c) => c.id), SOON.map((c) => c.id)));
  check('coming-soon cards have no links', s.cards.filter((c) => c.soon).every((c) => c.links === 0), s.cards);
  check('released cards keep their links', s.cards.filter((c) => !c.soon).every((c) => c.links >= 3), s.cards);
  check('combined progress counts released courses only', s.progTxt === (3 + COMPLETE_ALL.length) + ' of ' + TOTAL + ' chapters read', s.progTxt);
  check('tracker lists every course in order', eq(s.mosaic.map((g) => g.name), REG.COURSES.map((c) => c.title)), s.mosaic.map((g) => g.name));
  const soonRows = s.mosaic.filter((g) => g.soon);
  check('upcoming rows are marked "Soon"', soonRows.length === SOON.length && soonRows.every((g) => g.ct === 'Soon'), soonRows);
  check('upcoming rows have no links and one ghost square per planned chapter',
    soonRows.every((g, i) => g.links === 0 && g.squares === SOON[i].chapters), soonRows.map((g) => [g.name, g.links, g.squares]));
  check('stale progress never fills an upcoming row' + (STALE ? ' (' + STALE.store + '-done is set)' : ''), soonRows.every((g) => g.done === 0), soonRows.map((g) => g.done));
  check('released rows are unchanged', s.mosaic.filter((g) => !g.soon).every((g) => g.links === g.squares + 1), s.mosaic.filter((g) => !g.soon));
  // Laptop and wider: one line of squares per course, all rows the same square size, big enough to click.
  // Phones wrap (64 squares on one 390 px line would be ~4 px each).
  if (WIDTH >= 1280) {
    check('each tracker row is one line of squares', s.mosaic.every((g) => g.lines === 1), s.mosaic.map((g) => [g.name, g.lines]));
    const sizes = [...new Set(s.mosaic.map((g) => g.size))];
    check('every row uses the same square size, at least 7 px', sizes.length === 1 && sizes[0] >= 7, sizes);
  }
  check('search filters list released courses only', eq(s.filters, ['all'].concat(LIVE.map((c) => c.id))), s.filters);
  check('study data requested for released courses only',
    s.studyScripts.length === LIVE.length && s.studyScripts.every((x) => !SOON.some((c) => x.startsWith(c.dir + '/'))), s.studyScripts);
  const last = REG.COURSES[REG.COURSES.length - 1], k1 = (s.cards.find((c) => c.id === last.id) || {}).k1 || '';
  check('theme colours: ' + last.title + ' uses its ' + THEME + ' pair', k1.toLowerCase() === (THEME === 'dark' ? last.d1 : last.c1), k1);
  check('viewport is ' + WIDTH + 'px wide (±24 px of window chrome)', Math.abs(s.innerW - WIDTH) <= 24, s.innerW);
  check('no horizontal scroll', s.scrollW <= s.innerW, [s.scrollW, s.innerW]);

  console.log('paths');
  check('paths section is visible', !s.pathsHidden);
  check('featured path is the complete order', eq(s.featured.map((c) => c.id), REG.FEATURED.steps), s.featured.map((c) => c.id));
  check('featured: released steps link, unreleased ones are faded spans',
    s.featured.every((c) => c.link === !isSoon(c.id) && c.soon === isSoon(c.id)), s.featured);
  check('role paths in order', eq(s.paths.map((p) => p.id), REG.PATHS.map((p) => p.id)), s.paths.map((p) => p.id));
  const P = Object.fromEntries(s.paths.map((p) => [p.id, p]));
  check('each path lists its steps, then its optional steps', REG.PATHS.every((p) => P[p.id] &&
    eq(P[p.id].chips.map((c) => c.id), p.steps.concat(p.optional)) && eq(P[p.id].chips.filter((c) => c.opt).map((c) => c.id), p.optional)),
    REG.PATHS.filter((p) => !P[p.id] || !eq(P[p.id].chips.map((c) => c.id), p.steps.concat(p.optional))).map((p) => p.id));
  check('a completed course shows a tick, others do not', s.featured.every((c) => c.done === (c.id === COMPLETE.id)), s.featured.map((c) => [c.id, c.done]));
  const wrong = REG.PATHS.filter((p) => !P[p.id] || P[p.id].prog !== expectedProg(p)).map((p) => [p.id, P[p.id] && P[p.id].prog, expectedProg(p)]);
  check('every path counts released required steps', wrong.length === 0, wrong);

  // Filled chips put text on the course gradient: it must stay readable at both ends of it.
  // Dark mode: 4.5:1 (WCAG AA). Light mode: 3:1 (AA for bold UI labels), since some light-mode
  // hues (amber, cyan, orange) can't reach 4.5:1 with any single text colour.
  const MIN = THEME === 'dark' ? 4.5 : 3;
  const weak = s.featured.filter((c) => !c.opt).map((c) => [c.id, Math.min(contrast(c.fg, c.k1), contrast(c.fg, c.k2))])
    .filter(([, r]) => r < MIN).map(([id, r]) => id + ' ' + r.toFixed(2));
  check('path chip text contrast ≥ ' + MIN + ':1 (' + THEME + ')', weak.length === 0, weak);

  // Chip states must be in the text, not only in fading and dashes, so screen readers announce them.
  const F = Object.fromEntries(s.featured.map((c) => [c.id, c.text]));
  if (STALE) check('unreleased chips say "coming soon"', /\(coming soon\)/.test(F[STALE.id] || ''), F[STALE.id]);
  check('completed chips say "complete"', /\(complete\)/.test(F[COMPLETE.id] || ''), F[COMPLETE.id]);
  const optChip = s.paths.flatMap((p) => p.chips).find((c) => c.opt);
  check('optional chips say "optional"', optChip && /\(optional/.test(optChip.text), optChip && optChip.text);

  console.log('copy');
  const all = word(REG.COURSES.length);
  const lead = all[0].toUpperCase() + all.slice(1) + ' courses' + (SOON.length ? ', ' + word(LIVE.length) + ' out now and ' + word(SOON.length) + ' on the way,' : ',');
  check('hero lead counts courses from the registry', s.lead === lead, [s.lead, lead]);
  check('stats show released and upcoming courses', s.stats[0] === LIVE.length + ' courses' &&
    (SOON.length ? s.stats[1] === SOON.length + ' on the way' : !s.stats.some((x) => /on the way/.test(x))), s.stats);
  check('hero title keeps clear of the tracker (≥ 24 px)', s.titleGap === null || s.titleGap >= 24, s.titleGap);
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
