import styles from '@components/ContentFluid.module.scss';

import * as React from 'react';

interface ContentFluidProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
}

const ContentFluid: React.FC<ContentFluidProps> = ({ children, ...rest }) => {
  return <div className={styles.root}>{children}</div>;
};

export default ContentFluid;
