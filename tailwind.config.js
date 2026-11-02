/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        brand: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48', // Primary precision crimson
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          coral: '#f43f5e',
          red: '#e11d48',
        }
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 12px 28px -6px rgba(15, 23, 42, 0.09), 0 4px 12px -2px rgba(15, 23, 42, 0.04)',
        'glow-rose': '0 0 24px -4px rgba(225, 29, 72, 0.25)',
      }
    },
  },
  plugins: [],
}
