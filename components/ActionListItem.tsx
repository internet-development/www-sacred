import styles from '@components/ActionListItem.module.scss';

import * as React from 'react';

interface ActionListItemBaseProps {
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

interface LinkProps extends ActionListItemBaseProps {
  href: string;
  target?: string;
  onClick?: never;
  htmlFor?: never;
}

interface LabelProps extends ActionListItemBaseProps {
  htmlFor: string;
  onClick?: React.MouseEventHandler<HTMLLabelElement>;
  href?: never;
  target?: never;
}

interface DivProps extends ActionListItemBaseProps {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  href?: never;
  target?: never;
  htmlFor?: never;
}

type ActionListItemProps = LinkProps | LabelProps | DivProps;

const ActionListItem: React.FC<ActionListItemProps> = (props) => {
  if ('href' in props) {
    return (
      <a
        className={styles.item}
        href={props.href}
        target={props.target}
        style={props.style}
        tabIndex={0}
        role="link"
      >
        <figure className={styles.icon}>{props.icon}</figure>
        <span className={styles.text}>{props.children}</span>
      </a>
    );
  }

  if ('htmlFor' in props) {
    return (
      <label
        className={styles.item}
        htmlFor={props.htmlFor}
        style={props.style}
      >
        <figure className={styles.icon}>{props.icon}</figure>
        <span className={styles.text}>{props.children}</span>
      </label>
    );
  }

  return (
    <div
      className={styles.item}
      onClick={props.onClick}
      style={props.style}
      tabIndex={0}
      role="button"
    >
      <figure className={styles.icon}>{props.icon}</figure>
      <span className={styles.text}>{props.children}</span>
    </div>
  );
};

export default ActionListItem;