# hd-demo

A Vite + React + TypeScript showcase site. Left sidebar lists demos; the right
pane renders each one with Sandpack in read-only mode (code + live result).
Below 768px the sidebar becomes a drawer and the panes stack. Deployed to
GitHub Pages via Actions; `base` is `/hd-demo/`.

`lib/` is pure logic — no DOM, no React. Pure helpers have twice grown back
into view files; put them here.

## Adding a demo

A folder under `src/demos/<html|react>/<id>/` with a `config.json` (`title`,
`description`, `entry`, optional `dependencies` / `externalResources`).
`loadDemos.ts` globs it up — no registry. One version or both; the version
icons appear only when both exist.

Skills `/add-demo`, `/html <id>` and `/react <id>` do the work.

Commit messages follow Conventional Commits — see [CONTRIBUTING.md](CONTRIBUTING.md).
Run `npm run lint`, `npx tsc --noEmit` and `npm run build` before committing; CI
runs all three. `npm run format` is Prettier — `src/demos` is deliberately
excluded, since demo code is shown verbatim and keeps its author's style.

## Things that bite

Sandpack fails silently in these ways — each one looks like your own bug and
costs an afternoon. Everything else about the project is in
[README.md](README.md) or commented where it happens.

- **`DemoView` and `EmbedView` must stay on the same `<Sandpack>` preset.**
  EmbedView once composed the parts by hand, and that path lost whatever the
  preset supplies — theme, pane heights — each time DemoView changed, while the
  sandbox ran and logged normally behind it.
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
- **Below 768px Sandpack stacks the panes but doesn't halve them.** Its halving
  rule excludes `.sp-editor` and `.sp-preset-column` — exactly what the preset
  renders — so both keep full height and the preview lands past the bottom of a
  container that doesn't scroll. `DemoView` halves it, on the token _and_ on
  `editorHeight`, which the preset writes inline where it wins.
