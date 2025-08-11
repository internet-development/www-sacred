'use client';

import styles from '@components/TableRow.module.scss';

import * as React from 'react';

type TableRowProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
};

const TableRow = ({ children, ...rest }) => {
  return (
    <tr className={styles.root} tabIndex={0} {...rest}>
      {children}
    </tr>
  );
};

TableRow.displayName = 'TableRow';

export default TableRow;
