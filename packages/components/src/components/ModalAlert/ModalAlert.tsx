"use client";

import styles from "./ModalAlert.module.scss";

import * as Utilities from "@srcl/ui/utilities";

import { useModals } from "@srcl/ui/hooks";

import { Button } from "@srcl/ui/components/Button";
import { Card } from "@srcl/ui/components/Card";

interface ModalAlertProps {
  buttonText?: string | any;
  message: string;
}

export const ModalAlert = ({ message, buttonText }: ModalAlertProps) => {
  const { close } = useModals();

  return (
    <div className={styles.root}>
      <Card title="ALERT">
        {message}
        <br />
        <br />
        <Button onClick={() => close()}>
          {Utilities.isEmpty(buttonText) ? "Close" : buttonText}
        </Button>
      </Card>
    </div>
  );
};
