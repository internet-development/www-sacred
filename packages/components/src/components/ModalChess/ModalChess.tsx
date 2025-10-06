"use client";

import styles from "./ModalChess.module.scss";

import * as Utilities from "@srcl/ui/utilities";

import { useHotkeys, useModals } from "@srcl/ui/hooks";

import { Button } from "@srcl/ui/components/Button";
import { CardDouble } from "@srcl/ui/components/CardDouble";
import { Chessboard } from "@srcl/ui/components/Chessboard";

interface ModalErrorProps {
  buttonText?: string | any;
  board: string[][];
  title?: string;
}

export const ModalChess = ({ board, buttonText, title }: ModalErrorProps) => {
  const { close } = useModals();

  useHotkeys("enter", () => close());

  return (
    <div className={styles.root}>
      <CardDouble title={title} style={{ textAlign: "center" }}>
        <Chessboard board={board} />
        <br />
        <br />
        <Button onClick={() => close()}>
          {Utilities.isEmpty(buttonText) ? "CLOSE" : buttonText}
        </Button>
      </CardDouble>
    </div>
  );
};
