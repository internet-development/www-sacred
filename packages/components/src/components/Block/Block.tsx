import styles from "./Block.module.scss";

import * as React from "react";

interface BlockProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
}

export const Block: React.FC<BlockProps> = ({ children, ...rest }) => {
  return (
    <span className={styles.block} {...rest}>
      {children}
    </span>
  );
};
