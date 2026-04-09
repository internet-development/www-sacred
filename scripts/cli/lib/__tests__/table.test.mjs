import { describe, it, expect } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { strip } = require('../ansi');
const { formatRow, kvTable, kvTableGradient } = require('../table');

const SPEC = [
  { width: 10, align: 'left' },
  { width: 12, align: 'left', grow: true },
  { width: 8, align: 'right', status: true, gap: 2 },
];

describe('formatRow', () => {
  it('aligns columns to their declared widths', () => {
    const row = formatRow(['name', 'value', 'OPEN'], SPEC, 60);
    const visible = strip(row);
    expect(visible).toContain('name');
    expect(visible).toContain('value');
    //NOTE(jimmylee): right-aligned status column ends with the status text.
    expect(visible.trimEnd().endsWith('OPEN')).toBe(true);
  });

  it('colors known status values via ANSI escapes', () => {
    const row = formatRow(['x', 'y', 'OPEN'], SPEC, 60);
    expect(row).toContain('\x1b[1m');
    expect(row).toContain('38;2;0;255;0');
  });

  it('grays out terminal status values', () => {
    const row = formatRow(['x', 'y', 'CLOSED'], SPEC, 60);
    expect(row).toContain('38;2;168;168;168');
  });
});

describe('kvTable', () => {
  it('produces 24ch keys followed by raw values', () => {
    const lines = kvTable([['PROJECT', 'sacred']]);
    expect(lines).toHaveLength(1);
    expect(lines[0].startsWith('PROJECT')).toBe(true);
    expect(strip(lines[0])).toBe('PROJECT'.padEnd(24, ' ') + 'sacred');
  });
});

describe('kvTableGradient', () => {
  it('applies a gradient to the value column', () => {
    const lines = kvTableGradient([['STATUS', 'OK']]);
    expect(lines).toHaveLength(1);
    //NOTE(jimmylee): each character of the value gets its own fg escape.
    expect(lines[0].match(/38;2;/g) || []).toHaveLength(2);
  });
});
