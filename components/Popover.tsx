import styles from '@components/Popover.module.scss';

import * as React from 'react';

interface PopoverProps extends React.HTMLAttributes<HTMLDivElement> {}

const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(({ style: propStyle, ...rest }, ref) => {
  const style: React.CSSProperties = { ...propStyle };

  return <div ref={ref} className={styles.root} {...rest} style={style} />;
});

Popover.displayName = 'Popover';

export default Popover;
