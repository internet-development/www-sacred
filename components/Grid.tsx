import styles from '@components/Grid.module.scss';

import * as React from 'react';

function Grid(props) {
  return (
    <div className={styles.grid} {...props}>
      {props.children}
    </div>
  );
}

export default Grid;
