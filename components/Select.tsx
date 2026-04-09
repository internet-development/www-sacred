'use client';

import styles from '@components/Select.module.css';

import * as React from 'react';
import * as Utilities from '@common/utilities';

interface SelectProps {
  name: string;
  options: string[];
  placeholder?: string;
  defaultValue?: string;
  onChange?: (selectedValue: string) => void;
}

const Select: React.FC<SelectProps> = ({ name, options, placeholder, defaultValue = '', onChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [index, setIndex] = React.useState(-1);
  const [selectedValue, setSelectedValue] = React.useState(defaultValue);

  const containerRef = React.useRef<HTMLButtonElement | null>(null);
  const listRef = React.useRef<HTMLUListElement | null>(null);

  const focusOption = (nextIndex: number) => {
    setIndex(nextIndex);
    const items = listRef.current?.querySelectorAll<HTMLLIElement>('[role="option"]');
    items?.[nextIndex]?.focus();
  };

  const handleOpen = () => {
    setIsOpen(true);
    const currentIndex = options.indexOf(selectedValue);
    setIndex(currentIndex >= 0 ? currentIndex : 0);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIndex(-1);

    if (containerRef && containerRef.current) {
      containerRef.current?.focus();
    }
  };

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    onChange?.(value);
    handleClose();
  };

  //NOTE(jimmylee): Focus the highlighted option after the listbox renders.
  React.useEffect(() => {
    if (isOpen && index >= 0) {
      const items = listRef.current?.querySelectorAll<HTMLLIElement>('[role="option"]');
      items?.[index]?.focus();
    }
  }, [isOpen]);

  //NOTE(jimmylee): Enter and Space rely on the button's native click activation via onClick.
  const handleButtonKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        if (!isOpen) {
          handleOpen();
        } else {
          const next = Math.min(index + 1, options.length - 1);
          focusOption(next);
        }
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        if (!isOpen) {
          handleOpen();
        } else {
          const prev = Math.max(index - 1, 0);
          focusOption(prev);
        }
        break;
      }
      case 'Escape': {
        if (isOpen) {
          event.preventDefault();
          handleClose();
        }
        break;
      }
    }
  };

  const handleOptionKeyDown = (event: React.KeyboardEvent<HTMLLIElement>, option: string, idx: number) => {
    switch (event.key) {
      case 'Enter':
      case ' ': {
        event.preventDefault();
        handleSelect(option);
        break;
      }
      case 'ArrowDown': {
        event.preventDefault();
        const next = Math.min(idx + 1, options.length - 1);
        focusOption(next);
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        const prev = Math.max(idx - 1, 0);
        focusOption(prev);
        break;
      }
      case 'Escape': {
        event.preventDefault();
        handleClose();
        break;
      }
    }
  };

  return (
    <>
      <section className={styles.select}>
        <figure
          className={Utilities.classNames(isOpen ? styles.focused : null, styles.control)}
          onClick={() => {
            isOpen ? handleClose() : handleOpen();
          }}
        >
          ▼
        </figure>
        <button
          className={styles.display}
          ref={containerRef}
          tabIndex={0}
          onClick={() => {
            isOpen ? handleClose() : handleOpen();
          }}
          onKeyDown={handleButtonKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          {selectedValue || placeholder}
        </button>
      </section>

      {isOpen && (
        <ul className={styles.menu} role="listbox" ref={listRef}>
          {options.map((option, idx) => {
            return (
              <li key={option} role="option" tabIndex={0} className={Utilities.classNames(styles.item)} aria-selected={idx === index} onClick={() => handleSelect(option)} onKeyDown={(e) => handleOptionKeyDown(e, option, idx)}>
                {option}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default Select;
