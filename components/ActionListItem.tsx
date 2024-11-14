import styles from '@components/ActionListItem.module.scss';

import * as React from 'react';

export default function ActionListItem(props) {
  if (props.href) {
    return (
      <a className={styles.item} href={props.href} target={props.target} style={props.style} tabIndex={0} role="link">
        <figure className={styles.icon}>{props.icon}</figure>
        <span className={styles.text}>{props.children}</span>
      </a>
    );
  }

  if (props.htmlFor) {
    return (
      <label className={styles.item} htmlFor={props.htmlFor} onClick={props.onClick} style={props.style} tabIndex={0} role="button">
        <figure className={styles.icon}>{props.icon}</figure>
        <span className={styles.text}>{props.children}</span>
      </label>
    );
  }

  return (
    <div className={styles.item} onClick={props.onClick} style={props.style} tabIndex={0} role="button">
      <figure className={styles.icon}>{props.icon}</figure>
      <span className={styles.text}>{props.children}</span>
    </div>
  );
}
