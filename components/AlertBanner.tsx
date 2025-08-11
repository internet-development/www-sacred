import styles from '@components/AlertBanner.module.scss';

import * as React from 'react';

interface AlertBannerProps {
  style?: any;
  children?: any;
}

const AlertBanner: React.FC<AlertBannerProps> = ({ style: propStyle, ...rest }) => {
  let style: React.CSSProperties = { ...propStyle };

  return <div className={styles.root} {...rest} style={style} />;
};

export default AlertBanner;
