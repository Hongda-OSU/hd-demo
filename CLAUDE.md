# hd-demo

A Vite + React + TypeScript site: a sidebar of demos, each rendered read-only by
Sandpack. Below 768px it becomes a drawer and the panes stack.

`lib/` is pure logic — no DOM, no React. Helpers keep drifting into view files.

Demos are folders under `src/demos/<html|react>/<id>/` with a `config.json`,
found by glob. Skills: `/add-demo`, `/html`, `/react`.

Before committing: `npm run lint`, `npx tsc --noEmit`, `npm run build`.
Conventional Commits — see [CONTRIBUTING.md](CONTRIBUTING.md).

## Things that bite

Sandpack fails silently; each reads as your own bug.

- `DemoView` and `EmbedView` must share one `<Sandpack>` preset.
- React entry imports need the extension, or the template's `App.js` wins.
- `customSetup` drops the template's `entry`.
- `readOnly` skips CodeMirror, so line numbers never work.
- Pane height is a Stitches token, not CSS; `DemoView` passes pixels.
- Below 768px the panes stack but aren't halved; `DemoView` halves them.
