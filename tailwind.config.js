/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      lineHeight: {
        tighter: '0.9',
        ultra: '0.8',
        mini: '-0.35',
      },
      screens: {
        '3xl': '2220px',
      },
      fontFamily: {
        genos: ['var(--font-family-genos)'],
        roboto: ['var(--font-family-roboto)'],
        smooch: ['var(--font-family-smooch)'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    function ({ addUtilities }) {
      addUtilities({
        // White fill, black outline
        '.text-white-stroke-black': {
          color: '#fff !important',
          '-webkit-text-stroke': '1px #000',
          'paint-order': 'stroke fill',
          'text-shadow': `
    1px 1px 0 #000,
    -1px 1px 0 #000,
    1px -1px 0 #000,
    -1px -1px 0 #000
  `,
        },

        // Black fill, white outline
        '.text-black-stroke-white': {
          color: '#000 !important',
          '-webkit-text-stroke': '1px #fff',
          'paint-order': 'stroke fill',
          'text-shadow': `
    1px 1px 0 #fff,
    -1px 1px 0 #fff,
    1px -1px 0 #fff,
    -1px -1px 0 #fff
  `,
        },
      })
    },
  ],
}
