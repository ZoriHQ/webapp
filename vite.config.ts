import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import type { Plugin } from 'vite'

// Plugin to inject Zori analytics script during build
function injectZoriAnalytics(): Plugin {
  return {
    name: 'inject-zori-analytics',
    transformIndexHtml(html) {
      const zoriPublishableKey =
        process.env.VITE_ZORI_PUBLISHABLE_KEY ||
        'zori_pt_a06776c2d31f612efb69c3dfeed1d6e4121364797b6e3b253c'

      const analyticsScript = `
  <script
    async
    src="https://cdn.zorihq.com/script.min.js"
    data-key="${zoriPublishableKey}">
  </script>`
      return html.replace('</head>', `${analyticsScript}\n  </head>`)
    },
  }
}

const config = defineConfig({
  plugins: [
    // Path aliases support
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    // Tailwind CSS
    tailwindcss(),
    // TanStack Router plugin for file-based routing
    TanStackRouterVite(),
    // React plugin
    viteReact(),
    // Zori analytics injection
    injectZoriAnalytics(),
  ],
  optimizeDeps: {
    include: ['three', 'react-globe.gl'],
    esbuildOptions: {
      target: 'es2020',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['@tanstack/react-router', '@tanstack/react-query'],
          globe: ['three', 'react-globe.gl'],
        },
      },
    },
  },
  server: {
    port: 3000,
  },
})

export default config
