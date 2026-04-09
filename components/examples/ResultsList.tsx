'use client';

//NOTE(jimmylee): React port of the WindowListBills/Cards/Expenses/Transactions CLI screens.
//NOTE(jimmylee): Layout only — no animation header. The data set matches scripts/cli/templates so the
//NOTE(jimmylee): React surface and CLI screen agree on the row order. Uses SimpleTable so the column
//NOTE(jimmylee): definition maps directly onto the CLI framework's `formatRow` colSpec. The screen is
//NOTE(jimmylee): wrapped in <Window> and the action row uses <ActionButton> + <RowSpaceBetween> so it
//NOTE(jimmylee): stays in lockstep with CLITemplate / InvoiceTemplate — every CLI port surface uses
//NOTE(jimmylee): the same dialog frame and action button pair the alt-screen CLI shows.

import * as React from 'react';

import Window from '@components/Window';
import Card from '@components/Card';
import SimpleTable from '@components/SimpleTable';
import ActionButton from '@components/ActionButton';
import RowSpaceBetween from '@components/RowSpaceBetween';

const RESULTS: string[][] = [
  ['ID', 'NAME', 'STATUS', 'AMOUNT', 'CREATED_AT'],
  ['a1b2c3d4-e5f6-7890', 'Office Supplies Q1', 'ACTIVE', '$2,340.00', '2026-03-11T14:22:08'],
  ['b2c3d4e5-f6a7-8901', 'Cloud Infrastructure', 'ACTIVE', '$18,920.50', '2026-03-10T09:15:33'],
  ['c3d4e5f6-a7b8-9012', 'Team Lunch March', 'CLOSED', '$487.25', '2026-03-09T12:48:19'],
  ['d4e5f6a7-b8c9-0123', 'Software Licenses', 'ACTIVE', '$6,100.00', '2026-03-08T16:05:41'],
  ['e5f6a7b8-c9d0-1234', 'Travel Reimbursement', 'CLOSED', '$1,245.80', '2026-03-07T08:30:55'],
];

const ResultsList: React.FC = () => {
  return (
    <Window>
      <Card title="RESULTS [Page 1 of 5]" mode="left">
        <SimpleTable data={RESULTS} />
      </Card>
      <br />
      <RowSpaceBetween>
        <span>
          <ActionButton hotkey="ESC">EXIT</ActionButton>
        </span>
        <span>
          <ActionButton hotkey="←">PREV</ActionButton>
          {' '}
          <ActionButton hotkey="→">NEXT</ActionButton>
        </span>
      </RowSpaceBetween>
    </Window>
  );
};

export default ResultsList;
