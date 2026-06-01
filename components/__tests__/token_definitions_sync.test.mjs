import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

//NOTE(jimmylee): Validity guard for design tokens, closing the gap theming_tokens_sync leaves. That guard
//NOTE(jimmylee): proves a component's source and its catalog entry agree on a token name, consistency, but
//NOTE(jimmylee): not that the name is real. A token typo'd identically into both a .tsx/.module.css and the
//NOTE(jimmylee): catalog passes green while the component renders an undefined CSS custom property to nothing:
//NOTE(jimmylee): a background that silently vanishes, a z-index that collapses, with no compile error. This
//NOTE(jimmylee): walks all of components/ (theming_tokens_sync is top-level + catalog-scoped, so the demos
//NOTE(jimmylee): under examples/ / modals/ / page/ / detectors/ are unguarded) and asserts every referenced
//NOTE(jimmylee): var(--theme|ansi|color|font|z-index-*) token is defined in global.css / global-fonts.css.

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMPONENTS_DIR = join(__dirname, '..');
const REPO_ROOT = join(COMPONENTS_DIR, '..');
const GLOBAL_CSS_PATHS = [join(REPO_ROOT, 'global.css'), join(REPO_ROOT, 'global-fonts.css')];

const REF_RE = /var\(\s*(--(?:theme|ansi|color|font|z-index)-[a-z0-9-]+)\s*\)/g;
const DEF_RE = /(--(?:theme|ansi|color|font|z-index)-[a-z0-9-]+)\s*:/g;

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== '__tests__') files.push(...walk(path));
    } else if (/\.(tsx|ts|module\.css)$/.test(entry.name)) {
      files.push(path);
    }
  }
  return files;
}

function referencedTokens() {
  const refs = new Map();
  for (const path of walk(COMPONENTS_DIR)) {
    const body = readFileSync(path, 'utf8');
    for (const match of body.matchAll(REF_RE)) {
      if (!refs.has(match[1])) refs.set(match[1], path.slice(REPO_ROOT.length + 1));
    }
  }
  return refs;
}

function definedTokens() {
  const defs = new Set();
  for (const path of GLOBAL_CSS_PATHS) {
    for (const match of readFileSync(path, 'utf8').matchAll(DEF_RE)) defs.add(match[1]);
  }
  return defs;
}

describe('components/ var(--…) references ↔ global.css / global-fonts.css definitions', () => {
  const referenced = referencedTokens();
  const defined = definedTokens();

  it('parses a non-trivial set of references and definitions from the filesystem', () => {
    expect(referenced.size).toBeGreaterThan(0);
    expect(defined.size).toBeGreaterThan(0);
  });

  it('every token referenced anywhere in components/ is defined as a custom property', () => {
    const undefinedRefs = [...referenced]
      .filter(([token]) => !defined.has(token))
      .map(([token, file]) => `${token} (first referenced in ${file})`);
    expect(
      undefinedRefs,
      `These components/ references point at undefined CSS custom properties:\n${undefinedRefs.join('\n')}`,
    ).toEqual([]);
  });
});
