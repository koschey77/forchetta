/**
 * Сервис для управления и оптимизации видеоматериалов (Cloudinary)
 */
export const videoService = {
  /**
   * Получает оптимизированную ссылку на видео в Cloudinary
   * Автоматически подбирает формат (webm/mp4/etc) и качество
   * 
   * @param {string} url - Исходный Cloudinary URL видео
   * @param {object} options - Опции трансформации (width, height, crop)
   * @returns {string} - Оптимизированный URL
   */
  getOptimizedVideoUrl: (url, options = {}) => {
    if (!url || !url.includes('cloudinary.com/video/upload/')) {
      return url;
    }
    
    try {
      // Стандартная оптимизация качества и формата для видео
      const optimizations = ['q_auto', 'f_auto'];
      
      // Дополнительные параметры обрезки/ресайза если переданы
      if (options.width) optimizations.push(`w_${options.width}`);
      if (options.height) optimizations.push(`h_${options.height}`);
      if (options.crop) optimizations.push(`c_${options.crop}`);
      
      const optString = optimizations.join(',');
      
      // Вставляем трансформации после /upload/
      return url.replace('/upload/', `/upload/${optString}/`);
    } catch (error) {
      console.error('Video optimization error:', error);
      return url; // В случае ошибки возвращаем оригинал
    }
  }
};
