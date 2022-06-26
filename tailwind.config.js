/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'green': 'rgb(28, 61, 28)',
        'yellow': 'rgb(216, 216, 0)',
        'lightGrayGreen': '#e8ffec',
        'slate': 'darkslategrey',
      }
    },
  },
  plugins: [],
}
