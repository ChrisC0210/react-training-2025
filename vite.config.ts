import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // base: "/react-training-2025/",
  base: './',
  plugins: [react()],
})
