"use client";

import styles from "./ModalDOMSnake.module.scss";

import * as Utilities from "@srcl/ui/utilities";

import { useModals } from "@srcl/ui/hooks";

import { Button } from "@srcl/ui/components/Button";
import { Card } from "@srcl/ui/components/Card";

import { DOMSnake } from "@srcl/ui/components/DOMSnake";

interface ModalDOMSnakeProps {
  buttonText?: string | any;
}

export const ModalDOMSnake = ({ buttonText }: ModalDOMSnakeProps) => {
  const { close } = useModals();

  return (
    <div className={styles.root}>
      <Card title="DOM SNAKE">
        <DOMSnake height={14} width={34} />
        <br />
        <br />
        <Button onClick={() => close()}>
          {Utilities.isEmpty(buttonText) ? "Close" : buttonText}
        </Button>
      </Card>
    </div>
  );
};
