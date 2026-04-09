import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

//NOTE(jimmylee): Regression guard — asserts Window.module.css uses a responsive min-width so the
//NOTE(jimmylee): window can shrink below 24ch on narrow viewports without forcing horizontal scroll.

const __dirname = dirname(fileURLToPath(import.meta.url));
const CSS_PATH = join(__dirname, '..', 'Window.module.css');

describe('Window.module.css responsive min-width', () => {
  const css = readFileSync(CSS_PATH, 'utf8');

  it('uses min(24ch, …) instead of a hard 24ch min-width', () => {
    expect(css).toContain('min(24ch,');
  });

  it('uses responsive horizontal padding', () => {
    expect(css).toContain('min(2ch,');
  });
});
