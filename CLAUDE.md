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
Run `npm run lint`, `npx tsc --noEmit` and `npm run build` before committing; CI
runs all three. `npm run format` is Prettier — `src/demos` is deliberately
excluded, since demo code is shown verbatim and keeps its author's style.

## Things that bite

Sandpack fails silently in these four ways — each one looks like your own bug
and costs an afternoon. Everything else about the project is in
[README.md](README.md) or commented where it happens.

- **React entry**: Sandpack's react template ships its own `/App.js`. An
  extensionless `import App from "./App"` resolves to it instead of the demo's
  `App.jsx`, silently rendering "Hello world". `DemoView.tsx` generates a hidden
  `/index.js` importing the entry _with_ its extension.
- **`customSetup` drops the template's `entry`** (no fallback), so it is
  restated explicitly in `sandpackSetup`.
- **`readOnly` and line numbers are mutually exclusive.** `readOnly` makes
  Sandpack skip CodeMirror entirely and render static highlighted markup;
  `showLineNumbers` is a CodeMirror extension, so it silently does nothing.
- **Pane height is a Stitches token**, `$layout$height`, injected at runtime and
  outranking any stylesheet rule. `DemoView` measures its box and passes pixels.
