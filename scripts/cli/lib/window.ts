import { bgHex, bgDefault, RESET, COLORS, visLen } from './ansi';

const MARGIN: number = 2;
const SHADOW_W: number = 1;
const SHADOW_H: number = 1;

const MIN_INNER_W: number = 20;
const MIN_TERM_W: number = 2 * MARGIN + SHADOW_W + MIN_INNER_W;

const bgTerm: string = bgDefault;
const bgWin: string = bgHex(COLORS.windowBg);
const bgShd: string = bgHex(COLORS.shadow);
const marginRight: string = ' '.repeat(Math.max(0, MARGIN - SHADOW_W));

function getInnerWidth(termW: number): number {
  return Math.max(10, termW - 2 * MARGIN - SHADOW_W);
}

function wrapLine(line: string, innerW: number): string {
  const pad = innerW - visLen(line);
  const fill = pad > 0 ? ' '.repeat(pad) : '';
  return `${bgTerm}${' '.repeat(MARGIN)}${bgWin}${line}${RESET}${bgWin}${fill}${RESET}${bgShd} ${RESET}${bgTerm}${marginRight}${RESET}`;
}

function shadowBottomRow(innerW: number): string {
  return `${bgTerm}${' '.repeat(MARGIN + SHADOW_W)}${bgShd}${' '.repeat(innerW)}${RESET}${bgTerm}${marginRight}${RESET}`;
}

function wrapLineTop(line: string, innerW: number): string {
  const pad = innerW - visLen(line);
  const fill = pad > 0 ? ' '.repeat(pad) : '';
  return bgTerm + ' '.repeat(MARGIN) + bgWin + line + RESET + bgWin + fill + RESET + bgTerm + ' '.repeat(MARGIN) + RESET;
}

function wrapLines(lines: string[], termW: number): string[] {
  const innerW = getInnerWidth(termW);
  const out: string[] = [];
  if (lines.length > 0) out.push(wrapLineTop(lines[0], innerW));
  for (let i = 1; i < lines.length; i++) out.push(wrapLine(lines[i], innerW));
  out.push(shadowBottomRow(innerW));
  return out;
}

export {
  MARGIN, SHADOW_W, SHADOW_H, MIN_INNER_W, MIN_TERM_W,
  bgTerm, bgWin, bgShd, marginRight,
  getInnerWidth, wrapLine, wrapLineTop, shadowBottomRow, wrapLines,
};
