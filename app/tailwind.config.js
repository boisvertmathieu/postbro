/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.{html,ts}"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}

