"use client";

import styles from "./ModalCanvasPlatformer.module.scss";

import * as Utilities from "@srcl/ui/utilities";

import { useModals } from "@srcl/ui/hooks";

import { Button } from "@srcl/ui/components/Button";
import { CanvasPlatformer } from "@srcl/ui/components/CanvasPlatformer";
import { Card } from "@srcl/ui/components/Card";

interface ModalCanvasPlatformerProps {
  buttonText?: string | any;
}

export function ModalCanvasPlatformer({
  buttonText,
}: ModalCanvasPlatformerProps) {
  const { close } = useModals();

  return (
    <div className={styles.root}>
      <Card title="ALERT">
        <CanvasPlatformer rows={12} />
        <br />
        <br />
        <Button onClick={() => close()}>
          {Utilities.isEmpty(buttonText) ? "Close" : buttonText}
        </Button>
      </Card>
    </div>
  );
}
