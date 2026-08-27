import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  // served from https://ricardo-valero.github.io/portfolio/ — anything built
  // at runtime rather than by Vite must go through import.meta.env.BASE_URL
  base: '/portfolio/',
  plugins: [solid()],
  server: {
    // tunnel hosts for sharing the dev server (localhost.run, zrok)
    allowedHosts: ['.lhr.life', '.shares.zrok.io'],
  },
})
