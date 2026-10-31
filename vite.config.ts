import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Long-lived vendor chunks. App code and content change on almost every deploy; React,
 * the router and framer-motion rarely do. Splitting them out lets returning visitors keep
 * those cached and only re-download the small app chunk. three.js is deliberately not
 * listed: it stays inside the lazy DataFlowScene chunk.
 */
const VENDOR_CHUNKS: Record<string, RegExp> = {
  react: /[\\/]node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom|cookie|set-cookie-parser)[\\/]/,
  motion: /[\\/]node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/,
}

// https://vite.dev/config/
export default defineConfig({
  base: '/portfolio/', // Set to your repo name
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          for (const [name, pattern] of Object.entries(VENDOR_CHUNKS)) {
            if (pattern.test(id)) return name
          }
        },
      },
    },
  },
})
