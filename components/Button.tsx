'use client';

import styles from '@components/Button.module.scss';

import * as React from 'react';
import * as Utilities from '@common/utilities';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  theme?: 'PRIMARY' | 'SECONDARY';
  isDisabled?: boolean;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ theme = 'PRIMARY', isDisabled, children, ...rest }) => {
  let classNames = Utilities.classNames(styles.root, styles.primary);

  if (theme === 'SECONDARY') {
    classNames = Utilities.classNames(styles.root, styles.secondary);
  }

  if (isDisabled) {
    classNames = Utilities.classNames(styles.root, styles.disabled);

    return <div className={classNames}>{children}</div>;
  }

  return (
    <button className={classNames} role="button" tabIndex={0} disabled={isDisabled} {...rest}>
      {children}
    </button>
  );
};

export default Button;
