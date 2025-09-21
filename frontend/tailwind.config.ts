import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2D63F6',
          dark: '#1E44B5'
        }
      }
    },
  },
  plugins: [],
} satisfies Config