import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

//NOTE(jimmylee): Reachability guard, closing the gap agents_md_sync leaves. That guard proves a
//NOTE(jimmylee): components/*.tsx file and its catalog `## Heading` coexist, but coexistence is not
//NOTE(jimmylee): reachability. A component can sit on disk with a green catalog entry, valid tokens, and a
//NOTE(jimmylee): **Used by** line pointing at a render that was deleted or never existed, and every other
//NOTE(jimmylee): guard stays green while an agent follows that dead pointer to a component no surface mounts.
//NOTE(jimmylee): This walks all of app/ + components/ and asserts every top-level components/*.tsx is
//NOTE(jimmylee): imported by at least one other file, so a **Used by** pointer can never go stale silently.

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMPONENTS_DIR = join(__dirname, '..');
const REPO_ROOT = join(COMPONENTS_DIR, '..');
const SEARCH_DIRS = [join(REPO_ROOT, 'app'), COMPONENTS_DIR];

const IMPORT_SPEC_RE = /import\s+(?:[^'"]*?\sfrom\s+)?['"]([^'"]+)['"]/g;

function listComponents() {
  return readdirSync(COMPONENTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.tsx'))
    .map((entry) => entry.name.replace(/\.tsx$/, ''))
    .sort();
}

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== '__tests__') files.push(...walk(path));
    } else if (/\.(tsx|ts)$/.test(entry.name)) {
      files.push(path);
    }
  }
  return files;
}

//NOTE(jimmylee): Key importers by the path specifier's basename, not a bare identifier, so the closing
//NOTE(jimmylee): quote bounds the name, `@components/CardDouble` resolves to CardDouble, never masking Card.
function importersByBasename() {
  const importers = new Map();
  for (const dir of SEARCH_DIRS) {
    for (const path of walk(dir)) {
      for (const match of readFileSync(path, 'utf8').matchAll(IMPORT_SPEC_RE)) {
        const base = match[1].split('/').pop();
        if (!importers.has(base)) importers.set(base, new Set());
        importers.get(base).add(path);
      }
    }
  }
  return importers;
}

describe('components/*.tsx reachability ↔ app/ + components/ imports', () => {
  const components = listComponents();
  const importers = importersByBasename();

  it('parses a non-trivial component set and import set from the filesystem', () => {
    expect(components.length).toBeGreaterThan(0);
    expect(importers.size).toBeGreaterThan(0);
  });

  it('every top-level components/*.tsx is imported by at least one other file under app/ or components/', () => {
    const orphans = components.filter((name) => {
      const ownPath = join(COMPONENTS_DIR, `${name}.tsx`);
      const seen = importers.get(name);
      return !seen || [...seen].every((path) => path === ownPath);
    });
    expect(
      orphans,
      `These catalog components are imported by no surface — their **Used by** pointers are dead: ${orphans.join(', ')}`,
    ).toEqual([]);
  });
});
