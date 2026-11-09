/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        // Deep indigo-navy surfaces shared by the top bar, dashboard hero and AI panel
        ink: {
          950: '#0b0a24',
          900: '#121034',
          800: '#1a1748',
          700: '#24205e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        'soft': '0 2px 10px -1px rgba(0, 0, 0, 0.04), 0 1px 3px -1px rgba(0, 0, 0, 0.02)',
        'soft-md': '0 6px 20px -2px rgba(0, 0, 0, 0.07), 0 2px 6px -2px rgba(0, 0, 0, 0.03)',
        'soft-lg': '0 12px 30px -4px rgba(0, 0, 0, 0.1), 0 4px 12px -3px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 25px -5px rgba(99, 102, 241, 0.35)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
        // Light, layered shadows: cards should float, not look outlined
        'card': '0 1px 2px rgba(16, 24, 40, 0.04), 0 1px 3px rgba(16, 24, 40, 0.03)',
        'card-hover': '0 1px 2px rgba(16, 24, 40, 0.04), 0 12px 28px -10px rgba(30, 27, 75, 0.18)',
        'hero': '0 1px 2px rgba(11, 10, 36, 0.2), 0 18px 40px -18px rgba(30, 27, 94, 0.55)',
        'glow-lg': '0 18px 50px -12px rgba(79, 70, 229, 0.55)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        scaleUp: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -12px, 0)' },
        },
        // Uses the standalone `translate` property so hover transforms still apply after entry
        rise: {
          '0%': { opacity: '0', translate: '0 14px' },
          '100%': { opacity: '1', translate: 'none' },
        },
        // Bottom sheet entrance (mobile modals)
        sheetUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        sheetDown: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        },
        scaleDown: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.96)' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        // Tab icon pop when a tab becomes active
        tabPop: {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.22) translateY(-2px)' },
          '70%': { transform: 'scale(0.94)' },
          '100%': { transform: 'scale(1)' },
        },
        // Page change: quick fade + small rise
        pageIn: {
          '0%': { opacity: '0', translate: '0 8px' },
          '100%': { opacity: '1', translate: 'none' },
        },
        growX: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-right': 'slideRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-up': 'scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulseSlow 2.5s infinite',
        'gradient-shift': 'gradientShift 14s ease infinite',
        'float': 'float 9s ease-in-out infinite',
        'rise': 'rise 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'sheet-up': 'sheetUp 0.32s cubic-bezier(0.32, 0.72, 0, 1) both',
        'sheet-down': 'sheetDown 0.22s cubic-bezier(0.4, 0, 1, 1) both',
        'scale-down': 'scaleDown 0.16s cubic-bezier(0.4, 0, 1, 1) both',
        'fade-out': 'fadeOut 0.2s ease-in both',
        'tab-pop': 'tabPop 0.42s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'page-in': 'pageIn 0.28s cubic-bezier(0.16, 1, 0.3, 1) both',
        'grow-x': 'growX 0.9s cubic-bezier(0.16, 1, 0.3, 1) both',
      }
    },
  },
  plugins: [],
}
