import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = process.argv[2];
if (!dist) {
  console.error('Použití: node tools/deploy/precache.mjs <adresář exportu>');
  process.exit(1);
}

const SKIP = new Set(['sw.js', '.nojekyll', 'metadata.json']);

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const files = walk(dist)
  .map((path) => relative(dist, path).split(sep).join('/'))
  .filter((path) => !SKIP.has(path) && !path.endsWith('.map'))
  .sort();

const index = readFileSync(join(dist, 'index.html'), 'utf8');
const bundle = index.match(/index-([a-f0-9]+)\.js/);
if (!bundle) {
  console.error('V index.html chybí index-<hash>.js');
  process.exit(1);
}

const digest = createHash('sha256');
for (const path of files) digest.update(path).update(readFileSync(join(dist, path)));
const version = `${bundle[1].slice(0, 12)}-${digest.digest('hex').slice(0, 8)}`;

const precache = ['./', ...files.filter((path) => path !== 'index.html')];
const template = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'sw.js'), 'utf8');
const sw = template.replace('__VERSION__', version).replace("['__PRECACHE__']", JSON.stringify(precache));
writeFileSync(join(dist, 'sw.js'), sw);

const bytes = files.reduce((sum, path) => sum + statSync(join(dist, path)).size, 0);
console.log(`sw.js: verze ${version}, ${precache.length} souborů, ${(bytes / 1048576).toFixed(1)} MB`);
