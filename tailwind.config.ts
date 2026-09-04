import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#12221b',
        canvas: '#f5f7f4',
        // Snapmint-style brand orange
        brand: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        // Slate palette for Snapmint-style text & borders
        slate: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // Trust-green (kept from original moss palette)
        moss: {
          50:  '#effbf4',
          100: '#daf5e5',
          200: '#b7e9cd',
          300: '#85d6aa',
          400: '#4cbb80',
          500: '#299d61',
          600: '#197f4c',
          700: '#17663f',
          800: '#165136',
          900: '#13432e',
          950: '#09261a',
        },
        emerald: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        amber: {
          50:  '#fffbeb',
          100: '#fef3c7',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        coral: '#ff7657',
      },
      boxShadow: {
        soft: '0 20px 60px -32px rgba(18, 34, 27, 0.28)',
        card: '0 8px 30px -18px rgba(18, 34, 27, 0.22)',
        'card-hover': '0 16px 40px -16px rgba(18, 34, 27, 0.32)',
        'emi-selected': '0 10px 25px -10px rgba(249, 115, 22, 0.35)',
        'product-thumb': '0 4px 14px -4px rgba(0,0,0,0.12)',
        'sticky-bar': '0 -8px 30px -8px rgba(0,0,0,0.12)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up':  'fade-up 420ms ease-out both',
        'scale-in': 'scale-in 200ms ease-out both',
      },
    },
  },
  plugins: [forms],
} satisfies Config;
