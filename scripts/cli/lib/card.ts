import { RESET, INVERSE, visLen, bgHex, fgHex, COLORS } from './ansi';

const B = { tl: '┌', tr: '┐', bl: '└', br: '┘', h: '─', v: '│' } as const;

const MIN_CARD_W: number = 10;

function cardTop(title: string, innerW: number): string {
  const t = ` ${title} `;
  const fill = Math.max(0, innerW - 3 - t.length);
  return `${B.tl}${B.h}${t}${B.h.repeat(fill)}${B.tr}`;
}

function cardRow(content: string, innerW: number): string {
  const inner = `  ${content}`;
  const vis = visLen(inner);
  const fill = innerW - 2 - vis;
  if (fill >= 0) return `${B.v}${inner}${' '.repeat(fill)}${B.v}`;
  return `${B.v}${inner}${RESET}`;
}

function cardHeaderRow(content: string, innerW: number): string {
  const hdrBg = bgHex(COLORS.tableHeader);
  const hdrFg = fgHex(COLORS.text);
  const inner = `  ${content}`;
  const vis = visLen(inner);
  const fill = Math.max(0, innerW - 2 - vis);
  return `${B.v}${hdrBg}${hdrFg}${inner}${' '.repeat(fill)}${RESET}${B.v}`;
}

function cardBot(innerW: number): string {
  return `${B.bl}${B.h.repeat(Math.max(0, innerW - 2))}${B.br}`;
}

function wordWrap(text: string, maxW: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
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

function cardSelectRow(content: string, innerW: number, selected: boolean): string {
  if (!selected) return cardRow(content, innerW);
  const inner = `  ${content}`;
  const vis = visLen(inner);
  const fill = Math.max(0, innerW - 2 - vis);
  return `${B.v}${INVERSE}${inner}${' '.repeat(fill)}${RESET}${B.v}`;
}

export { B, MIN_CARD_W, cardTop, cardRow, cardSelectRow, cardHeaderRow, cardBot, wordWrap };
