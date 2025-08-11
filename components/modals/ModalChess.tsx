'use client';

import styles from '@components/modals/ModalChess.module.scss';

import * as React from 'react';
import * as Utilities from '@common/utilities';

import { useHotkeys } from '@modules/hotkeys';
import { useModals } from '@components/page/ModalContext';

import Button from '@components/Button';
import CardDouble from '@components/CardDouble';
import Chessboard from '@components/Chessboard';

interface ModalErrorProps {
  buttonText?: string | any;
  board: string[][];
  title?: string;
}

function ModalChess({ board, buttonText, title }: ModalErrorProps) {
  const { close } = useModals();

  useHotkeys('enter', () => close());

  return (
    <div className={styles.root}>
      <CardDouble title={title} style={{ textAlign: 'center' }}>
        <Chessboard board={board} />
        <br />
        <br />
        <Button onClick={() => close()}>{Utilities.isEmpty(buttonText) ? 'CLOSE' : buttonText}</Button>
      </CardDouble>
    </div>
  );
}

export default ModalChess;
