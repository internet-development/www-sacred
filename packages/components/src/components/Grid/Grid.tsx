import styles from "./Grid.module.scss";

import * as React from "react";

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Grid: React.FC<GridProps> = ({ children, ...rest }) => {
  return (
    <div className={styles.grid} {...rest}>
      {children}
    </div>
  );
};
