/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Базовые цвета для будущих компонентов
        brand: {
          bg: '#F5F2E9',
          dark: '#2A1C14',
          text: '#4A3A32',
          accent: '#8B5A33',
        },
        // Цвета для страницы регистрации из Figma
        auth: {
          bg: '#F5EEE0',     
          primary: '#8B7355',
          text: '#8B7355',   
          light: '#F5EEE0',  
          border: '#8B7355'  
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
