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

const Accordion: React.FC<AccordionProps> = ({ defaultValue = false, title, children }) => {
  const [show, setShow] = React.useState<boolean>(defaultValue);
  const accordionRef = React.useRef<HTMLDivElement | null>(null);

  const toggleShow = (): void => {
    setShow((prevShow) => !prevShow);
  };

  return (
    <>
      <Row ref={accordionRef} tabIndex={0} role="button" onClick={toggleShow} aria-expanded={show}>
        <div className={Utilities.classNames(styles.flex, show ? styles.active : undefined)}>
          <span className={styles.icon}>{show ? '▾' : '▸'}</span>
          <span className={styles.content}>{title}</span>
        </div>
      </Row>
      {show && <Row style={{ paddingLeft: '1ch' }}>{children}</Row>}
    </>
  );
};

export default Accordion;
