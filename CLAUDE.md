# hd-demo

A Vite + React + TypeScript showcase site. Left sidebar lists demos; the right
pane renders each one with Sandpack in read-only mode (code + live result).
Deployed to GitHub Pages via Actions; `base` is `/hd-demo/`.

## Adding a demo

Drop a folder into `src/demos/html/<id>/` or `src/demos/react/<id>/` with a
`config.json` (`title`, `description`, `entry`, optional `dependencies` and
`externalResources`). `src/lib/loadDemos.ts` picks it up via `import.meta.glob`
— no registry to edit. A demo may have one or both versions; the HTML/REACT
tabs hide themselves when only one exists.

Skills: `/html <id>` and `/react <id>` scaffold one version of a demo;
`/add-demo` holds the shared rules both defer to.

Commit messages follow Conventional Commits — see [CONTRIBUTING.md](CONTRIBUTING.md).
Run `npx tsc --noEmit` and `npm run build` before committing; CI runs both.

## Things that bite

- **React entry**: Sandpack's react template ships its own `/App.js`. An
  extensionless `import App from "./App"` resolves to it instead of the demo's
  `App.jsx`, silently rendering "Hello world". `DemoView.tsx` generates a hidden
  `/index.js` importing the entry *with* its extension.
- **`customSetup` drops the template's `entry`** (no fallback), so it is
  restated explicitly in `sandpackSetup`.
- **Shaders inline as JS template strings.** Sandpack's bundler cannot import
  `.glsl` files.
- **Routing**: `/<id>` browses, `/embed/<id>` is a bare preview for iframes;
  `?v=html|react` picks the version. Pages has no rewrites, so `vite.config.js`
  copies `index.html` to `404.html` to let the SPA boot on deep links.
