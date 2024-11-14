'use client';

import styles from '@components/Accordion.module.scss';

import * as React from 'react';

import Row from '@components/Row';

function Accordion(props) {
  const [show, setShow] = React.useState(props.defaultValue);

  return (
    <>
      <Row onClick={() => setShow(!show)}>
        <div className={styles.flex}>
          <span className={styles.icon}>{show ? '▾' : '▸'}</span>
          <span className={styles.content}>
            <strong>{props.title}</strong>
          </span>
        </div>
      </Row>
      {show ? <Row style={{ paddingLeft: `1ch` }}>{props.children}</Row> : null}
    </>
  );
}

export default Accordion;
