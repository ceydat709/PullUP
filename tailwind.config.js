/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    theme: {
      extend: {
        keyframes: {
          'spin-die': {
            from: { transform: 'rotate(0deg)' },
            to: { transform: 'rotate(360deg)' },
          },
        },
        animation: {
          'spin-die': 'spin-die 0.6s ease-in-out',
        },
      },
    },
    plugins: [],
  };
  