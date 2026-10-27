import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync } from 'node:fs'
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

const MIME = { jpg: 'jpeg', svg: 'svg+xml' }
const PUBLISHED = /https:\/\/hongdalin\.blog\/hd-demo\/([\w./-]+\.(png|jpe?g|gif|webp|avif|svg))/gi

function demoImages() {
  let root, outDir, serving
  return {
    name: 'demo-images',
    configResolved(config) {
      root = config.root
      outDir = resolve(config.root, config.build.outDir, 'demos')
      serving = config.command === 'serve'
    },
    // Under `npm run dev` those URLs are not live yet, and the sandbox, being a
    // public origin, may not fetch from localhost. So the dev server inlines each
    // picture it has on disk into the demo source as a data URI.
    transform(code, id) {
      if (!serving || !id.endsWith('?raw') || !id.includes('/src/demos/')) return
      return code.replace(PUBLISHED, (url, path, ext) => {
        const file = resolve(root, path.startsWith('demos/') ? 'src' : 'public', path)
        if (!existsSync(file)) return url
        this.addWatchFile(file)
        const type = MIME[ext.toLowerCase()] ?? ext.toLowerCase()
        return `data:image/${type};base64,${readFileSync(file).toString('base64')}`
      })
    },
    closeBundle() {
      const demos = resolve(root, 'src/demos')
      for (const file of readdirSync(demos, { recursive: true })) {
        if (!IMAGE.test(file)) continue
        mkdirSync(dirname(resolve(outDir, file)), { recursive: true })
        copyFileSync(resolve(demos, file), resolve(outDir, file))
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/hd-demo/',
  plugins: [react(), spaFallback(), demoImages()],
})
