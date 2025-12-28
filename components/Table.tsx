'use client';

import styles from '@components/Table.module.css';

import * as React from 'react';

type TableProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
};

const Table = ({ children, ...rest }) => {
  return (
    <table className={styles.root} {...rest}>
      <tbody className={styles.body}>{children}</tbody>
    </table>
  );
};

Table.displayName = 'Table';

export default Table;
