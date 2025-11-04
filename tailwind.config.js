/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'media', // ✅ Automatically respects device settings
  theme: {
    lineHeight: {
      'tighter': '1.18',
      'extratight': '0.97',
      'supertight': '0.9',
    },

    extend: {
      screens: {
        '3xl': '2220px',
      },
      fontFamily: {
        roboto: ['var(--font-family-roboto)'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
