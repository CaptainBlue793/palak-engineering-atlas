#!/usr/bin/env node
/* ---------------------------------------------------------------------------
   Injects resource links into every .pitem in every chapter.

     node tools/lc-links.js              inject / refresh all chapters
     node tools/lc-links.js --report     show what would happen, write nothing
     node tools/lc-links.js --refresh    re-download the LeetCode slug list first
     node tools/lc-links.js 41 42        limit to specific chapters

   Idempotent: existing <a class="lc"> anchors are stripped and rebuilt, so it
   is safe to re-run after editing a chapter or the map.

   Slug validation: tools/lc-slugs.json holds {slug: [id, title, paidOnly]} for
   every LeetCode problem, fetched from the public problem list. Any slug in
   lc-map.js that is not in that file is reported as an error and NOT linked,
   so a typo can never ship as a dead link. Non-LeetCode targets (full URLs)
   are passed through as-is.
   --------------------------------------------------------------------------- */

'use strict';
const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.join(__dirname, '..');
const SLUGS = path.join(__dirname, 'lc-slugs.json');
const MAP = require('./lc-map.js');

const args = process.argv.slice(2);
const REPORT = args.includes('--report');
const REFRESH = args.includes('--refresh');
const ONLY = args.filter((a) => /^\d+$/.test(a)).map((a) => a.padStart(2, '0'));

/* ---------------- slug table ---------------- */

function download() {
  return new Promise((resolve, reject) => {
    const req = https.get(
      'https://leetcode.com/api/problems/all/',
      { headers: { 'User-Agent': 'Mozilla/5.0' } },
      (res) => {
        if (res.statusCode !== 200) return reject(new Error('HTTP ' + res.statusCode));
        let body = '';
        res.on('data', (d) => (body += d));
        res.on('end', () => {
          try {
            const pairs = JSON.parse(body).stat_status_pairs;
            const out = {};
            for (const p of pairs) {
              out[p.stat.question__title_slug] = [
                p.stat.frontend_question_id,
                p.stat.question__title,
                p.paid_only ? 1 : 0,
              ];
            }
            fs.writeFileSync(SLUGS, JSON.stringify(out));
            resolve(out);
          } catch (e) { reject(e); }
        });
      }
    );
    req.on('error', reject);
    req.setTimeout(30000, () => req.destroy(new Error('timeout')));
  });
}

async function loadSlugs() {
  if (REFRESH || !fs.existsSync(SLUGS)) {
    process.stdout.write(REFRESH ? 'refreshing slug list... ' : 'fetching slug list (first run)... ');
    try {
      const t = await download();
      console.log(Object.keys(t).length + ' problems');
      return t;
    } catch (e) {
      console.log('failed (' + e.message + ')');
      if (fs.existsSync(SLUGS)) {
        console.log('  falling back to the cached list');
      } else {
        console.error('\nNo cached slug list and the download failed. Re-run with network access.');
        process.exit(1);
      }
    }
  }
  return JSON.parse(fs.readFileSync(SLUGS, 'utf8'));
}

/* ---------------- matching ---------------- */

// Normalise an item's text for matching: strip tags/entities, lowercase,
// unify the dashes and quotes the prose uses so needles stay readable.
function norm(html) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"')
    .replace(/[‘’]/g, "'").replace(/[“”]/g, '"')
    .replace(/—/g, ' — ')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

// Longest-match-wins over non-overlapping spans, returned in reading order.
// This is what lets "Stone game I and II; predict the winner" pick up two
// links while "Single number II" does not also match "single number".
function matchTargets(text) {
  const hits = [];
  for (const [needle, target] of MAP) {
    let from = 0, at;
    while ((at = text.indexOf(needle, from)) !== -1) {
      hits.push({ at, end: at + needle.length, needle, target });
      from = at + 1;
    }
  }
  hits.sort((a, b) => b.needle.length - a.needle.length);
  const taken = [];
  for (const h of hits) {
    if (taken.some((t) => h.at < t.end && t.at < h.end)) continue;
    taken.push(h);
  }
  taken.sort((a, b) => a.at - b.at);
  const seen = new Set();
  return taken.filter((h) => !seen.has(h.target) && seen.add(h.target)).slice(0, 3);
}

/* ---------------- link rendering ---------------- */

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function render(hits, slugs, errors, file) {
  const out = [];
  for (const h of hits) {
    if (/^https?:\/\//.test(h.target)) {
      const host = h.target.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
      const label = host.startsWith('cp-algorithms') ? 'CP'
        : host.startsWith('en.wikipedia') ? 'WIKI'
        : host.startsWith('www.geeksforgeeks') || host.startsWith('geeksforgeeks') ? 'GfG'
        : 'REF';
      out.push({ href: h.target, label, cls: 'lc ref', title: h.target });
      continue;
    }
    const rec = slugs[h.target];
    if (!rec) {
      errors.push(file + ': unknown LeetCode slug "' + h.target + '" (needle: "' + h.needle + '")');
      continue;
    }
    const [id, title, paid] = rec;
    out.push({
      href: 'https://leetcode.com/problems/' + h.target + '/',
      label: 'LC ' + id,
      cls: 'lc' + (paid ? ' paid' : ''),
      title: title + (paid ? ' — LeetCode Premium' : ''),
    });
  }
  if (!out.length) return '';
  return '<span class="lcs">' + out.map((o) =>
    '<a class="' + o.cls + '" href="' + esc(o.href) + '" target="_blank" rel="noopener" title="' + esc(o.title) + '">' + o.label + '</a>'
  ).join('') + '</span>';
}

/* ---------------- main ---------------- */

(async function main() {
  const slugs = await loadSlugs();

  // sanity-check the whole map up front, not just the needles that happen to hit
  const bad = [];
  for (const [needle, target] of MAP) {
    if (!/^https?:\/\//.test(target) && !slugs[target]) bad.push(target + '  (needle: "' + needle + '")');
  }
  if (bad.length) {
    console.error('\n' + bad.length + ' invalid slug(s) in tools/lc-map.js:');
    bad.forEach((b) => console.error('  ✗ ' + b));
    console.error('\nFix these before injecting. Nothing was written.');
    process.exit(1);
  }

  let files = fs.readdirSync(ROOT).filter((f) => /^\d\d-.*\.html$/.test(f)).sort();
  if (ONLY.length) files = files.filter((f) => ONLY.includes(f.slice(0, 2)));

  const errors = [], unmatched = [];
  let totalItems = 0, totalLinked = 0, totalChips = 0, changedFiles = 0;

  for (const file of files) {
    const p = path.join(ROOT, file);
    let src = fs.readFileSync(p, 'utf8');
    const before = src;
    let items = 0, linked = 0, chips = 0;

    src = src.replace(/<div class="pitem">([\s\S]*?)<\/div>\s*(?=<div class="pitem">|<\/div>)/g, (whole) => whole);

    src = src.replace(/(<div class="pitem">)([\s\S]*?)(<\/div>)/g, (m, open, inner, close) => {
      items++;
      // strip any previously injected chips so the run is idempotent
      inner = inner.replace(/<span class="lcs">[\s\S]*?<\/span>\s*$/, '');
      const spans = [...inner.matchAll(/<span(?:\s+class="([^"]*)")?>([\s\S]*?)<\/span>/g)];
      const body = spans.find((s) => !s[1]);           // the untagged span = description
      if (!body) return open + inner + close;
      const text = norm(body[2]);
      const hits = matchTargets(text);
      if (!hits.length) {
        const diff = spans[0] ? norm(spans[0][2]) : '';
        if (!/drill|do it|same/.test(diff)) unmatched.push(file + '  ' + text.slice(0, 92));
        return open + inner + close;
      }
      const html = render(hits, slugs, errors, file);
      if (!html) return open + inner + close;
      linked++; chips += (html.match(/<a /g) || []).length;
      return open + inner + html + close;
    });

    totalItems += items; totalLinked += linked; totalChips += chips;
    const changed = src !== before;
    if (changed) changedFiles++;
    if (!REPORT && changed) fs.writeFileSync(p, src);
    console.log(
      (changed ? (REPORT ? '  ~ ' : '  ✎ ') : '    ') +
      file.padEnd(28) + String(linked).padStart(3) + '/' + String(items).padEnd(3) + ' items linked,  ' +
      String(chips).padStart(3) + ' links'
    );
  }

  console.log('\n' + (REPORT ? 'REPORT ONLY — nothing written' : changedFiles + ' file(s) written'));
  console.log(totalLinked + ' of ' + totalItems + ' practice items linked (' + totalChips + ' links total)');

  if (errors.length) {
    console.log('\n' + errors.length + ' error(s):');
    errors.forEach((e) => console.log('  ✗ ' + e));
  }
  if (unmatched.length) {
    console.log('\n' + unmatched.length + ' unmatched item(s) — add a needle to tools/lc-map.js if these should link:');
    unmatched.forEach((u) => console.log('  · ' + u));
  }
  process.exit(errors.length ? 1 : 0);
})();
