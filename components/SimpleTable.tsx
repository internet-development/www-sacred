import styles from '@components/SimpleTable.module.css';

import * as React from 'react';

//NOTE(jimmylee): Simple fluid HTML table that mirrors the CLI framework's formatRow + cardHeaderRow
//NOTE(jimmylee): contract one-to-one. The first row of `data` is the header. Status coloring fires on
//NOTE(jimmylee): the same tokens the CLI honours: ACTIVE/OPEN/APPROVED → bold green, CLOSED/PAID/SUSPENDED
//NOTE(jimmylee): → gray. Use this table (not DataTable) inside CLI port examples so a port can be made
//NOTE(jimmylee): in either direction without losing column widths or status semantics.

interface SimpleTableProps {
  data: string[][];
  align?: ('left' | 'right')[];
}

const STATUS_OK = new Set(['ACTIVE', 'OPEN', 'APPROVED']);
const STATUS_OFF = new Set(['CLOSED', 'PAID', 'SUSPENDED']);

const SimpleTable: React.FC<SimpleTableProps> = ({ data, align }) => {
  if (!data || data.length === 0) return null;
  const [header, ...rows] = data;

  const alignAt = (col: number) => (align && align[col] === 'right' ? styles.alignRight : undefined);

  return (
    <div className={styles.scrollWrapper}>
      <table className={styles.root}>
        <thead>
          <tr>
            {header.map((cell, i) => (
              <td key={i} className={alignAt(i)}>
                {cell}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} tabIndex={0}>
              {row.map((cell, ci) => {
                let statusClass: string | undefined;
                if (STATUS_OK.has(cell)) statusClass = styles.statusOk;
                else if (STATUS_OFF.has(cell)) statusClass = styles.statusOff;
                const className = [alignAt(ci), statusClass].filter(Boolean).join(' ') || undefined;
                return (
                  <td key={ci} className={className}>
                    {cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SimpleTable;
