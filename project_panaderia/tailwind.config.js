/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFF7ED',
          100: '#FEE7D3',
        },
        orange: {
          100: '#FDBA74',
          300: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          800: '#C2410C',
        },
        amber: {
          900: '#7C2D12',
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}