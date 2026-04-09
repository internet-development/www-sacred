'use client';

//NOTE(jimmylee): React port of the sacred CLI template (scripts/cli/templates/template.ts).
//NOTE(jimmylee): Layout-only port — no animation header, no terminal canvas. Sacred React surfaces
//NOTE(jimmylee): use sacred's existing animation primitives if/when they want motion. This component
//NOTE(jimmylee): exists so the same data + structure that powers the CLI template renders identically
//NOTE(jimmylee): in the browser using sacred's existing component library — Window, Card, SimpleTable,
//NOTE(jimmylee): ActionButton, RowSpaceBetween. A human should look at this surface and the
//NOTE(jimmylee): `npm run cli:typescript` / `npm run cli:python` output and read them as the same screen.

import * as React from 'react';

import Window from '@components/Window';
import Card from '@components/Card';
import SimpleTable from '@components/SimpleTable';
import ActionButton from '@components/ActionButton';
import RowSpaceBetween from '@components/RowSpaceBetween';

const SUMMARY: Array<[string, string]> = [
  ['PROJECT', 'www-sacred'],
  ['VERSION', '1.1.19'],
  ['LANGUAGE', 'TypeScript + Python'],
  ['STATUS', 'OK'],
];

//NOTE(jimmylee): Same primitive set the CLI template demonstrates. The status column matches the
//NOTE(jimmylee): CLI's status coloring contract — ACTIVE/OPEN/APPROVED, CLOSED/PAID/SUSPENDED.
const PRIMITIVES: string[][] = [
  ['NAME', 'KIND', 'STATUS', 'UPDATED'],
  ['ansi.js', 'primitive', 'ACTIVE', '2026-04-08T09:00:00'],
  ['window.js', 'primitive', 'ACTIVE', '2026-04-08T09:00:00'],
  ['card.js', 'primitive', 'ACTIVE', '2026-04-08T09:00:00'],
  ['table.js', 'primitive', 'ACTIVE', '2026-04-08T09:00:00'],
  ['button.js', 'primitive', 'ACTIVE', '2026-04-08T09:00:00'],
  ['app.js', 'lifecycle', 'ACTIVE', '2026-04-08T09:00:00'],
];

//NOTE(jimmylee): NOTE prose intentionally opens with a meditation on inside/outside before pivoting
//NOTE(jimmylee): into the technical contract. The first line is the seed; the rest is the porting
//NOTE(jimmylee): note that the CLI template carries verbatim. No attribution — the line is reused as
//NOTE(jimmylee): plain prose because sacred docs are factual.
const NOTE = `The realism of totalitarian tyranny is the necessary conclusion of liberal idealism. If freedom is not a sacred truth and if it does not govern reality, then everything is permitted: in their non-existence, all principles are equal and have nothing to do with action, which belongs solely to the realm of technology. And thus, value is opposed to reality, spirit to practice; and thus begins this quarrel of "disengagement" and "engagement," characteristic of a fascistic society that has completely forgotten that to think is to live and that to worship is to obey. The freedom of the liberals foreshadows spiritual nihilism and justifies the practical fanaticism of totalitarian regimes.`;

const CLITemplate: React.FC = () => {
  return (
    <Window>
      <Card title="SACRED CLI / TEMPLATE" mode="left">
        {SUMMARY.map(([k, v]) => (
          <div key={k}>
            {k.padEnd(24, ' ')}
            {v}
          </div>
        ))}
      </Card>
      <br />
      <Card title="PRIMITIVES" mode="left">
        <SimpleTable data={PRIMITIVES} />
      </Card>
      <br />
      <Card title="NOTE" mode="left">
        {NOTE}
      </Card>
      <br />
      <RowSpaceBetween>
        <span>
          <ActionButton hotkey="ESC">EXIT</ActionButton>
        </span>
        <span>
          <ActionButton hotkey="↵">SELECT</ActionButton>
        </span>
      </RowSpaceBetween>
    </Window>
  );
};

export default CLITemplate;
