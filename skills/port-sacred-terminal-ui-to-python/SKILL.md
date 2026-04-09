# Skill: Port Sacred Terminal UI to Python

> Also available at https://sacred.computer/llm/skills/port-sacred-terminal-ui-to-python/SKILL.md

Take a React `Window*.tsx` (or any sacred component) and produce a terminal CLI screen written in Python that uses **Simulacrum's** Python mirror in `scripts/python/sacred_cli/`. Simulacrum is the sacred CLI framework — the JavaScript half lives in `scripts/cli/lib/`, the Python half is a one-to-one snake_case mirror.

> See `components/AGENTS.md` for the canonical catalog of every sacred React component (props, theming tokens, CLI primitive equivalent). Read it before identifying which React surface you are porting from.

## When to use

Use this skill whenever you want a Python CLI version of an existing sacred React surface. Sacred ships a Python port of the layout primitives (one-to-one with the JavaScript framework) so the same React component can render identically from either runtime.

## What you ship

A single `.py` file under `scripts/python/templates/` that:

1. Has a `python3` shebang and `if __name__ == "__main__":` entry point.
2. Imports primitives from `sacred_cli` (the package lives in `scripts/python/sacred_cli/`).
3. Calls `create_app(build=build).start()` with a `build(page, inner_w, selected_row)` function that returns `list[str]`.

## Reference implementation

Read these files before starting:

- `scripts/python/templates/template.py` — canonical example (run with `npm run cli:python`)
- `scripts/python/sacred_cli/__init__.py` — public surface re-exports
- `scripts/python/sacred_cli/ansi.py` — ANSI escapes, hex helpers, padding, gradient text
- `scripts/python/sacred_cli/window.py` — window frame (margin + window bg + shadow)
- `scripts/python/sacred_cli/card.py` — box-drawing card borders and word wrap
- `scripts/python/sacred_cli/table.py` — `format_row`, `kv_table`, `kv_table_gradient`
- `scripts/python/sacred_cli/button.py` — `button`, `button_row`
- `scripts/python/sacred_cli/app.py` — lifecycle: alt screen, raw mode, resize, paging, selection
- `scripts/cli/colors.json` — sacred-themed color palette (the Python ANSI module loads this same JSON)

## Naming convention

The Python port mirrors the JavaScript framework one-to-one but uses **snake_case**:

| JavaScript                                 | Python                                        |
| ------------------------------------------ | --------------------------------------------- |
| `cardTop(title, innerW)`                   | `card_top(title, inner_w)`                    |
| `cardRow(content, innerW)`                 | `card_row(content, inner_w)`                  |
| `cardSelectRow(content, innerW, selected)` | `card_select_row(content, inner_w, selected)` |
| `cardHeaderRow(content, innerW)`           | `card_header_row(content, inner_w)`           |
| `cardBot(innerW)`                          | `card_bot(inner_w)`                           |
| `formatRow(vals, colSpec, innerW)`         | `format_row(vals, col_spec, inner_w)`         |
| `kvTable(pairs)`                           | `kv_table(pairs)`                             |
| `kvTableGradient(pairs)`                   | `kv_table_gradient(pairs)`                    |
| `buttonRow(left, right, innerW)`           | `button_row(left, right, inner_w)`            |
| `wordWrap(text, maxW)`                     | `word_wrap(text, max_w)`                      |
| `createApp({ build })`                     | `create_app(build=build)`                     |

`button(hotkey, label)` and the COLORS dict keep the same names because they have no JS-specific casing.

## ColSpec reference

```py
COL_SPEC = [
    {"width": 14, "align": "left"},
    {"width": 12, "align": "left", "grow": True},
    {"width": 8, "align": "right", "status": True, "gap": 2},
]
```

Status coloring: `ACTIVE`/`OPEN`/`APPROVED` → bold green; `CLOSED`/`PAID`/`SUSPENDED` → gray. The framework handles this automatically when `status: True`.

## Step-by-step

1. **Read the React file.** Identify cards, tables, paragraphs, and button rows. Skip the `<ASCIICanvas>` (CLI is static).
2. **Extract data.** Move table rows into module-level lists at the top of your `.py` file.
3. **Define COL_SPECS.** One per table. Mark a single column with `"grow": True`.
4. **Write `build(page, inner_w, selected_row)`.** Append `card_top` → rows → `card_bot` for each section. End with `button_row(...)`.
5. **Run `npm run cli:python`.** Verify margins, shadow, and inner padding match the React component.
6. **Add interactivity (optional).** Pass `interactive={"count": 5, "on_select": fn, "persist": True}` to `create_app` and use `card_select_row(content, inner_w, i == selected_row)`.
7. **Add pagination (optional).** Pass `total_pages=N` (or a callable) and slice your data by `page` inside `build`.

## Formatting rules

- Shebang `#!/usr/bin/env python3`.
- Comments use `# NOTE(your_github_username): ...`.
- Column headers are `UPPER_SNAKE_CASE`.
- Dates are ISO 8601 (`2026-04-08T09:00:00`).
- Currency uses commas (`$18,920.50`).
- Never hardcode hex colors — read from `scripts/cli/colors.json` via `sacred_cli.COLORS`.
- Python templates run on POSIX terminals (macOS / Linux); the lifecycle uses `termios` raw mode. Windows users need a `msvcrt` shim that the sacred port does not currently provide.

## Smoke test

After writing the file:

```sh
npm test                # JS framework unit tests + Python parity suite
npm run cli:python      # your screen renders, ESC quits cleanly
```

If you see garbled output, your terminal probably does not support 24-bit true color — the sacred palette assumes `\x1b[38;2;R;G;Bm` works.

## Verifying parity

The Python framework is a one-to-one mirror of the JavaScript framework. The two runtimes are locked into byte-identical output by a parity test suite under `scripts/python/sacred_cli/__tests__/`:

```sh
npm run test:python     # only the Python suite
npm test                # JS suite + Python suite (chained)
```

`npm run test:python` first regenerates the JS reference fixture (`scripts/python/sacred_cli/__tests__/fixtures/reference.json`) via `node scripts/cli/lib/__tests__/dump_reference.js`, then runs `python3 -m unittest discover` against `sacred_cli/__tests__`. The fixture is checked into the repo so the Python test never has to shell out — regeneration is just a guard against stale snapshots.

If `python3` is not on PATH, the runner prints a warning and exits 0. Sacred contributors on minimal containers can still run `npm test` without installing Python.

### When the parity test fails

A failing parity test almost always means **a JS module was changed without porting the change to its Python mirror.** To fix:

1. Read the failing assertion (e.g. `test_format_row_status`).
2. Open the corresponding JS module (`scripts/cli/lib/table.js`) and the Python mirror (`scripts/python/sacred_cli/table.py`) side-by-side.
3. Port the JS change into the Python file. Snake-case the symbol names per the naming table above.
4. Re-run `npm test`. The fixture is regenerated automatically — no manual step needed.

If you genuinely need to update the contract on **both** sides, edit the JS module first, then run `npm test` to see what the parity fixture now looks like, and only then port the new behavior into Python. Never edit the fixture JSON by hand.

The unit tests under `scripts/python/sacred_cli/__tests__/` (one file per module: `test_ansi.py`, `test_window.py`, `test_card.py`, `test_table.py`, `test_button.py`) mirror the JS tests in `scripts/cli/lib/__tests__/`. When you add a new JS test, add the equivalent Python test in the same file so the assertion sets stay synchronized.
