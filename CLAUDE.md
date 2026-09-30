# hd-demo

A Vite + React + TypeScript showcase site. The sidebar lists demos; the right
pane renders one with Sandpack, read-only, source beside live result.
Below 768px the sidebar becomes a drawer and the panes stack. Deployed to
GitHub Pages; `base` is `/hd-demo/`.

Served at `hongdalin.blog/hd-demo/`. The user site carries a custom domain and
GitHub redirects every project page under the account to it, so the
`hongda-osu.github.io` address is gone for good.

## Layout

- `components/` renders. `lib/` is pure logic — no DOM, no React. Helpers have
  drifted out of `lib/` twice; put them back rather than let a third settle in.
- `DemoView` measures its box and renders Sandpack. `DemoToolbar` owns the
  header controls. `EmbedView` is the bare preview behind `/embed/<id>`.
- `lib/` holds `loadDemos` (glob), `sandpack` (assembly), `embed` (URLs),
  `router`, and `narrow` (the single 768px breakpoint).

## Adding a demo

A folder under `src/demos/<html|react>/<id>/` with a `config.json` — `title`,
`description`, `entry`, optional `dependencies` and `externalResources`. No
registry: `loadDemos` finds it by glob. Both versions of one `<id>` may exist,
and the version icons appear only then.

Pin dependency versions exactly. Sandpack resolves them from a CDN at view
time, so a range lets a working demo break later with nothing in the diff to
show why.

The `/add-demo`, `/html` and `/react` skills walk through it.

## Working here

Run `npm run lint`, `npx tsc --noEmit`, `npm run build` and
`npm run check:docs`; CI runs all four. Prettier skips `src/demos`, since demo
code is shown verbatim and keeps its author's style.

Commits are Conventional, atomic, subject and body lines all within 72
characters, and say what changed and why rather than how. A global
`commit-msg` hook rejects the mechanical breaches as you commit. After
cloning, `git config core.hooksPath .githooks`.

This file stays within 120 lines and 600 words, counted after `@import`.

## Things that bite

Sandpack fails silently in these ways. Each looks like a bug in your own code,
while the sandbox keeps logging as though all is well.

- **One preset, both views.** `DemoView` and `EmbedView` must go through the
  same `<Sandpack>`. `EmbedView` once composed the parts by hand, and that
  second path lost whatever the preset supplies — theme, then pane heights —
  each time `DemoView` changed. It rendered light, then zero-height, while the
  demo ran behind it.
- **React entry needs its extension.** Sandpack's react template ships its own
  `/App.js`, so an extensionless `import App from "./App"` resolves to that
  instead of the demo's `App.jsx` and silently renders "Hello world". The
  generated `/index.js` imports the entry with its extension.
- **`customSetup` drops the template's `entry`.** There is no fallback, so
  `sandpackSetup` restates it.
- **`readOnly` rules out line numbers.** It makes Sandpack skip CodeMirror and
  render static highlighted markup; line numbers are a CodeMirror extension,
  so `showLineNumbers` does nothing at all.
- **Pane height is a Stitches token.** `$layout$height` is injected at runtime
  and outranks any stylesheet rule. `DemoView` measures and passes pixels.
- **Below 768px the panes stack but aren't halved.** Sandpack's halving rule
  excludes `.sp-editor` and `.sp-preset-column`, which is what the preset
  renders, so both keep full height and the preview lands past the bottom of a
  container that doesn't scroll. `DemoView` halves it, on the token and on
  `editorHeight`, which the preset writes inline where it wins.

## Verifying a UI change

Four combinations — main view and `/embed/`, each wide and narrow — and a
change to one has repeatedly broken another unnoticed. Sandpack bundles in the
browser at view time, so none of this shows up in `tsc` or `build`: load the
page.
