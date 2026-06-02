# SRCL

**[Live Demo](https://sacred.computer)**

SRCL is an open-source React component and style repository that helps you build web applications, desktop applications, and static websites with terminal aesthetics. Its modular, easy-to-use components emphasize precise monospace character spacing and line heights, enabling you to quickly copy and paste implementations while maintaining a clean, efficient codebase.

```sh
npm install
npm run dev
```

Go to `http://localhost:10000` in your browser of choice.

We use [Vercel](https://vercel.com/home) for hosting.

### Tests

Run the unit tests for the sacred CLI framework primitives:

```sh
npm test
```

This runs three gates: TypeScript type-check, the [vitest](https://vitest.dev/) suite, and the Python unittest suite (which includes a parity test between the JS and Python CLI runtimes). If `python3` is not on your PATH, the Python suite skips with a warning. Use `npm run test:js` or `npm run test:python` to run a single suite.

### Sacred CLI Templates

Sacred ships a tiny zero-dependency CLI framework under `scripts/cli/lib`. The framework reads its palette from `scripts/cli/colors.json` so the terminal surface and the React surface stay in agreement. Two reference templates render the same data set in two languages:

```sh
npm run cli:typescript
npm run cli:python
```

`cli:typescript` runs `scripts/cli/templates/template.ts` via [tsx](https://github.com/privatenumber/tsx). `cli:python` runs `scripts/python/templates/template.py` against a snake_case Python mirror of the framework under `scripts/python/sacred_cli`. Both screens use the alt screen buffer and raw mode keyboard input — press `Esc` or `Ctrl-C` to exit. The same template is also mounted as a React component on the kitchen sink page (search for `CLI TEMPLATE EXAMPLE`).

If you want to write your own CLI screen or port a sacred React surface to a terminal, the four porting skills under `skills/` walk through the conventions:

- `skills/port-sacred-terminal-ui-to-typescript-cli/SKILL.md`
- `skills/port-sacred-terminal-ui-to-python/SKILL.md`
- `skills/port-sacred-terminal-ui-to-react-using-same-conventions/SKILL.md`
- `skills/port-sacred-terminal-ui-to-hostile-react-codebase/SKILL.md`

### Documentation URLs

Every doc and component source file in the repo is published at a stable URL so humans and agents can read them without cloning:

- [https://sacred.computer/llms.txt](https://sacred.computer/llms.txt) — [llmstxt.org](https://llmstxt.org/) index, grouped into Repo conventions, Simulacrum (CLI framework), Skills, and Component source
- [https://sacred.computer/llms-full.txt](https://sacred.computer/llms-full.txt) — every doc concatenated in one fetch
- [https://sacred.computer/llm/AGENTS.md](https://sacred.computer/llm/AGENTS.md) — root sacred / Simulacrum conventions
- [https://sacred.computer/llm/components/AGENTS.md](https://sacred.computer/llm/components/AGENTS.md) — canonical catalog of every sacred React component (props, theming tokens, CLI primitive equivalent)
- [https://sacred.computer/llm/components/Card.tsx.txt](https://sacred.computer/llm/components/Card.tsx.txt) — raw source of a component (every `components/*.tsx` follows this pattern)
- [https://sacred.computer/llm/scripts/cli/AGENTS.md](https://sacred.computer/llm/scripts/cli/AGENTS.md) — Simulacrum TypeScript framework
- [https://sacred.computer/llm/scripts/python/AGENTS.md](https://sacred.computer/llm/scripts/python/AGENTS.md) — Simulacrum Python mirror
- [https://sacred.computer/llm/skills/port-sacred-terminal-ui-to-typescript-cli/SKILL.md](https://sacred.computer/llm/skills/port-sacred-terminal-ui-to-typescript-cli/SKILL.md)
- [https://sacred.computer/llm/skills/port-sacred-terminal-ui-to-python/SKILL.md](https://sacred.computer/llm/skills/port-sacred-terminal-ui-to-python/SKILL.md)
- [https://sacred.computer/llm/skills/port-sacred-terminal-ui-to-react-using-same-conventions/SKILL.md](https://sacred.computer/llm/skills/port-sacred-terminal-ui-to-react-using-same-conventions/SKILL.md)
- [https://sacred.computer/llm/skills/port-sacred-terminal-ui-to-hostile-react-codebase/SKILL.md](https://sacred.computer/llm/skills/port-sacred-terminal-ui-to-hostile-react-codebase/SKILL.md)
- [https://sacred.computer/llm/skills/fast-typescript-check/SKILL.md](https://sacred.computer/llm/skills/fast-typescript-check/SKILL.md) — keep this repo's TypeScript fast to type-check and fast to run

Adding a new doc or component file to the repo automatically exposes it as a URL. Both `/llms.txt` and `/llms-full.txt` follow the [llmstxt.org](https://llmstxt.org/) convention.

### Contact

If you have questions ping me on Twitter, [@wwwjim](https://www.twitter.com/wwwjim). Or you can ping [@internetxstudio](https://x.com/internetxstudio).
