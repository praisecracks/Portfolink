import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true, // Forces Vite to detect file changes
    },
    host: true, // Enables access via network (optional)
    strictPort: true, // Keeps port consistent
    port: 5173, // You can change this if needed
  },
})
