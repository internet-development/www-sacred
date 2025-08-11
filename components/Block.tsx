import styles from '@components/Block.module.scss';

import * as React from 'react';

interface BlockProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
}

const Block: React.FC<BlockProps> = ({ children, ...rest }) => {
  return (
    <span className={styles.block} {...rest}>
      {children}
    </span>
  );
};

export default Block;
