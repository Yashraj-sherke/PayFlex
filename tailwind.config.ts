import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#12221b',
        canvas: '#f5f7f4',
        moss: {
          50: '#effbf4',
          100: '#daf5e5',
          200: '#b7e9cd',
          300: '#85d6aa',
          400: '#4cbb80',
          500: '#299d61',
          600: '#197f4c',
          700: '#17663f',
          800: '#165136',
          900: '#13432e',
          950: '#09261a'
        },
        coral: '#ff7657',
      },
      boxShadow: {
        soft: '0 20px 60px -32px rgba(18, 34, 27, 0.28)',
        card: '0 8px 30px -18px rgba(18, 34, 27, 0.22)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      fontFamily: {
        sans: ['Inter', 'Avenir Next', 'Segoe UI', 'Helvetica Neue', 'sans-serif'],
        display: ['Manrope', 'Avenir Next', 'Segoe UI', 'sans-serif'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 420ms ease-out both',
      },
    },
  },
  plugins: [forms],
} satisfies Config;
