
import { ditherCanvas, type RGBColor } from '@lib/dither';
import getSafeImageSrc from '@lib/getSafeImageSrc';
import { cn } from '@lib/utils';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface DitherProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;

  // Halftone options
  monochrome?: boolean;
  levels?: number;
  palette?: RGBColor[];
  twoColor?: [RGBColor, RGBColor]; // [paper, ink]
}

/**
 * Dither
 * - Loads an image once per src/size and caches the original pixels.
 * - Re-applies halftone when options change without reloading the image.
 * - No CRT animation, only stable two-color/palette-based dithering.
 */
interface LoadCandidate {
  url: string;
  crossOrigin?: '' | 'anonymous';
}

const Dither: React.FC<DitherProps> = ({ src, alt = '', width, height, className, style, monochrome, levels, palette, twoColor }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const baseRef = useRef<ImageData | null>(null);
  const [loaded, setLoaded] = useState(false);

  const safeSrc = useMemo(() => getSafeImageSrc(src), [src]);
  const rawSrc = useMemo(() => {
    const trimmed = src?.trim?.();
    return trimmed ? trimmed : undefined;
  }, [src]);

  // Render from cached base image with current halftone parameters
  const renderCurrent = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx || !baseRef.current) return;

    // Restore pristine base pixels to canvas, then apply dithering in-place
    ctx.putImageData(baseRef.current, 0, 0);
    ditherCanvas(ctx, { monochrome, levels, palette, twoColor });
  }, [monochrome, levels, palette, twoColor]);

  // Load the image once per src/size and cache base pixels
  useEffect(() => {
    let canceled = false;
    baseRef.current = null;
    setLoaded(false);

    const candidates: LoadCandidate[] = [];
    if (safeSrc) {
      candidates.push({ url: safeSrc });
    }
    if (rawSrc && (!safeSrc || safeSrc !== rawSrc)) {
      candidates.push({ url: rawSrc, crossOrigin: 'anonymous' });
      candidates.push({ url: rawSrc });
    }

    if (candidates.length === 0) {
      return () => {
        canceled = true;
      };
    }

    let img: HTMLImageElement | null = null;

    const loadFromIndex = (index: number) => {
      const candidate = candidates[index];
      if (!candidate) {
        setLoaded(true);
        return;
      }

      img = new window.Image();
      img.decoding = 'async';

      if (typeof candidate.crossOrigin !== 'undefined') {
        img.crossOrigin = candidate.crossOrigin;
      } else {
        img.removeAttribute('crossorigin');
      }

      img.onload = () => {
        if (canceled || !img) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        const w = width ?? (img.naturalWidth || 1);
        const h = height ?? (img.naturalHeight || 1);

        // Size canvas to the target render dimensions
        canvas.width = w;
        canvas.height = h;

        // Draw source -> cache base pixels -> apply halftone once
        ctx.drawImage(img, 0, 0, w, h);
        try {
          baseRef.current = ctx.getImageData(0, 0, w, h);
          setLoaded(true);
          renderCurrent();
        } catch (error) {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.warn('Dither: unable to access pixel data (likely due to CORS). Rendering unfiltered image.', error);
          }
          setLoaded(true);
        }
      };

      img.onerror = () => {
        if (canceled) return;
        loadFromIndex(index + 1);
      };

      img.src = candidate.url;
    };

    loadFromIndex(0);

    return () => {
      canceled = true;
      img = null;
    };
  }, [safeSrc, rawSrc, width, height, renderCurrent]);

  // Re-apply halftone when parameters change without reloading
  useEffect(() => {
    if (!loaded) return;
    renderCurrent();
  }, [loaded, renderCurrent]);

  return <canvas ref={canvasRef} aria-label={alt} role="img" className={cn('max-w-full', className)} style={style} />;
};

export default Dither;
