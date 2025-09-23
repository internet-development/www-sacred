export type RGBColor = [number, number, number];

export interface DitherOptions {
  monochrome?: boolean;
  levels?: number;
  palette?: RGBColor[];
  twoColor?: [RGBColor, RGBColor];
}

// 4×4 Bayer matrix (ordered dithering)
const BAYER_4X4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5] as const;

// Pre-compute threshold lookup as normalized offsets in range (−0.5 .. 0.5)
const BAYER_THRESHOLDS = BAYER_4X4.map((v) => (v + 0.5) / 16 - 0.5);

// Helper to find the squared Euclidean distance between two colors
function colorDistanceSq(c1: RGBColor, c2: RGBColor): number {
  const dr = c1[0] - c2[0];
  const dg = c1[1] - c2[1];
  const db = c1[2] - c2[2];
  return dr * dr + dg * dg + db * db;
}

// Helper to find the closest color in a palette
function findClosestColor(color: RGBColor, palette: RGBColor[]): RGBColor {
  let closestColor = palette[0];
  let minDistanceSq = Infinity;

  for (const paletteColor of palette) {
    const distanceSq = colorDistanceSq(color, paletteColor);
    if (distanceSq < minDistanceSq) {
      minDistanceSq = distanceSq;
      closestColor = paletteColor;
    }
  }

  return closestColor;
}

export function applyBayer4x4Dither(imageData: ImageData, options: DitherOptions = {}) {
  const { monochrome = false, levels = 4, palette, twoColor } = options;

  const w = imageData.width;
  const h = imageData.height;
  const data = imageData.data;

  // Two-color (single-ink) halftone dithering
  if (twoColor && twoColor.length === 2) {
    const paper = twoColor[0];
    const ink = twoColor[1];
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        const bayerIndex = (y & 3) * 4 + (x & 3);
        const thresholdOffset = BAYER_THRESHOLDS[bayerIndex]; // −0.5 … 0.5

        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        // perceived luminance
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        const normalized = luminance / 255 + thresholdOffset;

        const color = normalized < 0.5 ? ink : paper;

        data[idx] = color[0];
        data[idx + 1] = color[1];
        data[idx + 2] = color[2];
      }
    }
    return imageData;
  }

  // Palette-based dithering
  if (palette && palette.length > 0) {
    const DITHER_STRENGTH = 48; // Adjust this for more/less dithering effect
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        const bayerIndex = (y & 3) * 4 + (x & 3);
        const thresholdOffset = BAYER_THRESHOLDS[bayerIndex]; // −0.5 … 0.5

        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        // Add dither noise to the original pixel color
        const ditheredR = r + thresholdOffset * DITHER_STRENGTH;
        const ditheredG = g + thresholdOffset * DITHER_STRENGTH;
        const ditheredB = b + thresholdOffset * DITHER_STRENGTH;

        // Find the closest color in the palette to the noisy color
        const closestColor = findClosestColor([ditheredR, ditheredG, ditheredB], palette);

        data[idx] = closestColor[0];
        data[idx + 1] = closestColor[1];
        data[idx + 2] = closestColor[2];
      }
    }
    return imageData;
  }

  const L = Math.max(2, levels);
  const maxLevelIndex = L - 1;
  const invLevelsMinus1 = 1 / maxLevelIndex;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const bayerIndex = (y & 3) * 4 + (x & 3);
      const thresholdOffset = BAYER_THRESHOLDS[bayerIndex]; // −0.5 … 0.5

      if (monochrome) {
        // grayscale path (perceived luminance)
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

        const normalized = luminance / 255 + thresholdOffset;
        const quant = normalized < 0.5 ? 0 : 1;
        const color = quant * 255;

        data[idx] = color;
        data[idx + 1] = color;
        data[idx + 2] = color;
      } else {
        // colour path — each channel quantised independently
        for (let c = 0; c < 3; c++) {
          const val = data[idx + c];
          const normalized = val / 255 + thresholdOffset;
          const quantLevel = Math.min(maxLevelIndex, Math.max(0, Math.round(normalized * maxLevelIndex)));
          data[idx + c] = Math.round(quantLevel * (255 * invLevelsMinus1));
        }
      }
      // alpha untouched
    }
  }

  return imageData;
}

// Convenience wrapper operating on a CanvasRenderingContext2D
export function ditherCanvas(ctx: CanvasRenderingContext2D, options?: DitherOptions) {
  const { width, height } = ctx.canvas;
  const src = ctx.getImageData(0, 0, width, height);
  const dst = applyBayer4x4Dither(src, options);
  ctx.putImageData(dst, 0, 0);
  return dst;
}
