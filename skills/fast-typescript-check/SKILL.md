---
name: fast-typescript-check
description: Keep www-sacred's TypeScript fast to type-check and fast to run. Use when touching the ASCII/canvas animation components (the only real per-frame code here), tightening type-check wall-clock, or auditing a change for runtime or compiler regressions. Scoped to this repo — a React 19 / Next.js 16 component library plus the zero-dependency Simulacrum CLI framework.
---

# fast-typescript-check

A performance review guide for `www-sacred`. Use the source examples to locate work, then measure before changing an implementation. These techniques are candidates for investigation, not measured speedup guarantees.

## What runs hot here

Inspect each component's clock before changing animation behavior. The animation family uses both `requestAnimationFrame` and intervals:

- `components/ASCIICanvas.tsx` — animated ASCII art in a `<pre>` of per-cell `<span>` elements
- `components/MatrixLoader.tsx` — falling-glyph matrix effect
- `components/CanvasSnake.tsx`, `components/CanvasPlatformer.tsx` — interactive games using animation frames
- `components/DOMSnake.tsx` — movement driven by an interval
- `components/examples/OneLineLoaders.tsx`, `components/BlockLoader.tsx` — interval-driven spinners
- `components/BarLoader.tsx`, `components/BarProgress.tsx` — controlled progress or interval-driven demo progress; `BarProgress` also uses an animation frame for a measurement retry

`components/ASCIICanvas.tsx` is the reference implementation. It already follows most of Part 1: a pre-allocated span grid, DOM diffing against `previousCharsRef` / `previousColorsRef`, refs cached into locals before the loop, an indexed `for`, guarded property writes, and an `IntersectionObserver` that stops the loop when the element scrolls off-screen. When you write or review an animation component, hold it against that file.

Other components may also own timers or effects; inspect their setup and cleanup before drawing performance conclusions. The Simulacrum CLI framework under `scripts/cli/lib/*` and its Python mirror have no animation loop. Part 2 applies to TypeScript checking, not Python execution.

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

Remove the marks after profiling — they are diagnostic instrumentation (see 1.9). At 60fps the total frame interval is about 16.67ms; the time available to JavaScript depends on rendering and other work. Measure the cell calculation, DOM mutation, and browser rendering separately before choosing an optimization.

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

`ASCIICanvas` avoids redundant DOM writes by mutating a `<span>` only when its content or color changed:

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

Guarding repeated writes can reduce mutation work. Whether a particular write causes style calculation, layout, or repaint depends on the property, value, browser, and surrounding code; establish the cost with a trace.

### 1.3 Indexed for-loops, no per-frame closures

The reference cell loop uses an indexed `for`. Check allocation profiles before replacing other loop forms. Inline callbacks and intermediate arrays can add work, but callback reuse and engine optimization affect the result; iterator syntax alone does not prove a performance problem.

```typescript
//NOTE(jimmylee): allocates a comparator object every frame — avoid in rAF
cells.sort((a, b) => a.depth - b.depth);
```

If a sort is genuinely needed per frame, confirm it can't be hoisted behind a change check first.

### 1.4 Pre-allocate; never allocate inside the frame loop

`ASCIICanvas` reuses spans and previous-value arrays between grid rebuilds. Width changes, effect setup, and body class/style changes can cause rebuilding. Its `animate()` helper still creates a cell object and color string per call, so it is not allocation-free. Reuse large buffers where practical and measure allocation costs before changing this representation.

### 1.5 Guard the whole loop, not each iteration

When the component has nothing to do, skip the frame entirely. `ASCIICanvas` returns early when off-screen and never schedules the next frame:

```typescript
const loop = () => {
  if (!visibleRef.current || cancelled) return;
  // ...
  frameRef.current = requestAnimationFrame(loop);
};
```

The observer allows this frame loop to stop while offscreen and resume on visibility changes. Other observers and component work can still run; this does not establish zero total CPU use. Interval-driven components need their own lifecycle review.

### 1.6 Bitwise floor for positive grid math

`x | 0` coerces to a signed 32-bit integer, while `Math.floor` rounds down without that coercion. They agree for nonnegative inputs within the signed 32-bit range. Do not substitute one for the other without proving those bounds and measuring a benefit.

```typescript
const column = index % cols;
const row = (index - column) / cols;
```

`ASCIICanvas` derives `row` by exact integer division because the subtraction guarantees divisibility. Preserve that arithmetic contract; the source does not establish a universal speed advantage for bitwise coercion.

### 1.7 Keep numbers in one type lane

V8 represents small integers (Smis) differently from boxed doubles. A counter that starts at `0` and later receives a float forces a representation change. In the wave math (`Math.sin`, `Math.cos`), values are doubles throughout — keep them that way and keep loop indices integer throughout. Don't mix `Math.random()` or division results into an integer accumulator inside a hot loop.

### 1.8 Guard property writes that trigger work

Review setters with side effects and guard redundant writes where useful. Use browser measurements to determine the resulting style/layout work (see 1.2).

### 1.9 Strip diagnostic instrumentation from the frame path

`performance.now()` is fine once per frame (`ASCIICanvas` reads it for the time base). `console.log`, `JSON.stringify`, and extra `performance.now()` calls for profiling are not — at 60fps they are real cost. Gate them behind a debug flag or remove them after measuring.

### 1.10 Prefer `as const` objects over enums; ES modules over namespaces

Prefer the repository's plain objects and ES modules. The `as const` assertion is erased, but the object itself remains a runtime value. Enum and namespace emit varies by construct and transpiler; `isolatedModules` constrains cross-file assumptions, especially ambient const enums. Do not introduce a different representation as an unmeasured optimization.

```typescript
const DIRECTION = { Up: 'UP', Down: 'DOWN', Left: 'LEFT', Right: 'RIGHT' } as const;
type Direction = (typeof DIRECTION)[keyof typeof DIRECTION];
```

## Part 2 — Compiler performance

These are candidates for reducing `tsc --noEmit` wall-clock time and improving editor responsiveness. Measure their effect before claiming a benefit. They apply across the whole repo, not just the animation family.

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

Interfaces can make reusable object relationships easier to cache and report incompatible properties directly. Intersections can instead combine incompatible properties into `never`. Choose the correct semantics first, then use compiler diagnostics to investigate expensive relationships.

### 2.3 Keep union types small

Large unions can require expensive pairwise comparisons. Consider shared base types when diagnostics identify a costly union, while preserving discriminants and narrowing behavior. There is no repository-measured member-count threshold.

### 2.4 Limit recursive generic nesting

Deeply nested recursive generics can increase instantiation work. Prefer concrete types for known shapes when that improves clarity, and measure costly generic relationships. A fixed recursion-depth limit is not a substitute for diagnostics.

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
    "target": "es2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,                 // kept for compatibility; the Simulacrum framework is now .ts
    "skipLibCheck": true,
    "strict": false,                 // only strictNullChecks is on (see below)
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,                  // tsc is a checker only; Next.js/SWC emits
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",   // matches the bundler's resolution — correctness, not speed
    "resolveJsonModule": true,       // lets TypeScript import colors.json as a typed module
    "isolatedModules": true,
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
- `exclude` lists `node_modules` and `**/*.spec.ts`. It filters discovery through `include`; imported dependencies and referenced declarations can still enter the program. Preserve these exclusions without treating them as a guarantee that dependency types are never read.
- There are no project references and no `verbatimModuleSyntax` / `types: []` / `moduleDetection`. The repo is small enough that none of these earn their complexity yet; revisit only if `time npx tsc --noEmit` climbs past ~30s.

The manifest declares TypeScript `^7.0.2`. The configuration omits `baseUrl`, resolves the four `paths` aliases relative to the configuration file, and sets `target: es2017`. Run `npm run typecheck` with the installed compiler to establish current correctness; this document is not a record of a successful check.

### 2.7 Compiler diagnostic commands

Run before and after any change that touches types broadly.

| Command | What it tells you |
| --- | --- |
| `npx tsc --noEmit --extendedDiagnostics` | Files, Bind, Check, Emit times. High Check time = type complexity. |
| `time npx tsc --noEmit` | Wall-clock budget check. Should stay well under 30s for this repo. |
| `npx tsc --noEmit --generateTrace ./trace` then `npx @typescript/analyze-trace ./trace` | Slowest files and most expensive type instantiations. |
| `npx tsc --explainFiles \| grep node_modules` | Surfaces packages pulled in that shouldn't be. |

## Part 3 — The native TypeScript compiler

TypeScript 7 is released through the standard `typescript` package and provides the native `tsc` executable. This repository already declares TypeScript 7; installing `@typescript/native-preview` is unnecessary. Consult the [TypeScript 7 release announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/) for compatibility limits. Upstream performance measurements do not establish a speedup for this repository. Measure the installed compiler and verify diagnostic-option support before using optional tracing tools; installing a trace analyzer requires separate authorization.

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
- [ ] Buffers are reused where practical; rebuilds account for width, font, and effect changes
- [ ] The loop early-returns when off-screen / cancelled, gated by an `IntersectionObserver`
- [ ] Numeric variables stay in one lane (integer indices, double math)
- [ ] No `console.log` / extra `performance.now()` left in the frame path

**Compiler — whole repo:**

- [ ] Exported functions that return complex objects have explicit return types
- [ ] Boundary object types use `interface extends`, not `&`
- [ ] Expensive unions and recursive types are investigated with compiler diagnostics
- [ ] Type-only imports use `import type`
- [ ] No `enum`, no `namespace`, no `const enum`
- [ ] tsconfig edits keep an explicit `node_modules` in `exclude` and don't silently flip `strict`

**Naming:**

- [ ] Names are spelled out (`previousColors`, not `pc`)
- [ ] Comments are `//NOTE(jimmylee):` / `# NOTE(jimmylee):`, explain _why_, and aren't restating the code
- [ ] No `__private` prefix introduced — it isn't a convention in this repo
