'use client';

import styles from '@components/Button.module.scss';

import * as React from 'react';
import * as Utilities from '@common/utilities';

function Button(props) {
  let classNames = Utilities.classNames(styles.root, styles.primary);

  if (props.type === 'SECONDARY') {
    classNames = Utilities.classNames(styles.root, styles.secondary);
  }

  if (props.isDisabled) {
    classNames = Utilities.classNames(styles.root, styles.disabled);

    return (
      <button className={classNames} disabled>
        {props.children}
      </button>
    );
  }

  return <button className={classNames} {...props} />;
}

export default Button;
