"""Box-drawing card borders + word wrap. Mirrors scripts/cli/lib/card.js."""

from .ansi import COLORS, INVERSE, RESET, bg_hex, fg_hex, vis_len

# NOTE(jimmylee): Box-drawing characters — matches Card.tsx border rendering.
B = {"tl": "\u250C", "tr": "\u2510", "bl": "\u2514", "br": "\u2518", "h": "\u2500", "v": "\u2502"}

MIN_CARD_W = 10


def card_top(title: str, inner_w: int) -> str:
    t = f" {title} "
    fill = max(0, inner_w - 3 - len(t))
    return f"{B['tl']}{B['h']}{t}{B['h'] * fill}{B['tr']}"


def card_row(content: str, inner_w: int) -> str:
    inner = f"  {content}"
    vis = vis_len(inner)
    fill = inner_w - 2 - vis
    if fill >= 0:
        return f"{B['v']}{inner}{' ' * fill}{B['v']}"
    return f"{B['v']}{inner}{RESET}"


def card_header_row(content: str, inner_w: int) -> str:
    hdr_bg = bg_hex(COLORS["tableHeader"])
    hdr_fg = fg_hex(COLORS["text"])
    inner = f"  {content}"
    vis = vis_len(inner)
    fill = max(0, inner_w - 2 - vis)
    return f"{B['v']}{hdr_bg}{hdr_fg}{inner}{' ' * fill}{RESET}{B['v']}"


def card_bot(inner_w: int) -> str:
    return f"{B['bl']}{B['h'] * max(0, inner_w - 2)}{B['br']}"


def word_wrap(text: str, max_w: int):
    words = text.split(" ")
    lines = []
    cur = ""
    for word in words:
        if cur and len(cur) + 1 + len(word) > max_w:
            lines.append(cur)
            cur = word
        else:
            cur = cur + " " + word if cur else word
    if cur:
        lines.append(cur)
    return lines


def card_select_row(content: str, inner_w: int, selected: bool) -> str:
    if not selected:
        return card_row(content, inner_w)
    inner = f"  {content}"
    vis = vis_len(inner)
    fill = max(0, inner_w - 2 - vis)
    return f"{B['v']}{INVERSE}{inner}{' ' * fill}{RESET}{B['v']}"
