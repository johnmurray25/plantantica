/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'green': 'rgb(39, 47, 39)',
        'olive': '#4C6049',
        'customYellow': 'rgb(248, 245, 240)',
        'lightYellow': '#ccae62',
        'darkYellow': '#af9349',
        'lighterYellow': 'rgb(248, 245, 240)',
        'lightGrayGreen': '#e8ffec',
        // 'blue': '#7ed6df',
        'slate': 'darkslategrey',
        'dry': '#d6b980'
      },
      backgroundImage: {
        'blue-tree': 'url(../img/blue-tree.png)'
      }
    },
  },
  plugins: [],
}
