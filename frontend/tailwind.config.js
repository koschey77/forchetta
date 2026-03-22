/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Основные цвета бренда
        'light-gray': '#F5F7F8',      // Светлый серый фон
        'creamy': '#F5EEE0',          // Кремовый (основной светлый)
        'choco-light': '#705A5A',     // Коричневый светлый
        'choco-light-50': '#705A5A80',  // Коричневый светлый 50% для hover
        'dark-creamy': '#E3D6BF',     // Темный кремовый
        'choco-dark': '#2B1A12',      // Коричневый темный
        'wine-red': '#893E3E',        // Винный красный (для акций)
        
        // Градиенты и дополнительные
        'gradient-start': '#F5F7F8',  // Начало линейного градиента
        'gradient-end': '#F5EEE0',    // Конец линейного градиента
        
        // Семантические цвета
        background: {
          primary: '#F5F7F8',         // Основной фон
          secondary: '#F5EEE0',       // Вторичный фон  
          card: '#FFFFFF',            // Фон карточек
        },
        text: {
          primary: '#2B1A12',         // Основной текст (choco-dark)
          secondary: '#705A5A',       // Вторичный текст (choco-light)
          accent: '#F5EEE0',          // Акцентный текст на темном фоне
        },
        border: {
          main: '#705A5A',            // Основные границы
          light: '#F5EEE0',           // Светлые границы
        },
        button: {
          primary: '#E3D6BF',         // Основные кнопки (каталог)
          secondary: '#2B1A12',       // Темные кнопки (новинка)
          accent: '#893E3E',          // Акцентные кнопки (скидки)
        }
      },
      fontFamily: {
        // Шрифты из дизайн-системы Figma
        'sans': ['Montserrat', 'sans-serif'],           // Основной шрифт для UI
        'serif': ['Cormorant Garamond', 'serif'],       // Декоративный шрифт для заголовков
        'montserrat': ['Montserrat', 'sans-serif'],     // Явное указание Montserrat
        'cormorant': ['Cormorant Garamond', 'serif'],   // Явное указание Cormorant Garamond
      },
      // Точные размеры шрифтов из Figma
      fontSize: {
        // Montserrat размеры из макета
        'figma-xs': ['12px', { lineHeight: '15px' }],    // Лейблы (Новинка, Топ продажів)
        'figma-sm': ['13px', { lineHeight: '16px' }],    // Breadcrumbs (Головна / Каталог)
        'figma-base': ['14px', { lineHeight: '17px' }],  // Цены товаров (150 грн / 150 г)
        'figma-md': ['16px', { lineHeight: '20px' }],    // Навигация (Каталог, Новинки)
        'figma-lg': ['18px', { lineHeight: '22px' }],    // Заголовки продуктов
        'figma-xl': ['20px', { lineHeight: '24px' }],    // Заголовки фильтров (Фільтри, Сортування)
        
        // Cormorant Garamond размеры
        'figma-hero': ['60px', { lineHeight: '73px' }],  // Главные заголовки (Каталог товарів)
      },
      // Font weights специально для Figma дизайна
      fontWeight: {
        'figma-regular': '400',   // Montserrat обычный
        'figma-medium': '500',    // Montserrat средний
        'figma-semibold': '600',  // Montserrat полужирный
        'figma-bold': '700',      // Cormorant Garamond жирный
      },
      // Готовые градиенты из Figma
      backgroundImage: {
        'main-gradient': 'linear-gradient(180deg, #F5F7F8 0%, #F5EEE0 100%)',
      }
    },
  },
  plugins: [],
}
