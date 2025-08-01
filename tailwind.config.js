// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'], // adjust for your project
  theme: {
    extend: {
      keyframes: {
        shake: {
          '0%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(7deg)' },
          '50%': { transform: 'rotate(-7deg)' },
          '75%': { transform: 'rotate(1deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        storm: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        shake: 'shake 0.5s ease-in-out both',
        storm: 'storm 0.7s ease-in-out both',
      },
    },
  },
  plugins: [],
}
