import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Показуємо Vite на джерело вашого пакета
      'react-url-query-params': resolve(__dirname, '../../packages/react-url-query-params/src/index.ts'),
    },
  }
})
