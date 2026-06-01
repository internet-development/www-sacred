import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

//NOTE(jimmylee): Sync guard for the Theming tokens field of components/AGENTS.md. That field is the
//NOTE(jimmylee): port-time color-fidelity contract, every porting agent reads it to learn which
//NOTE(jimmylee): var(--theme-*)/var(--ansi-*)/var(--color-*)/var(--font-*)/var(--z-index-*) tokens a
//NOTE(jimmylee): component consumes so a light/dark/OKLCH-tint port preserves color. It is
//NOTE(jimmylee): hand-maintained against source, so it drifts invisibly: a renamed or undefined token in
//NOTE(jimmylee): the .tsx/.module.css never trips a compiler, and the catalog can over- or under-document
//NOTE(jimmylee): with no visible break until a surface renders the wrong color. palette_sync locks
//NOTE(jimmylee): colors.json → global.css primitives; this locks the per-component consumption, closing
//NOTE(jimmylee): the last hand-maintained link in the color pipeline.

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMPONENTS_DIR = join(__dirname, '..');
const CATALOG_PATH = join(COMPONENTS_DIR, 'AGENTS.md');

const TOKEN_RE = /var\(\s*(--(?:theme|ansi|color|font|z-index)-[a-z0-9-]+)\s*\)/g;
const CATALOG_TOKEN_RE = /--(?:theme|ansi|color|font|z-index)-[a-z0-9-]+/g;

function listComponents() {
  return readdirSync(COMPONENTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.tsx'))
    .map((entry) => entry.name.replace(/\.tsx$/, ''))
    .sort();
}

//NOTE(jimmylee): Scan both the .tsx and its sibling .module.css. DebugGrid proves a token can live in a
//NOTE(jimmylee): JS-assigned style string with no .module.css at all, and SimpleTable proves it can live
//NOTE(jimmylee): only in the .module.css with none in the .tsx.
function sourceTokens(name) {
  const tokens = new Set();
  for (const ext of ['.tsx', '.module.css']) {
    const path = join(COMPONENTS_DIR, `${name}${ext}`);
    if (!existsSync(path)) continue;
    for (const match of readFileSync(path, 'utf8').matchAll(TOKEN_RE)) tokens.add(match[1]);
  }
  return tokens;
}

//NOTE(jimmylee): Pull each component's Theming tokens line out of the catalog. (none) and the
//NOTE(jimmylee): (inherited from …) note both carry no --… tokens, so they parse to the empty set, the
//NOTE(jimmylee): natural match for a component that references no var() of its own.
function catalogTokens() {
  const body = readFileSync(CATALOG_PATH, 'utf8');
  const byComponent = new Map();
  let current = null;
  for (const line of body.split('\n')) {
    const heading = line.match(/^##\s+([A-Za-z][A-Za-z0-9]*)\s*$/);
    if (heading) {
      current = heading[1];
      continue;
    }
    const field = line.match(/\*\*Theming tokens:\*\*(.*)/);
    if (current && field && !byComponent.has(current)) {
      byComponent.set(current, new Set(field[1].match(CATALOG_TOKEN_RE) ?? []));
    }
  }
  return byComponent;
}

function sorted(set) {
  return [...set].sort();
}

describe('components/*.tsx tokens ↔ AGENTS.md Theming tokens sync', () => {
  const components = listComponents();
  const catalog = catalogTokens();

  it('parses a non-trivial number of components and catalog entries', () => {
    expect(components.length).toBeGreaterThan(0);
    expect(catalog.size).toBeGreaterThan(0);
  });

  it("every component's documented Theming tokens equal the var() tokens in its source", () => {
    const drift = [];
    for (const name of components) {
      const source = sorted(sourceTokens(name));
      const documented = catalog.has(name) ? sorted(catalog.get(name)) : null;
      if (documented === null) {
        drift.push(`${name}: no Theming tokens line in catalog`);
        continue;
      }
      if (source.join(',') !== documented.join(',')) {
        drift.push(`${name}: source [${source.join(', ') || '∅'}] ≠ catalog [${documented.join(', ') || '∅'}]`);
      }
    }
    expect(drift, `Theming tokens drift between source and components/AGENTS.md:\n${drift.join('\n')}`).toEqual([]);
  });
});
