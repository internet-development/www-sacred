import styles from '@components/Window.module.css';

import * as React from 'react';

type WindowProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
};

const Window: React.FC<WindowProps> = ({ children, ...rest }) => {
  return (
    <section className={styles.window} role="dialog" {...rest}>
      {children}
    </section>
  );
};

export default Window;
