import styles from '@components/page/DefaultLayout.module.scss';

import * as React from 'react';

export default function DefaultLayout(props) {
  return (
    <div className={styles.body}>
      <img className={styles.pixel} src={props.previewPixelSRC} alt={''} />
      {props.children}
    </div>
  );
}
