import { describe, it, expect } from 'vitest';
import { createRequire } from 'node:module';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

//NOTE(jimmylee): Sync guard for components/AGENTS.md. Asserts every .tsx file directly under
//NOTE(jimmylee): components/ has a matching `## Heading` in the catalog and vice versa. The catalog
//NOTE(jimmylee): is the canonical surface map for sacred React components — adding a component
//NOTE(jimmylee): without documenting it (or removing one without deleting its entry) fails CI inside
//NOTE(jimmylee): the same PR. Sub-directories (`examples/`, `modals/`, `svg/`, `page/`, `detectors/`)
//NOTE(jimmylee): are intentionally excluded — they are demos / icons / runtime detectors, not the
//NOTE(jimmylee): library surface itself.

//NOTE(jimmylee): createRequire is unused at present but kept here so this file follows the same
//NOTE(jimmylee): import shape as scripts/cli/lib/__tests__/*.test.mjs. If this catalog ever needs to
//NOTE(jimmylee): pull in a CJS helper, the require is ready.
const _require = createRequire(import.meta.url);

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMPONENTS_DIR = join(__dirname, '..');
const CATALOG_PATH = join(COMPONENTS_DIR, 'AGENTS.md');

function listComponentTsxFiles() {
  return readdirSync(COMPONENTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.tsx'))
    .map((entry) => entry.name.replace(/\.tsx$/, ''))
    .sort();
}

function listCatalogHeadings() {
  const body = readFileSync(CATALOG_PATH, 'utf8');
  const headings = [];
  for (const line of body.split('\n')) {
    const match = line.match(/^##\s+([A-Za-z][A-Za-z0-9]*)\s*$/);
    if (match) headings.push(match[1]);
  }
  return headings.sort();
}

describe('components/AGENTS.md catalog sync', () => {
  const components = listComponentTsxFiles();
  const headings = listCatalogHeadings();
  const componentSet = new Set(components);
  const headingSet = new Set(headings);

  it('every components/*.tsx has a matching ## heading in components/AGENTS.md', () => {
    const undocumented = components.filter((name) => !headingSet.has(name));
    expect(
      undocumented,
      `These components have no entry in components/AGENTS.md: ${undocumented.join(', ')}`,
    ).toEqual([]);
  });

  it('every ## heading in components/AGENTS.md maps to a real components/*.tsx file', () => {
    const stale = headings.filter((name) => !componentSet.has(name));
    expect(
      stale,
      `These catalog entries point at missing files: ${stale.join(', ')}`,
    ).toEqual([]);
  });

  it('catalog has at least one entry', () => {
    expect(headings.length).toBeGreaterThan(0);
  });
});
