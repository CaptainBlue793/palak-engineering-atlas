'use strict';
/* The Atlas course registry, read from assets/atlas.js so tools share one source of truth.
     const { COURSES, FEATURED, PATHS } = require('./registry.cjs');
   Each course: { id, title, short, dir, store, indexVar, c1, c2, d1, d2, chapters, first, dist, soon, ... }. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const src = fs.readFileSync(path.join(ROOT, 'assets/atlas.js'), 'utf8').replace(/\r\n/g, '\n');

function literal(name) {
  const start = src.indexOf('var ' + name + ' = ');
  if (start < 0) throw new Error('registry: ' + name + ' not found in assets/atlas.js');
  const open = start + ('var ' + name + ' = ').length;
  const close = src[open] === '[' ? src.indexOf('\n  ];', open) + 4 : src.indexOf('\n  };', open) + 4;
  return vm.runInNewContext('(' + src.slice(open, close) + ')');
}

const COURSES = literal('COURSES');
module.exports = {
  ROOT,
  COURSES,
  FEATURED: literal('FEATURED'),
  PATHS: literal('PATHS'),
  byId: (id) => COURSES.find((c) => c.id === id),
  // Courses whose folder exists in this checkout (a course is scaffolded before it is released).
  onDisk: () => COURSES.filter((c) => fs.existsSync(path.join(ROOT, c.dir, 'assets/app.js'))),
  // Runtime namespace used by a course's generated globals: SD_INDEX -> SD.
  ns: (c) => c.indexVar.replace(/_INDEX$/, ''),
};
