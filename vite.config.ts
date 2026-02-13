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
        // Simplified manual chunking
        manualChunks(id) {
          // Keep admin pages separate to avoid loading them on the home page
          if (id.includes('/src/pages/admin/') || id.includes('/src/pages/AdminDashboard')) {
            return 'admin-pages';
          }
        },
      },
    },
    // Use esbuild for minification (faster and default for Vite)
    minify: 'esbuild',
  },
})
