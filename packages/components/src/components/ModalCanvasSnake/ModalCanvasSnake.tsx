"use client";

import styles from "./ModalCanvasSnake.module.scss";

import * as Utilities from "@srcl/ui/utilities";

import { useModals } from "@srcl/ui/hooks";

import { Button } from "@srcl/ui/components/Button";
import { CanvasSnake } from "@srcl/ui/components/CanvasSnake";
import { Card } from "@srcl/ui/components/Card";

interface ModalCanvasSnakeProps {
  buttonText?: string | any;
}

export const ModalCanvasSnake = ({ buttonText }: ModalCanvasSnakeProps) => {
  const { close } = useModals();

  return (
    <div className={styles.root}>
      <Card title="CANVAS PLATFORMER">
        <CanvasSnake rows={12} />
        <br />
        <br />
        <Button onClick={() => close()}>
          {Utilities.isEmpty(buttonText) ? "Close" : buttonText}
        </Button>
      </Card>
    </div>
  );
};
