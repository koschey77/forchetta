import toast from 'react-hot-toast'

export const imageService = {
  // ======================================================================
  // КОНСТАНТЫ И НАСТРОЙКИ
  // ======================================================================
  
  DEFAULTS: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_COUNT: 5,
    VALID_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    VALID_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp']
  },

  // ======================================================================
  // ВАЛИДАЦИЯ ФАЙЛОВ
  // ======================================================================
  
  /**
   * Валидация файлов (из ProductEditor.jsx логики)
   * @param {FileList|File[]} files - файлы для проверки  
   * @param {number} maxCount - максимальное количество
   * @param {number} currentCount - текущее количество изображений
   * @returns {Object} { valid: boolean, files: File[], errors: string[] }
   */
  validateFiles: (files, maxCount = 5, currentCount = 0) => {
    const fileArray = Array.isArray(files) ? files : Array.from(files)
    const totalFiles = currentCount + fileArray.length
    const errors = []
    const validFiles = []

    // Проверка общего количества
    if (totalFiles > maxCount) {
      const canAdd = maxCount - currentCount
      errors.push(`Можна додати ще ${canAdd} зображень (максимум ${maxCount} загальних)`)
      return { valid: false, files: [], errors }
    }

    // Валидация каждого файла
    fileArray.forEach(file => {
      // Проверка типа
      if (!imageService.DEFAULTS.VALID_TYPES.includes(file.type)) {
        errors.push(`Файл ${file.name} має неправильний формат. Підтримувані: JPG, PNG, WebP`)
        return
      }
      
      // Проверка размера  
      if (file.size > imageService.DEFAULTS.MAX_SIZE) {
        errors.push(`Файл ${file.name} занадто великий. Максимум: 5MB`)
        return
      }
      
      validFiles.push(file)
    })

    // Показываем ошибки если есть
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error))
      return { valid: false, files: validFiles, errors }
    }

    return { valid: true, files: validFiles, errors: [] }
  },

  /**
   * Быстрая проверка одного файла (для CategoryEditor)
   */
  validateSingleFile: (file, maxSize = imageService.DEFAULTS.MAX_SIZE) => {
    if (!imageService.DEFAULTS.VALID_TYPES.includes(file.type)) {
      toast.error('Неправильний формат файлу. Підтримувані: JPG, PNG, WebP')
      return false
    }
    
    if (file.size > maxSize) {
      toast.error('Файл занадто великий. Максимум: 5MB')
      return false
    }
    
    return true
  },

  // ======================================================================
  // КОНВЕРТАЦИЯ ФАЙЛОВ
  // ======================================================================
  
  // Конвертация одного файла в base64 (из CategoryEditor.jsx)
  fileToBase64: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  },

  // Конвертация массива файлов в base64
  filesToBase64: async (files) => {
    if (!files || files.length === 0) return []
    
    try {
      const imagePromises = files.map(file => imageService.fileToBase64(file))
      const base64Images = await Promise.all(imagePromises)
      return base64Images
    } catch (error) {
      console.error('Error converting files to base64:', error)
      toast.error('Помилка обробки зображень')
      throw error
    }
  },

  // ======================================================================
  // УПРАВЛЕНИЕ МАССИВАМИ ИЗОБРАЖЕНИЙ
  // ======================================================================
  
  /**
   * Добавление новых файлов к существующему массиву
   */
  addImages: (currentImages, newFiles, maxCount = 5) => {
    const validation = imageService.validateFiles(newFiles, maxCount, currentImages.length)
    
    if (validation.valid) {
      return [...currentImages, ...validation.files]
    }
    
    return currentImages
  },

  /**
   * Удаление изображения по индексу (из ProductEditor.jsx)
   */
  removeImage: (images, index) => {
    return images.filter((_, i) => i !== index)
  },

  /**
   * Очистка всех изображений
   */
  clearImages: () => [],

  /**
   * Получение информации о массиве изображений
   */
  getImagesInfo: (newImages = [], existingImages = [], maxCount = 5) => {
    const totalCount = newImages.length + existingImages.length
    const canAddMore = totalCount < maxCount
    const remainingSlots = maxCount - totalCount
    
    return {
      newCount: newImages.length,
      existingCount: existingImages.length,
      totalCount,
      canAddMore,
      remainingSlots,
      isFull: totalCount >= maxCount
    }
  },

  // ======================================================================
  // СОЗДАНИЕ PREVIEW URL
  // ======================================================================
  
  /**
   * Создание URL для превью новых файлов
   */
  createPreviewUrl: (file) => {
    if (file instanceof File) {
      return URL.createObjectURL(file)
    }
    return null
  },

  /**
   * Получение URL для отображения (новый файл или существующее изображение)
   */
  getDisplayUrl: (image) => {
    // Новый файл 
    if (image instanceof File) {
      return URL.createObjectURL(image)
    }
    
    // Существующее изображение с объектом
    if (image && typeof image === 'object' && image.url) {
      return image.url
    }
    
    // Прямая строка URL
    if (typeof image === 'string') {
      return image
    }
    
    return null
  },

  /**
   * Освобождение памяти от URL объектов
   */
  revokePreviewUrl: (url) => {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url)
    }
  },

  // ======================================================================
  // DRAG & DROP ОБРАБОТЧИКИ
  // ======================================================================
  
  /**
   * Создает набор drag & drop обработчиков с управлением состоянием
   * @param {Function} setIsDragging - функция для управления визуальным состоянием
   * @param {Function} onFilesAdded - функция для добавления файлов
   * @param {number} maxCount - максимальное количество файлов
   * @param {number} currentCount - текущее количество файлов
   */
  createDragHandlers: (setIsDragging, onFilesAdded, maxCount = 5, currentCount = 0) => ({
    handleDragEnter: (e) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(true)
    },

    handleDragLeave: (e) => {
      e.preventDefault()
      e.stopPropagation()
      // Проверяем, что мы действительно покидаем область перетаскивания
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX
      const y = e.clientY
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        setIsDragging(false)
      }
    },

    handleDragOver: (e) => {
      e.preventDefault()
      e.stopPropagation()
      e.dataTransfer.dropEffect = 'copy'
    },

    handleDrop: (e) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files)
      const validation = imageService.validateFiles(files, maxCount, currentCount)
      
      if (validation.valid && validation.files.length > 0) {
        onFilesAdded(validation.files)
      } else if (validation.errors.length > 0) {
        validation.errors.forEach(error => toast.error(error))
      }
    }
  }),

  /**
   * Проверка поддержки drag & drop
   */
  isDragDropSupported: () => {
    return 'draggable' in document.createElement('div') && 'ondrop' in document.createElement('div')
  },

  // ======================================================================
  // УТИЛИТАРНЫЕ ФУНКЦИИ
  // ======================================================================
  
  /**
   * Форматирование размера файла для отображения
   */
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  },

  /**
   * Получение расширения файла
   */
  getFileExtension: (filename) => {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2)
  },

  /**
   * Проверка, является ли файл изображением
   */
  isImageFile: (file) => {
    return file && imageService.DEFAULTS.VALID_TYPES.includes(file.type)
  },

  // ======================================================================
  // ГОТОВЫЕ ХУКИ ДЛЯ КОМПОНЕНТОВ
  // ======================================================================
  
  /**
   * Готовый обработчик для input[type="file"]
   */
  createFileInputHandler: (currentImages, setImages, maxCount = 5) => {
    return (e) => {
      const files = Array.from(e.target.files)
      const newImages = imageService.addImages(currentImages, files, maxCount)
      setImages(newImages)
      
      // Очищаем input для возможности выбора тех же файлов снова  
      e.target.value = ''
    }
  },

  /**
   * Готовый обработчик для удаления изображения
   */
  createRemoveHandler: (images, setImages) => {
    return (index) => {
      const newImages = imageService.removeImage(images, index)
      setImages(newImages)
    }
  },

  /**
   * Набор обработчиков drag & drop для компонента
   */
  createDragDropHandlers: (currentImages, onImagesChange, maxCount = 5) => {
    return {
      onDragEnter: imageService.handleDragEnter,
      onDragLeave: imageService.handleDragLeave, 
      onDragOver: imageService.handleDragOver,
      onDrop: (e) => imageService.handleDrop(
        e, 
        (newFiles) => {
          const updatedImages = imageService.addImages(currentImages, newFiles, maxCount)
          onImagesChange(updatedImages)
        },
        maxCount,
        currentImages.length
      )
    }
  }
}

export default imageService