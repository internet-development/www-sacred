# Skill: Port Sacred Terminal UI to React Using Same Conventions

> Also available at https://sacred.computer/llm/skills/port-sacred-terminal-ui-to-react-using-same-conventions/SKILL.md

Take a CLI screen written for **Simulacrum** — the sacred CLI framework (`scripts/cli/templates/*.ts` or `scripts/python/templates/*.py`) — and produce a React component that lives inside `components/examples/` (or `components/`) using only sacred's existing primitives — `Window`, `Card`, `SimpleTable`, `ActionButton`, `RowSpaceBetween`, `BarLoader`, etc.

> See `components/AGENTS.md` for the canonical catalog of every sacred React component (props, theming tokens, CLI primitive equivalent). Read it before picking a component to render.

## When to use

Use this skill whenever you have a CLI screen and want a sacred React surface that mirrors it without the canvas-based animation. This is the inverse of `port-sacred-terminal-ui-to-typescript-cli` and `port-sacred-terminal-ui-to-python`.

## Reference primitives

These are the React components that sacred ships and that the CLI framework maps onto. Read them before writing the port:

| Sacred React component | CLI primitive | What it renders |
| --- | --- | --- |
| `components/Card.tsx` | `cardTop`/`cardRow`/`cardBot` | Box-drawing card with title bar |
| `components/CardDouble.tsx` | (no equivalent) | Double-bordered card with left/right titles |
| `components/SimpleTable.tsx` | `formatRow` + `cardHeaderRow`/`cardRow` | Fluid HTML table with header background and status coloring — the canonical React surface for CLI port examples |
| `components/DataTable.tsx` | (no direct equivalent) | Sacred's gradient-tinted table — heavier, used outside CLI ports |
| `components/Button.tsx` | `button` + `buttonRow` | Hotkey + label button pair |
| `components/BarLoader.tsx` | (one-line loader) | Single-row progress fill |
| `components/RowSpaceBetween.tsx` | `buttonRow(left, right, innerW)` | Left/right justified row |
| `components/Block.tsx` | `cardRow(text, innerW)` with word wrap | Padded text block |
| `components/Text.tsx` | gradient or plain text | Typography wrapper |

## Step-by-step

1. **Read the CLI screen.** Identify each `cardTop`/`cardRow`/`cardBot` block and each `buttonRow`. Each block becomes one `<Card>` element.
2. **Create the React file.** Drop it in `components/examples/` if it is a demo, or `components/` if it is a reusable surface. Use `'use client'` only if you need browser APIs (most ports do not).
3. **Map cards to `<Card title="...">`.** Wrap content children in `<Card>`. Card renders the title bar, the framework only adds borders.
4. **Map data tables to `<SimpleTable data={[...]} />`.** First row is the header, subsequent rows are data. `SimpleTable` is a fluid HTML table with the same column + status contract as the CLI framework's `formatRow` (`ACTIVE`/`OPEN`/`APPROVED` → bold green, `CLOSED`/`PAID`/`SUSPENDED` → gray). Use `align={['left','right',...]}` to mirror per-column alignment from the CLI's `colSpec`. Do **not** use the heavier `DataTable` here — its gradient backgrounds are not part of the CLI surface.
5. **Map button rows to `<RowSpaceBetween>`.** Left and right buttons go in the slots provided. Use `<Button theme="SECONDARY">ESC EXIT</Button>` so the React buttons match the CLI button row visually.
6. **Skip the animation header.** Sacred's React UI has its own animation surfaces (`canvas-platformer`, `canvas-snake`); do not re-port the CLI's static layout into one of those. The point is **layout parity**, not animation parity.
7. **Inherit theming.** Sacred's `global.css` already drives every `--theme-*` token from the active light/dark/tint theme. Do not import `scripts/cli/colors.json` from React — the React side picks up the same ANSI palette through the CSS custom properties (`var(--theme-background)` etc.).

## What NOT to do

- **Do not** re-implement the box-drawing borders in HTML/CSS — `Card` already does this.
- **Do not** copy `scripts/cli/lib/*` into the React tree. The CLI framework is for terminals; the React tree uses CSS Modules.
- **Do not** import `scripts/cli/colors.json` from a React file. The browser palette comes from CSS custom properties — the JSON is the authoritative source for the ANSI palette but it is consumed indirectly through `global.css`.
- **Do not** add an `<ASCIICanvas>` from `.workdir/` — sacred has its own animations and porting that canvas duplicates state machines.

## Layout expectations

Sacred React components are width-fluid: use them in `<ContentFluid>` or `<Block>` containers and let CSS Grid / Flexbox do the work. The CLI framework's "innerW" concept is replaced by browser layout, so you do not need to compute column widths yourself — DataTable and Card handle their own padding.

## Smoke test

After writing the component:

```sh
npm test     # CLI framework tests still pass (sanity check)
npm run dev  # render the React surface in the browser
```

Visit the page that renders your component and confirm:

- Card titles match the CLI `cardTop` titles exactly
- SimpleTable rows match the CLI `formatRow` outputs (same order, same labels, same status colors)
- Buttons match the CLI `button(hotkey, label)` pairs
- The screen reads the same in light, dark, and every tinted theme (the global CSS handles this for free)

If anything diverges, trust the CLI screen — it is the source of truth for layout because the CLI framework forces explicit widths and the React side fills in around it.
