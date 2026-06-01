import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

//NOTE(jimmylee): Sync guard for the Appearance (theme) and Mode (tint) menus. Both menus in
//NOTE(jimmylee): components/page/DefaultActionBar.tsx and the body.theme-* / body.tint-* rules in
//NOTE(jimmylee): global.css are hand-maintained on both sides, adding a theme or tint means editing
//NOTE(jimmylee): two files by hand. This guard fails CI inside the same PR when they drift: a menu
//NOTE(jimmylee): entry pointing at a theme-*/tint-* class with no CSS rule (dead item, clicking it
//NOTE(jimmylee): strips the current class and applies nothing), or a body.tint-* rule with no menu
//NOTE(jimmylee): entry (unreachable tint), or a body.tint-* source whose OKLCH derivation is missing from
//NOTE(jimmylee): the body.theme-light.tint-* or body.theme-dark.tint-* list (the tint sets --tint to a real
//NOTE(jimmylee): color yet derives no --theme-* tokens under that base, a silent no-op). It is the sibling
//NOTE(jimmylee): of font_sync.test.mjs, which guards the Fonts menu against global-fonts.css.

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMPONENTS_DIR = join(__dirname, '..');
const REPO_ROOT = join(COMPONENTS_DIR, '..');
const ACTION_BAR_PATH = join(COMPONENTS_DIR, 'page', 'DefaultActionBar.tsx');
const GLOBAL_CSS_PATH = join(REPO_ROOT, 'global.css');

//NOTE(jimmylee): The Light theme is selected via onHandleAppearanceChange(''), the empty string strips
//NOTE(jimmylee): the theme class and falls back to the base :root tokens. body.theme-light mirrors that
//NOTE(jimmylee): default and is intentionally never wired to a menu entry, so it is exempt from the
//NOTE(jimmylee): reverse pairing rule. The Mode "None" default is onHandleAppearanceModeChange('') and
//NOTE(jimmylee): ships no body.tint-* rule at all, so there is nothing to exempt on the tint side.
const DEFAULT_THEME_SELECTOR = 'theme-light';

//NOTE(jimmylee): onHandleAppearanceChange also fires from the prefersDark system-preference useEffect in
//NOTE(jimmylee): the same file (with 'theme-dark' and ''), so a whole-file parse would double-count the
//NOTE(jimmylee): theme references. The existence checks below only care that every referenced class has
//NOTE(jimmylee): a CSS rule (the useEffect references are valid), and we never assert "exactly one" on
//NOTE(jimmylee): the theme side, so the double count is harmless. onHandleAppearanceModeChange is unique
//NOTE(jimmylee): to the Mode menu, so tint references never double-count.
function listMenuClasses(handlerName) {
  const body = readFileSync(ACTION_BAR_PATH, 'utf8');
  const classes = [];
  const pattern = new RegExp(`${handlerName}\\(\\s*'([^']*)'\\s*\\)`, 'g');
  for (const match of body.matchAll(pattern)) {
    //NOTE(jimmylee): The empty-string call is the default (Light / None) and points at no class. Skip it.
    if (match[1]) classes.push(match[1]);
  }
  return classes;
}

//NOTE(jimmylee): Only standalone body.theme-* / body.tint-* rules are collected. The combined
//NOTE(jimmylee): body.theme-light.tint-green, ... selector lists in global.css never match because the
//NOTE(jimmylee): anchor requires `body.theme-`/`body.tint-` immediately followed by `{`, and those lines
//NOTE(jimmylee): are `body.theme-light.tint-green,` (followed by `.tint`/`,`, never `{`).
function parseCssSelectors(prefix) {
  const body = readFileSync(GLOBAL_CSS_PATH, 'utf8');
  const selectors = new Set();
  const pattern = new RegExp(`body\\.(${prefix}-[a-z0-9-]+)\\s*\\{`, 'g');
  for (const match of body.matchAll(pattern)) {
    selectors.add(match[1]);
  }
  return selectors;
}

//NOTE(jimmylee): A tint only paints if it appears in all three places: the standalone body.tint-* rule
//NOTE(jimmylee): (parsed above), and the two OKLCH derivation lists below that turn its --tint into every
//NOTE(jimmylee): --theme-* token, once for the light base (body.theme-light.tint-*) and once for the dark
//NOTE(jimmylee): base (body.theme-dark.tint-*). The derivation selectors are comma-separated lists spanning
//NOTE(jimmylee): many lines before a single `{`, so a per-occurrence scan attributes each combined
//NOTE(jimmylee): body.theme-{base}.tint-{name} token to its own light/dark bucket, a loose tint-* scan
//NOTE(jimmylee): would conflate the two lists with each other and with the standalone rules.
function parseDerivationLists() {
  const body = readFileSync(GLOBAL_CSS_PATH, 'utf8');
  const lists = { light: new Set(), dark: new Set() };
  for (const match of body.matchAll(/body\.theme-(light|dark)\.(tint-[a-z0-9-]+)/g)) {
    lists[match[1]].add(match[2]);
  }
  return lists;
}

function sorted(set) {
  return [...set].sort();
}

describe('appearance + mode menus ↔ global.css sync', () => {
  const menuThemeClasses = listMenuClasses('onHandleAppearanceChange');
  const menuTintClasses = listMenuClasses('onHandleAppearanceModeChange');
  const cssThemeSelectors = parseCssSelectors('theme');
  const cssTintSelectors = parseCssSelectors('tint');
  const derivationLists = parseDerivationLists();

  const tintCounts = new Map();
  for (const name of menuTintClasses) {
    tintCounts.set(name, (tintCounts.get(name) ?? 0) + 1);
  }

  it('parses a non-trivial number of themes and tints from both files', () => {
    expect(menuThemeClasses.length).toBeGreaterThan(0);
    expect(menuTintClasses.length).toBeGreaterThan(0);
    expect(cssThemeSelectors.size).toBeGreaterThan(0);
    expect(cssTintSelectors.size).toBeGreaterThan(0);
  });

  it('every menu theme-* class has a matching body.theme-* selector in global.css', () => {
    const dead = menuThemeClasses.filter((name) => !cssThemeSelectors.has(name));
    expect(
      dead,
      `These Appearance entries point at a theme-* class with no CSS rule (dead item): ${dead.join(', ')}`,
    ).toEqual([]);
  });

  it('every menu tint-* class has a matching body.tint-* selector in global.css', () => {
    const dead = menuTintClasses.filter((name) => !cssTintSelectors.has(name));
    expect(
      dead,
      `These Mode entries point at a tint-* class with no CSS rule (dead item): ${dead.join(', ')}`,
    ).toEqual([]);
  });

  it('every body.tint-* selector is referenced by exactly one Mode menu entry', () => {
    const offenders = [];
    for (const className of cssTintSelectors) {
      const count = tintCounts.get(className) ?? 0;
      if (count !== 1) {
        offenders.push(`${className} (referenced ${count} times, expected exactly 1)`);
      }
    }
    expect(offenders, `tint selectors not paired one-to-one with a Mode menu entry: ${offenders.join(', ')}`).toEqual([]);
  });

  it('every body.tint-* selector has a matching body.theme-light.tint-* OKLCH derivation', () => {
    //NOTE(jimmylee): Set equality both ways: a standalone tint with no light derivation paints no
    //NOTE(jimmylee): --theme-* tokens under the light base (silent no-op), and a light derivation for a
    //NOTE(jimmylee): tint with no --tint source derives from an undefined color. Sorted output names the
    //NOTE(jimmylee): exact offending tint.
    expect(
      sorted(derivationLists.light),
      'body.theme-light.tint-* derivation list does not match the standalone body.tint-* set',
    ).toEqual(sorted(cssTintSelectors));
  });

  it('every body.tint-* selector has a matching body.theme-dark.tint-* OKLCH derivation', () => {
    expect(
      sorted(derivationLists.dark),
      'body.theme-dark.tint-* derivation list does not match the standalone body.tint-* set',
    ).toEqual(sorted(cssTintSelectors));
  });

  it('ships the documented Light default selector without wiring it to a menu entry', () => {
    //NOTE(jimmylee): body.theme-light must exist (it backs the '' Light default) but the menu reaches it
    //NOTE(jimmylee): via the empty-string call, never by class name, the same exemption shape the font
    //NOTE(jimmylee): guard applies to body.font-use-geist-mono.
    expect(cssThemeSelectors.has(DEFAULT_THEME_SELECTOR)).toBe(true);
    expect(menuThemeClasses).not.toContain(DEFAULT_THEME_SELECTOR);
  });
});
