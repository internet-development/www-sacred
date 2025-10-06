import styles from './DefaultLayout.module.scss';

import * as React from 'react';

interface DefaultLayoutProps {
  previewPixelSRC: string;
  children?: React.ReactNode;
}

export const DefaultLayout: React.FC<DefaultLayoutProps> = ({ previewPixelSRC, children }) => {
  return (
    <div className={styles.body}>
      <img className={styles.pixel} src={previewPixelSRC} alt="" />
      {children}
    </div>
  );
};
