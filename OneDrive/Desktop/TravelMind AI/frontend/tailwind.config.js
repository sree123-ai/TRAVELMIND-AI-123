/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFDF7',
          100: '#FFF5D8',
          200: '#F9EBC7',
          300: '#F1DCAC',
          400: '#E7C88E',
        },
        borderBrown: '#7A421F',
        borderBrownLight: '#8B4A24',
        textBrown: '#4A2412',
        textBrownDark: '#5A2B15',
        tourOrange: '#F28A20',
        tourGreen: '#7BC52B',
        tourBlue: '#3FA9DD',
        tourPink: '#E84383',
        tourPurple: '#A946D1',
        tourCyan: '#2FB7B7',
        tourGold: '#F6C453'
      },
      boxShadow: {
        'btn-3d': '0 6px 0 #5A2B15',
        'btn-3d-active': '0 2px 0 #5A2B15',
        'card-3d': '0 10px 0 rgba(90,43,21,0.45)',
        'card-subtle': '0 8px 24px rgba(74,36,18,0.25)',
      },
      fontFamily: {
        sans: ['Fredoka', 'Nunito', 'Baloo 2', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
