'use client';

import styles from '@components/RowEllipsis.module.scss';

import * as React from 'react';

type RowEllipsisProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
};

const RowEllipsis = React.forwardRef<HTMLElement, RowEllipsisProps>(({ children, ...rest }, ref) => {
  return (
    <section className={styles.row} ref={ref} {...rest}>
      {children}
    </section>
  );
});

RowEllipsis.displayName = 'RowEllipsis';

export default RowEllipsis;
