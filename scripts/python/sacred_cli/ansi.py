"""ANSI escape sequences + 24-bit color utilities. Mirrors scripts/cli/lib/ansi.js."""

import json
import os
import re

CSI = "\x1b["
RESET = f"{CSI}0m"
DIM = f"{CSI}2m"
BOLD = f"{CSI}1m"
INVERSE = f"{CSI}7m"

# NOTE(jimmylee): Reset only text attributes (bold/dim) and fg color — preserves background.
RESET_FG = f"{CSI}22m{CSI}39m"
# NOTE(jimmylee): Default terminal background — lets the terminal's own bg color show through.
bg_default = f"{CSI}49m"


def fg(r: int, g: int, b: int) -> str:
    return f"{CSI}38;2;{r};{g};{b}m"


def bg(r: int, g: int, b: int) -> str:
    return f"{CSI}48;2;{r};{g};{b}m"


def fg_hex(hex_str: str) -> str:
    h = hex_str[1:] if hex_str.startswith("#") else hex_str
    return fg(int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))


def bg_hex(hex_str: str) -> str:
    h = hex_str[1:] if hex_str.startswith("#") else hex_str
    return bg(int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))


def move_to(row: int, col: int) -> str:
    return f"{CSI}{row};{col}H"


cursor_hide = f"{CSI}?25l"
cursor_show = f"{CSI}?25h"
alt_screen_on = f"{CSI}?1049h"
alt_screen_off = f"{CSI}?1049l"
clear_screen = f"{CSI}2J{CSI}H"
clear_eol = f"{CSI}K"
clear_eos = f"{CSI}J"


_ANSI_RE = re.compile(r"\x1b\[[0-9;]*m")


def strip(s: str) -> str:
    return _ANSI_RE.sub("", s)


def vis_len(s: str) -> int:
    return len(strip(s))


def truncate_visible(s: str, n: int) -> str:
    """ANSI-aware truncation — closes any open color state with RESET_FG."""
    vis = 0
    i = 0
    while i < len(s) and vis < n:
        if s[i] == "\x1b" and i + 1 < len(s) and s[i + 1] == "[":
            j = i + 2
            while j < len(s) and s[j] != "m":
                j += 1
            i = j + 1
        else:
            vis += 1
            i += 1
    return s[:i] + RESET_FG


def pad_r(s: str, n: int) -> str:
    v = vis_len(s)
    if v > n:
        return truncate_visible(s, n)
    return s + " " * (n - v) if v < n else s


def pad_l(s: str, n: int) -> str:
    d = n - vis_len(s)
    return " " * d + s if d > 0 else s


def _js_round(x: float) -> int:
    # NOTE(jimmylee): JavaScript's Math.round rounds 0.5 toward positive infinity, so 0.5 → 1
    # NOTE(jimmylee): and -0.5 → 0. Python's built-in round() uses banker's rounding (0.5 → 0),
    # NOTE(jimmylee): which would diverge from the JS framework byte-for-byte. The parity test
    # NOTE(jimmylee): suite expects identical output between the two runtimes — use this helper
    # NOTE(jimmylee): wherever the JS source calls Math.round.
    import math
    return math.floor(x + 0.5)


def gradient_text(text: str, start_hex: str, end_hex: str) -> str:
    """Horizontal gradient — matches React .gradientText CSS class."""
    if not text:
        return ""
    s = start_hex[1:] if start_hex.startswith("#") else start_hex
    e = end_hex[1:] if end_hex.startswith("#") else end_hex
    sr, sg, sb = int(s[0:2], 16), int(s[2:4], 16), int(s[4:6], 16)
    er, eg, eb = int(e[0:2], 16), int(e[2:4], 16), int(e[4:6], 16)
    length = max(len(text) - 1, 1)
    out = ""
    for i, ch in enumerate(text):
        t = i / length
        r = _js_round(sr + (er - sr) * t)
        g = _js_round(sg + (eg - sg) * t)
        b = _js_round(sb + (eb - sb) * t)
        out += fg(r, g, b) + ch
    return out + RESET_FG


# NOTE(jimmylee): Sacred color palette — same source of truth as scripts/cli/colors.json.
_HERE = os.path.dirname(os.path.abspath(__file__))
_COLORS_PATH = os.path.normpath(os.path.join(_HERE, "..", "..", "cli", "colors.json"))
with open(_COLORS_PATH, "r", encoding="utf-8") as _f:
    COLORS = json.load(_f)
