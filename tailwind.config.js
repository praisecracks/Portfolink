export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        spinPulse: {
          '0%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(180deg)' },
          '50%': { transform: 'rotate(360deg)' },
          '75%': { transform: 'rotate(540deg)' },
          '100%': { transform: 'rotate(720deg)' },
        },
      },
      animation: {
        'spin-variable': 'spinPulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
