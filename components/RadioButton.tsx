import styles from '@components/RadioButton.module.scss';

import * as React from 'react';
import * as Utilities from '@common/utilities';

interface RadioButtonProps {
  style?: React.CSSProperties;
  name: string;
  value: string;
  selected?: boolean;
  onSelect?: (value: string) => void;
  children?: React.ReactNode;
}

const RadioButton: React.FC<RadioButtonProps> = ({ style, name, value, selected = false, onSelect, children }) => {
  const radioId = `${name}-${value}-radio`;
  const [isFocused, setIsFocused] = React.useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        onSelect?.(value);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        Utilities.findNextFocusable(document.activeElement, 'previous')?.focus();
        break;
      case 'Tab':
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        Utilities.findNextFocusable(document.activeElement, 'next')?.focus();
        break;
      default:
        break;
    }
  };

  const handleChange = () => {
    onSelect?.(value);
  };

  return (
    <div
      className={Utilities.classNames(styles.section, {
        [styles.focused]: isFocused,
        [styles.selected]: selected,
      })}
      style={style}
    >
      <input className={styles.input} id={radioId} type="radio" name={name} value={value} checked={selected} onFocus={handleFocus} onBlur={handleBlur} onKeyDown={handleKeyDown} onChange={handleChange} />
      <div className={styles.relative}>
        <label className={styles.figure} htmlFor={radioId}>
          {selected ? <span aria-hidden="true" className={styles.dot} /> : null}
        </label>
      </div>
      <div className={styles.right}>&nbsp;&nbsp;{children}</div>
    </div>
  );
};

export default RadioButton;
