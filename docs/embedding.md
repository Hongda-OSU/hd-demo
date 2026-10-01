# URLs, embedding and controls

## URLs

| Path                    | Shows                                  |
| ----------------------- | -------------------------------------- |
| `/hd-demo/`             | Redirects to the first demo            |
| `/hd-demo/<id>`         | Sidebar, source and result             |
| `/hd-demo/<id>?v=react` | The same, pinned to one version        |
| `/hd-demo/embed/<id>`   | The result alone — no sidebar, no code |

## Embedding

`/embed/` is meant for other sites. The `< >` control in the header copies a
ready snippet for whatever is on screen, so there is no need to write one:

```html
<iframe
  src="https://hongdalin.blog/hd-demo/embed/ripple-image-effect"
  style="width:100%;height:520px;border:0"
></iframe>
```

`?v=` is added only when a demo has both versions, so a published iframe
doesn't get stuck on the old one once a second version appears.

GitHub Pages sends no `X-Frame-Options`, so embedding works untouched — don't
add a restrictive `frame-ancestors` policy or it breaks.

## Header controls

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
out — the sidebar becomes a drawer over a scrim, and the code and preview
stack rather than sitting side by side.
