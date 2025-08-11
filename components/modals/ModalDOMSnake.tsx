'use client';

import styles from '@components/modals/ModalCanvasSnake.module.scss';

import * as React from 'react';
import * as Utilities from '@common/utilities';

import { useModals } from '@components/page/ModalContext';

import Button from '@components/Button';
import Card from '@components/Card';
import DOMSnake from '@components/DOMSnake';

interface ModalDOMSnakeProps {
  buttonText?: string | any;
}

function ModalDOMSnake({ buttonText }: ModalDOMSnakeProps) {
  const { close } = useModals();

  return (
    <div className={styles.root}>
      <Card title="DOM SNAKE">
        <DOMSnake height={14} width={34} />
        <br />
        <br />
        <Button onClick={() => close()}>{Utilities.isEmpty(buttonText) ? 'Close' : buttonText}</Button>
      </Card>
    </div>
  );
}

export default ModalDOMSnake;
