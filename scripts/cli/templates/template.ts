#!/usr/bin/env -S npx tsx
//NOTE(jimmylee): Sacred CLI — TypeScript template demonstrating layout primitives + lifecycle.
//NOTE(jimmylee): Run with `npm run cli:typescript`. Press ESC or Ctrl-C to exit.
//NOTE(jimmylee): This is the canonical example for porting React Window* components to TS CLI screens.

//NOTE(jimmylee): The framework lives in scripts/cli/lib/* as zero-dependency CommonJS — TypeScript
//NOTE(jimmylee): consumes it via `require` so we get type erasure for free without a build step.
const { cardTop, cardRow, cardHeaderRow, cardBot, wordWrap } = require('../lib/card');
const { formatRow, kvTable } = require('../lib/table');
const { button, buttonRow } = require('../lib/button');
const { createApp } = require('../lib/app');

type ColSpec = {
  width: number;
  align?: 'left' | 'right';
  grow?: boolean;
  status?: boolean;
  gap?: number;
};

const SUMMARY: Array<[string, string]> = [
  ['PROJECT', 'www-sacred'],
  ['VERSION', '1.1.19'],
  ['LANGUAGE', 'TypeScript'],
  ['STATUS', 'OK'],
];

const TH = ['NAME', 'KIND', 'STATUS', 'UPDATED'];

const ROWS: string[][] = [
  ['ansi.js', 'primitive', 'ACTIVE', '2026-04-08T09:00:00'],
  ['window.js', 'primitive', 'ACTIVE', '2026-04-08T09:00:00'],
  ['card.js', 'primitive', 'ACTIVE', '2026-04-08T09:00:00'],
  ['table.js', 'primitive', 'ACTIVE', '2026-04-08T09:00:00'],
  ['button.js', 'primitive', 'ACTIVE', '2026-04-08T09:00:00'],
  ['app.js', 'lifecycle', 'ACTIVE', '2026-04-08T09:00:00'],
];

const COL_SPEC: ColSpec[] = [
  { width: 14, align: 'left' },
  { width: 12, align: 'left', grow: true },
  { width: 8, align: 'right', status: true, gap: 2 },
  { width: 19, align: 'right', gap: 2 },
];

const NOTE =
  'Sacred ports React Window components into terminal screens by mapping each <Card> to ' +
  'a cardTop/cardRow/cardBot triple. Use this template as the canonical reference for the ' +
  'skill in skills/port-sacred-terminal-ui-to-typescript-cli.';

createApp({
  totalPages: 1,
  build: (_page: number, innerW: number) => {
    const L: string[] = [];

    //NOTE(jimmylee): Empty strings render as a blank window-fill row via wrapLine, matching the
    //NOTE(jimmylee): one-line gap that the React kitchen sink draws with `<br />` between cards
    //NOTE(jimmylee): in components/examples/CLITemplate.tsx. Keep CLI/Python/React in lockstep.
    L.push(cardTop('SACRED CLI / TEMPLATE', innerW));
    for (const line of kvTable(SUMMARY)) L.push(cardRow(line, innerW));
    L.push(cardBot(innerW));
    L.push('');

    L.push(cardTop('PRIMITIVES', innerW));
    L.push(cardHeaderRow(formatRow(TH, COL_SPEC, innerW), innerW));
    for (const row of ROWS) L.push(cardRow(formatRow(row, COL_SPEC, innerW), innerW));
    L.push(cardBot(innerW));
    L.push('');

    L.push(cardTop('NOTE', innerW));
    const contentW = innerW - 6;
    for (const wl of wordWrap(NOTE, contentW)) L.push(cardRow(wl, innerW));
    L.push(cardBot(innerW));
    L.push('');

    L.push(buttonRow(button('ESC', 'exit'), button('\u21B5', 'select'), innerW));

    return L;
  },
}).start();
