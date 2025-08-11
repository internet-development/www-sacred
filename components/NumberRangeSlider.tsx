'use client';

import styles from '@components/NumberRangeSlider.module.scss';

import * as React from 'react';

interface RangerProps {
  defaultValue?: number;
  max?: number;
  min?: number;
  step?: number;
}

const NumberRangeSlider: React.FC<RangerProps> = ({ defaultValue = 0, max = 5000, min = 0, step = 1 }) => {
  const sliderRef = React.useRef<HTMLInputElement>(null);
  const [displayValue, setDisplayValue] = React.useState<number>(defaultValue);

  const maxDigits = max.toString().length;

  const padValue = (value: number): string => {
    return value.toString().padStart(maxDigits, '0');
  };

  React.useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.value = String(defaultValue);
    }
    setDisplayValue(defaultValue);
  }, [defaultValue]);

  const scrub = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = parseInt(event.target.value, 10);
    setDisplayValue(value);
  };

  return (
    <div className={styles.root}>
      <label className={styles.left}>
        <div className={styles.amount}>{padValue(displayValue)}</div>
      </label>
      <input className={styles.slider} defaultValue={defaultValue} max={max} min={min} onChange={scrub} ref={sliderRef} role="slider" step={step} tabIndex={0} type="range" />
    </div>
  );
};

export default NumberRangeSlider;
