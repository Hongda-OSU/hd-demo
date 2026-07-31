import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
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

// https://vite.dev/config/
export default defineConfig({
  base: '/hd-demo/',
  plugins: [react(), spaFallback()],
})
