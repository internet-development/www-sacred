import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

//NOTE(jimmylee): Fidelity guard for the Props field of components/AGENTS.md, the last hand-copied block in
//NOTE(jimmylee): the catalog. agents_md_sync locks the heading set, theming_tokens_sync locks the tokens,
//NOTE(jimmylee): token_definitions_sync proves they are real, component_usage_sync proves each entry is
//NOTE(jimmylee): reachable, four of each entry's five fields are sealed. Props is the fifth: every entry
//NOTE(jimmylee): copies the component's interface/type Props block verbatim from source, and that block is the
//NOTE(jimmylee): agent's API contract. Read the catalog, copy the prop names and types, write the call site.
//NOTE(jimmylee): Nothing checked it. When a component gains, drops, or renames a prop, the source compiles and
//NOTE(jimmylee): every other guard stays green while the catalog keeps advertising the old shape, so an agent
//NOTE(jimmylee): writes <Component oldProp={…}> against a prop that no longer exists. The relation: each
//NOTE(jimmylee): documented ```ts``` block, whitespace-normalized, must be a substring of its whitespace-
//NOTE(jimmylee): normalized .tsx source. Substring (not equality) absorbs React.forwardRef and components that
//NOTE(jimmylee): declare extra non-Props types, the cases components/AGENTS.md calls out in How to read.

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMPONENTS_DIR = join(__dirname, '..');
const CATALOG_PATH = join(COMPONENTS_DIR, 'AGENTS.md');

function normalize(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function listComponents() {
  return readdirSync(COMPONENTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.tsx'))
    .map((entry) => entry.name.replace(/\.tsx$/, ''))
    .sort();
}

//NOTE(jimmylee): Map each catalog entry to the text inside its Props ```ts``` fence, or null for the
//NOTE(jimmylee): `_(untyped — …)_` / `_(no props)_` italic notes, only fenced blocks claim verbatim source.
function catalogPropsBlocks() {
  const lines = readFileSync(CATALOG_PATH, 'utf8').split('\n');
  const blocks = new Map();
  let current = null;
  for (let i = 0; i < lines.length; i++) {
    const heading = lines[i].match(/^##\s+([A-Za-z][A-Za-z0-9]*)\s*$/);
    if (heading) {
      current = heading[1];
      continue;
    }
    if (!current || blocks.has(current) || !/^\s*-\s+\*\*Props:\*\*/.test(lines[i])) continue;
    let block = null;
    for (let j = i + 1; j < lines.length && !/^##\s/.test(lines[j]) && !/^\s*-\s+\*\*/.test(lines[j]); j++) {
      if (!/^\s*```ts\s*$/.test(lines[j])) continue;
      const buffer = [];
      for (j++; j < lines.length && !/^\s*```\s*$/.test(lines[j]); j++) buffer.push(lines[j]);
      block = buffer.join('\n');
      break;
    }
    blocks.set(current, block);
  }
  return blocks;
}

describe('components/*.tsx Props ↔ AGENTS.md Props block sync', () => {
  const components = listComponents();
  const blocks = catalogPropsBlocks();
  const fenced = components.filter((name) => blocks.get(name) != null);

  it('parses a non-trivial number of components and fenced Props blocks', () => {
    expect(components.length).toBeGreaterThan(0);
    expect(fenced.length).toBeGreaterThan(40);
  });

  it("every documented ```ts``` Props block is a verbatim substring of its component's source", () => {
    const drift = [];
    for (const name of fenced) {
      const source = normalize(readFileSync(join(COMPONENTS_DIR, `${name}.tsx`), 'utf8'));
      const documented = normalize(blocks.get(name));
      if (!source.includes(documented)) {
        drift.push(`${name}: documented Props block no longer matches source:\n  ${documented}`);
      }
    }
    expect(drift, `Props drift between components/AGENTS.md and source:\n${drift.join('\n')}`).toEqual([]);
  });
});
