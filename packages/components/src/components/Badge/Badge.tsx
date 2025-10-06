"use client";

import styles from "./Badge.module.scss";

import * as React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ children, ...rest }) => {
  return (
    <span className={styles.root} {...rest}>
      {children}
    </span>
  );
};
