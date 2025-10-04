/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Severity color system
        severity: {
          high: {
            bg: 'bg-red-50',
            text: 'text-red-800',
            border: 'border-red-200',
            badge: 'bg-red-100 text-red-800',
            ring: 'ring-red-200'
          },
          warning: {
            bg: 'bg-yellow-50',
            text: 'text-yellow-800',
            border: 'border-yellow-200',
            badge: 'bg-yellow-100 text-yellow-800',
            ring: 'ring-yellow-200'
          },
          info: {
            bg: 'bg-blue-50',
            text: 'text-blue-800',
            border: 'border-blue-200',
            badge: 'bg-blue-100 text-blue-800',
            ring: 'ring-blue-200'
          },
          secure: {
            bg: 'bg-green-50',
            text: 'text-green-800',
            border: 'border-green-200',
            badge: 'bg-green-100 text-green-800',
            ring: 'ring-green-200'
          }
        },
        // App-specific colors
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
