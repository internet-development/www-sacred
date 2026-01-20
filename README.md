# SRCL

**[Live Demo](https://sacred.computer)**

SRCL is an open-source React component and style repository that helps you build web applications, desktop applications, and static websites with terminal aesthetics. Its modular, easy-to-use components emphasize precise monospace character spacing and line heights, enabling you to quickly copy and paste implementations while maintaining a clean, efficient codebase.

```sh
npm install
npm run dev
```

Go to `http://localhost:10000` in your browser of choice.

We use [Vercel](https://vercel.com/home) for hosting.

### Appearance Modes

SRCL supports color accent modes that can be layered on top of light or dark themes. These modes are activated by adding a `tint-*` class to the `<body>` element.

Available modes:
- `tint-blue`
- `tint-green`
- `tint-orange`
- `tint-purple`
- `tint-red`
- `tint-yellow`
- `tint-pink`
- `tint-cherry`

You can toggle these at runtime via the Action Bar (Appearance → Mode) or programmatically using `Utilities.onHandleAppearanceModeChange('tint-cherry')`.

### Scripts (Optional)

If you need to run node script without running the server, use this example to get started

```sh
npm run script example
```

### Contact

If you have questions ping me on Twitter, [@wwwjim](https://www.twitter.com/wwwjim). Or you can ping [@internetxstudio](https://x.com/internetxstudio).
