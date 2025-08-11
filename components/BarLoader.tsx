'use client';

import * as React from 'react';

import styles from '@components/BarLoader.module.scss';

interface BarLoaderProps {
  intervalRate?: number;
  progress?: number;
}

const BarLoader: React.FC<BarLoaderProps> = ({ intervalRate, progress }) => {
  const [currentProgress, setCurrentProgress] = React.useState<number>(progress || 0);

  React.useEffect(() => {
    if (progress !== undefined) {
      setCurrentProgress(progress);
      return;
    }

    if (!intervalRate) return;

    const interval = setInterval(() => {
      setCurrentProgress((prev) => (prev + 10) % 110);
    }, intervalRate);

    return () => clearInterval(interval);
  }, [intervalRate, progress]);

  return (
    <div className={styles.root}>
      <div
        className={styles.bar}
        style={{
          width: `${Math.min(currentProgress, 100)}%`,
        }}
      ></div>
    </div>
  );
};

export default BarLoader;
