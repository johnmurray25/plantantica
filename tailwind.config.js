/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // "**/*.{js,ts,jsx,tsx}",
    "app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'green': 'rgb(39, 47, 39)',
        'olive': '#4C6049',
        'yellow': 'rgb(248, 245, 240)',
        'lighterYellow': 'rgb(248, 245, 240)',
        'lightGrayGreen': '#e8ffec',
        // 'blue': '#7ed6df',
        'slate': 'darkslategrey',
      },
      backgroundImage: {
        'blue-tree': 'url(../img/blue-tree.png)'
      }
    },
  },
  plugins: [],
}
