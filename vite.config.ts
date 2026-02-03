import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Enable source maps for production debugging (optional, can be disabled for smaller builds)
    sourcemap: false,
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'animation-vendor': ['framer-motion'],
          'ui-vendor': ['lucide-react', 'swiper'],
          // Supabase and email services
          'services': ['@supabase/supabase-js', '@emailjs/browser'],
        },
      },
    },
    // Use esbuild for minification (faster and default for Vite)
    minify: 'esbuild',
  },
})
