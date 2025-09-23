import styles from '@components/Dialog.module.scss';

import * as React from 'react';

import Block from '@components/Block';
import Button from '@components/Button';

interface DialogProps {
  title?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const Dialog: React.FC<DialogProps> = ({ title, children, style, onConfirm, onCancel }) => {
  const titleId = React.useId();
  const descId = React.useId();

  const hasTitle = title !== undefined && title !== null && !(typeof title === 'string' && title.trim() === '');
  const hasDescription = React.Children.count(children) > 0;

  return (
    <div
      className={styles.root}
      style={style}
      role="dialog"
      aria-modal="true"
      aria-labelledby={hasTitle ? titleId : undefined}
      aria-describedby={hasDescription ? descId : undefined}
    >
      <header className={styles.header} id={hasTitle ? titleId : undefined}>
        {title}
      </header>
      <br />
      <article className={styles.message} id={hasDescription ? descId : undefined}>
        {children}
      </article>
      <br />
      <div className={styles.actions}>
        <Button theme="SECONDARY" onClick={onConfirm}>
          OK
        </Button>
        <Block style={{ opacity: 0 }} />
        <Button theme="SECONDARY" onClick={onCancel}>
          Cancel
        </Button>
      </div>
      <br />
    </div>
  );
};

export default Dialog;
