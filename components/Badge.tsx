'use client';

import styles from '@components/Badge.module.css';

import * as React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ children, ...rest }) => {
  return (
    <span className={styles.root} {...rest}>
      {children}
    </span>
  );
};

export default Badge;
