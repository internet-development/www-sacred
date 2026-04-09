import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

//NOTE(jimmylee): Regression guard — asserts SimpleTable.module.css contains overflow-x containment
//NOTE(jimmylee): so the table scrolls horizontally inside its card frame on narrow viewports instead
//NOTE(jimmylee): of forcing the entire page to scroll.

const __dirname = dirname(fileURLToPath(import.meta.url));
const CSS_PATH = join(__dirname, '..', 'SimpleTable.module.css');

describe('SimpleTable.module.css overflow containment', () => {
  const css = readFileSync(CSS_PATH, 'utf8');

  it('has overflow-x on the scroll wrapper', () => {
    expect(css).toContain('overflow-x');
  });

  it('has a scrollWrapper class', () => {
    expect(css).toContain('.scrollWrapper');
  });
});
