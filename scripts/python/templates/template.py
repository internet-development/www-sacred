#!/usr/bin/env python3
# NOTE(jimmylee): Sacred CLI — Python template demonstrating layout primitives + lifecycle.
# NOTE(jimmylee): Run with `npm run cli:python`. Press ESC or Ctrl-C to exit.
# NOTE(jimmylee): This is the canonical example for porting React Window* components to Python CLI screens.

import os
import sys

# NOTE(jimmylee): Make scripts/python importable when running this file directly.
_HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.normpath(os.path.join(_HERE, "..")))

from sacred_cli import (
    button, button_row,
    card_bot, card_header_row, card_row, card_top, word_wrap,
    create_app,
    format_row, kv_table,
)

SUMMARY = [
    ("PROJECT", "www-sacred"),
    ("VERSION", "1.1.19"),
    ("LANGUAGE", "Python"),
    ("STATUS", "OK"),
]

TH = ["NAME", "KIND", "STATUS", "UPDATED"]

ROWS = [
    ["ansi.py", "primitive", "ACTIVE", "2026-04-08T09:00:00"],
    ["window.py", "primitive", "ACTIVE", "2026-04-08T09:00:00"],
    ["card.py", "primitive", "ACTIVE", "2026-04-08T09:00:00"],
    ["table.py", "primitive", "ACTIVE", "2026-04-08T09:00:00"],
    ["button.py", "primitive", "ACTIVE", "2026-04-08T09:00:00"],
    ["app.py", "lifecycle", "ACTIVE", "2026-04-08T09:00:00"],
]

COL_SPEC = [
    {"width": 14, "align": "left"},
    {"width": 12, "align": "left", "grow": True},
    {"width": 8, "align": "right", "status": True, "gap": 2},
    {"width": 19, "align": "right", "gap": 2},
]

NOTE = (
    "Sacred ports React Window components into terminal screens by mapping each <Card> to "
    "a card_top/card_row/card_bot triple. Use this template as the canonical reference for the "
    "skill in skills/port-sacred-terminal-ui-to-python."
)


def build(_page: int, inner_w: int, _selected: int):
    L = []

    # NOTE(jimmylee): Empty strings render as a blank window-fill row via wrap_line, matching the
    # NOTE(jimmylee): one-line gap that the React kitchen sink draws with `<br />` between cards
    # NOTE(jimmylee): in components/examples/CLITemplate.tsx. Keep CLI/Python/React in lockstep.
    L.append(card_top("SACRED CLI / TEMPLATE", inner_w))
    for line in kv_table(SUMMARY):
        L.append(card_row(line, inner_w))
    L.append(card_bot(inner_w))
    L.append("")

    L.append(card_top("PRIMITIVES", inner_w))
    L.append(card_header_row(format_row(TH, COL_SPEC, inner_w), inner_w))
    for row in ROWS:
        L.append(card_row(format_row(row, COL_SPEC, inner_w), inner_w))
    L.append(card_bot(inner_w))
    L.append("")

    L.append(card_top("NOTE", inner_w))
    content_w = inner_w - 6
    for wl in word_wrap(NOTE, content_w):
        L.append(card_row(wl, inner_w))
    L.append(card_bot(inner_w))
    L.append("")

    L.append(button_row(button("ESC", "exit"), button("\u21B5", "select"), inner_w))

    return L


if __name__ == "__main__":
    create_app(build=build, total_pages=1).start()
