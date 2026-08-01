# hd-demo

A showcase site for front-end demos. Pick one from the sidebar, see its source
and the running result side by side. Demos can have an HTML version, a React
version, or both.

Live at `https://hongda-osu.github.io/hd-demo/` once Pages is enabled.

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

A demo needs only one version — the HTML/REACT tabs hide themselves when the
other doesn't exist.

Working with Claude Code, `/add-demo` walks through it one prompt at a time.
`/html <id>` and `/react <id>` skip straight to a version.

## URLs

| Path                    | Shows                                  |
| ----------------------- | -------------------------------------- |
| `/hd-demo/`             | Redirects to the first demo            |
| `/hd-demo/<id>`         | Sidebar + code + result                |
| `/hd-demo/<id>?v=react` | Same, forcing a version                |
| `/hd-demo/embed/<id>`   | The result alone — no sidebar, no code |

`/embed/` is meant for other sites. The **Embed** button copies a ready snippet
for whatever you are looking at, so there is no need to write one by hand:

```html
<iframe
  src="https://hongda-osu.github.io/hd-demo/embed/ripple-image-effect"
  style="width:100%;height:520px;border:0"
></iframe>
```

The version is pinned with `?v=` only when a demo has both, so an iframe
published today doesn't get stuck on the old version if a second one is added
later.

GitHub Pages sends no `X-Frame-Options`, so this works without configuration.
Don't add a restrictive `frame-ancestors` policy or embedding will break.

## The header controls

| Control          | Does                                                         |
| ---------------- | ------------------------------------------------------------ |
| `HTML` / `REACT` | Switches version — shown only when a demo has both           |
| `Libraries (n)`  | Lists npm dependencies and external resources, disabled at 0 |
| `Embed`          | Copies the `<iframe>` snippet for the current view           |

`«` collapses the sidebar; the choice is remembered.

## How it works

Previews run on [Sandpack](https://sandpack.codesandbox.io/) in `readOnly`
mode — a real bundler in the browser, so React demos can use `import`, split
across files, and pull npm packages. HTML demos use its `static` template,
React demos its `react` template.

The cost is that dependencies install and bundle **in the browser, at view
time**. A demo with `three` may take several seconds on first load. That is
inherent to the approach, not a bug.

Three constraints worth knowing before you write a demo:

- **Shaders inline as JS template strings.** Sandpack can't resolve `.glsl`
  imports — there's no `vite-plugin-glsl` inside the sandbox.
- **React demos don't include their own `main.jsx`.** The mount file is
  generated from `config.entry`. See [CLAUDE.md](CLAUDE.md) for why.
- **Read-only means no line numbers.** `readOnly` makes Sandpack render static
  markup rather than CodeMirror, and line numbers come from CodeMirror.

## Working on the site

```sh
npm run lint       # oxlint
npx tsc --noEmit
npm run build
npm run format     # prettier; src/demos is excluded on purpose
```

CI runs the first three, so a failure there blocks the deploy. Demo sources are
left out of Prettier deliberately — they're shown verbatim in the editor pane,
so they keep whatever style their author wrote.

## Deploying

Push to `main`; [the workflow](.github/workflows/deploy.yml) lints, typechecks,
builds, and publishes to Pages. Enable it once at **Settings → Pages → Source
→ "GitHub Actions"**.

Pages has no rewrite rules, so `vite.config.js` copies `index.html` to
`404.html` — that's what lets `/embed/<id>` resolve on a deep link.

## Layout

```
src/
├── App.tsx                     # sidebar + routing
├── components/
│   ├── DemoView.tsx            # version tabs + Sandpack
│   └── EmbedView.tsx           # bare preview for iframes
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
