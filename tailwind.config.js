/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#294749',
        'secondary': '#AFBDA1',
        'secondaryDark': "#8A9889",
        'tertiary': '#BFCAB7',
        'brandGreen': 'rgb(39, 47, 39)',
        'olive': '#4C6049',
        'customYellow': 'rgb(248, 245, 240)',
        'brandYellow': "#FFE894",
        'lightYellow': '#ccae62',
        'darkYellow': '#af9349',
        'lighterYellow': 'rgb(248, 245, 240)',
        'lightGrayGreen': '#e8ffec',
        // 'blue': '#7ed6df',
        'slate': 'darkslategrey',
        'dry': '#d1b979'
      },
      backgroundImage: {
        'flowers': 'url(/flowers-in-glass.jpg)',
      }
    },
  },
  plugins: [],
}
