'use client';

import styles from '@components/DropdownMenu.module.css';

import * as React from 'react';

import ActionButton from '@components/ActionButton';
import ActionListItem from '@components/ActionListItem';
import ModalTrigger from '@components/ModalTrigger';

import { useHotkeys } from '@modules/hotkeys';

interface DropdownMenuItemProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  href?: string;
  target?: string;
  onClick?: () => void;
  modal?: any;
  modalProps?: Record<string, unknown>;
}

interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose?: (event?: MouseEvent | TouchEvent | KeyboardEvent) => void;
  items?: DropdownMenuItemProps[];
}

const DropdownMenu = React.forwardRef<HTMLDivElement, DropdownMenuProps>((props, ref) => {
  const { onClose, items, style, ...rest } = props;

  const menuRef = React.useRef<HTMLDivElement>(null);

  const setRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      (menuRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    },
    [ref]
  );

  const handleClose = React.useCallback(() => {
    if (onClose) onClose();
  }, [onClose]);

  //NOTE(jimmylee): Fallback for when focus is outside the menu container.
  useHotkeys('Escape', handleClose);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const menu = menuRef.current;
    if (!menu) return;

    const menuItems = Array.from(menu.querySelectorAll<HTMLElement>('[role="menuitem"]'));
    if (menuItems.length === 0) return;

    const currentIndex = menuItems.indexOf(event.target as HTMLElement);

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        event.stopPropagation();
        const next = currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0;
        menuItems[next].focus();
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        event.stopPropagation();
        const prev = currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
        menuItems[prev].focus();
        break;
      }
      case 'Enter':
      case ' ': {
        event.preventDefault();
        event.stopPropagation();
        if (currentIndex >= 0) {
          menuItems[currentIndex].click();
        }
        break;
      }
      case 'Escape': {
        event.preventDefault();
        event.stopPropagation();
        handleClose();
        break;
      }
    }
  };

  return (
    <div ref={setRef} className={styles.root} style={style} {...rest} role="menu" onKeyDown={handleKeyDown}>
      {items &&
        items.map((each, index) => {
          if (each.modal) {
            return (
              <ModalTrigger key={`action-items-${index}`} modal={each.modal} modalProps={each.modalProps}>
                <ActionListItem icon={each.icon} role="menuitem">
                  {each.children}
                </ActionListItem>
              </ModalTrigger>
            );
          }

          return (
            <ActionListItem
              key={`action-items-${index}`}
              icon={each.icon}
              href={each.href}
              target={each.target}
              role="menuitem"
              onClick={() => {
                if (each.onClick) {
                  each.onClick();
                }

                if (onClose) {
                  onClose();
                }
              }}
            >
              {each.children}
            </ActionListItem>
          );
        })}

      <footer className={styles.footer}>
        Press escape to{' '}
        <ActionButton
          hotkey="Esc"
          onClick={() => {
            if (onClose) onClose();
          }}
        >
          Close
        </ActionButton>
      </footer>
    </div>
  );
});

DropdownMenu.displayName = 'DropdownMenu';

export default DropdownMenu;
