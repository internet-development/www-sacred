'use client';

import styles from '@components/ActionListItem.module.css';

import * as React from 'react';

interface ActionListItemProps {
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  href?: string;
  target?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement | HTMLAnchorElement>;
  role?: string;
}

const ActionListItem: React.FC<ActionListItemProps> = (props) => {
  const { href, target, onClick, children, icon, style, role } = props;

  const resolvedRole = role || (href ? 'link' : 'button');

  if (href) {
    return (
      <a className={styles.item} href={href} target={target} style={style} tabIndex={0} role={resolvedRole}>
        <figure className={styles.icon}>{icon}</figure>
        <span className={styles.text}>{children}</span>
      </a>
    );
  }

  //NOTE(jimmylee): When role="menuitem", the parent menu container handles keyboard activation.
  const handleKeyDown = role === 'menuitem' ? undefined : (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (e.key === ' ') e.preventDefault();
      e.currentTarget.click();
    }
  };

  return (
    <div className={styles.item} onClick={onClick} onKeyDown={handleKeyDown} style={style} tabIndex={0} role={resolvedRole}>
      <figure className={styles.icon}>{icon}</figure>
      <span className={styles.text}>{children}</span>
    </div>
  );
};

export default ActionListItem;
