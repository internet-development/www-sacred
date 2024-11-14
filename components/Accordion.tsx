'use client';

import styles from '@components/Accordion.module.scss';

import * as React from 'react';
import * as Utilities from '@common/utilities';

import Row from '@components/Row';

interface AccordionProps {
  defaultValue?: boolean;
  title: string;
  children?: React.ReactNode;
}

function Accordion({ defaultValue = false, title, children }: AccordionProps) {
  const [show, setShow] = React.useState(defaultValue);
  const accordionRef = React.useRef<HTMLElement | null>(null);

  const toggleShow = () => {
    setShow((prevShow) => !prevShow);
  };

  return (
    <>
    <Row
      ref={accordionRef}
      tabIndex={0}
      role="button"
      onClick={toggleShow}
      aria-expanded={show}
    >
      <div className={Utilities.classNames(styles.flex, show ? styles.active : null)}>
        <span className={styles.icon}>{show ? '▾' : '▸'}</span>
        <span className={styles.content}>
          <strong>{title}</strong>
        </span>
      </div>
    </Row>
    {show && <Row style={{ paddingLeft: `1ch` }}>{children}</Row>}
    </>
  );
}

export default Accordion;