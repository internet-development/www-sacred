"use client";

import styles from "./Row.module.scss";

import * as React from "react";

type RowProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
};

export const Row = React.forwardRef<HTMLElement, RowProps>(
  ({ children, ...rest }, ref) => {
    return (
      <section className={styles.row} ref={ref} {...rest}>
        {children}
      </section>
    );
  }
);

Row.displayName = "Row";
