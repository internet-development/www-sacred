# Skill: Port Sacred Terminal UI to TypeScript CLI

> Also available at https://sacred.computer/llm/skills/port-sacred-terminal-ui-to-typescript-cli/SKILL.md

Take a React `Window*.tsx` (or any sacred component) and produce a terminal CLI screen written in TypeScript that uses **Simulacrum** — the sacred CLI framework in `scripts/cli/lib/`.

> See `components/AGENTS.md` for the canonical catalog of every sacred React component (props, theming tokens, CLI primitive equivalent). Read it before identifying which React surface you are porting from.

## When to use

Use this skill whenever you want a CLI version of an existing sacred React surface. Sacred ships a small zero-dependency layout framework that maps every React `<Card>` / `<DataTable>` / `<TerminalButton>` concept onto a CLI primitive. The output is identical to the React component minus the canvas-based animations — sacred renders are static.

## What you ship

A single `.ts` file under `scripts/cli/templates/` that:

1. Uses `tsx` as a shebang or `npm run cli:typescript` as the entry point.
2. `require`s the framework primitives (the framework is CommonJS so TypeScript consumes it via `require` for type erasure with no build step).
3. Calls `createApp({ build }).start()` with a `build(page, innerW, selectedRow)` function that returns `string[]`.

## Reference implementation

Read these files before starting:

- `scripts/cli/templates/template.ts` — canonical example (run with `npm run cli:typescript`)
- `scripts/cli/lib/ansi.js` — ANSI escapes, hex helpers, padding, gradient text
- `scripts/cli/lib/window.js` — window frame (margin + window bg + shadow)
- `scripts/cli/lib/card.js` — box-drawing card borders and word-wrap
- `scripts/cli/lib/table.js` — `formatRow`, `kvTable`, `kvTableGradient`
- `scripts/cli/lib/button.js` — `button`, `buttonRow`
- `scripts/cli/lib/app.js` — lifecycle: alt screen, raw mode, resize, paging, selection
- `scripts/cli/colors.json` — sacred-themed color palette (single source of truth)

## React-to-CLI concept map

| React surface                             | CLI primitive                                            | Notes                                                                       |
| ----------------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------- |
| `<Card title="T">`                        | `cardTop('T', innerW)` + `cardBot(innerW)`               | Top + bottom borders                                                        |
| Content `<div>` inside `<Card>`           | `cardRow(text, innerW)`                                  | 2ch left indent, padded to inner width                                      |
| `unstyledTableFixedKey` + `gradientText`  | `kvTableGradient([[k, v]])`                              | 24ch key column, gradient on value                                          |
| `<thead><tr><td>`                         | `cardHeaderRow(formatRow(TH, COL_SPEC, innerW), innerW)` | `#585858` background                                                        |
| `<tbody><tr><td>`                         | `cardRow(formatRow(row, COL_SPEC, innerW), innerW)`      | Per-cell alignment, status coloring                                         |
| `styles.statusAuthenticated/Disconnected` | `colSpec: { status: true }`                              | `ACTIVE`/`OPEN`/`APPROVED` → bold green; `CLOSED`/`PAID`/`SUSPENDED` → gray |
| `<TerminalButton hotkey="ESC">`           | `button('ESC', 'exit')`                                  | Hotkey + label background pair                                              |
| `flexRowLeft / flexRowRight`              | `buttonRow(left, right, innerW)`                         | Left + right justify with windowBg gap                                      |
| Word-wrapped paragraph                    | `wordWrap(text, innerW - 6)`                             | Card padding is 3ch each side                                               |
| Animated `<ASCIICanvas>` header           | _omit_                                                   | Sacred CLI ports are static; the React side keeps the animation             |

## ColSpec reference

```ts
type ColSpec = {
  width: number;
  align?: 'left' | 'right';
  grow?: boolean; // one column per spec absorbs extra width
  status?: boolean; // ACTIVE/OPEN/APPROVED → bold green; CLOSED/PAID/SUSPENDED → gray
  gap?: number; // inter-column spacing (default 1ch)
};
```

## Step-by-step

1. **Read the React file.** Identify cards, tables, paragraphs, and button rows. Skip the `<ASCIICanvas>` (CLI is static).
2. **Extract data.** Move table rows into `const` arrays at the top of your TS file. If the React component already imports JSON, share the same JSON.
3. **Define COL_SPECS.** One per `<table>`. Mark a single column with `grow: true`.
4. **Write `build(page, innerW, selectedRow)`.** Push `cardTop` → rows → `cardBot` for each section. Append `buttonRow(...)` last.
5. **Run `npm run cli:typescript`.** Verify margins, shadow, and inner padding match the React component.
6. **Add interactivity (optional).** Pass `interactive: { count, onSelect, persist: true }` to `createApp` and use `cardSelectRow(content, innerW, i === selectedRow)`.
7. **Add pagination (optional).** Pass `totalPages: N` (or `() => N`) and slice your data by `page` inside `build`.

## Formatting rules

- File starts with `#!/usr/bin/env -S npx tsx`.
- Comments use `//NOTE(your_github_username): ...`.
- Column headers are `UPPER_SNAKE_CASE`.
- Dates are ISO 8601 (`2026-04-08T09:00:00`).
- Currency uses commas (`$18,920.50`).
- Never hardcode hex colors — read from `scripts/cli/colors.json` via the framework.

## Smoke test

After writing the file:

```sh
npm test                  # JS framework + Python parity suite (chained)
npm run cli:typescript    # your screen renders, ESC quits cleanly
```

If `npm test` fails, the framework is broken — fix it before continuing. If your screen flickers on resize, you forgot to wrap content in `cardRow`/`cardSelectRow` (the framework relies on padded rows for the in-place redraw).

If a JS module changes the bytes coming out of any primitive, the parity test in `scripts/python/sacred_cli/__tests__/test_parity.py` will fail until the Python mirror under `scripts/python/sacred_cli/` is updated to match. Port the change to both runtimes in the same PR — see `skills/port-sacred-terminal-ui-to-python/SKILL.md` § "Verifying parity".
