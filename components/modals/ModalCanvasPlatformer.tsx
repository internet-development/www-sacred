'use client';

import styles from '@components/modals/ModalCanvasPlatformer.module.scss';

import * as React from 'react';
import * as Utilities from '@common/utilities';

import { useModals } from '@components/page/ModalContext';

import Button from '@components/Button';
import CanvasPlatformer from '@components/CanvasPlatformer';
import Card from '@components/Card';

interface ModalCanvasPlatformerProps {
  buttonText?: string | any;
}

function ModalCanvasPlatformer({ buttonText }: ModalCanvasPlatformerProps) {
  const { close } = useModals();

  return (
    <div className={styles.root}>
      <Card title="ALERT">
        <CanvasPlatformer rows={12} />
        <br />
        <br />
        <Button onClick={() => close()}>{Utilities.isEmpty(buttonText) ? 'Close' : buttonText}</Button>
      </Card>
    </div>
  );
}

export default ModalCanvasPlatformer;
