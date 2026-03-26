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
        manualChunks(id) {
          // Keep admin pages separate
          if (id.includes('/src/pages/admin/') || id.includes('/src/pages/AdminDashboard')) {
            return 'admin-pages';
          }
          // Separate heavy vendor libs to enable parallel loading & caching
          if (id.includes('node_modules/framer-motion')) {
            return 'framer-motion';
          }
          if (id.includes('node_modules/swiper')) {
            return 'swiper';
          }
          if (id.includes('node_modules/@supabase')) {
            return 'supabase';
          }
          if (id.includes('node_modules/react-dom')) {
            return 'react-dom';
          }
        },
      },
    },
    minify: 'esbuild',
    // Enable CSS code splitting for faster initial load
    cssCodeSplit: true,
  },
})
