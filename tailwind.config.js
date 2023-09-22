/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#37393f",
        "secondary": "#2f3136",
        "dark": "#202225",
        "hovercolor": "#266e59",
      }
    },
  },
  plugins: [],
}