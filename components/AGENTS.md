# AGENTS.md — components

Canonical catalog of every React component sacred ships under `components/`. One entry per `.tsx` file directly under `components/`. The `examples/`, `modals/`, `svg/`, `page/`, and `detectors/` subdirectories are intentionally excluded — those are demos, modal bodies, icons, and runtime detectors that compose this library, not the library itself.

The catalog is enforced by `components/__tests__/agents_md_sync.test.mjs`, which fails CI if a `.tsx` file is added under `components/` without a matching `## Heading` here, or vice versa. Adding a component without documenting it is a CI failure inside the same PR.

## How to read each entry

- **Path** — repo-relative path of the source file.
- **Purpose** — one factual sentence pulled from the source. The catalog never invents behavior.
- **Props** — copied verbatim from the `interface` / `type Props` block in the source. If the component uses `React.forwardRef`, the inner Props type is what is shown. Sacred components are deliberately untyped or loosely typed in places — the catalog reflects that, it does not normalize.
- **Theming tokens** — `var(--theme-*)`, `var(--ansi-*)`, `var(--color-*)`, `var(--font-*)`, and `var(--z-index-*)` references read from the matching `.module.css` file (or inline `style={{}}`). This is the contract that lets a port preserve colors across light/dark and the seven OKLCH tints. If a component has no `.module.css` and no inline tokens, the field reads `(none)`.
- **CLI primitive** — the equivalent in the sacred CLI framework (`scripts/cli/lib/*` / `scripts/python/sacred_cli/*`). Pulled from the four port skills' mapping tables. If there is no equivalent — typically because the CLI framework is layout-only and the React component is interactive, animated, or browser-specific — the field reads `(React-only)` plus a one-phrase reason.
- **Used by** — at least one concrete reference inside `app/page.tsx` (the kitchen sink) or `components/examples/*.tsx` so an agent can see the component in the wild.

The catalog is the **what**. The four `skills/port-sacred-terminal-ui-to-*/SKILL.md` files remain the **how** — they walk through the procedural side of porting and they keep their own (scoped) component mapping tables for the porting workflow they describe. If you are porting a screen, read the skill first; if you just need to know which sacred component renders X, read this catalog.

## Out of scope (gaps to fill in follow-up tasks)

- **Per-prop usage examples** — the catalog lists props but does not exhaustively show every meaningful prop combination. A "Storybook-lite" surface that embeds minimal usage snippets per component is a separate, larger task.
- **Raw `.tsx` source mirror** — an agent that has read this catalog may want to fetch the raw component source over HTTP. The `/llm/...` URL surface intentionally only exposes Markdown contracts (`AGENTS.md` and `SKILL.md`). A `/llm/components/<Name>.tsx.txt` mirror is a follow-up task with a broader allowlist; it is deliberately not part of the first ship so the public surface stays tight.

---

## Accordion

- **Path:** `components/Accordion.tsx`
- **Purpose:** Click-to-toggle collapsible section with a title row and a children body.
- **Props:**
  ```ts
  interface AccordionProps {
    defaultValue?: boolean;
    title: string;
    children?: React.ReactNode;
  }
  ```
- **Theming tokens:** `--theme-focused-foreground`
- **CLI primitive:** (React-only) The CLI framework renders flat pages — there is no folding section concept.
- **Used by:** `<Accordion defaultValue={true} title="ACTION BAR">` in the kitchen sink (`app/page.tsx`).

## ASCIICanvas

- **Path:** `components/ASCIICanvas.tsx`
- **Purpose:** Animated ASCII art rendered in a `<pre>` element using per-cell `<span>` elements with DOM diffing.
- **Props:**
  ```ts
  { rows?: number }
  ```
- **Theming tokens:** `--font-size`, `--theme-line-height-base`
- **CLI primitive:** (React-only) The CLI framework is static — animation belongs on the React side.
- **Used by:** `<ASCIICanvas rows={20} />` in the "ASCII CANVAS" accordion in `app/page.tsx`.

## ActionBar

- **Path:** `components/ActionBar.tsx`
- **Purpose:** Horizontal toolbar of action items, each with optional hotkey and nested dropdown menu.
- **Props:**
  ```ts
  interface ActionBarProps {
    items: ActionBarItem[];
  }
  ```
- **Theming tokens:** `--theme-background`, `--theme-border`
- **CLI primitive:** `buttonRow` plus repeated `button(hotkey, label)` calls. The CLI version is non-nested; nested dropdowns are React-only.
- **Used by:** `<ActionBar items={[ ... ]} />` inside the "ACTION BAR" accordion in `app/page.tsx`.

## ActionButton

- **Path:** `components/ActionButton.tsx`
- **Purpose:** Hotkey + label button pair, the React peer of the CLI `button` primitive.
- **Props:**
  ```ts
  interface ActionButtonProps {
    onClick?: () => void;
    hotkey?: any;
    children?: React.ReactNode;
    style?: any;
    rootStyle?: any;
    isSelected?: boolean;
  }
  ```
- **Theming tokens:** `--theme-button-background`, `--theme-button-foreground`, `--theme-focused-foreground`, `--theme-text`, `--font-family-mono`, `--font-size`
- **CLI primitive:** `button(hotkey, label)` in `scripts/cli/lib/button.js` (`button(hotkey, label)` in the Python mirror). Pair with `buttonRow(...)` to get the same left/right layout.
- **Used by:** `<ActionButton hotkey="ESC">EXIT</ActionButton>` in `components/examples/CLITemplate.tsx`, `components/examples/InvoiceTemplate.tsx`, `components/examples/ResultsList.tsx`, and the "ACTION BUTTONS" accordion in `app/page.tsx`. Every CLI port surface uses `ActionButton` (not `Button`) so it stays in lockstep with Simulacrum's `button(hotkey, label)` primitive.

## ActionListItem

- **Path:** `components/ActionListItem.tsx`
- **Purpose:** Menu row that renders as either an anchor or a button with a leading icon glyph.
- **Props:**
  ```ts
  interface ActionListItemProps {
    style?: React.CSSProperties;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    href?: string;
    target?: string;
    onClick?: React.MouseEventHandler<HTMLDivElement | HTMLAnchorElement>;
    role?: string;
  }
  ```
- **Theming tokens:** `--theme-button-background`, `--theme-button-foreground`, `--theme-focused-foreground`, `--theme-text`, `--theme-line-height-base`, `--font-size`
- **CLI primitive:** `cardRow(formatRow([icon, label], colSpec, innerW), innerW)`. The CLI has no anchor concept — interactive items are wired through `createApp({ interactive, onKey })`.
- **Used by:** `<ActionListItem icon={'⭢'} href="https://internet.dev" target="_blank">` inside the navigation example in `app/page.tsx`.

## AlertBanner

- **Path:** `components/AlertBanner.tsx`
- **Purpose:** Full-width inline notification banner for advisory or warning copy.
- **Props:**
  ```ts
  interface AlertBannerProps {
    style?: any;
    children?: any;
  }
  ```
- **Theming tokens:** `--theme-border`, `--theme-border-subdued`, `--theme-line-height-base`, `--font-size`
- **CLI primitive:** `cardTop('!', innerW)` + `cardRow(text, innerW)` + `cardBot(innerW)` — sacred CLI ships no dedicated banner glyph; an unlabeled card row is the convention.
- **Used by:** `<AlertBanner>When things reach the extreme, they alternate to the opposite.</AlertBanner>` in `app/page.tsx`.

## Avatar

- **Path:** `components/Avatar.tsx`
- **Purpose:** Square portrait image (or initials placeholder) with optional inline label and external link.
- **Props:**
  ```ts
  interface AvatarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style' | 'className' | 'children'> {
    src?: string;
    href?: string;
    target?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }
  ```
- **Theming tokens:** `--theme-window-shadow`, `--theme-focused-foreground`, `--theme-text`, `--theme-line-height-base`, `--font-size`
- **CLI primitive:** (React-only) The CLI is text-only; portraits do not exist there.
- **Used by:** `<Avatar src="..." href="https://internet.dev" target="_blank" />` inside the "AVATARS" accordion in `app/page.tsx`.

## Badge

- **Path:** `components/Badge.tsx`
- **Purpose:** Inline label chip used for short status / version markers next to titles.
- **Props:**
  ```ts
  interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    children?: React.ReactNode;
  }
  ```
- **Theming tokens:** `--theme-border`, `--theme-line-height-base`, `--font-family-mono`, `--font-size`
- **CLI primitive:** Plain string concatenated into a `cardRow`. The CLI framework has no badge glyph because monospace runs are already labeled at column boundaries.
- **Used by:** `<Badge>{Package.version}</Badge>` inside the navigation strip in `app/page.tsx`.

## BarLoader

- **Path:** `components/BarLoader.tsx`
- **Purpose:** Fill-style progress bar with optional auto-advancing interval mode.
- **Props:**
  ```ts
  interface BarLoaderProps {
    intervalRate?: number;
    progress?: number;
  }
  ```
- **Theming tokens:** `--theme-border`, `--theme-text`, `--theme-line-height-base`, `--font-size`
- **CLI primitive:** (React-only) Sacred CLI ports are static — there is no animation diff loop. If you want a CLI progress indicator, render a single `cardRow` with the percentage at draw time.
- **Used by:** `<BarLoader intervalRate={1000} />` and `<BarLoader progress={50} />` inside the "BAR LOADERS" accordion in `app/page.tsx`.

## BarProgress

- **Path:** `components/BarProgress.tsx`
- **Purpose:** Character-based progress bar that fills its container width with a configurable glyph.
- **Props:**
  ```ts
  interface BarProgressProps {
    intervalRate?: number;
    progress?: number;
    fillChar?: string;
  }
  ```
- **Theming tokens:** `--theme-border-subdued`
- **CLI primitive:** (React-only) Same reason as BarLoader — the CLI is static.
- **Used by:** `<BarProgress intervalRate={500} fillChar="█" />` inside `components/examples/OneLineLoaders.tsx`.

## Block

- **Path:** `components/Block.tsx`
- **Purpose:** Inline span block used as a 1ch placeholder or measurement spacer in monospace layouts.
- **Props:**
  ```ts
  interface BlockProps extends React.HTMLAttributes<HTMLSpanElement> {
    children?: React.ReactNode;
  }
  ```
- **Theming tokens:** `--theme-text`, `--theme-line-height-base`, `--font-size`
- **CLI primitive:** A single space inside a `cardRow`. The CLI lays out by character grid, so a `<Block>` is implicit.
- **Used by:** `<Block style={{ opacity: 0 }} />` as a sizing spacer in `app/page.tsx`.

## BlockLoader

- **Path:** `components/BlockLoader.tsx`
- **Purpose:** Single-glyph spinner cycling through a Unicode box-drawing or block animation sequence.
- **Props:**
  ```ts
  interface BlockLoaderProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
    mode?: number;
  }
  ```
- **Theming tokens:** `--theme-line-height-base`, `--font-size`
- **CLI primitive:** (React-only) Sacred CLI ports are static. `OneLineLoaders.tsx` is the explicit React-side carve-out for spinners.
- **Used by:** `<BlockLoader mode={0} />` (and modes 1-11) inside the "BLOCK LOADERS" accordion in `app/page.tsx`.

## BreadCrumbs

- **Path:** `components/BreadCrumbs.tsx`
- **Purpose:** Linked breadcrumb trail with visual separators between hierarchy levels.
- **Props:**
  ```ts
  interface BreadCrumbsProps {
    items: BreadCrumbsItem[];
  }
  ```
- **Theming tokens:** `--theme-border`, `--theme-focused-foreground`, `--theme-text`, `--theme-line-height-base`
- **CLI primitive:** A `cardRow` with `path / segments / joined / by / slashes`. The CLI has no link concept.
- **Used by:** `<BreadCrumbs items={[...]} />` inside the "BREADCRUMBS" accordion in `app/page.tsx`.

## Button

- **Path:** `components/Button.tsx`
- **Purpose:** Two-theme HTML `<button>` (PRIMARY / SECONDARY) with disabled-state styling.
- **Props:**
  ```ts
  interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    theme?: 'PRIMARY' | 'SECONDARY';
    isDisabled?: boolean;
    children?: React.ReactNode;
  }
  ```
- **Theming tokens:** `--theme-background`, `--theme-border`, `--theme-button`, `--theme-button-background`, `--theme-button-foreground`, `--theme-button-text`, `--theme-focused-foreground`, `--theme-text`, `--theme-line-height-base`, `--font-family-mono`, `--font-size`
- **CLI primitive:** `button(hotkey, label)` (no theme variants — CLI buttons are uniform).
- **Used by:** `<Button>Primary Button</Button>` inside the "BUTTONS" accordion in `app/page.tsx`. Use `ActionButton` instead when porting CLI screens.

## ButtonGroup

- **Path:** `components/ButtonGroup.tsx`
- **Purpose:** Horizontal cluster of `ActionButton`s with selected-state highlighting and optional nested dropdown items.
- **Props:** _(untyped — `props.items: { body, hotkey?, selected?, onClick?, items?, openHotkey? }[]`, `props.isFull?: boolean`)_
- **Theming tokens:** (none)
- **CLI primitive:** `buttonRow(button(...), button(...), innerW)` repeated for each pair.
- **Used by:** `<ButtonGroup items={[{ body: '16 PX', selected: true }, { body: '32 PX' }, { body: '42 PX' }]} />` inside the "BUTTON GROUP" accordion in `app/page.tsx`.

## CanvasPlatformer

- **Path:** `components/CanvasPlatformer.tsx`
- **Purpose:** ASCII-grid 2D platformer mini-game with gravity, block placement, keyboard controls, and touch region controls for mobile (left third = move left, right third = move right, center = jump, multi-touch supported). Renders via pre/span grid with DOM diffing instead of canvas.
- **Props:**
  ```ts
  interface PlatformerProps {
    rows?: number;
  }
  ```
- **Theming tokens:** `--theme-border`, `--theme-text`, `--theme-focused-foreground`, `--font-size`, `--theme-line-height-base`
- **CLI primitive:** (React-only) Sacred CLI ports are static; no animation diffing.
- **Used by:** `<CanvasPlatformer rows={12} />` inside the ModalCanvasPlatformer modal triggered from `app/page.tsx`.

## CanvasSnake

- **Path:** `components/CanvasSnake.tsx`
- **Purpose:** ASCII-grid Snake mini-game with directional input (keyboard arrows and swipe gestures on mobile) and food collection. Renders via pre/span grid with DOM diffing instead of canvas.
- **Props:**
  ```ts
  interface SnakeProps {
    rows?: number;
  }
  ```
- **Theming tokens:** `--theme-text`, `--theme-focused-foreground`, `--font-size`, `--theme-line-height-base`
- **CLI primitive:** (React-only) Same reason as CanvasPlatformer.
- **Used by:** `<CanvasSnake rows={12} />` inside the ModalCanvasSnake modal triggered from `app/page.tsx`.

## Card

- **Path:** `components/Card.tsx`
- **Purpose:** Box-drawing card with a title bar and three corner modes (`default`, `'left'`, `'right'`).
- **Props:**
  ```ts
  interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
    title?: string | any;
    mode?: string | any;
  }
  ```
- **Theming tokens:** `--theme-text`, `--theme-line-height-base`, `--font-size`
- **CLI primitive:** `cardTop(title, innerW)` + `cardRow(content, innerW)` + `cardBot(innerW)` (`scripts/cli/lib/card.js`).
- **Used by:** `<Card title="EXAMPLE">...</Card>` repeated throughout `app/page.tsx`, and `<Card title="SACRED CLI / TEMPLATE" mode="left">` in `components/examples/CLITemplate.tsx`.

## CardDouble

- **Path:** `components/CardDouble.tsx`
- **Purpose:** Card variant with a double-stroke outer border, used for nested or emphasis groupings.
- **Props:**
  ```ts
  interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
    title?: string | any;
    mode?: string | any;
    style?: any;
  }
  ```
- **Theming tokens:** `--theme-text`, `--theme-line-height-base`, `--font-size`
- **CLI primitive:** (React-only) The sacred CLI framework only ships single-border cards in `scripts/cli/lib/card.js`.
- **Used by:** `<CardDouble title={entry[0]}>...</CardDouble>` inside `components/ComboBox.tsx`.

## Checkbox

- **Path:** `components/Checkbox.tsx`
- **Purpose:** Custom-styled checkbox with click + keyboard toggling and a children label slot.
- **Props:**
  ```ts
  interface CheckboxProps {
    style?: React.CSSProperties;
    checkboxStyle?: React.CSSProperties;
    name: string;
    defaultChecked?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    tabIndex?: number;
    children?: React.ReactNode;
  }
  ```
- **Theming tokens:** `--theme-border-subdued`, `--theme-button-background`, `--theme-button-foreground`, `--theme-focused-foreground`, `--theme-text`, `--theme-line-height-base`
- **CLI primitive:** `cardRow('[x] label', innerW)` rendered manually by the template; sacred CLI ships no checkbox primitive yet.
- **Used by:** `<Checkbox name="1">...</Checkbox>` inside the "CHECKBOX" accordion in `app/page.tsx`.

## Chessboard

- **Path:** `components/Chessboard.tsx`
- **Purpose:** 8×8 grid renderer that draws Unicode chess pieces from a 2D position array.
- **Props:**
  ```ts
  interface ChessboardProps {
    board: string[][];
  }
  ```
- **Theming tokens:** `--theme-border-subdued`, `--theme-focused-foreground-subdued`, `--theme-focused-foreground`, `--theme-line-height-base`
- **CLI primitive:** (React-only) The CLI framework has no grid primitive; a CLI port would render the board with eight `cardRow` calls of joined glyphs.
- **Used by:** `<Chessboard board={Constants.CHESSBOARD_DEFAULT_POSITIONS} />` inside the "CHESSBOARD" accordion in `app/page.tsx`.

## CodeBlock

- **Path:** `components/CodeBlock.tsx`
- **Purpose:** Pre-formatted source code block with line numbers and a fixed monospace style.
- **Props:**
  ```ts
  interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
    children?: React.ReactNode;
  }
  ```
- **Theming tokens:** `--theme-background`, `--theme-border-subdued`
- **CLI primitive:** A `cardRow` per line of source. The CLI has no syntax highlighting because the framework is colorless except for status columns.
- **Used by:** `<CodeBlock>...</CodeBlock>` inside the "CODE BLOCK" accordion in `app/page.tsx`.

## ComboBox

- **Path:** `components/ComboBox.tsx`
- **Purpose:** Searchable input + filtered result cards combo, optionally backed by a dataset.
- **Props:**
  ```ts
  interface ComboBoxProps {
    data: string[][];
    label?: string;
  }
  ```
- **Theming tokens:** (inherited from `Input` and `CardDouble`)
- **CLI primitive:** `createApp({ interactive: { count, onSelect } })` plus `cardSelectRow` for each filtered row. Sacred CLI's interactive selection lifecycle is the equivalent.
- **Used by:** `<ComboBox data={Constants.LANDSCAPES} label="SEARCH THE WORLD" />` inside the "COMBO BOX" accordion in `app/page.tsx`.

## ContentFluid

- **Path:** `components/ContentFluid.tsx`
- **Purpose:** Block container that expands to the full available width, used as the page-content shell.
- **Props:**
  ```ts
  interface ContentFluidProps extends React.HTMLAttributes<HTMLSpanElement> {
    children?: React.ReactNode;
  }
  ```
- **Theming tokens:** (none)
- **CLI primitive:** `getInnerWidth(termW)` plus the surrounding window frame in `scripts/cli/lib/window.js` — the CLI framework computes width once and the templates fill it.
- **Used by:** `<ContentFluid>...</ContentFluid>` wraps the kitchen sink page body in `app/page.tsx`.

## DataTable

- **Path:** `components/DataTable.tsx`
- **Purpose:** Gradient-tinted interactive data table that animates background fill on cell change.
- **Props:**
  ```ts
  interface TableProps {
    data: string[][];
  }
  ```
- **Theming tokens:** `--theme-focused-foreground-subdued`, `--theme-focused-foreground`
- **CLI primitive:** (React-only) The CLI port story uses `SimpleTable` instead because `SimpleTable`'s column + status contract maps one-to-one onto `formatRow`. `DataTable`'s gradient backgrounds are not part of the CLI surface — do not use it for CLI ports.
- **Used by:** `<DataTable data={Constants.SAMPLE_TABLE_DATA_CHANGE_ME} />` inside the "DATA TABLE" accordion in `app/page.tsx`.

## DatePicker

- **Path:** `components/DatePicker.tsx`
- **Purpose:** Calendar widget with month navigation and day cell selection in a 7-column grid.
- **Props:**
  ```ts
  interface DatePickerProps {
    year?: number;
    month?: number;
  }
  ```
- **Theming tokens:** `--theme-border-subdued`, `--theme-border`, `--theme-focused-foreground`, `--theme-text`, `--theme-line-height-base`
- **CLI primitive:** (React-only) No date grid in the CLI framework yet — a port would render rows of `formatRow` cells.
- **Used by:** `<DatePicker year={2012} month={12} />` inside the "DATE PICKER" accordion in `app/page.tsx`.

## DebugGrid

- **Path:** `components/DebugGrid.tsx`
- **Purpose:** Hidden character-grid overlay for visualizing alignment during layout work.
- **Props:** _(no props)_
- **Theming tokens:** `--theme-border`
- **CLI primitive:** (React-only) The CLI framework already snaps to character columns by definition.
- **Used by:** `<DebugGrid />` rendered above the kitchen sink in `app/page.tsx`.

## DefaultMetaTags

- **Path:** `components/DefaultMetaTags.tsx`
- **Purpose:** Static `<head>` metadata block for viewport, language, and favicon defaults.
- **Props:** _(no props)_
- **Theming tokens:** (none)
- **CLI primitive:** (React-only) HTML metadata has no CLI analogue.
- **Used by:** `app/head.tsx` for the kitchen sink page.

## Dialog

- **Path:** `components/Dialog.tsx`
- **Purpose:** Lightweight modal dialog with a title slot, body slot, and OK/Cancel actions.
- **Props:**
  ```ts
  interface DialogProps {
    title?: React.ReactNode;
    children?: React.ReactNode;
    style?: React.CSSProperties;
    onConfirm?: () => void;
    onCancel?: () => void;
  }
  ```
- **Theming tokens:** `--theme-background`, `--theme-border-subdued`, `--theme-border`, `--theme-text`
- **CLI primitive:** A bordered card plus a `buttonRow(button('ESC','cancel'), button('↵','ok'), innerW)`.
- **Used by:** `<Dialog title="FAREWELL">...</Dialog>` inside the "DIALOG" accordion in `app/page.tsx`.

## Divider

- **Path:** `components/Divider.tsx`
- **Purpose:** Horizontal rule with three styles: single, double, and gradient.
- **Props:**
  ```ts
  interface DividerProps extends React.HTMLAttributes<HTMLSpanElement> {
    children?: React.ReactNode;
    type?: string | any;
    style?: any;
  }
  ```
- **Theming tokens:** `--theme-border`, `--theme-text`, `--theme-line-height-base`, `--font-size`
- **CLI primitive:** A `cardRow` of `'─'` glyphs (or `'═'` for double) at full inner width. The CLI framework has no dedicated divider helper.
- **Used by:** `<Divider type="DOUBLE" />` inside the "DIVIDERS" accordion in `app/page.tsx`.

## DOMSnake

- **Path:** `components/DOMSnake.tsx`
- **Purpose:** DOM-grid Snake mini-game (sibling of `CanvasSnake`) using CSS cells instead of canvas pixels.
- **Props:**
  ```ts
  interface SnakeGameProps {
    width?: number;
    height?: number;
    startSpeed?: number;
  }
  ```
- **Theming tokens:** `--theme-focused-foreground`, `--theme-text`
- **CLI primitive:** (React-only) Animation game.
- **Used by:** `<DOMSnake />` inside the "DOM SNAKE" accordion in `app/page.tsx`.

## Drawer

- **Path:** `components/Drawer.tsx`
- **Purpose:** Collapsible sidebar drawer with a single toggle button and an animated hide/show state.
- **Props:**
  ```ts
  interface DrawerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
    children?: React.ReactNode;
    defaultValue?: boolean;
  }
  ```
- **Theming tokens:** `--theme-background-input`, `--theme-button-foreground`, `--theme-focused-foreground`, `--theme-text`, `--theme-line-height-base`, `--font-size`
- **CLI primitive:** (React-only) The CLI alt-screen is a single window; there is no drawer concept.
- **Used by:** `<Drawer>...</Drawer>` inside the "DRAWER" accordion in `app/page.tsx`.

## DropdownMenu

- **Path:** `components/DropdownMenu.tsx`
- **Purpose:** Floating list of action items with `role="menu"`, arrow-key navigation with focus wrapping, Enter/Space activation, and Escape to dismiss. Each item receives `role="menuitem"`.
- **Props:**
  ```ts
  interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {
    onClose?: (event?: MouseEvent | TouchEvent | KeyboardEvent) => void;
    items?: DropdownMenuItemProps[];
  }
  ```
- **Theming tokens:** `--theme-background-modal-footer`, `--theme-border`, `--theme-line-height-base`, `--font-size`
- **CLI primitive:** Sacred CLI's `createApp({ interactive: { count, onSelect } })` lifecycle plus `cardSelectRow` is the closest equivalent.
- **Used by:** Wired through `DropdownMenuTrigger` inside the "DROPDOWN MENU" accordion in `app/page.tsx`.

## DropdownMenuTrigger

- **Path:** `components/DropdownMenuTrigger.tsx`
- **Purpose:** Wrapper that opens an associated `DropdownMenu` on click or hotkey, dismisses on outside click, and returns focus to the trigger element when the menu closes.
- **Props:**
  ```ts
  interface DropdownMenuTriggerProps {
    children: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
    items: any;
    hotkey?: string;
  }
  ```
- **Theming tokens:** `--z-index-page-dropdown-menus`
- **CLI primitive:** (React-only) Hover/click trigger interaction is browser-specific.
- **Used by:** `<DropdownMenuTrigger items={...}>...</DropdownMenuTrigger>` inside the "DROPDOWN MENU" accordion in `app/page.tsx`.

## Grid

- **Path:** `components/Grid.tsx`
- **Purpose:** Responsive multi-column grid container that wraps its children in a flexible grid track.
- **Props:**
  ```ts
  interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
  }
  ```
- **Theming tokens:** `--theme-line-height-base`, `--font-size`
- **CLI primitive:** Multiple `cardRow(formatRow(...), innerW)` calls — the CLI framework treats every layout as a single column, multiple rows.
- **Used by:** `<Grid>...</Grid>` wraps the navigation strip near the top of `app/page.tsx`.

## HoverComponentTrigger

- **Path:** `components/HoverComponentTrigger.tsx`
- **Purpose:** Wrapper that pops a tooltip or popover on hover/click with auto-positioning and outside-click dismissal.
- **Props:**
  ```ts
  interface HoverComponentTriggerProps {
    children: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
    text: string;
    component: 'popover' | 'tooltip';
  }
  ```
- **Theming tokens:** `--z-index-page-popover`, `--z-index-page-tooltips`
- **CLI primitive:** (React-only) Hover-driven UI is browser-specific.
- **Used by:** `<HoverComponentTrigger text="..." component="tooltip">` inside the "TOOLTIP" accordion in `app/page.tsx`.

## Indent

- **Path:** `components/Indent.tsx`
- **Purpose:** Wrapper that applies a left padding to its children for nested content blocks.
- **Props:**
  ```ts
  interface IndentProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
  }
  ```
- **Theming tokens:** (none)
- **CLI primitive:** Manual `' '.repeat(N)` prefix inside `cardRow`. The CLI framework leaves indentation up to the template.
- **Used by:** `<Indent>...</Indent>` inside the "AVATARS" accordion in `app/page.tsx`.

## Input

- **Path:** `components/Input.tsx`
- **Purpose:** Single-line text input with a custom caret glyph, password masking, and optional label.
- **Props:**
  ```ts
  type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    caretChars?: string | any;
    label?: string | any;
    isBlink?: boolean;
  };
  ```
- **Theming tokens:** `--theme-background-input`, `--theme-background`, `--theme-border`, `--theme-focused-foreground`, `--theme-overlay`, `--theme-text`, `--theme-line-height-base`, `--font-size`
- **CLI primitive:** (React-only) The CLI templates capture keystrokes through `createApp({ onKey })` and compose their own input strings — sacred CLI ships no boxed input primitive.
- **Used by:** `<Input label="MULTIPLE INPUTS" autoComplete="off" isBlink={false} name="input_test_empty" />` inside the "INPUT" accordion in `app/page.tsx`.

## ListItem

- **Path:** `components/ListItem.tsx`
- **Purpose:** Keyboard-focusable list row with Enter / arrow-key navigation between siblings.
- **Props:** _(untyped — accepts standard `<li>` HTML attributes)_
- **Theming tokens:** `--theme-focused-foreground`
- **CLI primitive:** `cardRow` with manual prefix glyphs.
- **Used by:** Inside `Navigation` and `BreadCrumbs` examples in `app/page.tsx`.

## MatrixLoader

- **Path:** `components/MatrixLoader.tsx`
- **Purpose:** Matrix-rain effect rendered via pre/span grid with DOM diffing. Configurable direction and Greek/Katakana glyph mode.
- **Props:**
  ```ts
  interface MatrixLoaderProps {
    rows?: number;
    direction?: undefined | 'top-to-bottom' | 'left-to-right';
    mode?: undefined | 'greek' | 'katakana';
  }
  ```
- **Theming tokens:** `--theme-text`, `--font-size`, `--theme-line-height-base`
- **CLI primitive:** (React-only) Animation surface.
- **Used by:** `<MatrixLoader rows={32} mode="katakana" />` inside the ModalMatrixModes modal triggered from `app/page.tsx`.

## Message

- **Path:** `components/Message.tsx`
- **Purpose:** Chat message bubble (left-tail) for outgoing user messages.
- **Props:** _(untyped — accepts an optional children prop)_
- **Theming tokens:** `--theme-border-subdued`, `--theme-border`, `--theme-line-height-base`, `--font-size`
- **CLI primitive:** A `cardRow` per wrapped line with no special styling.
- **Used by:** `<Message>...</Message>` inside `components/examples/MessagesInterface.tsx`.

## MessageViewer

- **Path:** `components/MessageViewer.tsx`
- **Purpose:** Chat message bubble (right-tail) for incoming messages from another participant.
- **Props:** _(untyped — accepts an optional children prop)_
- **Theming tokens:** `--theme-focused-foreground`, `--theme-line-height-base`, `--font-size`
- **CLI primitive:** Same as `Message` — a `cardRow` per wrapped line.
- **Used by:** `<MessageViewer>...</MessageViewer>` inside `components/examples/MessagesInterface.tsx`.

## ModalStack

- **Path:** `components/ModalStack.tsx`
- **Purpose:** Stacked modal overlay container that manages z-index ordering and backdrop blur.
- **Props:** _(no props)_
- **Theming tokens:** `--z-index-page-modals`
- **CLI primitive:** (React-only) The CLI alt-screen has a single layer.
- **Used by:** Mounted by `Providers` for any `ModalTrigger` in the kitchen sink.

## ModalTrigger

- **Path:** `components/ModalTrigger.tsx`
- **Purpose:** Injects an `onClick` into its child via `React.cloneElement` that opens a modal component, chaining with any existing `onClick` the child already has. Keyboard-accessible because the child's own `onKeyDown` handler (which calls `onClick`) fires the injected callback directly.
- **Props:**
  ```ts
  interface ModalTriggerProps {
    children: React.ReactElement<{ onClick?: React.MouseEventHandler }>;
    modal: React.ComponentType<any>;
    modalProps?: Record<string, any>;
  }
  ```
- **Theming tokens:** (none)
- **CLI primitive:** (React-only) See `ModalStack`.
- **Used by:** `<ModalTrigger modal={ModalCreateAccount}>` inside the "MODAL" accordion in `app/page.tsx`.

## Navigation

- **Path:** `components/Navigation.tsx`
- **Purpose:** Top navigation bar with logo, left/right slot rails, and a center children slot.
- **Props:**
  ```ts
  interface NavigationProps extends React.HTMLAttributes<HTMLElement> {
    children?: React.ReactNode;
    logoHref?: string;
    logoTarget?: React.HTMLAttributeAnchorTarget;
    onClickLogo?: React.MouseEventHandler<HTMLButtonElement>;
    logo?: React.ReactNode;
    left?: React.ReactNode;
    right?: React.ReactNode;
  }
  ```
- **Theming tokens:** `--theme-border`, `--theme-focused-foreground`, `--theme-text`, `--font-size`
- **CLI primitive:** A `buttonRow(left, right, innerW)` plus a leading `cardRow` for the title.
- **Used by:** Top of the kitchen sink in `app/page.tsx` (search for `<Navigation`).

## NumberRangeSlider

- **Path:** `components/NumberRangeSlider.tsx`
- **Purpose:** Range slider with a labeled current value and configurable min/max/step bounds.
- **Props:**
  ```ts
  interface RangerProps {
    defaultValue?: number;
    max?: number;
    min?: number;
    step?: number;
  }
  ```
- **Theming tokens:** `--theme-background`, `--theme-border-subdued`, `--theme-button-foreground`, `--theme-focused-foreground`, `--theme-text`, `--theme-line-height-base`, `--font-size`
- **CLI primitive:** (React-only) Pointer-driven slider — port to a discrete `formatRow` of step labels if you need a CLI version.
- **Used by:** `<NumberRangeSlider defaultValue={50} />` inside the "NUMBER RANGE SLIDER" accordion in `app/page.tsx`.

## Popover

- **Path:** `components/Popover.tsx`
- **Purpose:** Generic floating panel container reused by `DropdownMenu` and `HoverComponentTrigger`.
- **Props:**
  ```ts
  interface PopoverProps extends React.HTMLAttributes<HTMLDivElement> {}
  ```
- **Theming tokens:** `--theme-border-subdued`, `--theme-border`, `--theme-line-height-base`, `--font-size`
- **CLI primitive:** (React-only) See `DropdownMenu`.
- **Used by:** Mounted by `HoverComponentTrigger` in the "POPOVER" accordion in `app/page.tsx`.

## Providers

- **Path:** `components/Providers.tsx`
- **Purpose:** Top-level context provider wrapping the app in `HotkeysProvider` and `ModalProvider`.
- **Props:**
  ```ts
  interface ProvidersProps {
    children: React.ReactNode;
  }
  ```
- **Theming tokens:** (none)
- **CLI primitive:** (React-only) Sacred CLI is a single process; there is no provider tree.
- **Used by:** `app/layout.tsx`.

## RadioButton

- **Path:** `components/RadioButton.tsx`
- **Purpose:** Custom-styled radio input with click + arrow-key selection inside a `RadioButtonGroup`.
- **Props:**
  ```ts
  interface RadioButtonProps {
    style?: React.CSSProperties;
    name: string;
    value: string;
    selected?: boolean;
    onSelect?: (value: string) => void;
    children?: React.ReactNode;
  }
  ```
- **Theming tokens:** `--theme-background`, `--theme-border-subdued`, `--theme-button-background`, `--theme-button-foreground`, `--theme-focused-foreground`, `--theme-text`, `--theme-line-height-base`, `--font-size`
- **CLI primitive:** `cardSelectRow(content, innerW, isSelected)` driven by `createApp({ interactive: { count, onSelect } })`.
- **Used by:** Inside `RadioButtonGroup` in the "RADIO BUTTON" accordion in `app/page.tsx`.

## RadioButtonGroup

- **Path:** `components/RadioButtonGroup.tsx`
- **Purpose:** Container that owns the selected value across a list of `RadioButton` siblings.
- **Props:**
  ```ts
  interface RadioButtonGroupProps {
    options: { value: string; label: string }[];
    defaultValue?: string;
  }
  ```
- **Theming tokens:** (none)
- **CLI primitive:** Same as `RadioButton` — `createApp` with `interactive: { count, onSelect, persist: true }`.
- **Used by:** `<RadioButtonGroup options={[...]} defaultValue="..." />` in the "RADIO BUTTON" accordion in `app/page.tsx`.

## Row

- **Path:** `components/Row.tsx`
- **Purpose:** Block-level row container with focus styling.
- **Props:**
  ```ts
  type RowProps = React.HTMLAttributes<HTMLElement> & {
    children?: React.ReactNode;
  };
  ```
- **Theming tokens:** `--theme-focused-foreground`
- **CLI primitive:** A single `cardRow(content, innerW)`.
- **Used by:** `<Row>...</Row>` near the top of `app/page.tsx`.

## RowEllipsis

- **Path:** `components/RowEllipsis.tsx`
- **Purpose:** Row container with `text-overflow: ellipsis` for single-line truncation.
- **Props:**
  ```ts
  type RowEllipsisProps = React.HTMLAttributes<HTMLElement> & {
    children?: React.ReactNode;
  };
  ```
- **Theming tokens:** `--theme-focused-foreground`
- **CLI primitive:** `truncateVisible(line, innerW)` from `scripts/cli/lib/ansi.js`.
- **Used by:** `<RowEllipsis>...</RowEllipsis>` inside list-item rows in `app/page.tsx`.

## RowSpaceBetween

- **Path:** `components/RowSpaceBetween.tsx`
- **Purpose:** Flexbox row that pushes its first and last child to opposite ends.
- **Props:**
  ```ts
  type RowSpaceBetweenProps = React.HTMLAttributes<HTMLElement> & {
    children?: React.ReactNode;
  };
  ```
- **Theming tokens:** `--theme-focused-foreground`
- **CLI primitive:** `buttonRow(left, right, innerW)` in `scripts/cli/lib/button.js`.
- **Used by:** `<RowSpaceBetween><span><ActionButton hotkey="ESC">EXIT</ActionButton></span><span><ActionButton hotkey="↵">SELECT</ActionButton></span></RowSpaceBetween>` in `components/examples/CLITemplate.tsx`, with the same shape repeated in `components/examples/InvoiceTemplate.tsx` (ESC EXIT / ↵ SUBMIT) and `components/examples/ResultsList.tsx` (ESC EXIT / ← PREV → NEXT).

## Select

- **Path:** `components/Select.tsx`
- **Purpose:** Custom dropdown select with keyboard navigation and styled option list.
- **Props:**
  ```ts
  interface SelectProps {
    name: string;
    options: string[];
    placeholder?: string;
    defaultValue?: string;
    onChange?: (selectedValue: string) => void;
  }
  ```
- **Theming tokens:** `--theme-background`, `--theme-border-subdued`, `--theme-border`, `--theme-button-foreground`, `--theme-focused-foreground`, `--theme-text`, `--theme-line-height-base`, `--font-family-mono`, `--font-size`, `--z-index-page-select`
- **CLI primitive:** `createApp({ interactive: { count, onSelect } })` plus `cardSelectRow`.
- **Used by:** `<Select name="select_test" options={[...]} />` inside the "SELECT" accordion in `app/page.tsx`.

## SidebarLayout

- **Path:** `components/SidebarLayout.tsx`
- **Purpose:** Two-column layout with a draggable sidebar handle and optional reversed column order.
- **Props:**
  ```ts
  interface SidebarLayoutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
    children?: React.ReactNode;
    sidebar?: React.ReactNode;
    defaultSidebarWidth?: number;
    isShowingHandle?: boolean;
    isReversed?: boolean;
  }
  ```
- **Theming tokens:** `--theme-focused-foreground`, `--theme-text`
- **CLI primitive:** (React-only) The CLI uses a single full-width window — there is no resizable sidebar.
- **Used by:** `<SidebarLayout sidebar={...}>...</SidebarLayout>` inside the "SIDEBAR LAYOUT" accordion in `app/page.tsx`.

## SimpleTable

- **Path:** `components/SimpleTable.tsx`
- **Purpose:** Fluid HTML table that mirrors the CLI framework's `formatRow` + `cardHeaderRow` contract one-to-one. First row is the header. Status coloring fires on `ACTIVE`/`OPEN`/`APPROVED` (bold green) and `CLOSED`/`PAID`/`SUSPENDED` (gray). Use this table — not `DataTable` — for any CLI port surface. The table is wrapped in a `scrollWrapper` div with `overflow-x: auto` so it scrolls horizontally inside its container on narrow viewports instead of forcing page-level scroll.
- **Props:**
  ```ts
  interface SimpleTableProps {
    data: string[][];
    align?: ('left' | 'right')[];
  }
  ```
- **Theming tokens:** `--ansi-10-lime`, `--ansi-240-gray-35`, `--ansi-248-gray-66`, `--color-white`
- **CLI primitive:** `cardHeaderRow(formatRow(TH, COL_SPEC, innerW), innerW)` for the header plus `cardRow(formatRow(row, COL_SPEC, innerW), innerW)` for each body row. The status set is the contract — `ACTIVE`/`OPEN`/`APPROVED` and `CLOSED`/`PAID`/`SUSPENDED`.
- **Used by:** `<SimpleTable data={PRIMITIVES} />` in `components/examples/CLITemplate.tsx`, `<SimpleTable data={LINE_ITEMS} align={LINE_ITEM_ALIGN} />` in `components/examples/InvoiceTemplate.tsx`, `<SimpleTable data={RESULTS} />` in `components/examples/ResultsList.tsx`.

## Table

- **Path:** `components/Table.tsx`
- **Purpose:** Semantic `<table>` wrapper that renders a `<tbody>` shell for sacred-styled tables.
- **Props:**
  ```ts
  type TableProps = React.HTMLAttributes<HTMLElement> & {
    children?: React.ReactNode;
  };
  ```
- **Theming tokens:** (none)
- **CLI primitive:** A column of `cardRow(formatRow(...))` calls — there is no separate `<table>` analogue in the CLI.
- **Used by:** `<Table>...</Table>` inside the navigation strip in `app/page.tsx`.

## TableColumn

- **Path:** `components/TableColumn.tsx`
- **Purpose:** Semantic `<td>` wrapper used inside `Table`/`TableRow`.
- **Props:**
  ```ts
  type TableColumnProps = React.HTMLAttributes<HTMLTableCellElement> & {
    children?: React.ReactNode;
  };
  ```
- **Theming tokens:** `--font-size`
- **CLI primitive:** A single cell inside `formatRow`.
- **Used by:** Inside `<TableRow>` in the navigation strip in `app/page.tsx`.

## TableRow

- **Path:** `components/TableRow.tsx`
- **Purpose:** Semantic `<tr>` wrapper with focus styling for keyboard navigation.
- **Props:**
  ```ts
  type TableRowProps = React.HTMLAttributes<HTMLElement> & {
    children?: React.ReactNode;
  };
  ```
- **Theming tokens:** `--theme-focused-foreground`
- **CLI primitive:** A single row inside `formatRow`.
- **Used by:** `<TableRow>...</TableRow>` inside `<Table>` in the navigation strip in `app/page.tsx`.

## Text

- **Path:** `components/Text.tsx`
- **Purpose:** Semantic `<p>` paragraph wrapper for body copy.
- **Props:**
  ```ts
  interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
    children?: React.ReactNode;
  }
  ```
- **Theming tokens:** (none)
- **CLI primitive:** `wordWrap(text, contentW)` in `scripts/cli/lib/card.js`, fed into a sequence of `cardRow` calls.
- **Used by:** `<Text>...</Text>` inside the navigation strip in `app/page.tsx`.

## TextArea

- **Path:** `components/TextArea.tsx`
- **Purpose:** Multi-line text input with auto-resizing height, custom caret, and an optional autoplay typewriter mode.
- **Props:**
  ```ts
  type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    autoPlay?: string;
    autoPlaySpeedMS?: number;
    isBlink?: boolean;
  };
  ```
- **Theming tokens:** `--theme-focused-foreground`, `--theme-text`, `--theme-line-height-base`, `--font-size`
- **CLI primitive:** (React-only) The CLI captures keystrokes through `createApp({ onKey })`.
- **Used by:** `<TextArea autoPlay="..." />` inside the "TEXT AREA" accordion in `app/page.tsx`.

## Tooltip

- **Path:** `components/Tooltip.tsx`
- **Purpose:** Generic short-text tooltip container, mounted by `HoverComponentTrigger`.
- **Props:**
  ```ts
  interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {}
  ```
- **Theming tokens:** `--theme-border-subdued`, `--theme-border`
- **CLI primitive:** (React-only) Hover-driven UI is browser-specific.
- **Used by:** Mounted via `<HoverComponentTrigger component="tooltip">` in the "TOOLTIP" accordion in `app/page.tsx`.

## TreeView

- **Path:** `components/TreeView.tsx`
- **Purpose:** Hierarchical file/folder tree with expand/collapse toggles and Unicode branch glyphs.
- **Props:**
  ```ts
  interface TreeViewProps {
    children?: React.ReactNode;
    defaultValue?: boolean;
    depth?: number;
    isFile?: boolean;
    isLastChild?: boolean;
    isRoot?: boolean;
    parentLines?: boolean[];
    style?: any;
    title: string;
  }
  ```
- **Theming tokens:** `--theme-focused-foreground`
- **CLI primitive:** A sequence of `cardRow` calls with manually composed `'├──'` / `'└──'` glyphs.
- **Used by:** `<TreeView title="root">...</TreeView>` inside the "TREE VIEW" accordion in `app/page.tsx`.

## Window

- **Path:** `components/Window.tsx`
- **Purpose:** Terminal-window frame for sacred React surfaces — slight off-background body fill plus a `1ch` right + 1-row bottom drop shadow (intentionally a step darker than the body so the panel reads as "lifted") that mirrors Simulacrum's window primitive. Uses a responsive `min-width: min(24ch, 100%)` so the window shrinks gracefully on narrow viewports (320px and up) without forcing horizontal scroll.
- **Props:**
  ```ts
  type WindowProps = React.HTMLAttributes<HTMLElement> & {
    children?: React.ReactNode;
  };
  ```
- **Theming tokens:** `--theme-window-background`, `--theme-window-shadow`, `--theme-line-height-base`
- **CLI primitive:** `getInnerWidth(termW)` + `wrapLine` / `wrapLineTop` / `shadowBottomRow` in `scripts/cli/lib/window.js`. Wrapping a CLI-port React surface in `<Window>` is the React-side equivalent of running the screen inside the Simulacrum alt-screen window frame.
- **Used by:** `<Window>...</Window>` wraps the cards + button row in `components/examples/CLITemplate.tsx`, `components/examples/InvoiceTemplate.tsx`, `components/examples/ResultsList.tsx`, `components/examples/AS400.tsx`, `components/examples/Denabase.tsx`, `components/examples/DashboardRadar.tsx`, and `components/examples/MessagesInterface.tsx`, plus the standalone "WINDOW" accordion in `app/page.tsx`.
- **Drop shadow spacing:** Window's bottom drop shadow (1 row) extends below the component's bounding box. When a Window-wrapped component sits inside an Accordion or any container that clips or collapses whitespace, add a double `<br />` after the component so the shadow has room to render. Single `<br />` clips the shadow.
