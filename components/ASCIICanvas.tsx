'use client';

//NOTE(jimmylee): ASCIICanvas — renders animated ASCII art in a <pre> element using per-cell <span> elements.
//NOTE(jimmylee): Ported from the animation framework in workdir/www-financial-cli-ui.
//NOTE(jimmylee): Memory optimized: pre-allocated span grid with DOM diffing (skips unchanged cells each frame).
//NOTE(jimmylee): IntersectionObserver pauses animation when off-screen to save CPU.
//NOTE(jimmylee): ResizeObserver recalculates column count on container resize.

import styles from '@components/ASCIICanvas.module.css';

import * as React from 'react';

const DENSITY = '10';

//NOTE(jimmylee): Mode 2 animation — binary 1s and 0s with animated wave-based grayscale gradients.
function animate(x: number, y: number, t: number, cols: number, rows: number): { char: string; color: string } {
  const speed = t * 8;
  const wave1 = Math.sin(x * 0.15 + speed) * Math.cos(y * 0.1 + speed * 0.7);
  const wave2 = Math.sin((x + y) * 0.08 + speed * 1.3);
  const v = wave1 + wave2;
  const digit = DENSITY[Math.floor(x * 0.5 + y * 0.3 + speed * 2) % DENSITY.length];
  const brightness = Math.floor(((Math.sin(v * 2) + 1) / 2) * 180 + 50);
  const hex = brightness.toString(16).padStart(2, '0');
  return { char: digit, color: `#${hex}${hex}${hex}` };
}

const ASCIICanvas = ({ rows = 10 }: { rows?: number }) => {
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

    //NOTE(jimmylee): Invisible measurement span — single 'X' character to calculate column width.
    const measure = document.createElement('span');
    measure.style.visibility = 'hidden';
    measure.style.position = 'absolute';
    measure.style.whiteSpace = 'pre';
    measure.textContent = 'X';
    el.appendChild(measure);

    //NOTE(jimmylee): Pre-allocate span elements per cell. Only rebuilds when column count changes.
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

    //NOTE(jimmylee): IntersectionObserver pauses rAF loop when element scrolls off-screen.
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
      const t = performance.now() * 0.0001;
      const grid = gridRef.current;
      const total = cols * rows;
      const pChars = prevCharsRef.current;
      const pColors = prevColorsRef.current;

      for (let idx = 0; idx < total && idx < grid.length; idx++) {
        const x = idx % cols;
        const y = (idx - x) / cols;
        const cell = animate(x, y, t, cols, rows);
        const s = grid[idx];
        if (cell.char !== pChars[idx]) {
          s.textContent = cell.char;
          pChars[idx] = cell.char;
        }
        if (cell.color !== pColors[idx]) {
          s.style.color = cell.color;
          pColors[idx] = cell.color;
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
  }, [rows]);

  const heightStyle = { height: `calc(var(--font-size) * var(--theme-line-height-base) * ${rows})` };

  return <pre ref={preRef} className={styles.root} style={heightStyle} />;
};

export default ASCIICanvas;
