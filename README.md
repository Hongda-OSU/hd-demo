# hd-demo

A showcase site for front-end demos. Pick one from the sidebar, see its source
and the running result side by side. Demos can have an HTML version, a React
version, or both.

Live at <https://hongda-osu.github.io/hd-demo/>.

## Running locally

```sh
npm install
npm run dev
```

Opens at `http://localhost:5173/hd-demo/` — note the `/hd-demo/` path, which
matches the GitHub Pages base.

## Adding a demo

Drop a folder into `src/demos/html/<id>/` or `src/demos/react/<id>/` with a
`config.json`. `src/lib/loadDemos.ts` finds it automatically via
`import.meta.glob` — there is no registry to edit and no layout code to touch.

```
src/demos/
├── html/typing-text-effect/
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   └── config.json
└── react/ripple-image-effect/
    ├── App.jsx
    ├── index.css
    ├── components/WebGLGallery.jsx
    └── config.json
```

```json
{
  "title": "Ripple Image Effect",
  "description": "一句话说明效果",
  "entry": "App.jsx",
  "dependencies": { "three": "0.185.1" }
}
```

A demo needs only one version — the version icons appear only when both exist.

Working with Claude Code, `/add-demo` walks through it one prompt at a time.
`/html <id>` and `/react <id>` skip straight to a version.

## URLs

| Path                    | Shows                                  |
| ----------------------- | -------------------------------------- |
| `/hd-demo/`             | Redirects to the first demo            |
| `/hd-demo/<id>`         | Sidebar + code + result                |
| `/hd-demo/<id>?v=react` | Same, forcing a version                |
| `/hd-demo/embed/<id>`   | The result alone — no sidebar, no code |

`/embed/` is meant for other sites. The `< >` button copies a ready snippet for
whatever you are looking at, so there is no need to write one by hand:

```html
<iframe
  src="https://hongda-osu.github.io/hd-demo/embed/ripple-image-effect"
  style="width:100%;height:520px;border:0"
></iframe>
```

`?v=` is added only when a demo has both versions, so a published iframe doesn't
get stuck on the old one when a second version appears.

GitHub Pages sends no `X-Frame-Options`, so this works out of the box. Don't add
a restrictive `frame-ancestors` policy or embedding breaks.

## The header controls

Icon buttons, top right. Hover any of them for a label.

| Icon              | Does                                                                 |
| ----------------- | -------------------------------------------------------------------- |
| HTML5 shield      | Switches to the HTML version — the pair shows only when both exist   |
| React atom        | Switches to the React version                                        |
| Crate, with count | Lists npm dependencies and external resources; disabled at 0         |
| `< >`             | Copies the `<iframe>` snippet for the current view; ticks on success |

`«` collapses the sidebar; the choice is remembered.

## How it works

Previews run on [Sandpack](https://sandpack.codesandbox.io/) in `readOnly`
mode — a real bundler in the browser, so React demos can use `import`, split
across files, and pull npm packages. HTML demos use its `static` template,
React demos its `react` template.

The cost is that dependencies install and bundle **in the browser, at view
time**. A demo with `three` may take several seconds on first load. That is
inherent to the approach, not a bug.

Three constraints when writing a demo — [CLAUDE.md](CLAUDE.md) has the why:

- Shaders inline as JS template strings; `.glsl` imports don't resolve.
- React demos have no `main.jsx`; it's generated from `config.entry`.
- Read-only means no line numbers.

## Deploying

```sh
npm run lint       # these three also run in CI and gate the deploy
npx tsc --noEmit
npm run build
npm run format     # prettier; src/demos excluded, demo code keeps its own style
```

Push to `main` and [the workflow](.github/workflows/deploy.yml) publishes to
Pages. Already set up — a fork would need **Settings → Pages → Source → "GitHub
Actions"** turned on once.

Pages has no rewrite rules, so `vite.config.js` copies `index.html` to
`404.html` — that's what lets `/embed/<id>` resolve on a deep link.

## Layout

```
src/
├── App.tsx                     # sidebar + routing
├── components/
│   ├── DemoView.tsx            # header controls + Sandpack
│   ├── EmbedView.tsx           # bare preview for iframes
│   └── icons.tsx               # the four header glyphs
├── lib/
│   ├── loadDemos.ts            # glob → project data
│   ├── sandpack.ts             # template + file setup
│   └── router.ts               # history-based routing
└── demos/                      # the demos themselves
```

App shell is TypeScript; demo files stay `.jsx`, since Sandpack's react
template is JS-based.

See [CONTRIBUTING.md](CONTRIBUTING.md) for commit conventions and
[CLAUDE.md](CLAUDE.md) for the Sandpack gotchas.
