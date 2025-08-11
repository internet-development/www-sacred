import styles from '@components/Indent.module.scss';

import * as React from 'react';

interface IndentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const Indent: React.FC<IndentProps> = ({ children, ...rest }) => {
  return (
    <div className={styles.root} {...rest}>
      {children}
    </div>
  );
};

export default Indent;
