'use strict';

//NOTE(jimmylee): Window wrapper — wraps content lines in a visual window matching React's .dialog class.
//NOTE(jimmylee): Adds windowBg fill, 1ch/1row offset shadow, and terminal default bg margins.

const { bgHex, bgDefault, RESET, COLORS, visLen } = require('./ansi');

const MARGIN = 2;
const SHADOW_W = 1;
const SHADOW_H = 1;

const MIN_INNER_W = 20;
const MIN_TERM_W = 2 * MARGIN + SHADOW_W + MIN_INNER_W;

const bgTerm = bgDefault;
const bgWin = bgHex(COLORS.windowBg);
const bgShd = bgHex(COLORS.shadow);
const marginRight = ' '.repeat(Math.max(0, MARGIN - SHADOW_W));

function getInnerWidth(termW) {
  return Math.max(10, termW - 2 * MARGIN - SHADOW_W);
}

function wrapLine(line, innerW) {
  const pad = innerW - visLen(line);
  const fill = pad > 0 ? ' '.repeat(pad) : '';
  return `${bgTerm}${' '.repeat(MARGIN)}${bgWin}${line}${RESET}${bgWin}${fill}${RESET}${bgShd} ${RESET}${bgTerm}${marginRight}${RESET}`;
}

//NOTE(jimmylee): Shadow's bottom edge row — offset 1ch right from window so the shadow rests
//NOTE(jimmylee): below the window with a 1ch right protrusion.
function shadowBottomRow(innerW) {
  return `${bgTerm}${' '.repeat(MARGIN + SHADOW_W)}${bgShd}${' '.repeat(innerW)}${RESET}${bgTerm}${marginRight}${RESET}`;
}

//NOTE(jimmylee): First window row — no right shadow (shadow is offset 1 row down).
function wrapLineTop(line, innerW) {
  const pad = innerW - visLen(line);
  const fill = pad > 0 ? ' '.repeat(pad) : '';
  return bgTerm + ' '.repeat(MARGIN) + bgWin + line + RESET + bgWin + fill + RESET + bgTerm + ' '.repeat(MARGIN) + RESET;
}

function wrapLines(lines, termW) {
  const innerW = getInnerWidth(termW);
  const out = [];
  if (lines.length > 0) out.push(wrapLineTop(lines[0], innerW));
  for (let i = 1; i < lines.length; i++) out.push(wrapLine(lines[i], innerW));
  out.push(shadowBottomRow(innerW));
  return out;
}

module.exports = {
  MARGIN, SHADOW_W, SHADOW_H, MIN_INNER_W, MIN_TERM_W,
  bgTerm, bgWin, bgShd, marginRight,
  getInnerWidth, wrapLine, wrapLineTop, shadowBottomRow, wrapLines,
};
