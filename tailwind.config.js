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
        'primary': {
          DEFAULT: 'var(--primary)',
          '50': 'color-mix(in srgb, var(--primary) 50%, transparent)',
          '90': 'color-mix(in srgb, var(--primary) 90%, transparent)',
        },
        'secondary': {
          DEFAULT: 'var(--secondary)',
          '50': 'color-mix(in srgb, var(--secondary) 50%, transparent)',
          '90': 'color-mix(in srgb, var(--secondary) 90%, transparent)',
        },
        'dark-bg': 'var(--dark-bg)',
        'dark-card': 'var(--dark-card)',
        'light': 'var(--light)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.05), 0 8px 10px -6px rgb(0 0 0 / 0.05)',
      },
    },
  },
  plugins: [],
}
