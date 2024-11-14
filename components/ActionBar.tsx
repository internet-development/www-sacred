import styles from '@components/ActionBar.module.scss';

import * as React from 'react';
import * as Utilities from '@common/utilities';

import ActionButton from '@components/ActionButton';
import Row from '@components/Row';

interface ActionBarItem {
  hotkey: string;
  onClick?: () => void;
  body: React.ReactNode;
}

interface ActionBarProps {
  items: ActionBarItem[];
}

const ActionBar: React.FC<ActionBarProps> = ({ items }) => {
  return (
    <div className={styles.root}>
      {items.map((each) => (
        <ActionButton key={each.hotkey} hotkey={each.hotkey} onClick={each.onClick}>
          {each.body}
        </ActionButton>
      ))}
    </div>
  );
};

export default ActionBar;
