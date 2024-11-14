import styles from '@components/Block.module.scss';

import * as React from 'react';

function Block(props) {
  return (
    <span className={styles.block} {...props}>
      {props.children}
    </span>
  );
}

export default Block;
