'use client';

import * as React from 'react';

import { RadioButton } from './RadioButton';

interface RadioButtonGroupProps {
  options: { value: string; label: string }[];
  defaultValue?: string;
}

export const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({ options, defaultValue = '' }) => {
  const [selectedValue, setSelectedValue] = React.useState<string>(defaultValue);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
  };

  return (
    <>
      {options.map((option) => (
        <RadioButton key={option.value} name="example" value={option.value} selected={selectedValue === option.value} onSelect={handleSelect}>
          {option.label}
        </RadioButton>
      ))}
    </>
  );
};
