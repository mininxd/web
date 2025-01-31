/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
export default {
    content: [
    "./index.html",
    "./*.html",
    "./src/*.{html,js,ts}",
  ],
  plugins: [
    daisyui,
  ],
  daisyui: {
    themes: [
      "dark",
      "cupcake",
      "dracula"
    ],
  },
}

