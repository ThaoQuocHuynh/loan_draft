import { type PluginOption, defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), visualizer({ open: false }) as PluginOption],
  base: '/loan-os/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('ag-grid') || id.includes('@radix-ui')) {
            // Split vendor libraries into separate chunks
            return 'ui-venders';
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
