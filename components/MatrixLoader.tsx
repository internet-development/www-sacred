'use client';

//NOTE(jimmylee): Matrix rain effect rendered via pre/span grid instead of canvas.
//NOTE(jimmylee): Same DOM diffing, IntersectionObserver, and ResizeObserver patterns as ASCIICanvas.

import styles from '@components/MatrixLoader.module.css';

import * as React from 'react';

interface MatrixLoaderProps {
  rows?: number;
  direction?: undefined | 'top-to-bottom' | 'left-to-right';
  mode?: undefined | 'greek' | 'katakana';
}

function randomChar(mode: string): string {
  if (mode === 'greek') {
    const isUppercase = Math.random() < 0.5;
    return String.fromCharCode(isUppercase ? 0x0391 + Math.floor(Math.random() * (0x03a9 - 0x0391 + 1)) : 0x03b1 + Math.floor(Math.random() * (0x03c9 - 0x03b1 + 1)));
  }
  if (mode === 'katakana') {
    return String.fromCharCode(0x30a0 + Math.floor(Math.random() * (0x30ff - 0x30a0 + 1)));
  }
  return '0';
}

const MatrixLoader: React.FC<MatrixLoaderProps> = ({ rows = 25, direction = 'top-to-bottom', mode = 'greek' }) => {
  const preRef = React.useRef<HTMLPreElement>(null);
  const frameRef = React.useRef<number>(0);
  const colsRef = React.useRef<number>(40);
  const visibleRef = React.useRef<boolean>(false);
  const gridRef = React.useRef<HTMLSpanElement[]>([]);
  const prevColsRef = React.useRef<number>(0);
  const prevCharsRef = React.useRef<string[]>([]);
  const prevColorsRef = React.useRef<string[]>([]);

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

    //NOTE(jimmylee): Track head positions for the rain streams. Each column (or row for LTR) has a
    //NOTE(jimmylee): head position that advances, leaving a fading trail behind it.
    let headPositions: number[] = [];
    //NOTE(jimmylee): Per-cell brightness values for fade trails. Decays each frame to simulate
    //NOTE(jimmylee): the classic matrix rain fade-out effect.
    let cellBrightness: Float64Array = new Float64Array(0);

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
      cellBrightness = new Float64Array(cols * rows);

      if (direction === 'top-to-bottom') {
        headPositions = new Array(cols).fill(0);
      } else {
        headPositions = new Array(rows).fill(0);
      }
    };

    const updateCols = () => {
      const chW = measure.getBoundingClientRect().width;
      if (chW > 0) {
        const cols = Math.floor(el.clientWidth / chW);
        colsRef.current = cols;
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

    const loop = () => {
      if (!visibleRef.current || cancelled) return;

      const cols = colsRef.current;
      const grid = gridRef.current;
      const total = cols * rows;
      const pChars = prevCharsRef.current;
      const pColors = prevColorsRef.current;

      //NOTE(jimmylee): Decay all cell brightness each frame to create the fade trail.
      for (let i = 0; i < total; i++) {
        cellBrightness[i] *= 0.92;
      }

      if (direction === 'top-to-bottom') {
        for (let col = 0; col < cols; col++) {
          const y = headPositions[col];
          if (y < rows) {
            const idx = y * cols + col;
            cellBrightness[idx] = 1;
          }
          headPositions[col]++;
          if (headPositions[col] > rows + Math.random() * 40) {
            headPositions[col] = 0;
          }
        }
      } else {
        for (let row = 0; row < rows; row++) {
          const x = headPositions[row];
          if (x < cols) {
            const idx = row * cols + x;
            cellBrightness[idx] = 1;
          }
          headPositions[row]++;
          if (headPositions[row] > cols + Math.random() * 40) {
            headPositions[row] = 0;
          }
        }
      }

      for (let idx = 0; idx < total && idx < grid.length; idx++) {
        const b = cellBrightness[idx];
        const s = grid[idx];

        if (b < 0.02) {
          if (pChars[idx] !== ' ') {
            s.textContent = ' ';
            pChars[idx] = ' ';
          }
          if (pColors[idx] !== '') {
            s.style.color = '';
            pColors[idx] = '';
          }
          continue;
        }

        //NOTE(jimmylee): Refresh the character occasionally to create the shimmering effect.
        if (b > 0.9 || Math.random() < 0.03) {
          const ch = randomChar(mode);
          if (ch !== pChars[idx]) {
            s.textContent = ch;
            pChars[idx] = ch;
          }
        }

        const alpha = Math.round(b * 100) / 100;
        const colorKey = alpha.toFixed(2);
        if (colorKey !== pColors[idx]) {
          s.style.color = themeTextColor;
          s.style.opacity = String(alpha);
          pColors[idx] = colorKey;
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
  }, [rows, direction, mode]);

  const heightStyle = { height: `calc(var(--font-size) * var(--theme-line-height-base) * ${rows})` };

  return (
    <div className={styles.container}>
      <pre ref={preRef} className={styles.root} style={heightStyle} />
    </div>
  );
};

export default MatrixLoader;
