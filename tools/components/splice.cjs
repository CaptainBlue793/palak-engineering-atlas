// Apply section edits to a chapter from a plain-text spec.
//   node tools/components/splice.cjs <file> <spec.txt>
// Spec blocks (anchors are single lines of literal text from the file):
//   @@ REPLACE <from anchor>            replace [from, until) with the body
//   @@ UNTIL <until anchor>             (searched after the from anchor; not removed)
//   …html…
//   @@ END
//   @@ BEFORE <anchor>                  insert the body immediately before the anchor
//   @@ AFTER <anchor>                   insert the body immediately after the anchor
//   @@ SUB <literal>  /  @@ WITH <literal>   one-line exact substitution (no body, no END)
//   @@ SKIPTO <unique anchor>           the next block searches for its anchor after this landmark
// Every anchor must occur exactly once in the file at the time its block runs.
const fs = require('fs');
const [file, specFile] = process.argv.slice(2);
let src = fs.readFileSync(file, 'utf8');
const original = src;
const lines = fs.readFileSync(specFile, 'utf8').replace(/\r\n/g, '\n').split('\n');
const nl = src.includes('\r\n') ? '\r\n' : '\n';
function find(needle, start = 0) {
  const i = src.indexOf(needle, start);
  if (i < 0) throw new Error(`anchor not found in ${file}: ${needle.slice(0, 90)}`);
  if (start === 0 && src.indexOf(needle, i + 1) >= 0) throw new Error(`anchor not unique in ${file}: ${needle.slice(0, 90)}`);
  return i;
}
let n = 0, cursor = 0;
for (let k = 0; k < lines.length; k++) {
  const sk = /^@@ SKIPTO (.*)$/.exec(lines[k]);
  if (sk) { cursor = find(sk[1]) + sk[1].length; continue; }
  const m = /^@@ (REPLACE|BEFORE|AFTER|SUB) (.*)$/.exec(lines[k]);
  if (!m) continue;
  const [, op, anchor] = m;
  const at = cursor; cursor = 0;
  const locate = (a) => (at ? find(a, at) : find(a));
  if (op === 'SUB') {
    const w = /^@@ WITH (.*)$/.exec(lines[++k]);
    if (!w) throw new Error('SUB without WITH: ' + anchor);
    const i = locate(anchor);
    src = src.slice(0, i) + w[1] + src.slice(i + anchor.length); n++; continue;
  }
  let until = null;
  if (op === 'REPLACE') {
    const u = /^@@ UNTIL (.*)$/.exec(lines[++k]);
    if (!u) throw new Error('REPLACE without UNTIL: ' + anchor);
    until = u[1];
  }
  const body = [];
  while (++k < lines.length && lines[k] !== '@@ END') {
    if (/^\s*@@ (REPLACE|UNTIL|BEFORE|AFTER|SUB|WITH|END)/.test(lines[k])) throw new Error(`stray directive inside block "${anchor.slice(0, 50)}": ${lines[k].trim().slice(0, 60)}`);
    body.push(lines[k]);
  }
  if (k >= lines.length) throw new Error(`missing @@ END for block "${anchor.slice(0, 60)}"`);
  const html = body.join(nl) + (body.length ? nl : '');
  const i = locate(anchor);
  if (op === 'BEFORE') src = src.slice(0, i) + html + src.slice(i);
  else if (op === 'AFTER') src = src.slice(0, i + anchor.length) + nl + html.replace(new RegExp(nl + '$'), '') + src.slice(i + anchor.length);
  else { const j = find(until, i + anchor.length); src = src.slice(0, i) + html + src.slice(j); }
  n++;
}
fs.writeFileSync(file, src);
console.log(`${file}: ${n} edit(s)`);
