'use client';

import { ditherCanvas, type RGBColor } from '@lib/dither';
import { cn } from '@lib/utils';
import React, { useCallback, useEffect, useRef, useState } from 'react';

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
const Dither: React.FC<DitherProps> = ({ src, alt = '', width, height, className, style, monochrome, levels, palette, twoColor }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const baseRef = useRef<ImageData | null>(null);
  const [loaded, setLoaded] = useState(false);

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
    setLoaded(false);

    const img = new window.Image();
    // Do not force crossOrigin here; upstream should proxy/handle CORS if needed.
    img.src = src;

    img.onload = () => {
      if (canceled) return;

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
      } catch {
        // If canvas is tainted (CORS), we cannot read pixels; leave as-is.
        // Still mark loaded so layout isn't blocked.
        setLoaded(true);
      }
    };

    img.onerror = () => {
      setLoaded(true);
    };

    return () => {
      canceled = true;
    };
  }, [src, width, height, renderCurrent]);

  // Re-apply halftone when parameters change without reloading
  useEffect(() => {
    if (!loaded) return;
    renderCurrent();
  }, [loaded, renderCurrent]);

  return <canvas ref={canvasRef} aria-label={alt} role="img" className={cn('max-w-full', className)} style={style} />;
};

export default Dither;
