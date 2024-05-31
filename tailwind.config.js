/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors:{
        'custom-green': '#0af0b2',
        'custom-voilet': '#9a84e8',
      }
      
    },
  },
  plugins: [],
};