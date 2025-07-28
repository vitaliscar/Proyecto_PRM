/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // Scan all source files for Tailwind classes
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E6F0FA', // Azul claro
        secondary: '#E8F5E9', // Verde pastel
        neutral: '#F7F7F7', // Gris claro
        accent: '#4B6CB7', // Azul principal
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};