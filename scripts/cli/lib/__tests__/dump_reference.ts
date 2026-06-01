import { cardTop, cardRow, cardHeaderRow, cardBot, cardSelectRow, wordWrap } from '../card';
import { formatRow, kvTable, kvTableGradient, ColSpec } from '../table';
import { button, buttonRow } from '../button';
import { wrapLineTop, wrapLine, shadowBottomRow, getInnerWidth } from '../window';

//NOTE(jimmylee): Pinned inner width keeps the fixture deterministic across terminals.
const INNER_W: number = 40;

const COL_SPEC: ColSpec[] = [
  { width: 10, align: 'left' },
  { width: 12, align: 'left', grow: true },
];

const STATUS_COL_SPEC: ColSpec[] = [
  { width: 10, align: 'left', status: true },
  { width: 10, align: 'right', status: true, gap: 2 },
];

//NOTE(jimmylee): Every entry below mirrors a Python assertion in __tests__/test_parity.py.
const fixture = {
  inner_w: INNER_W,
  card_top: cardTop('TITLE', INNER_W),
  card_row: cardRow('hello', INNER_W),
  card_bot: cardBot(INNER_W),
  card_select_row_off: cardSelectRow('item', INNER_W, false),
  card_select_row_on: cardSelectRow('item', INNER_W, true),
  card_header_row: cardHeaderRow(formatRow(['A', 'B'], COL_SPEC, INNER_W), INNER_W),
  format_row_basic: formatRow(['name', 'value'], COL_SPEC, INNER_W),
  format_row_status: formatRow(['ACTIVE', 'PAID'], STATUS_COL_SPEC, INNER_W),
  button_esc: button('ESC', 'exit'),
  button_arrow: button('↵', 'select'),
  button_row: buttonRow(button('ESC', 'exit'), button('↵', 'select'), INNER_W),
  word_wrap: wordWrap('the quick brown fox jumps over the lazy dog', 12),
  kv_table: kvTable([
    ['PROJECT', 'sacred'],
    ['STATUS', 'OK'],
  ]),
  kv_table_gradient: kvTableGradient([['STATUS', 'OK']]),
  inner_width_80: getInnerWidth(80),
  wrap_line_top: wrapLineTop('content', INNER_W),
  wrap_line: wrapLine('content', INNER_W),
  shadow_bottom_row: shadowBottomRow(INNER_W),
};

process.stdout.write(JSON.stringify(fixture, null, 2) + '\n');
