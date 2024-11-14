import styles from '@components/ActionButton.module.scss';

import * as React from 'react';
import * as Utilities from '@common/utilities';

interface ActionButtonProps {
  onClick?: () => void;
  hotkey: string;
  children?: React.ReactNode;
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, hotkey, children }) => {
  return (
    <div className={styles.root} onClick={onClick} tabIndex={0} role="button">
      <span className={styles.hotkey}>{hotkey}</span>
      <span className={styles.content}>{children}</span>
    </div>
  );
};

export default ActionButton;