'use strict';

//NOTE(jimmylee): Table formatting — key-value tables (24ch key) + data tables with column specs.

const { padR, padL, RESET_FG, fgHex, BOLD, COLORS, gradientText } = require('./ansi');

//NOTE(jimmylee): formatRow renders a single table row using column specs for width, alignment,
//NOTE(jimmylee): grow, and status coloring. ColSpec supports optional `gap` (default 1).
function formatRow(vals, colSpec, innerW) {
  const totalGaps = colSpec.reduce((a, c, i) => i > 0 ? a + ((c && c.gap) || 1) : a, 0);
  const baseTotal = colSpec.reduce((a, c) => a + c.width, 0) + totalGaps;
  const extra = Math.max(0, (innerW - 4) - baseTotal);
  const growIdx = colSpec.findIndex((c) => c.grow);
  const widths = colSpec.map((c, i) => c.width + (i === growIdx ? extra : 0));

  let line = '';
  for (let i = 0; i < vals.length; i++) {
    if (i > 0) line += ' '.repeat((colSpec[i] && colSpec[i].gap) || 1);
    let v = vals[i];
    //NOTE(jimmylee): Status coloring uses RESET_FG (not RESET) so the windowBg from card.js
    //NOTE(jimmylee): persists across subsequent columns.
    if (colSpec[i] && colSpec[i].status) {
      if (v === 'ACTIVE' || v === 'OPEN' || v === 'APPROVED') {
        v = `${BOLD}${fgHex(COLORS.success)}${v}${RESET_FG}`;
      } else if (v === 'CLOSED' || v === 'PAID' || v === 'SUSPENDED') {
        v = `${fgHex(COLORS.neutral)}${v}${RESET_FG}`;
      }
    }
    const align = colSpec[i] && colSpec[i].align;
    line += align === 'right' ? padL(v, widths[i]) : padR(v, widths[i]);
  }
  return line;
}

function kvTable(pairs) {
  const lines = [];
  for (const [k, v] of pairs) {
    lines.push(`${padR(k, 24)}${v}`);
  }
  return lines;
}

//NOTE(jimmylee): Key-value table with gradient on value column (matches .gradientText td:last-child).
function kvTableGradient(pairs) {
  const lines = [];
  for (const [k, v] of pairs) {
    lines.push(`${padR(k, 24)}${gradientText(v, COLORS.gradientStart, COLORS.gradientEnd)}`);
  }
  return lines;
}

module.exports = { formatRow, kvTable, kvTableGradient };
