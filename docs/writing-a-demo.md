# Writing a demo

A demo is a folder under `src/demos/html/<id>/` or `src/demos/react/<id>/`
plus a `config.json`. Nothing registers it — `loadDemos` globs `src/demos/**`
at build time, so a new folder appears in the sidebar with no other file
touched.

The same demo may exist in both `html/` and `react/` under one `<id>`. The
version icons in the header appear only then.

## `config.json`

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

`externalResources` exists for what an HTML demo does with a `<link>` in its
own `<head>`. A React demo has no HTML file of its own, so a webfont can only
be injected this way.

## What Sandpack will not do

Previews run on [Sandpack](https://sandpack.codesandbox.io/), CodeSandbox's
in-browser bundler, in `readOnly` mode. Because the bundling happens in the
visitor's browser, a demo can `import`, split across files and pull npm
packages while the whole site stays static. The cost is that dependencies are
fetched and bundled at view time, so a demo pulling `three` may take several
seconds to appear on first load.

Three consequences worth knowing before writing one:

- **Shaders inline as JS template strings.** Sandpack's bundler cannot resolve
  `.glsl` imports; there is no `vite-plugin-glsl` inside the sandbox.
- **React demos have no `main.jsx`.** The mount file is generated from
  `config.entry`, so writing one causes a collision.
- **There are no line numbers.** `readOnly` makes Sandpack render static
  highlighted markup instead of mounting CodeMirror, and line numbers are a
  CodeMirror extension.

## Sample images

Nine pixel-art scenes ship with the site for demos that need a picture and
have none of their own. Use the full URL: the sandbox runs on another origin,
so a relative path won't resolve. Pages serves them with
`Access-Control-Allow-Origin: *`, so they load as WebGL textures too.

```
https://hongdalin.blog/hd-demo/samples/<name>.png
```

| Name          | Size      | Scene                                           |
| ------------- | --------- | ----------------------------------------------- |
| `landscape-1` | 1600×1000 | Synthwave sunset over a city, mirrored in water |
| `landscape-2` | 1600×1000 | Aurora over snowy peaks, a lit cabin            |
| `landscape-3` | 1600×1000 | Ruins on the dunes under two moons              |
| `portrait-1`  | 1000×1500 | Rainy neon street, signs reflected in puddles   |
| `portrait-2`  | 1000×1500 | Lantern-lit alley with a vending machine        |
| `portrait-3`  | 1000×1500 | Moonlit forest full of fireflies                |
| `square-1`    | 1200×1200 | Ringed planet in a nebula                       |
| `square-2`    | 1200×1200 | Lighthouse on a cliff, beam over the sea        |
| `square-3`    | 1200×1200 | Jellyfish drifting through light rays           |

They are drawn in code, so there is no licence to track. To change one, edit
the scene in `design/samples/` and run `python3 design/samples/build.py`.

The `/add-demo`, `/html` and `/react` Claude Code skills walk through the
whole thing one prompt at a time.
