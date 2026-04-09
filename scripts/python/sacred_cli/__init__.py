"""Sacred CLI primitives — Python port of scripts/cli/lib.

This package mirrors the JavaScript framework one-to-one. Every public symbol in
the JS modules has the same name and contract here, so port skills can read the
JS source and produce a Python translation mechanically.
"""

from .ansi import (
    CSI, RESET, RESET_FG, DIM, BOLD, INVERSE,
    fg, bg, fg_hex, bg_hex, bg_default, gradient_text,
    move_to, cursor_hide, cursor_show, alt_screen_on, alt_screen_off,
    clear_screen, clear_eol, clear_eos,
    strip, vis_len, truncate_visible, pad_r, pad_l,
    COLORS,
)
from .window import (
    MARGIN, SHADOW_W, SHADOW_H, MIN_INNER_W, MIN_TERM_W,
    bg_term, bg_win, bg_shd, margin_right,
    get_inner_width, wrap_line, wrap_line_top, shadow_bottom_row, wrap_lines,
)
from .card import (
    B, MIN_CARD_W, card_top, card_row, card_select_row, card_header_row,
    card_bot, word_wrap,
)
from .table import format_row, kv_table, kv_table_gradient
from .button import button, button_row
from .app import create_app

__all__ = [
    "CSI", "RESET", "RESET_FG", "DIM", "BOLD", "INVERSE",
    "fg", "bg", "fg_hex", "bg_hex", "bg_default", "gradient_text",
    "move_to", "cursor_hide", "cursor_show", "alt_screen_on", "alt_screen_off",
    "clear_screen", "clear_eol", "clear_eos",
    "strip", "vis_len", "truncate_visible", "pad_r", "pad_l", "COLORS",
    "MARGIN", "SHADOW_W", "SHADOW_H", "MIN_INNER_W", "MIN_TERM_W",
    "bg_term", "bg_win", "bg_shd", "margin_right",
    "get_inner_width", "wrap_line", "wrap_line_top", "shadow_bottom_row", "wrap_lines",
    "B", "MIN_CARD_W", "card_top", "card_row", "card_select_row", "card_header_row",
    "card_bot", "word_wrap",
    "format_row", "kv_table", "kv_table_gradient",
    "button", "button_row",
    "create_app",
]
