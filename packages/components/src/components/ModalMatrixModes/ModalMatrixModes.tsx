"use client";

import styles from "./ModalMatrixModes.module.scss";

import * as Utilities from "@srcl/ui/utilities";

import { useModals } from "@srcl/ui/hooks";

import { Button } from "@srcl/ui/components/Button";
import { Card } from "@srcl/ui/components/Card";
import { MatrixLoader } from "@srcl/ui/components/MatrixLoader";

interface ModalMatrixModesProps {
  buttonText?: string | any;
}

export const ModalMatrixModes = ({ buttonText }: ModalMatrixModesProps) => {
  const { close } = useModals();

  return (
    <div className={styles.root}>
      <Card title="MATRIX MODES">
        <Card title="KATAKANA DEFAULT">
          <MatrixLoader rows={32} mode="katakana" />
        </Card>
        <Card title="GREEK LTR">
          <MatrixLoader direction="left-to-right" rows={8} mode="greek" />
        </Card>
        <br />
        <br />
        <Button onClick={() => close()}>
          {Utilities.isEmpty(buttonText) ? "Close" : buttonText}
        </Button>
      </Card>
    </div>
  );
};
