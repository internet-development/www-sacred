"""Sacred CLI app lifecycle. Mirrors scripts/cli/lib/app.js.

Slimmed version: alt-screen, raw mode, resize, input, pagination, and selection — but
no animation system. Sacred ports static screens; the React side handles its own physics.
"""

import os
import shutil
import signal
import sys

from .ansi import (
    RESET, alt_screen_off, alt_screen_on, clear_eol, clear_eos, clear_screen,
    cursor_hide, cursor_show, move_to,
)
from .window import (
    MIN_TERM_W, bg_term, get_inner_width, shadow_bottom_row, wrap_line, wrap_line_top,
)


def _term_size():
    sz = shutil.get_terminal_size((80, 24))
    return sz.columns, sz.lines


def create_app(*, build, total_pages=1, interactive=None, on_key=None):
    """Returns an object with a `start()` method.

    `build(page, inner_w, selected_row)` must return a list[str] of content lines.
    """

    def resolve_total_pages():
        return total_pages() if callable(total_pages) else total_pages

    state = {"page": 1, "selected_row": 0, "lines": [], "too_narrow": False}

    def write(s):
        sys.stdout.write(s)
        sys.stdout.flush()

    def full_build():
        term_w, term_h = _term_size()
        inner_w = get_inner_width(term_w)

        if term_w < MIN_TERM_W:
            state["too_narrow"] = True
            msg = "Terminal too narrow"
            wrapped = []
            for r in range(term_h):
                if r == term_h // 2:
                    pad = max(0, (term_w - len(msg)) // 2)
                    wrapped.append(
                        f"{bg_term}{' ' * pad}{msg}{' ' * max(0, term_w - pad - len(msg))}{RESET}"
                    )
                else:
                    wrapped.append(f"{bg_term}{' ' * term_w}{RESET}")
            state["lines"] = wrapped
            return
        state["too_narrow"] = False

        sel = state["selected_row"] if interactive else -1
        content_lines = build(state["page"], inner_w, sel)

        wrapped = [f"{bg_term}{' ' * term_w}{RESET}"]
        for i, line in enumerate(content_lines):
            wrapped.append(wrap_line_top(line, inner_w) if i == 0 else wrap_line(line, inner_w))
        wrapped.append(shadow_bottom_row(inner_w))
        wrapped.append(f"{bg_term}{' ' * term_w}{RESET}")
        state["lines"] = wrapped

    def render_static():
        buf = ""
        for i, line in enumerate(state["lines"]):
            buf += move_to(i + 1, 1) + line + clear_eol
        buf += move_to(len(state["lines"]) + 1, 1) + clear_eos
        write(buf)

    def redraw():
        full_build()
        render_static()

    # NOTE(jimmylee): Raw-mode entry/exit using termios. Linux/macOS only — Windows would need
    # NOTE(jimmylee): a `msvcrt`-based shim, but the React/CLI port targets POSIX terminals.
    import termios
    import tty

    fd = sys.stdin.fileno()
    old_attrs = [None]

    def quit_app(*_):
        if old_attrs[0] is not None:
            termios.tcsetattr(fd, termios.TCSADRAIN, old_attrs[0])
            old_attrs[0] = None
        write(cursor_show + alt_screen_off)
        sys.exit(0)

    def on_resize(*_):
        tp = resolve_total_pages()
        if state["page"] > tp:
            state["page"] = max(1, tp)
        if interactive:
            count = interactive["count"](state["page"]) if callable(interactive["count"]) else interactive["count"]
            if count == 0:
                state["selected_row"] = 0
            elif state["selected_row"] >= count:
                state["selected_row"] = count - 1
        redraw()

    def read_key():
        # NOTE(jimmylee): Read up to 8 bytes — enough to capture ESC [ A/B/C/D and one printable.
        try:
            data = os.read(fd, 8)
        except (OSError, KeyboardInterrupt):
            return None
        return data

    def start():
        write(alt_screen_on + cursor_hide + clear_screen)
        old_attrs[0] = termios.tcgetattr(fd)
        try:
            tty.setraw(fd)
        except termios.error:
            pass

        signal.signal(signal.SIGINT, lambda *_: quit_app())
        signal.signal(signal.SIGWINCH, lambda *_: on_resize())

        full_build()
        render_static()

        while True:
            data = read_key()
            if data is None:
                continue
            # NOTE(jimmylee): Ctrl-C (3), ESC alone (27 length 1) → quit.
            if data[0] == 3 or (data[0] == 27 and len(data) == 1):
                quit_app()
            i_count = 0
            if interactive:
                i_count = (
                    interactive["count"](state["page"])
                    if callable(interactive["count"])
                    else interactive["count"]
                )
            # NOTE(jimmylee): Enter (13) — fires on_select; persist keeps the screen alive.
            if data[0] == 13:
                if interactive and interactive.get("on_select") and i_count > 0:
                    interactive["on_select"](state["selected_row"], state["page"])
                if interactive and interactive.get("persist"):
                    redraw()
                    continue
                quit_app()
            # NOTE(jimmylee): Arrow keys — ESC [ A/B/C/D.
            if len(data) >= 3 and data[0] == 27 and data[1] == 91:
                if data[2] == 65 and interactive:
                    if state["selected_row"] > 0:
                        state["selected_row"] -= 1
                        redraw()
                    continue
                if data[2] == 66 and interactive:
                    if state["selected_row"] < i_count - 1:
                        state["selected_row"] += 1
                        redraw()
                    continue
                if data[2] == 67 and state["page"] < resolve_total_pages():
                    state["page"] += 1
                    if interactive:
                        state["selected_row"] = 0
                    redraw()
                    continue
                if data[2] == 68 and state["page"] > 1:
                    state["page"] -= 1
                    if interactive:
                        state["selected_row"] = 0
                    redraw()
                    continue
            if on_key:
                on_key(data, state, redraw)

    return type("SacredApp", (), {"start": staticmethod(start)})
