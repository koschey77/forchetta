import { useState, useEffect } from 'react'
import useCategoryStore from '../../stores/useCategoryStore'
import toast from 'react-hot-toast'

const CategoryEdit = ({ categoryId, onCancel, onSuccess }) => {
  const { updateCategory, getCategoryById, loading } = useCategoryStore()
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })

  const [selectedImage, setSelectedImage] = useState(null)
  const [existingImage, setExistingImage] = useState(null)
  const [dataLoaded, setDataLoaded] = useState(false)

  // Загружаем данные категории при монтировании
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Loading category data for ID:', categoryId)
        
        const category = await getCategoryById(categoryId)
        console.log('Category loaded:', category)
        
        // Заполняем форму данными категории
        setFormData({
          name: category.name || '',
          description: category.description || '',
        })

        // Сохраняем существующее изображение
        setExistingImage(category.image || null)
        setDataLoaded(true)
        
      } catch (error) {
        console.error('Error loading category:', error)
        toast.error('Помилка завантаження категорії')
        if (onCancel) onCancel()
      }
    }

    if (categoryId && !dataLoaded) {
      loadData()
    }
  }, [categoryId, getCategoryById, onCancel, dataLoaded])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Валидация файла
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const maxSize = 5 * 1024 * 1024 // 5MB
    
    if (!validTypes.includes(file.type)) {
      toast.error('Файл має неправильний формат. Підтримувані: JPG, PNG, WebP')
      return
    }
    
    if (file.size > maxSize) {
      toast.error('Файл занадто великий. Максимум: 5MB')
      return
    }

    setSelectedImage(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Базовая валидация
    if (!formData.name || !formData.description) {
      toast.error('Будь ласка, заповніть всі обов\'язкові поля')
      return
    }

    try {
      let imageToSend = null

      // Если есть новое изображение, конвертируем в base64
      if (selectedImage) {
        const imagePromise = new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.readAsDataURL(selectedImage)
        })
        
        imageToSend = await imagePromise
      }
      
      // Подготавливаем данные для отправки
      const categoryData = {
        ...formData,
      }

      // Добавляем изображение только если есть новое
      if (imageToSend) {
        categoryData.image = imageToSend
      }

      await updateCategory(categoryId, categoryData)
      
      if (onSuccess) onSuccess()

    } catch (error) {
      console.error('Error updating category:', error)
    }
  }

  const removeNewImage = () => {
    setSelectedImage(null)
    const fileInput = document.querySelector('input[type="file"]')
    if (fileInput) fileInput.value = ''
  }

  if (loading || !dataLoaded) {
    return (
      <div className="min-h-screen bg-creamy flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-choco-dark mx-auto"></div>
          <p className="mt-4 text-choco-light">Завантаження категорії...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-creamy p-4">
      <div className="max-w-2xl mx-auto">
        {/* Заголовок с кнопкой назад */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={onCancel}
              className="text-choco-light hover:text-choco-dark transition-colors mb-2"
            >
              ← Повернутися до списку
            </button>
            <h1 className="text-3xl font-cormorant font-bold text-choco-dark">
              Редагувати категорію
            </h1>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Название */}
            <div>
              <label className="block text-sm font-medium text-choco-dark mb-2">
                Назва категорії *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-creamy focus:border-transparent"
                placeholder="Наприклад: Торти"
                required
              />
            </div>

            {/* Описание */}
            <div>
              <label className="block text-sm font-medium text-choco-dark mb-2">
                Опис категорії *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-creamy focus:border-transparent resize-none"
                placeholder="Короткий опис категорії..."
                required
              />
            </div>

            {/* Изображения */}
            <div>
              <label className="block text-sm font-medium text-choco-dark mb-2">
                Зображення категорії
              </label>
              
              {/* Существующее изображение */}
              {existingImage && !selectedImage && (
                <div className="mb-4">
                  <h4 className="text-sm text-choco-light mb-2">Поточне зображення:</h4>
                  <div className="relative group inline-block">
                    <img
                      src={existingImage.url}
                      alt="Current"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  </div>
                </div>
              )}

              {/* Новое изображение */}
              {selectedImage && (
                <div className="mb-4">
                  <h4 className="text-sm text-choco-light mb-2">Нове зображення:</h4>
                  <div className="relative group inline-block">
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="New"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={removeNewImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}

              {/* Загрузка изображения */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-dark-creamy transition-colors">
                <div className="space-y-2">
                  <div className="text-4xl">📁</div>
                  <div className="text-choco-light">
                    <label htmlFor="category-image-edit" className="cursor-pointer">
                      <span className="text-dark-creamy hover:text-choco-dark font-medium">
                        {selectedImage || existingImage ? 'Замінити зображення' : 'Натисніть для завантаження'}
                      </span>
                    </label>
                    <input
                      id="category-image-edit"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-choco-light">
                    PNG, JPG, WebP до 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Кнопки */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 text-choco-dark rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Скасувати
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-dark-creamy text-choco-dark rounded-lg hover:bg-choco-light hover:text-creamy transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Оновлення...' : 'Оновити категорію'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CategoryEdit