# AGENTS.md — scripts/python

Python mirror of Simulacrum (the sacred CLI framework). Mirrors `scripts/cli/lib/*` one-to-one but with snake_case symbol names so the Python surface is idiomatic. The package is `sacred_cli` so Python imports stay obviously sacred-flavored.

## Why a Python mirror

The CLI framework is small enough that maintaining a parallel Python implementation is cheap, and porting React → Python is easier when the source-of-truth API is identical to the JS version. Both runtimes load the **same** `scripts/cli/colors.json`, so terminal output is byte-identical between `npm run cli:typescript` and `npm run cli:python` modulo numeric formatting.

## Layout

- `sacred_cli/__init__.py` — re-exports the public surface so templates can `from sacred_cli import ...`.
- `sacred_cli/ansi.py` — mirrors `scripts/cli/lib/ansi.js`. Loads colors via `os.path.join(_HERE, "..", "..", "cli", "colors.json")` — do not duplicate the palette. `_js_round` (private helper) reproduces JavaScript's `Math.round` semantics so byte-level parity holds against the JS framework; do **not** replace it with Python's banker-rounding `round()`.
- `sacred_cli/window.py` — mirrors `window.js`. `get_inner_width`, `wrap_line`, `wrap_line_top`, `shadow_bottom_row`, `wrap_lines`.
- `sacred_cli/card.py` — mirrors `card.js`. `card_top`, `card_row`, `card_select_row`, `card_header_row`, `card_bot`, `word_wrap`. `B` is a dict instead of a JS object.
- `sacred_cli/table.py` — mirrors `table.js`. `format_row`, `kv_table`, `kv_table_gradient`.
- `sacred_cli/button.py` — mirrors `button.js`. `button`, `button_row`.
- `sacred_cli/app.py` — mirrors `app.js`. `create_app(*, build, total_pages=1, interactive=None, on_key=None)` using `termios`/`tty` for POSIX raw mode.
- `sacred_cli/__tests__/` — unittest suite. One file per module (`test_ansi.py`, `test_window.py`, `test_card.py`, `test_table.py`, `test_button.py`) plus `test_parity.py` that asserts byte-identical output against the JS reference fixture under `fixtures/reference.json`. `_bootstrap.py` adds `scripts/python/` to `sys.path` so `import sacred_cli` works under `unittest discover` regardless of cwd. We use the `__tests__/` directory name to mirror the JS test layout under `scripts/cli/lib/__tests__/`.
- `templates/template.py` — canonical Python template, runs with `npm run cli:python`.

## Naming convention

| JavaScript | Python |
| --- | --- |
| `cardTop` | `card_top` |
| `cardRow` | `card_row` |
| `cardSelectRow` | `card_select_row` |
| `cardHeaderRow` | `card_header_row` |
| `cardBot` | `card_bot` |
| `formatRow` | `format_row` |
| `kvTable` | `kv_table` |
| `kvTableGradient` | `kv_table_gradient` |
| `buttonRow` | `button_row` |
| `wordWrap` | `word_wrap` |
| `createApp` | `create_app` |

`button(hotkey, label)` and `COLORS` keep the same name in both runtimes.

## Platform support

The Python lifecycle uses `termios` + `tty` for raw mode, so it runs on macOS / Linux. Windows users would need a `msvcrt` shim that the sacred port does not currently provide. If you add one, mirror the JS lifecycle byte-for-byte rather than introducing platform branches inside `app.py`. (The parity test suite intentionally does not exercise `app.py` — it only covers the layout primitives, which are platform-agnostic.)

## Tests

`npm run test:python` regenerates the JS reference fixture (via `node scripts/cli/lib/__tests__/dump_reference.js`) and then runs `python3 -m unittest discover -s sacred_cli/__tests__ -t .`. The `npm test` script chains the JS suite and the Python suite, so a single command catches both kinds of regression. If `python3` is not on PATH, the runner prints a warning and exits 0 — sacred contributors on minimal containers can still run `npm test`.

When the parity test fails, the cause is almost always a JS module that changed without a matching Python port. Open the failing assertion (e.g. `test_format_row_status`), read the JS source side-by-side with the Python mirror, and port the change. Re-run `npm test` — the fixture regenerates automatically.

## What this mirror deliberately does NOT have

- No third-party Python deps. Stdlib only. The mirror exists so a Python team can ship a sacred-styled CLI without `pip install` overhead. The test suite uses `unittest` from the stdlib for the same reason.
- No `pytest`. The JS suite is `vitest`; the Python suite is `unittest`. Both runtimes lean on their stdlib-equivalent test runner so there is nothing to install.
