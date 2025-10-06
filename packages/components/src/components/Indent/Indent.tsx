import styles from "./Indent.module.scss";

import * as React from "react";

interface IndentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Indent: React.FC<IndentProps> = ({ children, ...rest }) => {
  return (
    <div className={styles.root} {...rest}>
      {children}
    </div>
  );
};
