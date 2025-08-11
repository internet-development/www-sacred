import styles from '@components/DropdownMenu.module.scss';

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

  const handleHotkey = () => {
    if (onClose) onClose();
  };

  useHotkeys('space', handleHotkey);

  return (
    <div ref={ref} className={styles.root} style={style} {...rest}>
      {items &&
        items.map((each, index) => {
          if (each.modal) {
            return (
              <ModalTrigger key={`action-items-${index}`} modal={each.modal} modalProps={each.modalProps}>
                <ActionListItem children={each.children} icon={each.icon} />
              </ModalTrigger>
            );
          }

          return (
            <ActionListItem
              key={`action-items-${index}`}
              children={each.children}
              icon={each.icon}
              href={each.href}
              target={each.target}
              onClick={() => {
                if (each.onClick) {
                  each.onClick();
                }

                if (onClose) {
                  onClose();
                }
              }}
            />
          );
        })}

      <footer className={styles.footer}>
        Press space to{' '}
        <ActionButton
          hotkey="␣"
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
