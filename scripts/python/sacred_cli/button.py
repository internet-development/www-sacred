"""Terminal buttons. Mirrors scripts/cli/lib/button.js."""

from .ansi import COLORS, RESET, RESET_FG, bg_hex, fg_hex, vis_len


def button(hotkey: str, label: str) -> str:
    return (
        f"{bg_hex(COLORS['btnHotkey'])}{fg_hex(COLORS['text'])} {hotkey} {RESET_FG}"
        f"{bg_hex(COLORS['btnLabel'])}{fg_hex(COLORS['btnLabelText'])} {label.upper()} {RESET}"
    )


_bg_win = bg_hex(COLORS["windowBg"])


def button_row(left: str, right: str, inner_w: int) -> str:
    gap = max(1, inner_w - vis_len(left) - vis_len(right))
    return f"{left}{_bg_win}{' ' * gap}{RESET}{right}"
