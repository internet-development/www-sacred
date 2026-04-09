# AGENTS.md — scripts/cli

Simulacrum, the sacred CLI framework. Zero-dependency CommonJS. Imported by `scripts/cli/templates/*.ts` (via `tsx`) and mirrored in Python under `scripts/python/sacred_cli/`.

## Why CommonJS

`tsx` runs TypeScript with no build step, and `require()` against a CJS module means TypeScript consumes it through type erasure. Adding ESM here would force a build step or `--experimental-vm-modules`. Don't do it.

## Layout

- `colors.json` — sacred palette. Single source of truth, also loaded by the Python mirror.
- `lib/ansi.js` — ANSI escapes, hex helpers (`fgHex`/`bgHex`), padding (`padR`/`padL`), gradient text, visible-length math (`strip`/`visLen`/`truncateVisible`), color constants (`COLORS`).
- `lib/window.js` — window frame: margin (2ch), shadow (1ch right + 1 row bottom), `getInnerWidth`, `wrapLine`/`wrapLineTop`/`shadowBottomRow`/`wrapLines`, `bgTerm`/`bgWin`/`bgShd`, `MIN_TERM_W`/`MIN_INNER_W`.
- `lib/card.js` — box-drawing card (`B`, `cardTop`, `cardRow`, `cardSelectRow`, `cardHeaderRow`, `cardBot`, `wordWrap`).
- `lib/table.js` — `formatRow(vals, colSpec, innerW)`, `kvTable`, `kvTableGradient`. Status coloring fires when a column has `status: true` (`ACTIVE`/`OPEN`/`APPROVED` → bold green, `CLOSED`/`PAID`/`SUSPENDED` → gray).
- `lib/button.js` — `button(hotkey, label)` and `buttonRow(left, right, innerW)`.
- `lib/app.js` — lifecycle: alt screen, raw mode, resize debounce, pagination, optional row selection. Exports `createApp({ build, totalPages, interactive, onKey }).start()`.

## What this framework deliberately does NOT have

- **No animation diffing.** Sacred CLI ports are static. The React side handles animation via `<ASCIICanvas>` and the canvas modules. If you find yourself adding a frame loop here, stop and use the React side instead.
- **No mode loader, no plugin system.** Templates wire data and call `createApp`. Anything more belongs in the template.
- **No third-party deps.** `package.json`'s only role here is to expose the `cli:typescript` and `cli:python` scripts. The framework itself never imports from `node_modules`.

## Tests

`__tests__/*.test.mjs` cover the framework. Tests are `.mjs` so they can use `vitest`'s ESM imports while pulling the CJS source through `createRequire`. Run with `npm test` (which also runs the Python parity suite) or `npm run test:js` to skip Python. Add a test alongside the module you change.

## Parity fixture

`__tests__/dump_reference.js` is a tiny Node script that pipes a fixed dataset through every public primitive (`cardTop`, `cardRow`, `cardHeaderRow`, `cardBot`, `cardSelectRow`, `formatRow`, `kvTable`, `kvTableGradient`, `button`, `buttonRow`, `wrapLine`/`wrapLineTop`/`shadowBottomRow`, `wordWrap`) and prints the result as JSON on stdout. The output is the source-of-truth fixture that the Python parity test (`scripts/python/sacred_cli/__tests__/test_parity.py`) loads. `npm run test:python` regenerates the fixture before running the Python suite, so any drift between the JS framework and the Python mirror produces a hard test failure within a single PR cycle.

If you change a primitive's output, the fixture changes automatically — port the change into the Python mirror in the same PR, never edit the JSON by hand.

## Templates

`templates/template.ts` is the canonical TypeScript template. It is the reference for the `port-sacred-terminal-ui-to-typescript-cli` skill. Keep it short, opinionated, and runnable: `npm run cli:typescript` must always work.
