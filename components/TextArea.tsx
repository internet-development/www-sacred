'use client';

import styles from '@components/TextArea.module.scss';

import * as React from 'react';
import * as Utilities from '@common/utilities';

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  autoPlay?: string;
  autoPlaySpeedMS?: number;
  isBlink?: boolean;
};
function TextArea({ autoPlay, autoPlaySpeedMS = 40, isBlink, placeholder, onChange, ...rest }: TextAreaProps) {
  const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const measurementRef = React.useRef<HTMLDivElement | null>(null);

  const [text, setText] = React.useState<string>(rest.defaultValue?.toString() || rest.value?.toString() || '');
  const [isAutoPlaying, setIsAutoPlaying] = React.useState<boolean>(!!autoPlay);
  const [isFocused, setIsFocused] = React.useState<boolean>(false);
  const [selectionStart, setSelectionStart] = React.useState<number>(0);

  const autoPlayIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const autoPlayIndexRef = React.useRef<number>(0);

  const [currentLineIndex, setCurrentLineIndex] = React.useState<number>(0);
  const [totalLines, setTotalLines] = React.useState<number>(0);

  React.useEffect(() => {
    if (textAreaRef.current && isFocused) {
      textAreaRef.current.setSelectionRange(selectionStart, selectionStart);
    }
  }, [selectionStart, isFocused]);

  React.useEffect(() => {
    if (rest.value !== undefined) {
      const val = rest.value.toString();
      setText(val);
      setIsAutoPlaying(false);
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
      setSelectionStart(val.length);
    }
  }, [rest.value]);

  React.useEffect(() => {
    if (autoPlay && !rest.value && !rest.defaultValue) {
      setIsAutoPlaying(true);
      autoPlayIndexRef.current = 0;
      setText('');
      if (autoPlayIntervalRef.current) clearInterval(autoPlayIntervalRef.current);

      autoPlayIntervalRef.current = setInterval(() => {
        autoPlayIndexRef.current++;
        if (!autoPlay) return;
        if (autoPlayIndexRef.current > autoPlay.length) {
          setIsAutoPlaying(false);
          clearInterval(autoPlayIntervalRef.current!);
          return;
        }
        const newText = autoPlay.slice(0, autoPlayIndexRef.current);
        setText(newText);
        setSelectionStart(newText.length);
      }, autoPlaySpeedMS);
    }

    return () => {
      if (autoPlayIntervalRef.current) clearInterval(autoPlayIntervalRef.current);
    };
  }, [autoPlay, rest.value, rest.defaultValue]);

  const resizeTextArea = React.useCallback(() => {
    if (!textAreaRef.current) return;
    textAreaRef.current.style.height = 'auto';
    textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
  }, []);

  React.useEffect(() => {
    resizeTextArea();
    window.addEventListener('resize', resizeTextArea);
    return () => window.removeEventListener('resize', resizeTextArea);
  }, [resizeTextArea]);

  const onHandleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setText(value);
    setIsAutoPlaying(false);
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
    }
    resizeTextArea();
    if (onChange) {
      onChange(e);
    }
    setSelectionStart(e.target.selectionStart ?? 0);
  };

  const onHandleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget as HTMLTextAreaElement;
    setSelectionStart(textarea.selectionStart);
  };

  const onHandleFocus = () => {
    setIsFocused(true);
    if (textAreaRef.current) {
      setSelectionStart(textAreaRef.current.selectionStart);
    }
  };

  const onHandleBlur = () => {
    setIsFocused(false);
  };

  const onHandleClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget as HTMLTextAreaElement;
    textarea.focus();
    setSelectionStart(textarea.selectionStart);
  };

  React.useLayoutEffect(() => {
    if (!measurementRef.current) return;

    const measurementEl = measurementRef.current;
    const computedStyle = window.getComputedStyle(measurementEl);
    const lineHeightStr = computedStyle.lineHeight;
    let lineHeight = 20;
    if (lineHeightStr.endsWith('px')) {
      lineHeight = parseFloat(lineHeightStr);
    }

    const countLines = (content: string) => {
      measurementEl.textContent = content || '\u00A0';
      const height = measurementEl.offsetHeight;
      return Math.round(height / lineHeight);
    };

    const displayString = text || placeholder || '';

    const textBeforeCaret = text.substring(0, selectionStart);
    const textAfterCaret = text.substring(selectionStart);

    const total = countLines(displayString);
    setTotalLines(total > 0 ? total - 1 : 0);

    const currentLines = countLines(textBeforeCaret);
    setCurrentLineIndex(currentLines > 0 ? currentLines - 1 : 0);
  }, [text, selectionStart, placeholder]);

  const onHandleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'ArrowUp' && currentLineIndex === 0) {
      e.preventDefault();
      const previousFocusable = Utilities.findNextFocusable(document.activeElement, 'previous');
      previousFocusable?.focus();
    } else if (e.key === 'ArrowDown' && currentLineIndex === totalLines) {
      e.preventDefault();
      const nextFocusable = Utilities.findNextFocusable(document.activeElement, 'next');
      nextFocusable?.focus();
    }
  };

  const isPlaceholderVisible = !text && placeholder;

  const containerClasses = Utilities.classNames(styles.root, isFocused && styles.focused);

  return (
    <div className={containerClasses}>
      <div className={Utilities.classNames(styles.displayed, isPlaceholderVisible && styles.placeholder)}>
        {isPlaceholderVisible ? placeholder : text.substring(0, selectionStart)}
        {!isPlaceholderVisible && <span className={Utilities.classNames(styles.block, isBlink && styles.blink)}></span>}
        {!isPlaceholderVisible && text.substring(selectionStart)}
      </div>

      <div ref={measurementRef} className={styles.hidden}></div>

      <textarea className={styles.hiddenElement} ref={textAreaRef} value={text} aria-placeholder={placeholder} onFocus={onHandleFocus} onBlur={onHandleBlur} onKeyDown={onHandleKeyDown} onChange={onHandleChange} onSelect={onHandleSelect} onClick={onHandleClick} {...rest} />
    </div>
  );
}

export default TextArea;
