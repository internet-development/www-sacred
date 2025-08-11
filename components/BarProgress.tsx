'use client';

import styles from '@components/BarProgress.module.scss';

import * as React from 'react';

interface BarProgressProps {
  intervalRate?: number;
  progress?: number;
  fillChar?: string;
}

const BarProgress: React.FC<BarProgressProps> = ({ intervalRate, progress, fillChar = '░' }) => {
  const [currentProgress, setCurrentProgress] = React.useState(progress ?? 0);
  const [containerWidth, setContainerWidth] = React.useState(0);
  const [charWidth, setCharWidth] = React.useState(0);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const measureRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (typeof progress === 'number') {
      setCurrentProgress(progress);
      return;
    }
    if (!intervalRate) return;
    const interval = setInterval(() => {
      setCurrentProgress((prev) => (prev + 10) % 110);
    }, intervalRate);
    return () => clearInterval(interval);
  }, [intervalRate, progress]);

  React.useLayoutEffect(() => {
    if (!measureRef.current) return;
    const rect = measureRef.current.getBoundingClientRect();
    if (rect.width > 0) {
      setCharWidth(rect.width);
    } else {
      requestAnimationFrame(() => {
        const retryRect = measureRef.current?.getBoundingClientRect();
        if (retryRect && retryRect.width > 0) {
          setCharWidth(retryRect.width);
        }
      });
    }
  }, [fillChar]);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        setContainerWidth(width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const cappedProgress = Math.min(currentProgress, 100);

  let maxChars = 10;
  if (charWidth > 0 && containerWidth > 0) {
    maxChars = Math.max(1, Math.floor(containerWidth / charWidth));
  }

  const filledChars = Math.round((cappedProgress / 100) * maxChars);
  const barStr = fillChar.repeat(filledChars);

  return (
    <div className={styles.root} ref={containerRef} aria-valuenow={cappedProgress} aria-valuemin={0} aria-valuemax={100} role="progressbar">
      <span ref={measureRef} className={styles.measure}>
        {fillChar}
      </span>
      {barStr}
    </div>
  );
};

export default BarProgress;
