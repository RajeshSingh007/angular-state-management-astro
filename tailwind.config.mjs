/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          red: '#dd0031',
          dark: '#1a1a2e',
          navy: '#0f3460',
        },
      },
    },
  },
  plugins: [],
};
