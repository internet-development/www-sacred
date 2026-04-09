"""Table formatting. Mirrors scripts/cli/lib/table.js."""

from .ansi import BOLD, COLORS, RESET_FG, fg_hex, gradient_text, pad_l, pad_r


def format_row(vals, col_spec, inner_w: int) -> str:
    total_gaps = sum((c.get("gap", 1) if i > 0 else 0) for i, c in enumerate(col_spec))
    base_total = sum(c["width"] for c in col_spec) + total_gaps
    extra = max(0, (inner_w - 4) - base_total)
    grow_idx = next((i for i, c in enumerate(col_spec) if c.get("grow")), -1)
    widths = [c["width"] + (extra if i == grow_idx else 0) for i, c in enumerate(col_spec)]

    line = ""
    for i, v in enumerate(vals):
        if i > 0:
            line += " " * col_spec[i].get("gap", 1)
        if col_spec[i].get("status"):
            if v in ("ACTIVE", "OPEN", "APPROVED"):
                v = f"{BOLD}{fg_hex(COLORS['success'])}{v}{RESET_FG}"
            elif v in ("CLOSED", "PAID", "SUSPENDED"):
                v = f"{fg_hex(COLORS['neutral'])}{v}{RESET_FG}"
        align = col_spec[i].get("align")
        line += pad_l(v, widths[i]) if align == "right" else pad_r(v, widths[i])
    return line


def kv_table(pairs):
    return [f"{pad_r(k, 24)}{v}" for k, v in pairs]


def kv_table_gradient(pairs):
    return [
        f"{pad_r(k, 24)}{gradient_text(v, COLORS['gradientStart'], COLORS['gradientEnd'])}"
        for k, v in pairs
    ]
