import styles from '@components/Text.module.scss';

import * as React from 'react';

function Text(props) {
  return (
    <p className={styles.text} {...props}>
      {props.children}
    </p>
  );
}

export default Text;
