import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
  // MapLibre v6 nạp worker bằng URL tương đối — không cho Vite pre-bundle
  optimizeDeps: { exclude: ['maplibre-gl'] },
})
