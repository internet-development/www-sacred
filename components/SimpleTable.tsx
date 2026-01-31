'use client';

import styles from '@components/SimpleTable.module.css';

import * as React from 'react';

interface SimpleTableProps {
  data: string[][];
  headerless?: boolean;
}

const SimpleTable: React.FC<SimpleTableProps> = ({ data, headerless = false }) => {
  const tableRef = React.useRef<HTMLTableElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTableElement>) => {
    const activeElement = document.activeElement;
    if (!activeElement) return;
    
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        event.preventDefault();
        if (!(activeElement instanceof HTMLTableCellElement)) return;
        const direction = event.key === 'ArrowUp' || event.key === 'ArrowLeft' ? 'previous' : 'next';
        const allCells = Array.from(tableRef.current?.querySelectorAll<HTMLTableCellElement>('td, th') || []);
        const currentIndex = allCells.indexOf(activeElement);
        if (currentIndex === -1) return;
        let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
        if (direction === 'previous') {
          if (nextIndex < 0) nextIndex = allCells.length - 1;
        } else {
          if (nextIndex >= allCells.length) nextIndex = 0;
        }
        allCells[nextIndex].focus();
        break;
    }
  };

  return (
    <table className={styles.root} ref={tableRef} onKeyDown={handleKeyDown}>
      {!headerless && data.length > 0 && (
        <thead className={styles.head}>
          <tr className={styles.headerRow}>
            {data[0].map((cellContent, colIndex) => (
              <th key={colIndex} className={styles.headerCell} tabIndex={0}>
                {cellContent}
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody className={styles.body}>
        {data.slice(headerless ? 0 : 1).map((row, rowIndex) => (
          <tr key={rowIndex} className={styles.row}>
            {row.map((cellContent, colIndex) => (
              <td key={colIndex} className={styles.cell} tabIndex={0}>
                {cellContent}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

SimpleTable.displayName = 'SimpleTable';

export default SimpleTable;
