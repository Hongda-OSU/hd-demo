# hd-demo

A showcase site for front-end demos. Pick one from the sidebar, see its source
and the running result side by side. Demos can have an HTML version, a React
version, or both.

Live at <https://hongdalin.blog/hd-demo/>.

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
  src="https://hongdalin.blog/hd-demo/embed/ripple-image-effect"
  style="width:100%;height:520px;border:0"
></iframe>
```

`?v=` is added only when a demo has both versions, so a published iframe doesn't
get stuck on the old one when a second version appears.

GitHub Pages sends no `X-Frame-Options`, so this works out of the box. Don't add
a restrictive `frame-ancestors` policy or embedding breaks.

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

Below 768px the toolbar is the whole header — title and description drop out —
and Sandpack stacks the code over the preview.

See [CONTRIBUTING.md](CONTRIBUTING.md) for commit conventions and
[CLAUDE.md](CLAUDE.md) for the Sandpack gotchas.
