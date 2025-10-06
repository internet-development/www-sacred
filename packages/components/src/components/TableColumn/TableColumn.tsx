"use client";

import styles from "./TableColumn.module.scss";

import * as React from "react";

type TableColumnProps = React.HTMLAttributes<HTMLTableCellElement> & {
  children?: React.ReactNode;
};

export const TableColumn: React.FC<TableColumnProps> = ({
  children,
  ...rest
}) => {
  return (
    <td className={styles.root} {...rest}>
      {children}
    </td>
  );
};

TableColumn.displayName = "TableColumn";
