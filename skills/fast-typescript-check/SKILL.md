---
name: fast-typescript-check
description: Keep www-sacred's TypeScript fast to type-check and fast to run. Use when touching the ASCII/canvas animation components (the only real per-frame code here), tightening type-check wall-clock, or auditing a change for runtime or compiler regressions. Scoped to this repo — a React 19 / Next.js 16 component library plus the zero-dependency Simulacrum CLI framework.
---

# fast-typescript-check

A performance discipline for `www-sacred`. Every rule here is justified against this codebase: either fewer CPU cycles in the components that actually run a render loop, or faster `tsc --noEmit`. Nothing is cosmetic, and nothing references machinery this repo does not have.

## What runs hot here

This is not a game engine. There is no THREE.js, no physics, no 60fps simulation of a world. The only per-frame code is the ASCII/canvas animation family, all driven by `requestAnimationFrame`:

- `components/ASCIICanvas.tsx` — animated ASCII art in a `<pre>` of per-cell `<span>` elements
- `components/MatrixLoader.tsx` — falling-glyph matrix effect
- `components/CanvasSnake.tsx`, `components/DOMSnake.tsx`, `components/CanvasPlatformer.tsx` — interactive games
- `components/examples/OneLineLoaders.tsx`, `components/BarLoader.tsx`, `components/BlockLoader.tsx`, `components/BarProgress.tsx` — spinners

`components/ASCIICanvas.tsx` is the reference implementation. It already follows most of Part 1: a pre-allocated span grid, DOM diffing against `previousCharsRef` / `previousColorsRef`, refs cached into locals before the loop, an indexed `for`, guarded property writes, and an `IntersectionObserver` that stops the loop when the element scrolls off-screen. When you write or review an animation component, hold it against that file.

Everything else in the repo — the static React components, the Simulacrum CLI framework under `scripts/cli/lib/*`, the Python mirror — runs once per interaction, not per frame. Part 1 does not apply there; Part 2 (compiler) does.

## Conventions

These match what the repo already does. Follow them; do not invent new ones.

- Comments use `//NOTE(jimmylee):` (no space after `//`, no `@`) in TS/JS, `# NOTE(jimmylee):` in Python. Comment the _why_, never the _what_. If the code reads clearly, delete the comment. Spell names out — `candidateCount`, not `cnt`; `previousColors`, not `pc`. A clear name removes the need for a comment.
- This repo does **not** use a `__private` prefix. Module-private state is plain `const`; React-internal state is refs. Don't introduce a naming scheme the rest of the codebase doesn't share.
- The Simulacrum framework is zero-dependency TypeScript, run via `tsx` with no build step. Do not import that Node-only code (it uses `process.stdout`) from React.

## Profiling before optimizing

Find the bottleneck first. For the animation components:

1. Open DevTools → Performance, record while an `ASCIICanvas` / `MatrixLoader` is on screen for ~5s, stop.
2. Read the flame chart — the widest bars per frame are the cost. Sort Bottom-Up by Self Time.
3. If Scripting dominates, the `animate()` callback or the diff loop is the target. If Rendering/Painting dominates, the cost is DOM mutation (too many `<span>` writes per frame) — tighten the diff, not the math.

`performance.mark` / `performance.measure` isolate a section without DevTools overhead:

```typescript
performance.mark('asciiFrameStart');
//NOTE(jimmylee): the per-cell diff loop
performance.mark('asciiFrameEnd');
performance.measure('asciiFrame', 'asciiFrameStart', 'asciiFrameEnd');
```

Remove the marks after profiling — they are diagnostic instrumentation (see 1.9). At 60fps a frame is 16.67ms and the browser needs ~4ms for compositing, leaving ~12ms for JavaScript. A single `ASCIICanvas` fills a grid of `cols * rows` cells every frame; if that loop owns most of the budget, the win is in the diff, not the wave math.

## Part 1 — Runtime performance (animation components only)

Every rule applies to code inside a `requestAnimationFrame` loop. Outside the animation family, prioritize readability.

### 1.1 Cache refs and property chains before the loop

`ASCIICanvas` reads its refs once per frame into locals, then loops:

```typescript
const cols = colsRef.current;
const grid = gridRef.current;
const previousChars = previousCharsRef.current;
const previousColors = previousColorsRef.current;

for (let index = 0; index < total && index < grid.length; index++) {
  // ...reads previousChars[index], writes grid[index]
}
```

`ref.current` is a property access; inside a loop over hundreds of cells it is a repeated lookup that hoists trivially. Cache anything read more than once in a loop body.

### 1.2 Diff before you touch the DOM

The single biggest cost in a DOM-rendered animation is writing to the DOM. `ASCIICanvas` only mutates a `<span>` when its content actually changed:

```typescript
if (cell.char !== previousChars[index]) {
  span.textContent = cell.char;
  previousChars[index] = cell.char;
}
if (cell.color !== previousColors[index]) {
  span.style.color = cell.color;
  previousColors[index] = cell.color;
}
```

An unguarded `span.textContent = cell.char` every frame forces layout work even when the value is identical. The diff turns a full-grid repaint into only the cells that moved. Never write a DOM property unconditionally in a frame loop.

### 1.3 Indexed for-loops, no per-frame closures

Use an indexed `for`. Do not call `map` / `filter` / `forEach` / `sort` in a frame loop — each takes a fresh closure allocated every frame, which is pure GC pressure. `for...of` invokes the iterator protocol and deoptimizes in polymorphic call sites; keep it to lifecycle code (`build`, cleanup, one-shot queries).

```typescript
//NOTE(jimmylee): allocates a comparator object every frame — avoid in rAF
cells.sort((a, b) => a.depth - b.depth);
```

If a sort is genuinely needed per frame, confirm it can't be hoisted behind a change check first.

### 1.4 Pre-allocate; never allocate inside the frame loop

`ASCIICanvas` builds its span grid once in `buildGrid(cols)` and only rebuilds when the column count changes. Each frame reuses the existing spans and the existing `previousChars` / `previousColors` arrays. Allocation inside a frame loop creates GC pressure, and a single GC pause is a visible frame skip. Allocate buffers at setup, index into them each frame.

### 1.5 Guard the whole loop, not each iteration

When the component has nothing to do, skip the frame entirely. `ASCIICanvas` returns early when off-screen and never schedules the next frame:

```typescript
const loop = () => {
  if (!visibleRef.current || cancelled) return;
  // ...
  frameRef.current = requestAnimationFrame(loop);
};
```

Pair this with an `IntersectionObserver` so a loader scrolled out of view costs zero CPU. This is the highest-leverage optimization in the repo: a page with several `ASCIICanvas` instances would otherwise run every one of them forever.

### 1.6 Bitwise floor for positive grid math

`Math.floor(x)` is a call; `x | 0` truncates in one instruction. Safe only for positive values inside 32-bit signed range — exactly the case for grid column/row indexing.

```typescript
const column = index % cols;
const row = (index - column) / cols;
```

`ASCIICanvas` derives `row` by exact integer division (the subtraction guarantees divisibility), which avoids `Math.floor` entirely. Where you do need a floor on a known-positive value, `| 0` is the cheaper form.

### 1.7 Keep numbers in one type lane

V8 represents small integers (Smis) differently from boxed doubles. A counter that starts at `0` and later receives a float forces a representation change. In the wave math (`Math.sin`, `Math.cos`), values are doubles throughout — keep them that way and keep loop indices integer throughout. Don't mix `Math.random()` or division results into an integer accumulator inside a hot loop.

### 1.8 Guard property writes that trigger work

Setting `style.color` or `textContent` schedules style/layout work even when the value is unchanged (see 1.2). The same applies to any setter with side effects. Guard the write behind a difference check.

### 1.9 Strip diagnostic instrumentation from the frame path

`performance.now()` is fine once per frame (`ASCIICanvas` reads it for the time base). `console.log`, `JSON.stringify`, and extra `performance.now()` calls for profiling are not — at 60fps they are real cost. Gate them behind a debug flag or remove them after measuring.

### 1.10 Prefer `as const` objects over enums; ES modules over namespaces

Enums compile to runtime IIFEs with reverse-mapping tables; namespaces compile to IIFEs that block tree-shaking. `as const` objects produce zero runtime code and inline cleanly. This repo has **no** enums and **no** namespaces today — keep it that way. `const enum` is doubly wrong here because `isolatedModules: true` (set in `tsconfig.json`) cannot inline it across files.

```typescript
const DIRECTION = { Up: 'UP', Down: 'DOWN', Left: 'LEFT', Right: 'RIGHT' } as const;
type Direction = (typeof DIRECTION)[keyof typeof DIRECTION];
```

## Part 2 — Compiler performance

These reduce `tsc --noEmit` wall-clock and editor responsiveness. They apply across the whole repo, not just the animation family.

### 2.1 Add explicit return types on exported functions

Inferred return types on exports can balloon into anonymous types with `import("./path").Type` chains that slow editor responsiveness and incremental rebuilds. A named return type is compact.

```typescript
//NOTE(jimmylee): compiler infers a wide anonymous type
export function createState() {
  return { x: computeX(), y: computeY() };
}

export function createState(): EngineState {
  return { x: computeX(), y: computeY() };
}
```

### 2.2 Prefer `interface extends` over `&` intersections at boundaries

Interfaces produce a single cached flat type; intersections re-merge on every use and detect no conflicts. Use `interface extends` for types that cross module boundaries. Interior types used once don't matter.

### 2.3 Keep union types small

Union deduplication is pairwise (quadratic). Past ~12 members, refactor to a base type with a discriminant field instead of a wide `A | B | C | ...` union.

### 2.4 Limit recursive generic nesting

Deeply nested recursive generics (`DeepPartial<T>` style) are a common cause of slow checks — each level multiplies instantiations. Keep recursion to ≤3 levels; for known shapes, write the concrete type. This repo has no such generics today; don't add one without measuring.

### 2.5 `import type` for type-only imports

`import type` is erased at runtime, shrinking the module graph the bundler walks and heading off circular-import emit problems.

```typescript
import type { ASCIIAnimationFn } from '@components/ascii/utilities';
```

Note: this repo does **not** set `verbatimModuleSyntax`, so the compiler will not force this on you — it is a discipline, not an enforced error. Apply it to type-only imports anyway.

### 2.6 The real tsconfig.json

These are the settings actually in `tsconfig.json` and why they matter. Do not document settings the file doesn't have.

```jsonc
{
  "compilerOptions": {
    "paths": { "@root/*": ["./*"], "@common/*": ["./common/*"], "@components/*": ["./components/*"], "@modules/*": ["./modules/*"] },
    "target": "es2017",              // Next.js/SWC does the real downlevel; tsc target only affects lib surface
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,                 // kept for compatibility; the Simulacrum framework is now .ts
    "skipLibCheck": true,            // skips .d.ts checking — the largest single tsc speedup
    "strict": false,                 // only strictNullChecks is on (see below)
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,                  // tsc is a checker only; Next.js/SWC emits
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",   // matches the bundler's resolution — correctness, not speed
    "resolveJsonModule": true,       // lets TypeScript import colors.json as a typed module
    "isolatedModules": true,         // every file transpiles independently (Next/SWC); blocks const enum
    "jsx": "react-jsx",
    "incremental": true,             // writes tsconfig.tsbuildinfo, skips unchanged files
    "plugins": [{ "name": "next" }],
    "strictNullChecks": true
  },
  "exclude": ["node_modules", "**/*.spec.ts"],
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", ".next/dev/types/**/*.ts"]
}
```

Notes that matter when editing this file:

- `strict` is **off**; only `strictNullChecks` is enabled. Turning on full `strict` would be a large, separate diff (many components are loosely typed on purpose — see `components/AGENTS.md`). Don't flip it as a side effect.
- The `paths` map lists only the four live aliases: `@root/*`, `@common/*`, `@components/*`, `@modules/*`. Dead aliases (`@system`, `@demos`, `@data`, `@pages`) were removed.
- `exclude` lists `node_modules` (not the `**/node_modules` glob). TypeScript excludes `node_modules` by default, and once any `exclude` entry exists you must keep an explicit `node_modules` entry or the compiler crawls every package — which this file does.
- There are no project references and no `verbatimModuleSyntax` / `types: []` / `moduleDetection`. The repo is small enough that none of these earn their complexity yet; revisit only if `time npx tsc --noEmit` climbs past ~30s.

**Resolved:** `baseUrl` was dropped (modern resolution maps `paths` from the config file's own location) and `target` was raised from `es5` to `es2017`. `tsc --noEmit` exits 0 with no deprecation diagnostics under TypeScript 6.x.

### 2.7 Compiler diagnostic commands

Run before and after any change that touches types broadly.

| Command | What it tells you |
| --- | --- |
| `npx tsc --noEmit --extendedDiagnostics` | Files, Bind, Check, Emit times. High Check time = type complexity. |
| `time npx tsc --noEmit` | Wall-clock budget check. Should stay well under 30s for this repo. |
| `npx tsc --noEmit --generateTrace ./trace` then `npx @typescript/analyze-trace ./trace` | Slowest files and most expensive type instantiations. |
| `npx tsc --explainFiles \| grep node_modules` | Surfaces packages pulled in that shouldn't be. |

## Part 3 — Horizon: the native TypeScript compiler

Microsoft is porting `tsc` to Go (shipping as TypeScript 7.0), with ~10x type-check speedups reported on large codebases. It does not change language semantics — every rule above applies equally to both compilers. The native port makes checking faster; it does not make a quadratic union cheaper to evaluate. Available now as `@typescript/native-preview`. This repo type-checks in seconds today, so the win here is editor latency, not CI.

## Sources

In order of authority; higher-ranked sources win on conflict.

1. **Microsoft TypeScript Performance Wiki** — https://github.com/microsoft/TypeScript/wiki/Performance — tsconfig settings, type-system complexity, diagnostics.
2. **TypeScript Native Port announcement** — https://devblogs.microsoft.com/typescript/typescript-native-port/ — the 10x figures.
3. **Vyacheslav Egorov, "What's up with monomorphism?"** — https://mrale.ph/blog/2015/01/11/whats-up-with-monomorphism.html — V8 inline caches and hidden-class transitions.
4. **V8 Blog — TurboFan JIT** — https://v8.dev/blog/turbofan-jit — the optimizing compiler.

A note on `moduleResolution: "bundler"`: blogs sometimes list it as a speed setting. The TS wiki does not — resolution mode affects which files are found, not how fast they check. It is the correct setting here because it matches the bundler, not because it is faster.

## Audit checklist

**Runtime — only for code inside a `requestAnimationFrame` loop:**

- [ ] Refs / property chains read more than once are cached in a local before the loop
- [ ] DOM writes (`textContent`, `style.*`) are guarded by a difference check — diff, don't repaint
- [ ] No `new` allocations and no closures (`map`/`filter`/`sort` callbacks) inside the loop
- [ ] Buffers (span grid, previous-value arrays) are pre-allocated and reused, rebuilt only on resize
- [ ] The loop early-returns when off-screen / cancelled, gated by an `IntersectionObserver`
- [ ] Numeric variables stay in one lane (integer indices, double math)
- [ ] No `console.log` / extra `performance.now()` left in the frame path

**Compiler — whole repo:**

- [ ] Exported functions that return complex objects have explicit return types
- [ ] Boundary object types use `interface extends`, not `&`
- [ ] Unions stay under ~12 members
- [ ] Type-only imports use `import type`
- [ ] No `enum`, no `namespace`, no `const enum`
- [ ] tsconfig edits keep an explicit `node_modules` in `exclude` and don't silently flip `strict`

**Naming:**

- [ ] Names are spelled out (`previousColors`, not `pc`)
- [ ] Comments are `//NOTE(jimmylee):` / `# NOTE(jimmylee):`, explain _why_, and aren't restating the code
- [ ] No `__private` prefix introduced — it isn't a convention in this repo
