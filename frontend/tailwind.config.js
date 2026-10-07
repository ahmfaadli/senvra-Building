/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#175CD3',
          dark: '#0F3D91',
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#175CD3',
          600: '#1248A8',
          700: '#0F3D91',
        },
        accent: {
          DEFAULT: '#D92D20',
          light: '#FEF3F2',
        },
        dark: '#101828',
        secondary: '#344054',
        gray: '#667085',
        background: '#F5F7FA',
        border: '#E4E7EC',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'Manrope', 'sans-serif'],
      },
      maxWidth: {
        'screen-xl': '1280px',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
