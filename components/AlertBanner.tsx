import styles from '@components/AlertBanner.module.scss';

import * as React from 'react';

function AlertBanner(props) {
  let style = { ...props.style };

  if (props.type === 'SUCCESS') {
    style = { ...props.style, background: `var(--theme-success)`, boxShadow: `1ch 1ch 0 0 var(--theme-success-subdued)` };
  }

  if (props.type === 'ERROR') {
    style = { ...props.style, background: `var(--theme-error)`, boxShadow: `1ch 1ch 0 0 var(--theme-error-subdued)` };
  }

  return <div className={styles.root} {...props} style={style} />;
}

export default AlertBanner;
