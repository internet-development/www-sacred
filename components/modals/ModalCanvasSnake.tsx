'use client';

import styles from '@components/modals/ModalCanvasSnake.module.scss';

import * as React from 'react';
import * as Utilities from '@common/utilities';

import { useModals } from '@components/page/ModalContext';

import Button from '@components/Button';
import CanvasSnake from '@components/CanvasSnake';
import Card from '@components/Card';

interface ModalCanvasSnakeProps {
  buttonText?: string | any;
}

function ModalCanvasSnake({ buttonText }: ModalCanvasSnakeProps) {
  const { close } = useModals();

  return (
    <div className={styles.root}>
      <Card title="CANVAS PLATFORMER">
        <CanvasSnake rows={12} />
        <br />
        <br />
        <Button onClick={() => close()}>{Utilities.isEmpty(buttonText) ? 'Close' : buttonText}</Button>
      </Card>
    </div>
  );
}

export default ModalCanvasSnake;
