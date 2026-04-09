//NOTE(jimmylee): Shared types for the ASCII animation framework.
//NOTE(jimmylee): All canvas-style components (ASCIICanvas, MatrixLoader, CanvasSnake, CanvasPlatformer)
//NOTE(jimmylee): render into a <pre> with per-cell <span> elements instead of <canvas>.
//NOTE(jimmylee): This gives us DOM diffing, automatic theme inheritance, and reliable mobile rendering.

export type ASCIICell = string | { char: string; color: string };

export type ASCIIAnimationFn = (x: number, y: number, t: number, cols: number, rows: number, isDark?: boolean) => ASCIICell;

export function hex2(n: number): string {
  const h = Math.max(0, Math.min(255, Math.round(n))).toString(16);
  return h.length < 2 ? '0' + h : h;
}
