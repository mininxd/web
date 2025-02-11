import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  server: {
    watch: {
      ignored: ['!**/src/**', '!**/public/**'] 
    }
  },
  plugins: [tailwindcss()],
})
