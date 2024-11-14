'use client';

import styles from '@components/DefaultActionBar.module.scss';

import * as React from 'react';
import * as Utilities from '@common/utilities';

import { toggleDebugGrid } from '@components/DebugGrid';

import ActionBar from '@components/ActionBar';

function DefaultActionBar(props) {
  return (
    <div className={styles.root}>
      <ActionBar
        items={[
          {
            hotkey: '⌘+T',
            onClick: () => Utilities.onHandleThemeChange(),
            body: 'Toggle Theme',
          },
          {
            hotkey: '⌘+G',
            onClick: () => toggleDebugGrid(),
            body: 'Toggle Grid',
          },
        ]}
      />
    </div>
  );
}

export default DefaultActionBar;
