'use client';

import styles from '@components/ListItem.module.scss';

import * as React from 'react';
import * as Utilities from '@common/utilities';

const ListItem = ({ children }) => {
  const itemRef = React.useRef<HTMLLIElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLLIElement>) => {
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        itemRef.current?.click();
        break;
      case 'ArrowUp':
      case 'ArrowLeft': {
        event.preventDefault();
        const previousFocusable = Utilities.findNextFocusable(document.activeElement, 'previous');
        previousFocusable?.focus();
        break;
      }
      case 'ArrowDown':
      case 'ArrowRight': {
        event.preventDefault();
        const nextFocusable = Utilities.findNextFocusable(document.activeElement, 'next');
        nextFocusable?.focus();
        break;
      }
      default:
        break;
    }
  };

  return (
    <li className={styles.root} tabIndex={0} ref={itemRef} onKeyDown={handleKeyDown}>
      {children}
    </li>
  );
};

export default ListItem;
