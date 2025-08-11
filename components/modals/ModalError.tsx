'use client';

import styles from '@components/modals/ModalError.module.scss';

import * as React from 'react';
import * as Utilities from '@common/utilities';

import { useHotkeys } from '@modules/hotkeys';
import { useModals } from '@components/page/ModalContext';

import ActionButton from '@components/ActionButton';
import Button from '@components/Button';
import CardDouble from '@components/CardDouble';
import Grid from '@components/Grid';

interface ModalErrorProps {
  buttonText?: string | any;
  message: string | any;
  title?: string;
}

// TODO(jimmylee)
// Enter doesn't always work for some reason.
function ModalError({ message, buttonText, title }: ModalErrorProps) {
  const { close } = useModals();

  useHotkeys('enter', () => close());

  return (
    <div className={styles.root}>
      <CardDouble title={title}>
        <br />
        {message}
        <Grid>
          <ul>
            <li>
              Press{' '}
              <ActionButton hotkey="⏎" onClick={() => close()}>
                ENTER
              </ActionButton>{' '}
              to continue.
            </li>
          </ul>
        </Grid>
      </CardDouble>
    </div>
  );
}

export default ModalError;
