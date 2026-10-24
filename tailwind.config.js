/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#070a12',
          cyan: '#00f0ff',
          emerald: '#00ff9d',
          amber: '#ffb800',
          rose: '#ff2a6d'
        }
      }
    },
  },
  plugins: [],
}
