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
        // Improved manual chunk splitting for better caching and performance
        manualChunks(id) {
          // Core React libraries (most stable, best for long-term caching)
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-vendor';
          }

          // React Router (separate from core React for better caching)
          if (id.includes('node_modules/react-router-dom')) {
            return 'router-vendor';
          }

          // Animation libraries (framer-motion is large ~126KB)
          if (id.includes('node_modules/framer-motion')) {
            return 'animation-vendor';
          }

          // UI libraries
          if (id.includes('node_modules/lucide-react') || id.includes('node_modules/swiper')) {
            return 'ui-vendor';
          }

          // Supabase (large library ~170KB, only needed for admin and some features)
          if (id.includes('node_modules/@supabase')) {
            return 'supabase-vendor';
          }

          // EmailJS (only needed for contact form)
          if (id.includes('node_modules/@emailjs')) {
            return 'emailjs-vendor';
          }

          // Vercel Analytics (can be loaded separately)
          if (id.includes('node_modules/@vercel')) {
            return 'analytics-vendor';
          }

          // Admin pages (separate chunk - only loads when accessing admin)
          if (id.includes('/src/pages/admin/') || id.includes('/src/pages/AdminDashboard')) {
            return 'admin-pages';
          }

          // Navigation components (shared across all routes, good for caching)
          if (id.includes('/src/components/Navbar') || id.includes('/src/components/Footer')) {
            return 'navigation';
          }
        },
      },
    },
    // Use esbuild for minification (faster and default for Vite)
    minify: 'esbuild',
  },
})
