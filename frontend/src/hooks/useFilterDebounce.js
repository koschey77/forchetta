import { useEffect, useState } from 'react';

/**
 * Hook для debounced значений с поддержкой минимальной длины
 * @param {*} value - Исходное значение для debounce
 * @param {number} delay - Задержка в миллисекундах
 * @param {number} minLength - Минимальная длина для активации debounce (по умолчанию 0)
 * @returns {*} Debounced значение
 */
const useFilterDebounce = (value, delay, minLength = 0) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Проверяем минимальную длину для строк или применяем debounce для всех остальных значений
    const shouldDebounce = typeof value === 'string' ? 
      (value.length >= minLength || value.length === 0) : true;

    if (shouldDebounce) {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => clearTimeout(handler);
    } else {
      // Если не проходит проверку minLength, не обновляем debounced значение
      return;
    }
  }, [value, delay, minLength]);

  return debouncedValue;
};

export default useFilterDebounce;