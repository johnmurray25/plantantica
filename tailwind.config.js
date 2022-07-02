/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'green': 'rgb(39, 47, 39)',
        'yellow': 'rgb(248, 245, 240)',
        'lighterYellow': 'rgb(248, 245, 240)',
        'lightGrayGreen': '#e8ffec',
        'slate': 'darkslategrey',
      }
    },
  },
  plugins: [],
}
