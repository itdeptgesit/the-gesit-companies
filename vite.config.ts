import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-framer': ['framer-motion'],
          'vendor-swiper': ['swiper'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
    minify: 'esbuild',
    // Enable CSS code splitting for faster initial load
    cssCodeSplit: true,
  },
})
