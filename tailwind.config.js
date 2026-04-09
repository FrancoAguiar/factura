/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0066FF',
          hover: '#0052CC',
          bg: '#0A0A0A',
          surface: '#121212',
          card: '#161616',
          border: '#262626'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Inter Tight', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 40px -10px rgba(0, 102, 255, 0.4)',
        'glow-hover': '0 0 50px -5px rgba(0, 102, 255, 0.6)',
        'sheet': '0 0 0 1px rgba(255,255,255,0.05), 0 20px 40px -10px rgba(0,0,0,0.6)',
        'card': '0 0 0 1px rgba(255,255,255,0.05), 0 4px 20px rgba(0,0,0,0.4)',
      },
      animation: {
        'float': 'float 5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(-2deg)' },
          '50%': { transform: 'translateY(-5px) rotate(0deg)' },
        }
      }
    },
  },
  plugins: [],
}
