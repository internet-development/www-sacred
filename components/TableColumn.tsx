'use client';

import styles from '@components/TableColumn.module.css';

import * as React from 'react';

type TableColumnProps = React.HTMLAttributes<HTMLTableCellElement> & {
  children?: React.ReactNode;
};

const TableColumn: React.FC<TableColumnProps> = ({ children, ...rest }) => {
  return (
    <td className={styles.root} {...rest}>
      {children}
    </td>
  );
};

TableColumn.displayName = 'TableColumn';

export default TableColumn;
