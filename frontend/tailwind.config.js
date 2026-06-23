export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#16192e', // Sidebar background
          accent: '#1e2440', // Sidebar active
          primary: '#262d4a',
          purple: '#6d4cff', // Some highlights
          green: '#22c55e',
        },
        background: '#f8fafc',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
