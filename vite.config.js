import { copyFileSync, mkdirSync, readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages has no rewrite rules, so /embed/<id> would 404 before our JS runs.
// Serving index.html as 404.html lets the SPA boot and read the path itself.
function spaFallback() {
  let outDir
  return {
    name: 'spa-404-fallback',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      copyFileSync(resolve(outDir, 'index.html'), resolve(outDir, '404.html'))
    },
  }
}

// Sandpack only takes text files, so a demo's images are published beside the
// site instead: src/demos/<version>/<id>/x.png is served at
// /hd-demo/demos/<version>/<id>/x.png, for the demo to load by full URL.
const IMAGE = /\.(png|jpe?g|gif|webp|avif|svg)$/i

function demoImages() {
  let root, outDir
  return {
    name: 'demo-images',
    configResolved(config) {
      root = resolve(config.root, 'src/demos')
      outDir = resolve(config.root, config.build.outDir, 'demos')
    },
    closeBundle() {
      for (const file of readdirSync(root, { recursive: true })) {
        if (!IMAGE.test(file)) continue
        mkdirSync(dirname(resolve(outDir, file)), { recursive: true })
        copyFileSync(resolve(root, file), resolve(outDir, file))
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/hd-demo/',
  plugins: [react(), spaFallback(), demoImages()],
})
