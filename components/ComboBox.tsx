'use client';

import styles from '@components/ComboBox.module.scss';

import * as React from 'react';

import AlertBanner from '@components/AlertBanner';
import ButtonGroup from '@components/ButtonGroup';
import CardDouble from '@components/CardDouble';
import Input from '@components/Input';

interface ComboBoxProps {
  data: string[][];
  label?: string;
}

function ComboBox({ data, label }: ComboBoxProps) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filtered = React.useMemo(() => {
    const sliced = data.slice(1);
    if (!searchTerm) return [];
    return sliced.filter((entry) => entry[0].toLowerCase().includes(searchTerm.toLowerCase()));
  }, [data, searchTerm]);

  const displayed = React.useMemo(() => {
    const sliced = data.slice(1);
    if (filtered.length >= 5) return filtered.slice(0, 5);
    if (filtered.length === 0 && searchTerm) return sliced.slice(0, 5);
    if (filtered.length > 0 && filtered.length < 5) {
      const needed = 5 - filtered.length;
      const remainder = sliced.filter((entry) => !filtered.includes(entry));
      return [...filtered, ...remainder.slice(0, needed)];
    }
    return sliced.slice(0, 5);
  }, [filtered, data, searchTerm]);

  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  return (
    <>
      <div className={styles.root}>
        <Input autoComplete="off" isBlink label={label} name="input_test_blink" value={searchTerm} onChange={handleChange} />
      </div>
      {displayed.map((entry) => (
        <CardDouble key={entry[0]} title={entry[0]}>
          <AlertBanner>{entry[1]}</AlertBanner>
          <br />
          <ButtonGroup isFull items={[{ body: 'FAVORITE' }, { body: 'DONATE' }, { body: 'LEARN MORE' }]} />
        </CardDouble>
      ))}
    </>
  );
}

export default ComboBox;
