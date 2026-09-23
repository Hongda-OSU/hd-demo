# hd-demo

A showcase site for front-end demos. Each demo is a small, self-contained piece
of interactive work — an animation, a WebGL effect, a CSS experiment — shown
with its source beside the result that source produces, both on the same page.

It exists because demos scattered across CodePen links, gists and dead branches
stop being findable. Collecting them costs nothing to host, and adding one costs
a folder.

Live at <https://hongdalin.blog/hd-demo/>.

## What's here

```
src/
├── App.tsx                 # routing, sidebar, the narrow-screen drawer
├── components/
│   ├── DemoView.tsx        # measures its box, renders Sandpack
│   ├── DemoToolbar.tsx     # the header controls and their state
│   ├── EmbedView.tsx       # bare preview behind /embed/<id>
│   ├── icons.tsx           # the six header glyphs
│   └── sandpack-fill.css   # overrides Sandpack's own DOM by selector
├── lib/                    # pure logic — no DOM, no React
│   ├── loadDemos.ts        # glob → the list of demos
│   ├── sandpack.ts         # template, file assembly, theme
│   ├── embed.ts            # /embed/ URL and iframe snippet
│   ├── router.ts           # history-based routing
│   └── narrow.ts           # the single 768px breakpoint
├── index.css               # colour variables and reset
└── demos/                  # the demos themselves
    ├── html/<id>/          # index.html, styles.css, script.js, config.json
    └── react/<id>/         # App.jsx, index.css, components/, config.json

.githooks/pre-push          # rejects a push breaking the rules in CLAUDE.md
scripts/check-docs.mjs      # size check for CLAUDE.md, also run in CI
design/icon-source.png      # the favicon at full size, not deployed
```

Nothing registers a demo. `loadDemos` globs `src/demos/**` at build time, so a
new folder appears in the sidebar with no other file touched.

## Demo format

A demo is a folder plus a `config.json`. The same demo may exist in both
`html/` and `react/` under one `<id>`; the version icons appear only then.

| Field               | Type     | Required | Meaning                                                             |
| ------------------- | -------- | -------- | ------------------------------------------------------------------- |
| `title`             | string   | yes      | Shown in the sidebar and the header                                 |
| `description`       | string   | yes      | One line, shown beside the title on wide screens                    |
| `entry`             | string   | yes      | `App.jsx` for React, `index.html` for HTML                          |
| `dependencies`      | object   | no       | npm package → **exact** version, never a range                      |
| `externalResources` | string[] | no       | CDN URLs injected into the preview page — fonts, global stylesheets |

```json
{
  "title": "Ripple Image Effect",
  "description": "WebGL gallery; the image follows the cursor on hover",
  "entry": "App.jsx",
  "dependencies": { "three": "0.185.1", "kokomi.js": "1.11.0", "gsap": "3.15.0" }
}
```

Versions are pinned exactly because Sandpack resolves them from a CDN every
time the demo is opened. A range means the running result drifts over time: a
demo that works today can break next year with nothing in the diff to show why.

`externalResources` exists for what an HTML demo does with a `<link>` in its own
`<head>`. A React demo has no HTML file of its own, so a webfont can only be
injected this way.

## URLs

| Path                    | Shows                                  |
| ----------------------- | -------------------------------------- |
| `/hd-demo/`             | Redirects to the first demo            |
| `/hd-demo/<id>`         | Sidebar, source and result             |
| `/hd-demo/<id>?v=react` | The same, pinned to one version        |
| `/hd-demo/embed/<id>`   | The result alone — no sidebar, no code |

`/embed/` is meant for other sites. The `< >` control copies a ready snippet for
whatever is on screen, so there is no need to write one:

```html
<iframe
  src="https://hongdalin.blog/hd-demo/embed/ripple-image-effect"
  style="width:100%;height:520px;border:0"
></iframe>
```

`?v=` is added only when a demo has both versions, so a published iframe doesn't
get stuck on the old one once a second version appears. GitHub Pages sends no
`X-Frame-Options`, so embedding works untouched — don't add a restrictive
`frame-ancestors` policy or it breaks.

## Controls

Icon buttons, top right. Hover any of them for a label.

| Icon              | Does                                                                 |
| ----------------- | -------------------------------------------------------------------- |
| Burger            | Collapses the demo list; on a phone opens it as a drawer             |
| HTML5 shield      | Switches to the HTML version — the pair shows only when both exist   |
| React atom        | Switches to the React version                                        |
| Crate, with count | Lists npm dependencies and external resources; disabled at 0         |
| Arrow leaving box | Opens the bare preview in a new tab                                  |
| `< >`             | Copies the `<iframe>` snippet for the current view; ticks on success |

Below 768px the toolbar becomes the whole header — title and description drop
out — the sidebar becomes a drawer over a scrim, and the code and preview stack
rather than sitting side by side.

## How it works

Previews run on [Sandpack](https://sandpack.codesandbox.io/), CodeSandbox's
in-browser bundler, in `readOnly` mode. HTML demos use its `static` template and
React demos its `react` template. Because the bundling happens in the visitor's
browser, a demo can `import`, split across files and pull npm packages while the
whole site stays static — which is what lets GitHub Pages host it.

The cost is that dependencies are fetched and bundled at view time. A demo
pulling `three` may take several seconds to appear on first load. That is
inherent to the approach, not a fault.

Three consequences worth knowing before writing a demo:

- **Shaders inline as JS template strings.** Sandpack's bundler cannot resolve
  `.glsl` imports; there is no `vite-plugin-glsl` inside the sandbox.
- **React demos have no `main.jsx`.** The mount file is generated from
  `config.entry`, so writing one causes a collision.
- **There are no line numbers.** `readOnly` makes Sandpack render static
  highlighted markup instead of mounting CodeMirror, and line numbers are a
  CodeMirror extension.

[CLAUDE.md](CLAUDE.md) records the rest, including the failures that look like
a bug in the demo but come from the plumbing.

## Running it

```sh
npm install
npm run dev     # http://localhost:5173/hd-demo/ — note the base path
```

Before pushing, and again in CI:

```sh
npm run lint
npx tsc --noEmit
npm run build
npm run check:docs
```

Push to `main` and [the workflow](.github/workflows/deploy.yml) publishes to
Pages. Pages has no rewrite rules, so `vite.config.js` copies `index.html` to
`404.html` — that is what lets `/embed/<id>` resolve when opened directly
rather than navigated to.
