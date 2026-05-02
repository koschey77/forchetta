import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Компонент для автоматичної прокрутки до початку сторінки при зміні роуту
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Прокручуємо до початку сторінки при зміні роуту
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
};

export default ScrollToTop;