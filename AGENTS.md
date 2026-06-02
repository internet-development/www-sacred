# AGENTS.md

Orientation for any agent working in `www-sacred`. Read this before touching code.

## What this repo is

`www-sacred` (npm package `srcl`) is an open-source React component library with terminal aesthetics. It is consumed in two ways:

1. **A Next.js 16 / React 19 site at `sacred.computer`** that renders every component in a kitchen sink at `app/page.tsx`.
2. **Simulacrum**, a zero-dependency CLI framework under `scripts/cli/lib/` (and a snake_case Python mirror under `scripts/python/sacred_cli/`) so the same layouts can render in a terminal.

Colors flow from one source: `scripts/cli/colors.json`. That file holds the terminal-tested palette. `global.css` mirrors it as `--ansi-*` primitives and builds `--theme-*` tokens on top. The OKLCH tint themes in `global.css` are a web-only derivation. When a color changes, it changes in `colors.json` first.

## Repo map

- `app/` — Next.js App Router. `app/page.tsx` is the kitchen sink. The `/llm/*` routes serve docs as markdown and component source as plain text so agents can fetch them without cloning.
- `components/` — Sacred React components. Read `components/AGENTS.md` first when picking a component. `components/examples/` has larger demo surfaces. `SimpleTable` is the table for CLI ports (maps onto `formatRow` + `cardHeaderRow`). `Window` is the React peer of the CLI window frame.
- `common/` — Constants and utilities shared across components.
- `modules/` — Stand-alone, dependency-free modules: the vendored `hotkeys/` library plus a few vendored Node helpers (`cors.ts`, `vary.ts`, `object-assign.ts`).
- `scripts/cli/` — Simulacrum, the sacred CLI framework (TypeScript, zero dependencies, run via `tsx`). `lib/` is the framework, `lib/__tests__/` is the vitest suite (and the `dump_reference.ts` fixture generator), `templates/` is the canonical TS template, `colors.json` is the shared palette.
- `scripts/python/` — Simulacrum's Python mirror. `sacred_cli/` is the package, `sacred_cli/__tests__/` is the unittest suite (and the parity test against the JS fixture), `templates/` is the canonical Python template.
- `scripts/test_python.ts` — TypeScript orchestrator for `npm run test:python`. Probes for `python3`, regenerates the TS fixture, then invokes `python3 -m unittest discover`. Skips with a warning if `python3` is missing.
- `skills/` — Four porting skills (TS CLI, Python CLI, React-to-React, hostile React host). Read `skills/*/SKILL.md` before porting.
- `.workdir/` — Read-only reference material from sibling projects. Never edit, never ship.

## Conventions

- All comments use `//NOTE(jimmylee): ...` in TS/JS/CSS (no space after `//`, no `@`) and `# NOTE(jimmylee): ...` in Python. Comments explain _why_, not _what_. If the code reads clearly on its own, write no comment — and delete self-documenting comments on sight.
- The CLI framework is intentionally zero-dependency TypeScript, run via `tsx` with no build step.
- The Python framework mirrors the JS framework one-to-one but uses snake_case. The same `colors.json` is the single source of truth — do not duplicate the palette. The two runtimes are locked into byte-identical output by the parity suite under `scripts/python/sacred_cli/__tests__/test_parity.py`. When you change a JS module, port the change to its Python mirror in the same PR — `npm test` will fail otherwise.
- React example components in `components/examples/*` should only depend on sacred's existing primitives (`Card`, `SimpleTable`, `Button`, `RowSpaceBetween`, etc.). The CLI port examples (`CLITemplate`, `InvoiceTemplate`, `ResultsList`) use `SimpleTable`, not `DataTable`, because `SimpleTable`'s column + status contract maps one-to-one onto `formatRow` and `cardHeaderRow`. Do not import from `scripts/cli/lib/*` from React — that code is Node-only and uses `process.stdout`.
- Tests live in four places: `scripts/cli/lib/__tests__/` (CLI framework), `components/__tests__/` (catalog sync guards), `app/llm/__tests__/` (URL surface), and `scripts/python/sacred_cli/__tests__/` (Python + parity). The sync guards keep docs, props, theming tokens, palette colors, and URL surfaces honest against the source. `npm test` runs everything. Run it before opening a PR.
- Sacred CLI ports are static — no animation diffing system. The React side keeps its existing animation primitives (canvas snake, canvas platformer, etc.). The one exception is `OneLineLoaders.tsx` because the spinners are the entire point of that component.

## Scripts

```sh
npm install             # install deps
npm run dev             # Next.js dev server on http://localhost:10000
npm test                # tsc --noEmit + JS vitest suite + Python unittest + parity suite (chained)
npm run test:js         # only the JS vitest suite
npm run test:python     # only the Python suite (skips with a warning if python3 missing)
npm run cli:typescript  # render the canonical TS CLI template (alt screen, ESC to quit)
npm run cli:python      # render the canonical Python CLI template (alt screen, ESC to quit)
```

## Where to start when porting

- **React → CLI (TS):** read `skills/port-sacred-terminal-ui-to-typescript-cli/SKILL.md` and `scripts/cli/templates/template.ts`.
- **React → CLI (Python):** read `skills/port-sacred-terminal-ui-to-python/SKILL.md` and `scripts/python/templates/template.py`.
- **CLI → React (sacred host):** read `skills/port-sacred-terminal-ui-to-react-using-same-conventions/SKILL.md` and any of the `components/examples/CLITemplate.tsx` / `InvoiceTemplate.tsx` / `ResultsList.tsx` files.
- **Sacred → foreign React app:** read `skills/port-sacred-terminal-ui-to-hostile-react-codebase/SKILL.md`.

## Keyboard and hotkey system

Sacred uses a vendored copy of [react-hotkeys-hook](https://github.com/JohannesKlauss/react-hotkeys-hook) at `modules/hotkeys/`. The module is self-contained CommonJS-compatible React code — no npm dependency. It provides `useHotkeys`, `HotkeysProvider`, `isHotkeyPressed`, and `useRecordHotkeys`.

### Architecture

- **`modules/hotkeys/parse-hotkeys.ts`** — parses key strings (`ctrl+a`, `ArrowDown`, `esc`) into a `Hotkey` descriptor with modifier flags (`alt`, `ctrl`, `meta`, `shift`, `mod`) and non-modifier key names. `mod` is a platform-aware shortcut: meta on macOS, ctrl elsewhere.
- **`modules/hotkeys/validators.ts`** — matching logic: `isHotkeyMatchingKeyboardEvent` compares a live `KeyboardEvent` against a parsed `Hotkey`, respecting modifier state. Guards (`isHotkeyEnabledOnTag`, `isKeyboardEventTriggeredByInput`) suppress hotkeys when focus is inside form elements unless explicitly opted in.
- **`modules/hotkeys/use-hotkeys.ts`** — the main hook. Attaches `keydown`/`keyup` listeners to either a ref'd DOM node or `document`. Supports `scopes` for conditional activation, `enableOnFormTags` / `enableOnContentEditable` overrides, `preventDefault`, and `keyup`-only mode.
- **`modules/hotkeys/hotkeys-provider.tsx`** — React context for scope management (`enableScope`, `disableScope`, `toggleScope`) and a registry of all bound hotkeys via `BoundHotkeysProxyProvider`. `HotkeysProvider` is mounted at the app root in `components/Providers.tsx`, activating scope-based hotkey gating for the entire tree.
- **`modules/hotkeys/is-hotkey-pressed.ts`** — global `Set<string>` tracking all currently held keys via document-level `keydown`/`keyup` listeners. Used by `useHotkeys` for multi-key combination matching. Handles the macOS meta-key quirk (clears non-modifier keys when meta is released).
- **`modules/hotkeys/use-record-hotkeys.ts`** — records key combinations pressed by the user into a `Set<string>`, useful for UI that lets users define their own shortcuts.
- **`modules/hotkeys/use-deep-equal-memo.ts`** — memoization helper using `Utilities.deepEqual` to prevent unnecessary re-renders when options objects are structurally equal.

### Where hotkeys are registered

| Component | Hotkeys | Purpose |
| --- | --- | --- |
| `components/page/DefaultActionBar.tsx` | `ArrowDown`, `ArrowUp`, `ArrowRight`, `ArrowLeft`, `Enter`, `Space`, `ctrl+g`, `Escape` | Global focus navigation across all focusable elements + debug grid toggle + dismiss topmost modal |
| `components/DropdownMenuTrigger.tsx` | Configurable via `hotkey` prop (e.g. `ctrl+o`, `ctrl+a`, `ctrl+t`) | Opens/closes a dropdown menu |
| `components/DropdownMenu.tsx` | `Escape` | Closes the active dropdown (fallback for when focus is outside the menu container) |
| `components/modals/ModalError.tsx` | `enter` | Closes the error modal |
| `components/modals/ModalChess.tsx` | `enter` | Closes the chess modal |

### Where keyboard events are handled directly (onKeyDown / addEventListener)

| Component | Keys | Purpose |
| --- | --- | --- |
| `components/DropdownMenu.tsx` | `ArrowDown`, `ArrowUp`, `Enter`, `Space`, `Escape` | Menu item navigation with focus wrapping, activation, and dismiss |
| `components/DataTable.tsx` | `Enter`, arrow keys | Cell navigation and activation within the gradient table |
| `components/ListItem.tsx` | `Enter`, arrow keys | Item activation and sequential focus traversal |
| `components/Select.tsx` | `Enter`, `Space`, `Escape`, arrow keys | Open/close listbox, navigate and select options, dismiss |
| `components/Input.tsx` | Native `onKeyDown` passthrough | Delegates to consumer callback |
| `components/TextArea.tsx` | Native `onKeyDown` passthrough | Delegates to consumer callback |
| `components/Checkbox.tsx` | Native `onKeyDown` via `<input>` | Standard checkbox toggling |
| `components/RadioButton.tsx` | Native `onKeyDown` via `<input>` | Standard radio selection |
| `components/ActionButton.tsx` | `Enter`, `Space` (inline) | Click activation for keyboard users |
| `components/ActionListItem.tsx` | `Enter`, `Space` (inline) | Click activation for keyboard users |
| `components/Accordion.tsx` | `Enter`, `Space` (inline) | Toggle open/close for keyboard users |
| `components/TreeView.tsx` | `Enter`, `Space` (inline) | Toggle expand/collapse for keyboard users |
| `components/CanvasPlatformer.tsx` | Arrow keys, `Space` (window listener) | Player movement and jumping |
| `components/CanvasSnake.tsx` | Arrow keys (window listener) | Snake direction control |
| `components/DOMSnake.tsx` | Arrow keys (window listener) | Snake direction control |

### Integration with the CLI framework

The CLI framework (`scripts/cli/lib/app.ts`) has its own keyboard system based on Node.js `process.stdin` raw mode. It handles `Ctrl-C`, `Escape` (quit), arrow keys (pagination/selection), and `Enter` (selection confirm). This is completely separate from the React hotkey module — the two systems share concepts but no code.

## Working agreements

- Don't commit unless the user explicitly asks. Sacred ships releases manually.
- Don't add features the task didn't ask for. If you find a tangential bug, surface it instead of fixing it silently.
- Don't import from `.workdir/` at runtime. It is reference material only.
- Don't break the kitchen sink. After any component change, render `app/page.tsx` mentally (or in `npm run dev`) and confirm nothing regresses.
