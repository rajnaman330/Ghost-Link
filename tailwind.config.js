/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ghost: "#0a0a0a",
        accent: "#00ff9d",
      },
    },
  },
  plugins: [],
}