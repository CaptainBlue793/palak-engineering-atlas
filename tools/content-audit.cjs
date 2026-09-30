'use strict';
// Read-only checks for the static courses. Run from any directory.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');
const root = path.resolve(__dirname, '..');
// Every course in the Atlas registry (assets/atlas.js) whose folder exists in this checkout.
const REG = require('./registry.cjs');
const courses = REG.onDisk().map(c => c.dir);
// Scaffolded chapters that haven't been written yet (<course>/tools/scaffold.cjs) carry a marker like <!-- lld:placeholder -->.
const isPlaceholder = src => /<!-- [a-z]+:placeholder -->/.test(src);
const args = process.argv.slice(2);
const mode = args[0] || 'check';
const text = s => s.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
let checked = 0;
const errors = [], warnings = [], patches = [];
for (const course of courses) {
  if (args[1] && args[1] !== course) continue;
  const app = fs.readFileSync(path.join(root, course, 'assets/app.js'), 'utf8');
  const registry = vm.runInNewContext(app.match(/const CHAPTERS = (\[[\s\S]*?\n  \]);/)[1]);
  if (mode === 'registry') { console.log(course, JSON.stringify(registry.map(({n,title}) => ({n,title})))); continue; }
  if (mode === 'bundle') {
    const prefix = REG.ns(REG.COURSES.find(c => c.dir === course));
    const bundled = fs.readFileSync(path.join(root, course, 'dist', course+'-course.html'), 'utf8');
    const written = registry.filter(ch => !isPlaceholder(fs.readFileSync(path.join(root, course, ch.file), 'utf8'))).length;
    const blocks = [...bundled.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]);
    blocks.forEach(code=>new vm.Script(code));
    const pageCode = blocks.find(code=>code.startsWith('window.'+prefix+'_PAGES = '));
    const pages = JSON.parse(pageCode.slice(pageCode.indexOf(' = ')+3).replace(/;\s*$/, ''));
    for (const ch of registry) if (pages[ch.file]?.chapter !== String(ch.n)) throw Error(course+': missing bundled chapter '+ch.n);
    for (const file of ['glossary.html', 'flashcards.html']) {
      if (!pages[file] || pages[file].chapter !== '') throw Error(course+': study tool treated as chapter: '+file);
    }
    if (!pages['index.html'].html.includes('https://captainblue793.github.io/palak-engineering-atlas/')) throw Error(course+': bundled Atlas link missing');
    const generated = {window:{}};
    vm.runInNewContext(fs.readFileSync(path.join(root,course,'assets/study-data.js'),'utf8'), generated, {timeout:1000});
    const index = generated.window[prefix+'_INDEX'], cards = generated.window[prefix+'_CARDS'];
    if (index.length !== registry.length || cards.length !== written*5) throw Error(course+': generated study-data count mismatch');
    console.log(course+': '+Object.keys(pages).length+' bundled pages; '+cards.length+' flashcards; scripts, prerequisite and study-tool routes valid (static check).');
    continue;
  }
  for (const ch of registry) {
    if (args[2] && ch.n < +args[2] || args[3] && ch.n > +args[3]) continue;
    const rel = course + '/' + ch.file;
    const src = fs.readFileSync(path.join(root, rel), 'utf8');
    let base = '';
    try { base = execFileSync('git', ['-C', root, 'show', 'HEAD:' + rel], {encoding:'utf8',stdio:['ignore','pipe','ignore']}); } catch {}
    if (mode === 'review') {
      console.log('\n' + rel + ' | growth ' + (Buffer.byteLength(src) - Buffer.byteLength(base)) + ' bytes');
      console.log(text(src.slice(src.indexOf('<main'), src.indexOf('<div class="takeaways">'))));
      continue;
    }
    if (mode === 'refs') {
      src.split('\n').forEach((line,i) => {
        if (/\b(?:Chapters?|Ch\.?)\s*\d/i.test(line) && !/eyebrow|pill accent/.test(line)) {
          const snippets = [...text(line).matchAll(/.{0,100}\b(?:Chapters?|Ch\.?)\s*\d.{0,130}/gi)].map(m=>m[0]);
          console.log(rel + ':' + (i+1) + ' ' + snippets.join(' | '));
        }
      });
      continue;
    }
    if (mode === 'icons') {
      const re = /(<div class="callout tip">\s*<div class="ico">)([^<]*)(<\/div>\s*<div class="body"><div class="title">What you need before this chapter<\/div>)/;
      const m = src.match(re);
      if (m && m[2] !== '📚') {
        const start = src.lastIndexOf('\n', m.index) + 1;
        const end = src.indexOf('\n', m.index + m[0].length);
        const before = src.slice(start,end);
        const after = before.replace(re, '$1📚$3');
        patches.push('*** Update File: ' + path.join(root,rel).replace(/\\/g,'/') + '\n@@\n' + before.split('\n').map(l=>'-'+l).join('\n') + '\n' + after.split('\n').map(l=>'+'+l).join('\n'));
      }
      continue;
    }
    checked++;
    const fail = msg => errors.push(rel + ': ' + msg);
    const stub = isPlaceholder(src);
    if (stub) warnings.push(rel + ': placeholder, not written yet');
    const h2 = s => [...s.matchAll(/<h2\b[^>]*>[\s\S]*?<\/h2>/g)].map(m=>m[0]);
    // Sequence diagrams: every message must point at a declared lifeline.
    for (const m of src.matchAll(/<figure class="seq" data-actors="([^"]*)"[^>]*>([\s\S]*?)<\/figure>/g)) {
      const n = m[1].split('|').length;
      if (n < 2) fail('sequence diagram needs 2+ actors');
      for (const x of m[2].matchAll(/data-m="(\d+)[>-](\d+)"/g)) if (+x[1] >= n || +x[2] >= n) fail('sequence message out of range: '+x[0]);
      if ((m[2].match(/<li\b/g)||[]).length !== (m[2].match(/data-m="/g)||[]).length) fail('sequence step missing data-m');
    }
    for (const m of src.matchAll(/<figure class="flow"[^>]*>([\s\S]*?)<\/figure>/g)) if ((m[1].match(/<li\b/g)||[]).length < 2) fail('workflow needs 2+ steps');
    if (!stub && (src.match(/class="quiz"/g)||[]).length !== 5) fail('expected five quiz questions');
    for (const block of src.split('<div class="quiz" data-answer="').slice(1)) {
      const answer = +block.slice(0,block.indexOf('"'));
      const opts = (block.match(/class="opt"/g)||[]).length;
      if (answer >= opts || !block.includes('class="explain"')) fail('invalid quiz answer/explanation');
    }
    for (const m of src.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
      if (!/\bsrc=/.test(m[1])) try { new vm.Script(m[2]); } catch(e) { fail(e.message); }
    }
    if (!stub && ch.n && !src.includes('What you need before this chapter')) fail('missing prerequisite box');
    const hero = src.match(/<section class="hero">([\s\S]*?)<\/section>/)?.[1] || '';
    if (!hero.includes((ch.n < 1 ? 'Prerequisite '+Math.round(ch.n*10) : 'Chapter '+ch.n)+'<')) fail('hero number mismatch');
    if (!hero.includes('⏱ '+ch.mins+' min')) fail('hero minutes mismatch: '+ch.mins);
    const level = ch.level === 'Case Studies' ? 'Case Study' : ch.level;
    if (!hero.replace(/&amp;/g,'&').includes('>'+level+'<')) fail('hero level mismatch: '+level);
    for (const m of src.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').matchAll(/(?:href|src)="([^"#?]+)(?:[?#][^"]*)?"/g)) {
      if (/^(?:https?:|data:|mailto:|javascript:)/.test(m[1])) continue;
      if (!fs.existsSync(path.resolve(root,course,m[1]))) fail('missing local target '+m[1]);
    }
    // A stack catches crossed/missing tags that simple opening/closing counts miss.
    const html = src.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<!--[\s\S]*?-->/g,'');
    const stack = [];
    const voids = new Set('area base br col embed hr img input link meta param source track wbr'.split(' '));
    for (const m of html.matchAll(/<\/?([a-z][\w:-]*)\b(?:"[^"]*"|'[^']*'|[^'">])*>/gi)) {
      const name=m[1].toLowerCase();
      if (m[0].startsWith('</')) {
        if (stack.at(-1)!==name) { fail('tag mismatch: closing '+name+' after '+stack.at(-1)); break; }
        stack.pop();
      } else if (!voids.has(name) && !m[0].endsWith('/>')) stack.push(name);
    }
    if (stack.length) fail('unclosed tags: '+stack.slice(-5).join(', '));
  }
}
if (mode === 'icons') console.log(patches.length ? '*** Begin Patch\n'+patches.join('\n')+'\n*** End Patch' : 'No icon changes');
if (mode === 'check') {
  errors.forEach(e=>console.log('ERROR '+e)); warnings.forEach(e=>console.log('WARN '+e));
  console.log(checked+' chapters checked; '+errors.length+' errors.');
  process.exitCode=errors.length?1:0;
}
