import styles from '@components/ActionBar.module.scss';

import * as React from 'react';
import * as Utilities from '@common/utilities';

import ActionButton from '@components/ActionButton';
import Row from '@components/Row';

function ActionBar(props) {
  return (
    <div className={styles.root}>
      {props.items.map((each) => {
        return (
          <ActionButton key={each.hotkey} hotkey={each.hotkey} onClick={each.onClick}>
            {each.body}
          </ActionButton>
        );
      })}
    </div>
  );
}

export default ActionBar;
