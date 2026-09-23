# hd-demo

A Vite + React + TypeScript showcase site. The sidebar lists demos; the right
pane renders one with Sandpack, read-only, source beside live result.
Below 768px the sidebar becomes a drawer and the panes stack. Deployed to
GitHub Pages; `base` is `/hd-demo/`.

The site is served at `hongdalin.blog/hd-demo/`, not at
`hongda-osu.github.io/hd-demo/`. The user site carries a custom domain and GitHub
redirects every project page under the account to it. Only a domain on this repo would
change that, so the github.io address is gone.

## Layout

- `components/` renders. `lib/` is pure logic — no DOM, no React. Helpers have
  drifted from `lib/` into view files twice; put them back rather than letting
  a third one settle in.
- `DemoView` measures its box and renders Sandpack. `DemoToolbar` owns the
  header controls and their state. `EmbedView` is the bare preview behind
  `/embed/<id>`.
- `lib/loadDemos` globs the demos, `lib/sandpack` assembles what Sandpack
  needs, `lib/embed` builds embed URLs, `lib/router` routes, and
  `lib/narrow` holds the single 768px breakpoint.

## Adding a demo

A folder under `src/demos/<html|react>/<id>/` with a `config.json` — `title`,
`description`, `entry`, optional `dependencies` and `externalResources`. No
registry: `loadDemos` finds it by glob. A demo may have one version or both,
and the version icons appear only with both.

Pin dependency versions exactly. Sandpack resolves them from a CDN at view
time, so a range lets a working demo break later with nothing in the diff to
show why.

The `/add-demo`, `/html` and `/react` skills walk through the whole thing.

## Working here

Run `npm run lint`, `npx tsc --noEmit`, `npm run build` and
`npm run check:docs`. CI runs all four. Prettier skips `src/demos`, since demo
code is shown verbatim and keeps its author's style.

After cloning, point git at the hooks once:

```sh
git config core.hooksPath .githooks
```

`pre-push` then rejects a push whose commits break the rules below, and runs
`check:docs`. CI runs the doc check too, so `--no-verify` only delays it.

## Committing

`type(scope): subject`, where type is one of `feat`, `fix`, `docs`,
`refactor`, `chore`, `style`. Scope is optional — a demo id, or the area
touched. Subject in the imperative, lowercase, no full stop, under 70
characters, describing the change rather than the file it lives in.

Write a body only when the diff cannot show why, wrapped at 72. A one-line
fix whose reason is unguessable is exactly the case for one; a rename is not.
Explain why, not what.

One logical change per commit. A new demo and a fix to the loader are two,
even when written in the same sitting.

CLAUDE.md itself stays under 200 lines; 80-120 lines at 300-600 words reads
best. `npm run check:docs` fails past the ceiling and notes the ranges.

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
  render static highlighted markup instead; line numbers are a CodeMirror
  extension, so setting `showLineNumbers` does nothing at all.
- **Pane height is a Stitches token.** `$layout$height` is injected at runtime
  and outranks any stylesheet rule, so CSS cannot set it. `DemoView` measures
  its container and passes pixels.
- **Below 768px the panes stack but aren't halved.** Sandpack's halving rule
  excludes `.sp-editor` and `.sp-preset-column`, which is what the preset
  renders, so both keep full height and the preview lands past the bottom of a
  container that doesn't scroll. `DemoView` halves it, on the token and on
  `editorHeight`, which the preset writes inline where it wins.

## Verifying a UI change

Four combinations — main view and `/embed/`, each wide and narrow — and a
change to one has repeatedly broken another unnoticed. Sandpack bundles
in the browser at view time, so nothing here shows up in `tsc` or `build`:
load the page.
