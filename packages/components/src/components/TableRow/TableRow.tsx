"use client";

import styles from "./TableRow.module.scss";

import * as React from "react";

type TableRowProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
};

export const TableRow = ({ children, ...rest }) => {
  return (
    <tr className={styles.root} tabIndex={0} {...rest}>
      {children}
    </tr>
  );
};

TableRow.displayName = "TableRow";
