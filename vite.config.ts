import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import 'tailwindcss/base'; @import 'tailwindcss/components'; @import 'tailwindcss/utilities';`
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3000
  }
})
