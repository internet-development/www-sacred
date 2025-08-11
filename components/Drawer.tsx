'use client';

import styles from '@components/Drawer.module.scss';

import * as React from 'react';

interface DrawerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
  children?: React.ReactNode;
  defaultValue?: boolean;
}

const Drawer: React.FC<DrawerProps> = ({ children, defaultValue = false, ...rest }) => {
  const [expand, setExpand] = React.useState<boolean>(defaultValue);

  return (
    <div className={styles.root} {...rest}>
      {expand ? <div className={styles.side}>{children}</div> : null}
      <div className={styles.right}>
        <button className={styles.action} onClick={() => setExpand(!expand)}>
          {expand ? '⭠' : '⭢'}
        </button>
      </div>
    </div>
  );
};

export default Drawer;
