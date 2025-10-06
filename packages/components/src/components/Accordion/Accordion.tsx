"use client";

import styles from "./Accordion.module.scss";

import * as React from "react";
import * as Utilities from "@srcl/ui/utilities";

import { Row } from "@srcl/ui/components/Row";

interface AccordionProps {
  defaultValue?: boolean;
  title: string;
  children?: React.ReactNode;
}

export const Accordion: React.FC<AccordionProps> = ({
  defaultValue = false,
  title,
  children,
}) => {
  const [show, setShow] = React.useState<boolean>(defaultValue);
  const accordionRef = React.useRef<HTMLDivElement | null>(null);

  const toggleShow = (): void => {
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
        <div
          className={Utilities.classNames(
            styles.flex,
            show ? styles.active : undefined
          )}
        >
          <span className={styles.icon}>{show ? "▾" : "▸"}</span>
          <span className={styles.content}>{title}</span>
        </div>
      </Row>
      {show && <Row style={{ paddingLeft: "1ch" }}>{children}</Row>}
    </>
  );
};
