import { defineConfig } from "vite";
import tailwindcss from "tailwindcss";
export default defineConfig({
plugins: [],
  css: {
   postcss: {
    plugins: [tailwindcss()],
   },
  },
});