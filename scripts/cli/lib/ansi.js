'use strict';

//NOTE(jimmylee): ANSI escape sequences + 24-bit color utilities for the Simulacrum CLI framework.
//NOTE(jimmylee): Sacred drops the animation color cache (fgCached/fgCacheReset) — sacred renders
//NOTE(jimmylee): are static, so per-pixel cache pressure is not a concern here.

const CSI = '\x1b[';
const RESET = `${CSI}0m`;
const DIM = `${CSI}2m`;
const BOLD = `${CSI}1m`;
const INVERSE = `${CSI}7m`;

//NOTE(jimmylee): Reset only text attributes (bold/dim) and fg color — preserves background.
const RESET_FG = `${CSI}22m${CSI}39m`;
//NOTE(jimmylee): Default terminal background — lets the terminal's own bg color show through.
const bgDefault = `${CSI}49m`;

const fg = (r, g, b) => `${CSI}38;2;${r};${g};${b}m`;
const bg = (r, g, b) => `${CSI}48;2;${r};${g};${b}m`;

function fgHex(hex) {
  const h = hex.startsWith('#') ? hex.slice(1) : hex;
  return fg(parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16));
}

function bgHex(hex) {
  const h = hex.startsWith('#') ? hex.slice(1) : hex;
  return bg(parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16));
}

const moveTo = (row, col) => `${CSI}${row};${col}H`;
const cursorHide = `${CSI}?25l`;
const cursorShow = `${CSI}?25h`;
const altScreenOn = `${CSI}?1049h`;
const altScreenOff = `${CSI}?1049l`;
const clearScreen = `${CSI}2J${CSI}H`;
const clearEOL = `${CSI}K`;
const clearEOS = `${CSI}J`;

function strip(s) {
  return s.replace(/\x1b\[[0-9;]*m/g, '');
}

function visLen(s) {
  return strip(s).length;
}

//NOTE(jimmylee): ANSI-aware truncation — walks visible characters while skipping escape sequences,
//NOTE(jimmylee): then closes any open color state with RESET_FG so subsequent cells render cleanly.
function truncateVisible(s, n) {
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

function padR(s, n) {
  const vis = visLen(s);
  if (vis > n) return truncateVisible(s, n);
  return vis < n ? s + ' '.repeat(n - vis) : s;
}

function padL(s, n) {
  const d = n - visLen(s);
  return d > 0 ? ' '.repeat(d) + s : s;
}

//NOTE(jimmylee): Horizontal gradient across plain text — matches the React .gradientText CSS class.
function gradientText(text, startHex, endHex) {
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

//NOTE(jimmylee): Sacred-themed color palette — matches scripts/cli/colors.json which is the
//NOTE(jimmylee): single source of truth shared with the global.css ANSI palette.
const COLORS = require('../colors.json');

module.exports = {
  CSI, RESET, RESET_FG, DIM, BOLD, INVERSE,
  fg, bg, fgHex, bgHex, bgDefault, gradientText,
  moveTo, cursorHide, cursorShow, altScreenOn, altScreenOff, clearScreen, clearEOL, clearEOS,
  strip, visLen, truncateVisible, padR, padL,
  COLORS,
};
