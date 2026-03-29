import { useState, useCallback, useEffect } from 'react';

/**
 * Hook для управления состоянием диапазона цен с локальным и глобальным состоянием
 * @param {Array} initialRange - Начальный диапазон [min, max]
 * @param {Function} onCommit - Callback для применения изменений в глобальное состояние
 * @returns {Object} Объект с localRange и обработчиками
 */
const usePriceRange = (initialRange, onCommit) => {
  const [localRange, setLocalRange] = useState(initialRange);

  // Синхронизируем локальное состояние с пропсами
  useEffect(() => {
    setLocalRange(initialRange);
  }, [initialRange]);

  /**
   * Обработчик для изменений слайдера (только локальное обновление)
   */
  const handleSliderChange = useCallback((newRange) => {
    setLocalRange(newRange);
  }, []);

  /**
   * Обработчик для завершения изменений (глобальное обновление)
   */
  const handleCommit = useCallback((newRange) => {
    setLocalRange(newRange);
    if (onCommit) {
      onCommit(newRange);
    }
  }, [onCommit]);

  /**
   * Обработчик для изменения минимального значения
   */
  const handleMinChange = useCallback((newMin) => {
    const newRange = [newMin, localRange[1]];
    setLocalRange(newRange);
  }, [localRange]);

  /**
   * Обработчик для изменения максимального значения
   */
  const handleMaxChange = useCallback((newMax) => {
    const newRange = [localRange[0], newMax];
    setLocalRange(newRange);
  }, [localRange]);

  /**
   * Обработчик для подтверждения изменений минимального значения
   */
  const handleMinCommit = useCallback((newMin) => {
    const correctedMin = Math.min(Math.max(newMin, 1), localRange[1] - 1);
    const newRange = [correctedMin, localRange[1]];
    handleCommit(newRange);
  }, [localRange, handleCommit]);

  /**
   * Обработчик для подтверждения изменений максимального значения
   */
  const handleMaxCommit = useCallback((newMax) => {
    const correctedMax = Math.max(localRange[0] + 1, Math.min(newMax, 2500));
    const newRange = [localRange[0], correctedMax];
    handleCommit(newRange);
  }, [localRange, handleCommit]);

  return {
    localRange,
    handleSliderChange,
    handleCommit,
    handleMinChange,
    handleMaxChange,
    handleMinCommit,
    handleMaxCommit
  };
};

export default usePriceRange;