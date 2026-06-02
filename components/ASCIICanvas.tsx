'use client';

import styles from '@components/ASCIICanvas.module.css';

import * as React from 'react';

const DENSITY = '10';

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
  const previousColsRef = React.useRef<number>(0);
  const previousCharsRef = React.useRef<string[]>([]);
  const previousColorsRef = React.useRef<string[]>([]);

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

    const buildGrid = (cols: number) => {
      if (cols === previousColsRef.current) return;
      previousColsRef.current = cols;
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
      previousCharsRef.current = new Array(cols * rows).fill('');
      previousColorsRef.current = new Array(cols * rows).fill('');
    };

    const updateCols = () => {
      const charWidth = measure.getBoundingClientRect().width;
      if (charWidth > 0) {
        const cols = Math.floor(el.clientWidth / charWidth);
        colsRef.current = cols;
        buildGrid(cols);
      }
    };
    updateCols();

    const resizeObs = new ResizeObserver(updateCols);
    resizeObs.observe(el);

    //NOTE(jimmylee): Font changes toggle a class on <body> (e.g. font-use-web-plus-ibm-bios),
    //NOTE(jimmylee): which changes --font-family-mono. Other components reflow via CSS but
    //NOTE(jimmylee): ASCIICanvas must rebuild its span grid because column count depends on
    //NOTE(jimmylee): character width.
    const fontObs = new MutationObserver(() => {
      previousColsRef.current = 0;
      updateCols();
    });
    fontObs.observe(document.body, { attributes: true, attributeFilter: ['class', 'style'] });

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
      const time = performance.now() * 0.0001;
      const grid = gridRef.current;
      const total = cols * rows;
      const previousChars = previousCharsRef.current;
      const previousColors = previousColorsRef.current;

      for (let index = 0; index < total && index < grid.length; index++) {
        const column = index % cols;
        const row = (index - column) / cols;
        const cell = animate(column, row, time, cols, rows);
        const span = grid[index];
        if (cell.char !== previousChars[index]) {
          span.textContent = cell.char;
          previousChars[index] = cell.char;
        }
        if (cell.color !== previousColors[index]) {
          span.style.color = cell.color;
          previousColors[index] = cell.color;
        }
      }

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameRef.current);
      resizeObs.disconnect();
      fontObs.disconnect();
      interObs.disconnect();
      if (measure.parentNode) measure.parentNode.removeChild(measure);
    };
  }, [rows]);

  const heightStyle = { height: `calc(var(--font-size) * var(--theme-line-height-base) * ${rows})` };

  return <pre ref={preRef} className={styles.root} style={heightStyle} />;
};

export default ASCIICanvas;
