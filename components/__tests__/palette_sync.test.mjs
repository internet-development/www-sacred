import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

//NOTE(jimmylee): Sync guard for the color palette. scripts/cli/colors.json is the root source of truth, the
//NOTE(jimmylee): true, terminal-tested colors, and global.css mirrors each one as an --ansi-*/--color-*/
//NOTE(jimmylee): --theme-window-* primitive. Both sides are hand-maintained, so the terminal palette and its
//NOTE(jimmylee): CSS mirror can drift with no compile error and no visible break until a surface renders the
//NOTE(jimmylee): wrong gray. This guard fails CI inside the same PR when a colors.json hex has no CSS home. It
//NOTE(jimmylee): is the sibling of appearance_sync / font_sync / agents_md_sync, closing the last
//NOTE(jimmylee): hand-maintained cross-runtime color invariant.

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMPONENTS_DIR = join(__dirname, '..');
const REPO_ROOT = join(COMPONENTS_DIR, '..');
const COLORS_JSON_PATH = join(REPO_ROOT, 'scripts', 'cli', 'colors.json');
const GLOBAL_CSS_PATH = join(REPO_ROOT, 'global.css');

//NOTE(jimmylee): btnLabel #4e4e4e sits off the xterm grayscale ramp, so it has no --ansi-* primitive to mirror.
//NOTE(jimmylee): The CLI paints it directly and no React surface consumes it. Exempt by key, the same way
//NOTE(jimmylee): appearance_sync exempts theme-light.
const EXEMPT_KEYS = new Set(['btnLabel']);

function readPalette() {
  const palette = JSON.parse(readFileSync(COLORS_JSON_PATH, 'utf8'));
  return Object.entries(palette).map(([key, hex]) => ({ key, hex: hex.toLowerCase() }));
}

function readCssPrimitiveHexes() {
  const body = readFileSync(GLOBAL_CSS_PATH, 'utf8');
  const hexes = new Set();
  for (const match of body.matchAll(/--(?:ansi|color|theme-window)-[a-z0-9-]+:\s*(#[0-9a-fA-F]{6})\b/g)) {
    hexes.add(match[1].toLowerCase());
  }
  return hexes;
}

describe('colors.json palette ↔ global.css primitive sync', () => {
  const palette = readPalette();
  const cssHexes = readCssPrimitiveHexes();
  const hexByKey = new Map(palette.map(({ key, hex }) => [key, hex]));

  it('parses a non-trivial palette and CSS primitive set from both files', () => {
    expect(palette.length).toBeGreaterThan(0);
    expect(cssHexes.size).toBeGreaterThan(0);
  });

  it('every colors.json hex is mirrored by a CSS primitive in global.css', () => {
    const missing = palette
      .filter(({ key }) => !EXEMPT_KEYS.has(key))
      .filter(({ hex }) => !cssHexes.has(hex))
      .map(({ key, hex }) => `${key} ${hex}`);
    expect(
      missing,
      `These colors.json entries have no matching CSS primitive in global.css: ${missing.join(', ')}`,
    ).toEqual([]);
  });

  it('keeps the documented exemption honest', () => {
    //NOTE(jimmylee): A stale exemption hides real drift: if an exempt key vanishes from colors.json or gains a
    //NOTE(jimmylee): CSS primitive, drop it from EXEMPT_KEYS so the mapping rule above starts covering it.
    const stale = [];
    for (const key of EXEMPT_KEYS) {
      if (!hexByKey.has(key)) {
        stale.push(`${key} (not a colors.json key)`);
      } else if (cssHexes.has(hexByKey.get(key))) {
        stale.push(`${key} ${hexByKey.get(key)} (now has a CSS primitive)`);
      }
    }
    expect(stale, `Remove these from EXEMPT_KEYS — they no longer need exempting: ${stale.join(', ')}`).toEqual([]);
  });
});
