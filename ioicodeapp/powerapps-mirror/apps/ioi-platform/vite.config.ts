import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { propagateQueryPlugin } from './plugins/vite-plugin-propagate-query';

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    propagateQueryPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    write: process.env.VITE_CHECK_MODE !== 'true',
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        // We disable inlineDynamicImports to allow code splitting,
        // which significantly improves initial load performance.
        inlineDynamicImports: false,
        // Merge chunks smaller than 10 KB to reduce upload file count for pac code push.
        // pac uploads every file individually; 200+ tiny chunks add ~60s of round-trip overhead.
        experimentalMinChunkSize: 10240,
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', 'lucide-react'],
          'vendor-data': ['@tanstack/react-query', 'jotai', 'zod'],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
    hmr: {
      overlay: false,
    },
  },
  optimizeDeps: {
    include: [
      '@hookform/resolvers',
      '@hookform/resolvers/zod',
      '@microsoft/power-apps/data',
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-collapsible',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-label',
      '@radix-ui/react-navigation-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-progress',
      '@radix-ui/react-radio-group',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-slider',
      '@radix-ui/react-slot',
      '@radix-ui/react-switch',
      '@radix-ui/react-tabs',
      '@radix-ui/react-tooltip',
      '@tanstack/react-table',
      'class-variance-authority',
      'clsx',
      'date-fns',
      'lucide-react',
      'motion',
      'react-day-picker',
      'react-dom/client',
      'react-hook-form',
      'recharts',
      'tailwind-merge',
      'uuid',
      'zod',
    ],
  },
});
