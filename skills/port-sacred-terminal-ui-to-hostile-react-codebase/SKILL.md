# Skill: Port Sacred Terminal UI to a Hostile React Codebase

> Also available at https://sacred.computer/llm/skills/port-sacred-terminal-ui-to-hostile-react-codebase/SKILL.md

Take a sacred React component (or a sacred screen that mirrors a Simulacrum CLI surface) and graft it into a foreign React codebase that already ships its own design system, build pipeline, and CSS toolchain — without breaking the host or polluting it with sacred-specific globals.

> See `components/AGENTS.md` for the canonical catalog of every sacred React component (props, theming tokens, CLI primitive equivalent). Read it to know which sacred component you are about to graft into the host.

## When to use

Use this skill when the target repository:

- Already has its own CSS reset, theme tokens, or design system (Tailwind, MUI, Chakra, ShadCN, custom)
- Uses a build tool that conflicts with sacred's CSS Modules (`vite`, `webpack`, `rollup`, `parcel`, `metro`)
- Refuses to take sacred's `global.css` as-is because it would clobber the host's typography, color tokens, or layout primitives
- Has a hostile lint config (`no-default-export`, `no-css-modules`, `no-unused-vars` on `style` props, etc.)

If you control both repos and the host has no design system, prefer `port-sacred-terminal-ui-to-react-using-same-conventions` instead — it gives you the full sacred theming for free.

## Core principle

**Isolate, don't inherit.** Sacred's terminal aesthetic must be opt-in inside one container element, not bleed into the host. You will:

1. Scope every CSS rule under a single container class.
2. Inline the ANSI palette as CSS custom properties on that container.
3. Replace sacred's CSS Modules with whatever the host supports (CSS Modules, Tailwind, vanilla-extract, etc.).
4. Keep the React component file's structure identical so future updates from sacred can be diffed cleanly.

## Step-by-step

### 1. Pick a single root class name

Every sacred selector must live under one root. Pick a host-friendly name:

```tsx
<div className="sacred-root theme-dark tint-yellow">
  <Card title="STATUS">...</Card>
</div>
```

### 2. Inline the palette

Copy the relevant `--ansi-*`, `--color-*`, and `--theme-*` tokens from `global.css` into a host-controlled CSS file scoped to `.sacred-root`:

```css
.sacred-root {
  /* NOTE(@YOUR_GITHUB_USERNAME): Pinned ANSI palette — do not inherit host theme tokens. */
  --color-black: #000000;
  --color-white: #ffffff;
  --color-brand: #e4f221;
  --theme-background: var(--color-black);
  --theme-text: var(--color-white);
  --theme-border: #3a3a3a;
  /* ... */

  background: var(--theme-background);
  color: var(--theme-text);
  font-family: 'GeistMono-Regular', Consolas, monospace;
  font-variant-numeric: tabular-nums lining-nums;
}
```

Sacred's tints (`tint-green`, `tint-blue`, etc.) work the same way — copy the OKLCH math from `global.css` and scope it under `.sacred-root.theme-dark.tint-green`.

### 3. Translate CSS Modules

Sacred uses `Foo.module.css`. If the host blocks CSS Modules, translate the rules into the host's equivalent:

| Host system | Translation strategy |
| --- | --- |
| Tailwind | Map each `--theme-*` token to a Tailwind theme extension, then use `bg-[var(--theme-background)]` etc. |
| vanilla-extract | Copy each `.foo` rule into a `style({ ... })` block |
| Stitches/Emotion/styled-components | Wrap the CSS in `styled.div\`...\`` blocks |
| Plain CSS | Inline the CSS Modules content into a single scoped stylesheet |

In every case, every selector must start with `.sacred-root` so the host's other components are unaffected.

### 4. Eject sacred dependencies

Sacred React components import from `@components/...` via `tsconfig.json` paths. The host won't have that alias. Either:

- Add the alias to the host's `tsconfig.json` (cleanest), or
- Rewrite `@components/Card` to a relative path inside the host's `src/`

Sacred avoids runtime dependencies, so there is nothing else to port — no React Query, no Redux, no animation libraries.

### 5. Avoid global side effects

Sacred's `global.css` resets `box-sizing`, margins, padding, and list styles for every element. **Do not** import `global.css` into the host. Re-create only the rules you need under the `.sacred-root` selector. The host's reset stays untouched.

### 6. Confirm theming

Wrap your sacred container in a host-managed theme switcher and verify:

```tsx
<div className={`sacred-root theme-${theme} tint-${tint}`}>
  <Card title="STATUS">...</Card>
</div>
```

If the host already has dark mode, you have two options:

- **Mirror** the host's dark mode by deriving `theme-dark` from the host theme context
- **Independent** sacred theming via its own state — recommended when the sacred surface is a "console" or "debugger" overlay

## Don'ts

- **Do not** import `global.css` into the host. It breaks `body`, `ul`, `ol`, and many other elements.
- **Do not** re-export sacred's `Button`, `Input`, or other primitives with the same name as a host primitive — you will collide. Prefix them: `SacredButton`, `SacredInput`.
- **Do not** ship `scripts/cli/lib/*` into the React bundle. It is Node-only and uses `process.stdout`.
- **Do not** rewrite sacred components to consume host theme tokens. The whole point of this skill is to keep sacred isolated so future sacred releases drop in cleanly.

## Smoke test

1. Render your sacred-rooted component in the host app.
2. Switch the host's theme and confirm sacred does not change (or does change, intentionally, if you wired it).
3. Inspect the host's other components and confirm none of them have new margin/padding/font-family from sacred's reset.
4. Run `git diff` against the previous host build and confirm no host CSS rule changed.

## Reference: minimum sacred surface

A useful "first port" is the `Card` + `DataTable` + `Button` triple. That gives you:

- Box-drawing borders
- Header/data row alignment with status coloring
- Hotkey + label button row

That's enough for a status console, an audit log, or a debugger overlay. Add more sacred primitives (`BarLoader`, `BarProgress`, `Block`, `Text`) one at a time, scoping each new selector under `.sacred-root`.
