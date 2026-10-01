# hd-demo

A showcase site for front-end demos — each one shown with its source beside
the live result, and embeddable in someone else's page as an iframe.

**Live demo:** <https://hongdalin.blog/hd-demo/>

It exists because StackBlitz stopped working as an iframe embed. JSFiddle
still does, and this copies its shape. Hosting it myself means the embed
keeps working whatever a third-party service decides next.

## Features

- Source and live result side by side, bundled in the visitor's browser
- Every demo embeddable at `/embed/<id>`, with a button that copies the iframe
- The same demo in both HTML and React, switchable from the header
- Adding a demo is adding a folder — there is no registry to update
- Works down to phone width: the list becomes a drawer, the panes stack

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

Before pushing, and again in CI:

```bash
npm run lint
npx tsc --noEmit
npm run build
npm run check:docs
```

More detail in [`docs/`](docs/): [writing a demo](docs/writing-a-demo.md),
[URLs, embedding and controls](docs/embedding.md).
