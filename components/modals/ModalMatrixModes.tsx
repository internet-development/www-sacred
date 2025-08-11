'use client';

import styles from '@components/modals/ModalMatrixModes.module.scss';

import * as React from 'react';
import * as Utilities from '@common/utilities';

import { useModals } from '@components/page/ModalContext';

import Button from '@components/Button';
import Card from '@components/Card';
import MatrixLoader from '@components/MatrixLoader';

interface ModalMatrixModesProps {
  buttonText?: string | any;
}

function ModalMatrixModes({ buttonText }: ModalMatrixModesProps) {
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
        <Button onClick={() => close()}>{Utilities.isEmpty(buttonText) ? 'Close' : buttonText}</Button>
      </Card>
    </div>
  );
}

export default ModalMatrixModes;
