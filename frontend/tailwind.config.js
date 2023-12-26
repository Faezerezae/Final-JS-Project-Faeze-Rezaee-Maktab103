const defaultTheme = require('tailwindcss/defaultTheme')
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./node_modules/flowbite/**/*.js",
    "./components/**/*.{html,js}",
    "*.html",
    "main.js",
  ],
  theme: {
    extend: {
      fontFamily:{
        sans:['"Inter"', ...defaultTheme.fontFamily.sans]
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
