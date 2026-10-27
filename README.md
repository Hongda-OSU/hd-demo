<img src="assets/icon.png" width="128" height="128" alt="hd-demo icon: a smiling pixel-art monitor showing code beside a picture">

# hd-demo

My own JSFiddle: front-end demos with the source beside the live result, each
embeddable in another page as an iframe.

**Demo:** <https://hongdalin.blog/hd-demo/>

## Features

- Source and live result side by side, bundled in the visitor's browser
- Every demo embeddable at `/embed/<id>`, with a button that copies the iframe
- The same demo in both HTML and React, switchable from the header
- Variants of one topic filed under a single sidebar heading
- Adding a demo is adding a folder — there is no registry to update
- Works on a phone as well as a desktop

## Tech Stack

- Frontend: React 19, TypeScript 7, Vite 8
- Previews: Sandpack 2 — CodeSandbox's in-browser bundler, read-only
- Hosting: GitHub Pages, deployed by GitHub Actions on push to `main`

## Getting Started

### Prerequisites

- Node.js 24+
- npm 11+

### Installation

```bash
git clone https://github.com/Hongda-OSU/hd-demo.git
cd hd-demo
npm install
```

## Usage

```bash
npm run dev
```

Open <http://localhost:5173/hd-demo/> — note the `/hd-demo/` base path.
Demo images show here before they are deployed: the dev server inlines them.

Before pushing, and again in CI:

```bash
npm run lint
npx tsc --noEmit
npm run build
npm run check:docs
```

More detail in [`docs/`](docs/): [writing a demo](docs/writing-a-demo.md),
[URLs, embedding and controls](docs/embedding.md).
