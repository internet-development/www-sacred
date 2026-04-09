"""Window wrapper. Mirrors scripts/cli/lib/window.js."""

from .ansi import RESET, COLORS, bg_default, bg_hex, vis_len

MARGIN = 2
SHADOW_W = 1
SHADOW_H = 1

MIN_INNER_W = 20
MIN_TERM_W = 2 * MARGIN + SHADOW_W + MIN_INNER_W

bg_term = bg_default
bg_win = bg_hex(COLORS["windowBg"])
bg_shd = bg_hex(COLORS["shadow"])
margin_right = " " * max(0, MARGIN - SHADOW_W)


def get_inner_width(term_w: int) -> int:
    return max(10, term_w - 2 * MARGIN - SHADOW_W)


def wrap_line(line: str, inner_w: int) -> str:
    pad = inner_w - vis_len(line)
    fill = " " * pad if pad > 0 else ""
    return (
        f"{bg_term}{' ' * MARGIN}{bg_win}{line}{RESET}"
        f"{bg_win}{fill}{RESET}{bg_shd} {RESET}{bg_term}{margin_right}{RESET}"
    )


def shadow_bottom_row(inner_w: int) -> str:
    return (
        f"{bg_term}{' ' * (MARGIN + SHADOW_W)}{bg_shd}{' ' * inner_w}{RESET}"
        f"{bg_term}{margin_right}{RESET}"
    )


def wrap_line_top(line: str, inner_w: int) -> str:
    pad = inner_w - vis_len(line)
    fill = " " * pad if pad > 0 else ""
    return (
        f"{bg_term}{' ' * MARGIN}{bg_win}{line}{RESET}"
        f"{bg_win}{fill}{RESET}{bg_term}{' ' * MARGIN}{RESET}"
    )


def wrap_lines(lines, term_w: int):
    inner_w = get_inner_width(term_w)
    out = []
    if lines:
        out.append(wrap_line_top(lines[0], inner_w))
    for line in lines[1:]:
        out.append(wrap_line(line, inner_w))
    out.append(shadow_bottom_row(inner_w))
    return out
