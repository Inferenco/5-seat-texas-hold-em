import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Fix for @cedra-labs/wallet-adapter-plugin resolution issue
      '@cedra-labs/wallet-adapter-plugin': resolve(
        __dirname,
        'node_modules/@cedra-labs/wallet-adapter-plugin/dist/index.mjs'
      ),
    },
  },
  optimizeDeps: {
    include: [
      '@cedra-labs/wallet-adapter-core',
      '@cedra-labs/ts-sdk',
      '@cedra-labs/wallet-standard',
    ],
  },
})
