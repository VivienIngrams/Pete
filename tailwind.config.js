/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // Include all files in the src folder
    './pages/**/*.{js,ts,jsx,tsx}', // Include both JavaScript and TypeScript files
    './components/**/*.{js,ts,jsx,tsx}', // Include components with both JS/TS
    './app/**/*.{js,ts,jsx,tsx}', // If you're using the App Router in Next.js 13+
  ],
  darkMode: 'media',
  theme: {
    extend: {
      screens: {
        '3xl': '2220px',
      },
      fontFamily: {
        roboto: ['var(--font-family-roboto)'],
      },
    },
    plugins: [require('@tailwindcss/typography')],
  },
}
