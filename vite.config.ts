import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    rollupOptions: { output: { manualChunks(id) {
      if (id.includes('/src/data/busdata.json')) return 'bus-dataset';
      if (id.includes('/node_modules/framer-motion/') || id.includes('/node_modules/motion-')) return 'motion';
    } } },
  },
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
