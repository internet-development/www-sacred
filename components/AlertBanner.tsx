import styles from '@components/AlertBanner.module.scss';

import * as React from 'react';

interface AlertBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'SUCCESS' | 'ERROR';
}

const AlertBanner: React.FC<AlertBannerProps> = ({ type, style: propStyle, ...rest }) => {
  let style: React.CSSProperties = { ...propStyle };

  if (type === 'SUCCESS') {
    style = {
      ...style,
      background: 'var(--theme-success)',
      boxShadow: '1ch 1ch 0 0 var(--theme-success-subdued)',
    };
  }

  if (type === 'ERROR') {
    style = {
      ...style,
      background: 'var(--theme-error)',
      boxShadow: '1ch 1ch 0 0 var(--theme-error-subdued)',
    };
  }

  return <div className={styles.root} {...rest} style={style} />;
};

export default AlertBanner;