import COLORS_JSON from '../colors.json';

export type Palette = {
  termBg: string;
  windowBg: string;
  shadow: string;
  tableHeader: string;
  text: string;
  success: string;
  neutral: string;
  btnHotkey: string;
  btnLabel: string;
  btnLabelText: string;
  brand: string;
  gradientStart: string;
  gradientEnd: string;
};

const CSI: string = '\x1b[';
const RESET: string = `${CSI}0m`;
const DIM: string = `${CSI}2m`;
const BOLD: string = `${CSI}1m`;
const INVERSE: string = `${CSI}7m`;

//NOTE(jimmylee): Reset only text attributes (bold/dim) and fg color, preserves background.
const RESET_FG: string = `${CSI}22m${CSI}39m`;
//NOTE(jimmylee): Default terminal background, lets the terminal's own bg color show through.
const bgDefault: string = `${CSI}49m`;

const fg = (r: number, g: number, b: number): string => `${CSI}38;2;${r};${g};${b}m`;
const bg = (r: number, g: number, b: number): string => `${CSI}48;2;${r};${g};${b}m`;

function fgHex(hex: string): string {
  const h = hex.startsWith('#') ? hex.slice(1) : hex;
  return fg(parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16));
}

function bgHex(hex: string): string {
  const h = hex.startsWith('#') ? hex.slice(1) : hex;
  return bg(parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16));
}

const moveTo = (row: number, col: number): string => `${CSI}${row};${col}H`;
const cursorHide: string = `${CSI}?25l`;
const cursorShow: string = `${CSI}?25h`;
const altScreenOn: string = `${CSI}?1049h`;
const altScreenOff: string = `${CSI}?1049l`;
const clearScreen: string = `${CSI}2J${CSI}H`;
const clearEOL: string = `${CSI}K`;
const clearEOS: string = `${CSI}J`;

function strip(s: string): string {
  return s.replace(/\x1b\[[0-9;]*m/g, '');
}

function visLen(s: string): number {
  return strip(s).length;
}

function truncateVisible(s: string, n: number): string {
  let vis = 0;
  let i = 0;
  while (i < s.length && vis < n) {
    if (s[i] === '\x1b' && s[i + 1] === '[') {
      let j = i + 2;
      while (j < s.length && s[j] !== 'm') j++;
      i = j + 1;
    } else {
      vis++;
      i++;
    }
  }
  return s.slice(0, i) + RESET_FG;
}

function padR(s: string, n: number): string {
  const vis = visLen(s);
  if (vis > n) return truncateVisible(s, n);
  return vis < n ? s + ' '.repeat(n - vis) : s;
}

function padL(s: string, n: number): string {
  const d = n - visLen(s);
  return d > 0 ? ' '.repeat(d) + s : s;
}

function gradientText(text: string, startHex: string, endHex: string): string {
  if (text.length === 0) return '';
  const s = startHex.startsWith('#') ? startHex.slice(1) : startHex;
  const e = endHex.startsWith('#') ? endHex.slice(1) : endHex;
  const sr = parseInt(s.slice(0, 2), 16), sg = parseInt(s.slice(2, 4), 16), sb = parseInt(s.slice(4, 6), 16);
  const er = parseInt(e.slice(0, 2), 16), eg = parseInt(e.slice(2, 4), 16), eb = parseInt(e.slice(4, 6), 16);
  const len = Math.max(text.length - 1, 1);
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const t = i / len;
    const r = Math.round(sr + (er - sr) * t);
    const g = Math.round(sg + (eg - sg) * t);
    const b = Math.round(sb + (eb - sb) * t);
    out += fg(r, g, b) + text[i];
  }
  return out + RESET_FG;
}

const COLORS: Palette = COLORS_JSON;

export {
  CSI, RESET, RESET_FG, DIM, BOLD, INVERSE,
  fg, bg, fgHex, bgHex, bgDefault, gradientText,
  moveTo, cursorHide, cursorShow, altScreenOn, altScreenOff, clearScreen, clearEOL, clearEOS,
  strip, visLen, truncateVisible, padR, padL,
  COLORS,
};
