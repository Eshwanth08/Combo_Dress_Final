import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-utils': ['jszip', 'file-saver'],
          'vendor-react-core': ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  }
})
