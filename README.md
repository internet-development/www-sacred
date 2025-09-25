# SRCL

## Showcase and Home pages

SRCL includes two optional pages you can use to demo components quickly:

- ShowcasePage: lightweight, minimal dependencies; great for docs/playgrounds.
- HomePage: full “kitchen sink” demo of SRCL components.

Both are optional and only included in your bundle if you import them.

### Quick start (ShowcasePage)

```/dev/null/App.tsx#L1-20
import 'srcl/global.css';
import ShowcasePage from 'srcl/ShowcasePage';
// or: import ShowcasePage from 'srcl/pages/ShowcasePage';

export default function App() {
  return (
    <ShowcasePage
      title="My App"
      version="1.0.0"
      links={[
        { label: 'Studio', href: 'https://internet.dev', target: '_blank' },
        { label: 'SRCL Source', href: 'https://github.com/internet-development/www-sacred', target: '_blank' },
      ]}
      actions={[{ label: 'Primary Action', onClick: () => console.log('clicked!') }]}
    />
  );
}
```

### Full demo (HomePage)

```/dev/null/App.tsx#L1-12
import 'srcl/global.css';
import HomePage from 'srcl/HomePage';
// or: import HomePage from 'srcl/pages/HomePage';

export default function App() {
  return <HomePage />;
}
```

### How to avoid bundling these pages

- Don’t import them. With ESM and subpath exports, unused modules are excluded from the final bundle by default.
- Prefer subpath component imports elsewhere:
  - import Button from 'srcl/components/Button'
  - import Grid from 'srcl/components/Grid'
- If you only need a docs route or on-demand demo, lazy-load the page:
```/dev/null/routes.tsx#L1-20
import * as React from 'react';
const ShowcasePage = React.lazy(() => import('srcl/pages/ShowcasePage'));

export function DocsRoute() {
  return (
    <React.Suspense fallback={null}>
      <ShowcasePage />
    </React.Suspense>
  );
}
```

Notes:
- Global styles: import 'srcl/global.css' once in your app (recommended). You can also use 'srcl/global.scss' if your build supports Sass.
- Fonts are self-hosted and bundled via the CSS pipeline; no extra configuration is needed.

## Using SRCL via subpath exports

SRCL can be consumed as a library using subpath exports so you can import individual components directly without app-level aliases.

Examples:
- import Grid from 'srcl/components/Grid'
- import Row from 'srcl/components/Row'
- import Card from 'srcl/components/Card'
- import Button from 'srcl/components/Button'
- import Text from 'srcl/components/Text'
- import Badge from 'srcl/components/Badge'

Global styles:
- If available, import once in your app entry: import 'srcl/global.css'
- Alternatively (if your setup supports SCSS), import: import '@root/global.scss'

Notes:
- Tree-shaking: Subpath imports ensure you only bundle what you use.
- Types: TypeScript declaration files are provided for components and common utilities; editors should auto-complete props.
- Peer dependencies: React and React DOM are expected to be provided by the consuming app.
- Styles: Components use SCSS modules. Most Vite-based projects work out of the box. If your build fails to resolve SCSS, install a Sass pipeline (e.g., add the sass package).

Troubleshooting:
- If your bundler cannot resolve imports like 'srcl/components/Button', ensure that your installed SRCL version exposes subpath exports and your bundler supports them (Node resolution with "exports" field).
- If you see style resolution errors, add the sass dependency to your project and confirm that CSS/SCSS modules are enabled in your bundler config.


**[Live Demo](https://sacred.computer)**

SRCL is an open-source React component and style repository that helps you build web applications, desktop applications, and static websites with terminal aesthetics. Its modular, easy-to-use components emphasize precise monospace character spacing and line heights, enabling you to quickly copy and paste implementations while maintaining a clean, efficient codebase.

```sh
npm install
npm run dev
```

Go to `http://localhost:10000` in your browser of choice.

We use [Vercel](https://vercel.com/home) for hosting.

### Scripts (Optional)

If you need to run node script without running the server, use this example to get started

```sh
npm run script example
```

### Contact

If you have questions ping me on Twitter, [@wwwjim](https://www.twitter.com/wwwjim). Or you can ping [@internetxstudio](https://x.com/internetxstudio).
