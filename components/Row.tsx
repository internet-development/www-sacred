'use client';

import styles from '@components/Row.module.scss';

import * as React from 'react';

function Row(props) {
  return (
    <section className={styles.row} {...props}>
      {props.children}
    </section>
  );
}

export default Row;
