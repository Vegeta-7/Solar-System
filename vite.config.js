import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src/',
  publicDir: '../static/',
  base: './',
  build: {
    outDir: '../dist', // 🔥 Outputs dist folder at root level
    emptyOutDir: true,
  },
})
