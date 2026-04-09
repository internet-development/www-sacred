'use client';

//NOTE(jimmylee): React port of the WindowCreateInvoice CLI screen — layout only, no animation header.
//NOTE(jimmylee): Same data shape as scripts/cli/templates/template.ts so the React surface and CLI
//NOTE(jimmylee): screen render the same line items. Uses SimpleTable instead of DataTable so a port to
//NOTE(jimmylee): the CLI framework can be made cell-for-cell with the same column widths. The screen
//NOTE(jimmylee): is wrapped in <Window> and the action row uses <ActionButton> + <RowSpaceBetween>
//NOTE(jimmylee): so it stays in lockstep with CLITemplate / ResultsList — every CLI port surface uses
//NOTE(jimmylee): the same dialog frame and action button pair the alt-screen CLI shows.

import * as React from 'react';

import Window from '@components/Window';
import Card from '@components/Card';
import SimpleTable from '@components/SimpleTable';
import ActionButton from '@components/ActionButton';
import RowSpaceBetween from '@components/RowSpaceBetween';

const LINE_ITEMS: string[][] = [
  ['#', 'DESC.', 'UNIT RATE', 'COUNT', 'AMOUNT (USD)'],
  ['1', 'Cloud Infrastructure (Mar)', '4,250.00', '1', '4,250.00'],
  ['2', 'Design Software Licenses', '75.00', '2', '150.00'],
  ['3', 'Office Supplies', '312.00', '1', '312.00'],
];

const LINE_ITEM_ALIGN: ('left' | 'right')[] = ['left', 'left', 'right', 'right', 'right'];

const SUMMARY: Array<[string, string]> = [
  ['Subtotal', '$4,712.00'],
  ['Discount', '$-471.20'],
  ['Net Sales Total', '$4,240.80'],
  ['Tax', '$0.00'],
  ['Total', '$4,240.80'],
];

const InvoiceTemplate: React.FC = () => {
  return (
    <Window>
      <Card title="INVOICE #1047" mode="left">
        Holy See — Apostolic Palace
        <br />
        Place du Palais des Papes
        <br />
        84000 Avignon, France
        <br />
        billing@avignon.va
        <br />
        <br />
        Billed To:
        <br />
        Jimmy Lee
        <br />
        Internet Development Studio Company
        <br />
        Green Door
        <br />
        San Francisco, CA
        <br />
        <br />
        Order No.: 1047
        <br />
        Invoice Date: Monday, March 9th 2026, 6:45 PM
      </Card>
      <br />
      <Card title="LINE ITEMS" mode="left">
        <SimpleTable data={LINE_ITEMS} align={LINE_ITEM_ALIGN} />
        <br />
        {SUMMARY.map(([label, value]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{label}</span>
            <span>{value}</span>
          </div>
        ))}
      </Card>
      <br />
      <RowSpaceBetween>
        <span>
          <ActionButton hotkey="ESC">EXIT</ActionButton>
        </span>
        <span>
          <ActionButton hotkey="↵">SUBMIT</ActionButton>
        </span>
      </RowSpaceBetween>
    </Window>
  );
};

export default InvoiceTemplate;
