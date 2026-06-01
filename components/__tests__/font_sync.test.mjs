import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

//NOTE(jimmylee): Sync guard for the font picker. The Fonts menu in components/page/DefaultActionBar.tsx
//NOTE(jimmylee): and the @font-face / body.font-use-* rules in global-fonts.css are hand-maintained on
//NOTE(jimmylee): both sides, adding a font means editing two files by hand. This guard fails CI inside
//NOTE(jimmylee): the same PR when they drift: a menu entry pointing at a font-use-* class with no CSS
//NOTE(jimmylee): rule (dead item, clicking it strips the current font and applies nothing), a CSS rule
//NOTE(jimmylee): with no menu entry (unreachable font), or a rule whose --font-family-mono names an
//NOTE(jimmylee): @font-face family that was never declared (renders as the sans-serif fallback).

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMPONENTS_DIR = join(__dirname, '..');
const REPO_ROOT = join(COMPONENTS_DIR, '..');
const ACTION_BAR_PATH = join(COMPONENTS_DIR, 'page', 'DefaultActionBar.tsx');
const FONTS_CSS_PATH = join(REPO_ROOT, 'global-fonts.css');

//NOTE(jimmylee): The Geist default is selected via onHandleFontChange(''), the empty string strips all
//NOTE(jimmylee): font-* classes and falls back to the base --font-family-mono (GeistMono-Regular) in
//NOTE(jimmylee): global.css. body.font-use-geist-mono mirrors that default but is intentionally never
//NOTE(jimmylee): wired to a menu entry, so it is the one selector exempt from the "exactly one menu
//NOTE(jimmylee): entry" pairing rule below.
const DEFAULT_SELECTOR = 'font-use-geist-mono';

function listMenuFontClasses() {
  const body = readFileSync(ACTION_BAR_PATH, 'utf8');
  const classes = [];
  for (const match of body.matchAll(/onHandleFontChange\(\s*'([^']*)'\s*\)/g)) {
    //NOTE(jimmylee): The empty-string call is the Geist default and points at no class. Skip it.
    if (match[1]) classes.push(match[1]);
  }
  return classes;
}

function parseCssSelectors() {
  const body = readFileSync(FONTS_CSS_PATH, 'utf8');
  const selectors = [];
  for (const match of body.matchAll(/body\.(font-use-[a-z0-9-]+)\s*\{\s*--font-family-mono:\s*'([^']+)'/g)) {
    selectors.push({ className: match[1], family: match[2] });
  }
  return selectors;
}

function parseFontFaceFamilies() {
  const body = readFileSync(FONTS_CSS_PATH, 'utf8');
  const families = new Set();
  for (const match of body.matchAll(/@font-face\s*\{[^}]*?font-family:\s*'([^']+)'/g)) {
    families.add(match[1]);
  }
  return families;
}

describe('font picker ↔ global-fonts.css sync', () => {
  const menuClasses = listMenuFontClasses();
  const cssSelectors = parseCssSelectors();
  const fontFaceFamilies = parseFontFaceFamilies();

  const cssClassNames = new Set(cssSelectors.map((s) => s.className));
  const menuCounts = new Map();
  for (const name of menuClasses) {
    menuCounts.set(name, (menuCounts.get(name) ?? 0) + 1);
  }

  it('parses a non-trivial number of fonts from both files', () => {
    expect(menuClasses.length).toBeGreaterThan(0);
    expect(cssSelectors.length).toBeGreaterThan(0);
    expect(fontFaceFamilies.size).toBeGreaterThan(0);
  });

  it('every menu font-use-* class has a matching body.font-use-* selector in global-fonts.css', () => {
    const dead = menuClasses.filter((name) => !cssClassNames.has(name));
    expect(
      dead,
      `These menu entries point at a font-use-* class with no CSS rule (dead item): ${dead.join(', ')}`,
    ).toEqual([]);
  });

  it('every body.font-use-* selector is referenced by exactly one menu entry (Geist default excepted)', () => {
    const offenders = [];
    for (const { className } of cssSelectors) {
      if (className === DEFAULT_SELECTOR) {
        //NOTE(jimmylee): The default selector must stay unreferenced, it is reached via the '' call.
        if (menuCounts.has(className)) {
          offenders.push(`${className} (default — must not be wired to a menu entry)`);
        }
        continue;
      }
      const count = menuCounts.get(className) ?? 0;
      if (count !== 1) {
        offenders.push(`${className} (referenced ${count} times, expected exactly 1)`);
      }
    }
    expect(offenders, `CSS selectors not paired one-to-one with a menu entry: ${offenders.join(', ')}`).toEqual([]);
  });

  it('every body.font-use-* selector resolves --font-family-mono to a declared @font-face family', () => {
    const unresolved = cssSelectors
      .filter(({ family }) => !fontFaceFamilies.has(family))
      .map(({ className, family }) => `${className} → '${family}'`);
    expect(
      unresolved,
      `These selectors name a font-family with no @font-face declaration: ${unresolved.join(', ')}`,
    ).toEqual([]);
  });
});
