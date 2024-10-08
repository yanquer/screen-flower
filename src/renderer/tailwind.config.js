const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './src/renderer/pages/**/*.{js,ts,jsx,tsx}',
    './src/renderer/components/**/*.{js,ts,jsx,tsx}',
    './src/renderer/layout/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      // use colors only specified
      white: colors.white,
      gray: colors.gray,
      blue: colors.blue,
    },
    extend: {},
  },
  plugins: [],
}
