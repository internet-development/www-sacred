import { padR, padL, RESET_FG, fgHex, BOLD, COLORS, gradientText } from './ansi';

export type ColSpec = {
  width: number;
  align?: 'left' | 'right';
  grow?: boolean;
  status?: boolean;
  gap?: number;
};

function formatRow(vals: string[], colSpec: ColSpec[], innerW: number): string {
  const totalGaps = colSpec.reduce((a: number, c: ColSpec, i: number) => i > 0 ? a + ((c && c.gap) || 1) : a, 0);
  const baseTotal = colSpec.reduce((a: number, c: ColSpec) => a + c.width, 0) + totalGaps;
  const extra = Math.max(0, (innerW - 4) - baseTotal);
  const growIdx = colSpec.findIndex((c: ColSpec) => c.grow);
  const widths = colSpec.map((c: ColSpec, i: number) => c.width + (i === growIdx ? extra : 0));

  let line = '';
  for (let i = 0; i < vals.length; i++) {
    if (i > 0) line += ' '.repeat((colSpec[i] && colSpec[i].gap) || 1);
    let v = vals[i];
    //NOTE(jimmylee): Status coloring uses RESET_FG (not RESET) so the windowBg from card.ts
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

function kvTable(pairs: [string, string][]): string[] {
  const lines: string[] = [];
  for (const [k, v] of pairs) {
    lines.push(`${padR(k, 24)}${v}`);
  }
  return lines;
}

function kvTableGradient(pairs: [string, string][]): string[] {
  const lines: string[] = [];
  for (const [k, v] of pairs) {
    lines.push(`${padR(k, 24)}${gradientText(v, COLORS.gradientStart, COLORS.gradientEnd)}`);
  }
  return lines;
}

export { formatRow, kvTable, kvTableGradient };
