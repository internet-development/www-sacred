'use client';

//NOTE(jimmylee): Snake game rendered via pre/span grid instead of canvas.
//NOTE(jimmylee): Same DOM diffing, IntersectionObserver, and ResizeObserver patterns as ASCIICanvas.
//NOTE(jimmylee): Game logic is identical to the original — grid-based movement, wrap-on-collision reset.

import styles from '@components/CanvasSnake.module.css';

import * as React from 'react';

import ActionButton from '@components/ActionButton';

interface SnakeProps {
  rows?: number;
}

interface Position {
  x: number;
  y: number;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const CanvasSnake = ({ rows = 25 }: SnakeProps) => {
  const preRef = React.useRef<HTMLPreElement>(null);
  const [focused, setFocused] = React.useState(false);
  const directionRef = React.useRef<Direction>('RIGHT');
  const snakeRef = React.useRef<Position[]>([]);
  const fruitRef = React.useRef<Position>({ x: 0, y: 0 });
  const gridWidthRef = React.useRef<number>(0);
  const gridHeightRef = React.useRef<number>(0);
  const lastMoveTimeRef = React.useRef<number>(0);
  const moveInterval = 150;
  const frameRef = React.useRef<number>(0);
  const visibleRef = React.useRef<boolean>(false);
  const gridRef = React.useRef<HTMLSpanElement[]>([]);
  const prevColsRef = React.useRef<number>(0);
  const prevCharsRef = React.useRef<string[]>([]);
  const prevColorsRef = React.useRef<string[]>([]);
  const focusedRef = React.useRef<boolean>(false);

  const reset = React.useCallback((cols: number, gridRows: number) => {
    gridWidthRef.current = cols;
    gridHeightRef.current = gridRows;

    const startX = Math.floor(cols / 2);
    const startY = Math.floor(gridRows / 2);

    const snake: Position[] = [];
    for (let i = 13; i >= 0; i--) {
      snake.push({ x: startX - i, y: startY });
    }
    snakeRef.current = snake;
    directionRef.current = 'RIGHT';

    fruitRef.current = {
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * gridRows),
    };

    lastMoveTimeRef.current = performance.now();
  }, []);

  React.useEffect(() => {
    const el = preRef.current;
    if (!el) return;

    let cancelled = false;

    const measure = document.createElement('span');
    measure.style.visibility = 'hidden';
    measure.style.position = 'absolute';
    measure.style.whiteSpace = 'pre';
    measure.textContent = 'X';
    el.appendChild(measure);

    const themeTextColor = getComputedStyle(document.body).getPropertyValue('--theme-text').trim();
    const themeFocusedColor = getComputedStyle(document.body).getPropertyValue('--theme-focused-foreground').trim();

    const buildGrid = (cols: number) => {
      if (cols === prevColsRef.current) return;
      prevColsRef.current = cols;
      while (el.firstChild && el.firstChild !== measure) {
        el.removeChild(el.firstChild);
      }

      const frag = document.createDocumentFragment();
      const spans: HTMLSpanElement[] = [];

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const s = document.createElement('span');
          s.textContent = ' ';
          spans.push(s);
          frag.appendChild(s);
        }
        if (y < rows - 1) frag.appendChild(document.createTextNode('\n'));
      }

      el.insertBefore(frag, measure);
      gridRef.current = spans;
      prevCharsRef.current = new Array(cols * rows).fill('');
      prevColorsRef.current = new Array(cols * rows).fill('');
      reset(cols, rows);
    };

    const updateCols = () => {
      const chW = measure.getBoundingClientRect().width;
      if (chW > 0) {
        const cols = Math.floor(el.clientWidth / chW);
        buildGrid(cols);
      }
    };
    updateCols();

    const resizeObs = new ResizeObserver(updateCols);
    resizeObs.observe(el);

    const interObs = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = visibleRef.current;
        visibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting && !wasVisible) {
          frameRef.current = requestAnimationFrame(loop);
        }
      },
      { threshold: 0 }
    );
    interObs.observe(el);

    const moveSnake = () => {
      const snake = snakeRef.current;
      const dir = directionRef.current;
      const head = snake[snake.length - 1];
      const newHead: Position = { x: head.x, y: head.y };

      if (dir === 'LEFT') newHead.x -= 1;
      if (dir === 'RIGHT') newHead.x += 1;
      if (dir === 'UP') newHead.y -= 1;
      if (dir === 'DOWN') newHead.y += 1;

      const cols = gridWidthRef.current;
      if (newHead.x < 0 || newHead.x >= cols || newHead.y < 0 || newHead.y >= rows) {
        reset(cols, rows);
        return;
      }

      for (const seg of snake) {
        if (seg.x === newHead.x && seg.y === newHead.y) {
          reset(cols, rows);
          return;
        }
      }

      snake.push(newHead);
      if (newHead.x === fruitRef.current.x && newHead.y === fruitRef.current.y) {
        let fruitPos: Position;
        while (true) {
          fruitPos = {
            x: Math.floor(Math.random() * cols),
            y: Math.floor(Math.random() * rows),
          };
          if (!snake.some((s) => s.x === fruitPos.x && s.y === fruitPos.y)) break;
        }
        fruitRef.current = fruitPos;
      } else {
        snake.shift();
      }
    };

    const loop = (time: number) => {
      if (!visibleRef.current || cancelled) return;

      const cols = gridWidthRef.current;
      const grid = gridRef.current;
      const total = cols * rows;
      const pChars = prevCharsRef.current;
      const pColors = prevColorsRef.current;

      if (focusedRef.current && time - lastMoveTimeRef.current > moveInterval) {
        moveSnake();
        lastMoveTimeRef.current = time;
      }

      const snakeSet = new Set<number>();
      for (const seg of snakeRef.current) {
        snakeSet.add(seg.y * cols + seg.x);
      }
      const fruitIdx = fruitRef.current.y * cols + fruitRef.current.x;

      for (let idx = 0; idx < total && idx < grid.length; idx++) {
        const s = grid[idx];
        let ch: string;
        let color: string;

        if (snakeSet.has(idx)) {
          ch = '█';
          color = themeTextColor;
        } else if (idx === fruitIdx) {
          ch = '█';
          color = themeFocusedColor;
        } else {
          ch = ' ';
          color = '';
        }

        if (ch !== pChars[idx]) {
          s.textContent = ch;
          pChars[idx] = ch;
        }
        if (color !== pColors[idx]) {
          s.style.color = color;
          pColors[idx] = color;
        }
      }

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameRef.current);
      resizeObs.disconnect();
      interObs.disconnect();
      if (measure.parentNode) measure.parentNode.removeChild(measure);
    };
  }, [rows, reset]);

  React.useEffect(() => {
    const el = preRef.current;
    if (!el) return;

    const onFocus = () => {
      setFocused(true);
      focusedRef.current = true;
    };
    const onBlur = () => {
      setFocused(false);
      focusedRef.current = false;
    };

    el.tabIndex = 0;
    el.addEventListener('focus', onFocus);
    el.addEventListener('blur', onBlur);

    return () => {
      el.removeEventListener('focus', onFocus);
      el.removeEventListener('blur', onBlur);
    };
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!focusedRef.current) return;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        e.stopPropagation();
      }
      const currentDir = directionRef.current;
      if (e.key === 'ArrowLeft' && currentDir !== 'RIGHT') directionRef.current = 'LEFT';
      if (e.key === 'ArrowRight' && currentDir !== 'LEFT') directionRef.current = 'RIGHT';
      if (e.key === 'ArrowUp' && currentDir !== 'DOWN') directionRef.current = 'UP';
      if (e.key === 'ArrowDown' && currentDir !== 'UP') directionRef.current = 'DOWN';
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, []);

  //NOTE(jimmylee): Swipe gestures for mobile — swipe direction maps to snake direction change.
  React.useEffect(() => {
    const el = preRef.current;
    if (!el) return;

    let startX = 0;
    let startY = 0;

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      if (!focusedRef.current) el.focus();
    };

    const onTouchEnd = (e: TouchEvent) => {
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (absDx < 10 && absDy < 10) return;

      const currentDir = directionRef.current;
      if (absDx > absDy) {
        if (dx > 0 && currentDir !== 'LEFT') directionRef.current = 'RIGHT';
        if (dx < 0 && currentDir !== 'RIGHT') directionRef.current = 'LEFT';
      } else {
        if (dy > 0 && currentDir !== 'UP') directionRef.current = 'DOWN';
        if (dy < 0 && currentDir !== 'DOWN') directionRef.current = 'UP';
      }
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  const onHandleClickUp = () => {
    if (directionRef.current !== 'DOWN') directionRef.current = 'UP';
  };
  const onHandleClickDown = () => {
    if (directionRef.current !== 'UP') directionRef.current = 'DOWN';
  };
  const onHandleClickLeft = () => {
    if (directionRef.current !== 'RIGHT') directionRef.current = 'LEFT';
  };
  const onHandleClickRight = () => {
    if (directionRef.current !== 'LEFT') directionRef.current = 'RIGHT';
  };

  const heightStyle = { height: `calc(var(--font-size) * var(--theme-line-height-base) * ${rows})` };

  return (
    <>
      <ActionButton hotkey="↑" onClick={onHandleClickUp}>
        Up
      </ActionButton>
      <ActionButton hotkey="↓" onClick={onHandleClickDown}>
        Down
      </ActionButton>
      <ActionButton hotkey="←" onClick={onHandleClickLeft}>
        Left
      </ActionButton>
      <ActionButton hotkey="→" onClick={onHandleClickRight}>
        Right
      </ActionButton>
      <div className={styles.container}>
        <pre ref={preRef} className={styles.root} style={heightStyle} tabIndex={0} />
      </div>
    </>
  );
};

export default CanvasSnake;
