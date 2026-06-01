'use client';

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

const PRIMITIVES: string[][] = [
  ['NAME', 'KIND', 'STATUS', 'UPDATED'],
  ['ansi.ts', 'primitive', 'ACTIVE', '2026-04-08T09:00:00'],
  ['window.ts', 'primitive', 'ACTIVE', '2026-04-08T09:00:00'],
  ['card.ts', 'primitive', 'ACTIVE', '2026-04-08T09:00:00'],
  ['table.ts', 'primitive', 'ACTIVE', '2026-04-08T09:00:00'],
  ['button.ts', 'primitive', 'ACTIVE', '2026-04-08T09:00:00'],
  ['app.ts', 'lifecycle', 'ACTIVE', '2026-04-08T09:00:00'],
];

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
