import styles from '@components/ActionListItem.module.scss';

import * as React from 'react';

interface ActionListItemProps {
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  href?: string;
  target?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement | HTMLAnchorElement>;
}

const ActionListItem: React.FC<ActionListItemProps> = (props) => {
  const { href, target, onClick, children, icon, style } = props;

  if (href) {
    return (
      <a className={styles.item} href={href} target={target} style={style} tabIndex={0} role="link">
        <figure className={styles.icon}>{icon}</figure>
        <span className={styles.text}>{children}</span>
      </a>
    );
  }

  return (
    <div className={styles.item} onClick={onClick} style={style} tabIndex={0} role="button">
      <figure className={styles.icon}>{icon}</figure>
      <span className={styles.text}>{children}</span>
    </div>
  );
};

export default ActionListItem;
