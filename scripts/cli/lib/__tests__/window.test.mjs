import { describe, it, expect } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { strip } = require('../ansi');
const {
  MARGIN, SHADOW_W, MIN_INNER_W, MIN_TERM_W,
  getInnerWidth, wrapLine, wrapLineTop, shadowBottomRow, wrapLines,
} = require('../window');

describe('layout constants', () => {
  it('matches the documented values', () => {
    expect(MARGIN).toBe(2);
    expect(SHADOW_W).toBe(1);
    expect(MIN_INNER_W).toBe(20);
    expect(MIN_TERM_W).toBe(2 * MARGIN + SHADOW_W + MIN_INNER_W);
  });
});

describe('getInnerWidth', () => {
  it('subtracts margins and shadow from terminal width', () => {
    expect(getInnerWidth(80)).toBe(80 - 2 * MARGIN - SHADOW_W);
  });

  it('clamps to a 10ch minimum', () => {
    expect(getInnerWidth(5)).toBe(10);
  });
});

describe('wrapLine / wrapLineTop / shadowBottomRow', () => {
  it('wraps a line to the full visible width', () => {
    const innerW = getInnerWidth(80);
    const wrapped = wrapLine('content', innerW);
    //NOTE(jimmylee): visual width = MARGIN (left) + innerW + SHADOW_W + (MARGIN - SHADOW_W) (right).
    expect(strip(wrapped).length).toBe(MARGIN + innerW + SHADOW_W + (MARGIN - SHADOW_W));
  });

  it('omits right shadow on the first window row', () => {
    const innerW = getInnerWidth(80);
    const top = wrapLineTop('first', innerW);
    expect(strip(top).length).toBe(MARGIN + innerW + MARGIN);
  });

  it('shadow bottom row is offset by SHADOW_W', () => {
    const innerW = getInnerWidth(80);
    const bottom = shadowBottomRow(innerW);
    expect(strip(bottom).length).toBe(MARGIN + SHADOW_W + innerW + (MARGIN - SHADOW_W));
  });

  it('wrapLines emits N + 1 rows (lines + shadow bottom)', () => {
    const out = wrapLines(['a', 'b', 'c'], 80);
    expect(out).toHaveLength(4);
  });
});
