//NOTE(jimmylee): Tests for the sacred CLI ANSI primitives. Run with `npm test`.

import { describe, it, expect } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
  fgHex, bgHex, strip, visLen, padR, padL, truncateVisible, gradientText, RESET_FG, COLORS,
} = require('../ansi');

describe('fgHex / bgHex', () => {
  it('expands #ffffff to a 24-bit foreground escape', () => {
    expect(fgHex('#ffffff')).toBe('\x1b[38;2;255;255;255m');
  });

  it('expands #262626 to a 24-bit background escape', () => {
    expect(bgHex('#262626')).toBe('\x1b[48;2;38;38;38m');
  });

  it('accepts hex without leading hash', () => {
    expect(fgHex('e4f221')).toBe('\x1b[38;2;228;242;33m');
  });
});

describe('strip / visLen', () => {
  it('removes ANSI escapes for length math', () => {
    const colored = `${fgHex('#ff0000')}sacred${RESET_FG}`;
    expect(strip(colored)).toBe('sacred');
    expect(visLen(colored)).toBe(6);
  });
});

describe('padR / padL', () => {
  it('right-pads to fill width', () => {
    expect(padR('foo', 6)).toBe('foo   ');
  });

  it('left-pads to fill width', () => {
    expect(padL('foo', 6)).toBe('   foo');
  });

  it('truncates overlong strings via truncateVisible', () => {
    const padded = padR('hello world', 5);
    expect(strip(padded).length).toBeLessThanOrEqual(5);
  });
});

describe('truncateVisible', () => {
  it('appends RESET_FG so trailing color state is closed', () => {
    const out = truncateVisible(`${fgHex('#ff0000')}sacredXXX`, 6);
    expect(out.endsWith(RESET_FG)).toBe(true);
    expect(strip(out)).toBe('sacred');
  });
});

describe('gradientText', () => {
  it('emits one foreground escape per character + final RESET_FG', () => {
    const out = gradientText('abc', '#000000', '#ffffff');
    expect(strip(out)).toBe('abc');
    expect(out.endsWith(RESET_FG)).toBe(true);
  });

  it('returns empty string for empty input', () => {
    expect(gradientText('', '#000000', '#ffffff')).toBe('');
  });
});

describe('COLORS', () => {
  it('loads the sacred palette JSON', () => {
    expect(COLORS.windowBg).toBe('#3a3a3a');
    expect(COLORS.text).toBe('#ffffff');
    expect(COLORS.brand).toBe('#e4f221');
  });
});
