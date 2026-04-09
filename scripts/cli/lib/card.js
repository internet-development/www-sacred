'use strict';

//NOTE(jimmylee): Box-drawing card borders + word wrap.

const { RESET, INVERSE, visLen, bgHex, fgHex, COLORS } = require('./ansi');

//NOTE(jimmylee): Box-drawing characters — matches Card.tsx border rendering.
const B = { tl: '\u250C', tr: '\u2510', bl: '\u2514', br: '\u2518', h: '\u2500', v: '\u2502' };

const MIN_CARD_W = 10;

function cardTop(title, innerW) {
  const t = ` ${title} `;
  const fill = Math.max(0, innerW - 3 - t.length);
  return `${B.tl}${B.h}${t}${B.h.repeat(fill)}${B.tr}`;
}

function cardRow(content, innerW) {
  const inner = `  ${content}`;
  const vis = visLen(inner);
  const fill = innerW - 2 - vis;
  if (fill >= 0) return `${B.v}${inner}${' '.repeat(fill)}${B.v}`;
  return `${B.v}${inner}${RESET}`;
}

//NOTE(jimmylee): Card row with table header background — matches .unstyledTable thead td.
function cardHeaderRow(content, innerW) {
  const hdrBg = bgHex(COLORS.tableHeader);
  const hdrFg = fgHex(COLORS.text);
  const inner = `  ${content}`;
  const vis = visLen(inner);
  const fill = Math.max(0, innerW - 2 - vis);
  return `${B.v}${hdrBg}${hdrFg}${inner}${' '.repeat(fill)}${RESET}${B.v}`;
}

function cardBot(innerW) {
  return `${B.bl}${B.h.repeat(Math.max(0, innerW - 2))}${B.br}`;
}

function wordWrap(text, maxW) {
  const words = text.split(' ');
  const lines = [];
  let cur = '';
  for (const word of words) {
    if (cur && cur.length + 1 + word.length > maxW) {
      lines.push(cur);
      cur = word;
    } else {
      cur = cur ? cur + ' ' + word : word;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

//NOTE(jimmylee): Selectable card row — inverse video when selected, normal cardRow when not.
function cardSelectRow(content, innerW, selected) {
  if (!selected) return cardRow(content, innerW);
  const inner = `  ${content}`;
  const vis = visLen(inner);
  const fill = Math.max(0, innerW - 2 - vis);
  return `${B.v}${INVERSE}${inner}${' '.repeat(fill)}${RESET}${B.v}`;
}

module.exports = { B, MIN_CARD_W, cardTop, cardRow, cardSelectRow, cardHeaderRow, cardBot, wordWrap };
