import styles from '@components/ActionButton.module.scss';

import * as React from 'react';
import * as Utilities from '@common/utilities';

function ActionButton(props) {
  return (
    <div className={styles.root} onClick={props.onClick} tabIndex={0} role="button">
      <span className={styles.hotkey}>{props.hotkey}</span>
      <span className={styles.content}>{props.children}</span>
    </div>
  );
}

export default ActionButton;
