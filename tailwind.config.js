/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#082022',
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
        'dry': '#d1b979',
        'dark': '#111902',
        'highlight': '#A1C720',
        "lightbg": "#a1a891"
      },
      backgroundImage: {
        'flowers': 'url(/flowers-in-glass.jpg)',
        'flowersPortrait': 'url(/flowers-in-glass2.jpg)',
      }
    },
  },
  plugins: [],
}
