import styles from '@components/SimpleTable.module.css';

import * as React from 'react';

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
