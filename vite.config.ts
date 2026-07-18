import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative base so the built index.html's script/asset URLs resolve
  // correctly whether the site is served from a domain root or from a
  // GitHub Pages project subpath (https://user.github.io/repo-name/).
  base: './',
  plugins: [react()],
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    sourcemap: false,
  },
})
