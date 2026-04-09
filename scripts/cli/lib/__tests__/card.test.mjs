import { describe, it, expect } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { strip } = require('../ansi');
const { B, cardTop, cardRow, cardBot, cardSelectRow, cardHeaderRow, wordWrap } = require('../card');

describe('cardTop / cardBot', () => {
  it('renders top border with embedded title', () => {
    const top = cardTop('SUMMARY', 30);
    expect(top.startsWith(B.tl + B.h)).toBe(true);
    expect(top.endsWith(B.tr)).toBe(true);
    expect(top).toContain('SUMMARY');
    expect(top.length).toBe(30);
  });

  it('renders bottom border with corner glyphs', () => {
    const bot = cardBot(20);
    expect(bot.startsWith(B.bl)).toBe(true);
    expect(bot.endsWith(B.br)).toBe(true);
    expect(bot.length).toBe(20);
  });
});

describe('cardRow', () => {
  it('pads content to inner width with vertical borders', () => {
    const row = cardRow('hello', 20);
    expect(strip(row).length).toBe(20);
    expect(row.startsWith(B.v)).toBe(true);
    expect(row.endsWith(B.v)).toBe(true);
  });
});

describe('cardSelectRow', () => {
  it('returns plain row when not selected', () => {
    const row = cardSelectRow('item', 20, false);
    expect(strip(row).length).toBe(20);
    expect(row).not.toContain('\x1b[7m');
  });

  it('applies inverse video when selected', () => {
    const row = cardSelectRow('item', 20, true);
    expect(row).toContain('\x1b[7m');
  });
});

describe('cardHeaderRow', () => {
  it('pads content with table-header background', () => {
    const row = cardHeaderRow('NAME', 20);
    expect(strip(row).length).toBe(20);
    //NOTE(jimmylee): #585858 → 88,88,88 → bg escape signature.
    expect(row).toContain('48;2;88;88;88');
  });
});

describe('wordWrap', () => {
  it('splits long text into width-bounded lines', () => {
    const lines = wordWrap('the quick brown fox jumps over the lazy dog', 12);
    for (const line of lines) expect(line.length).toBeLessThanOrEqual(12);
    expect(lines.join(' ')).toBe('the quick brown fox jumps over the lazy dog');
  });

  it('handles short input as a single line', () => {
    expect(wordWrap('short', 20)).toEqual(['short']);
  });
});
