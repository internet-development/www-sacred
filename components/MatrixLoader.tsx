'use client';

import styles from '@components/MatrixLoader.module.scss';

import * as React from 'react';

interface MatrixLoaderProps {
  rows?: number;
  direction?: undefined | 'top-to-bottom' | 'left-to-right';
  mode?: undefined | 'greek' | 'katakana';
}

// TODO(jimmylee)
// Move these constants into a separate file
// Dynamically compute these constants since we're going to
// Support t-shirt sizes for the system.
const LINE_HEIGHT = 20;
const CHARACTER_WIDTH = 9.6;

function onTextGeneration({ mode = 'greek' }) {
  if (mode === 'greek') {
    const isUppercase = Math.random() < 0.5;

    return String.fromCharCode(isUppercase ? 0x0391 + Math.floor(Math.random() * (0x03a9 - 0x0391 + 1)) : 0x03b1 + Math.floor(Math.random() * (0x03c9 - 0x03b1 + 1)));
  }

  if (mode === 'katakana') {
    const japaneseRanges = [{ start: 0x30a0, end: 0x30ff }];

    const allJapaneseCharacters = japaneseRanges.flatMap((range) => Array.from({ length: range.end - range.start + 1 }, (_, i) => range.start + i));

    const randomJapaneseCharacter = allJapaneseCharacters[Math.floor(Math.random() * allJapaneseCharacters.length)];
    return String.fromCharCode(randomJapaneseCharacter);
  }

  return '0';
}

const MatrixLoader: React.FC<MatrixLoaderProps> = ({ rows = 25, direction = 'top-to-bottom', mode = 'greek' }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const resizeCanvas = () => {
      const parentWidth = parent.clientWidth;
      const parentHeight = rows * LINE_HEIGHT;

      const dpr = window.devicePixelRatio || 1;

      canvas.style.width = parentWidth + 'px';
      canvas.style.height = parentHeight + 'px';
      canvas.width = Math.floor(parentWidth * dpr);
      canvas.height = Math.floor(parentHeight * dpr);

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [rows]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let interval: number;

    const drawMatrix = () => {
      const w = canvas.width;
      const h = canvas.height;

      if (direction === 'top-to-bottom') {
        const cols = Math.floor(w / CHARACTER_WIDTH);
        const ypos: number[] = Array(cols).fill(0);

        const matrix = () => {
          const themeTextColor = getComputedStyle(document.body).getPropertyValue('--theme-text').trim();
          const fontFamily = getComputedStyle(document.body).getPropertyValue('--font-family-mono').trim();

          ctx.globalCompositeOperation = 'destination-out';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
          ctx.fillRect(0, 0, w, h);
          ctx.textBaseline = 'top';
          ctx.font = `16px ${fontFamily}`;

          ctx.globalCompositeOperation = 'source-over';

          ypos.forEach((y, ind) => {
            const text = onTextGeneration({ mode });
            const x = ind * CHARACTER_WIDTH;

            ctx.fillStyle = themeTextColor;
            ctx.fillText(text, x, y);

            if (y > h + Math.random() * 10000) {
              ypos[ind] = 0;
            } else {
              ypos[ind] = y + LINE_HEIGHT;
            }
          });
        };

        interval = window.setInterval(matrix, 50);
      } else if (direction === 'left-to-right') {
        const totalRows = rows; // Use rows directly for total rows
        const xpos: number[] = Array(totalRows).fill(0);

        const matrix = () => {
          const themeTextColor = getComputedStyle(document.body).getPropertyValue('--theme-text').trim();
          const fontFamily = getComputedStyle(document.body).getPropertyValue('--font-family-mono').trim();

          ctx.globalCompositeOperation = 'destination-out';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
          ctx.fillRect(0, 0, w, h);
          ctx.textBaseline = 'top';
          ctx.font = `16px ${fontFamily}`;

          ctx.globalCompositeOperation = 'source-over';

          xpos.forEach((x, ind) => {
            const text = onTextGeneration({ mode });
            const y = ind * LINE_HEIGHT;

            ctx.fillStyle = themeTextColor;
            ctx.fillText(text, x, y);

            if (x > w + Math.random() * 10000) {
              xpos[ind] = 0;
            } else {
              xpos[ind] = x + CHARACTER_WIDTH;
            }
          });
        };

        interval = window.setInterval(matrix, 50);
      }
    };

    drawMatrix();

    return () => {
      window.clearInterval(interval);
    };
  }, [rows, direction, mode]);

  return (
    <div className={styles.container}>
      <canvas className={styles.root} ref={canvasRef} />
    </div>
  );
};

export default MatrixLoader;
