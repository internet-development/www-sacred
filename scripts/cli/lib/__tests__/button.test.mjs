import { describe, it, expect } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { strip } = require('../ansi');
const { button, buttonRow } = require('../button');

describe('button', () => {
  it('uppercases the label and surrounds with single-space pads', () => {
    const b = button('ESC', 'exit');
    expect(strip(b)).toBe(' ESC  EXIT ');
  });

  it('preserves arrow glyph hotkeys', () => {
    const b = button('\u2192', 'next');
    expect(strip(b)).toBe(' \u2192  NEXT ');
  });
});

describe('buttonRow', () => {
  it('justifies left + right with windowBg gap', () => {
    const left = button('ESC', 'exit');
    const right = button('\u21B5', 'select');
    const row = buttonRow(left, right, 60);
    const visible = strip(row);
    expect(visible.length).toBe(60);
    expect(visible.startsWith(' ESC  EXIT')).toBe(true);
    expect(visible.trimEnd().endsWith('SELECT')).toBe(true);
  });
});
