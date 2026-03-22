import { useState } from 'react'
import useCategoryStore from '../../stores/useCategoryStore'
import toast from 'react-hot-toast'

const CategoryCreate = ({ onSuccess }) => {
  const { createCategory, loading } = useCategoryStore()
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })

  const [selectedImage, setSelectedImage] = useState(null)

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

    if (!selectedImage) {
      toast.error('Будь ласка, додайте зображення категорії')
      return
    }

    try {
      // Конвертируем изображение в base64 для отправки
      const imagePromise = new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.readAsDataURL(selectedImage)
      })
      
      const base64Image = await imagePromise
      
      // Подготавливаем данные для отправки
      const categoryData = {
        ...formData,
        image: base64Image
      }

      await createCategory(categoryData)

      // Очищаем форму после успешного создания
      setFormData({
        name: '',
        description: '',
      })
      setSelectedImage(null)
      
      // Очищаем input файла
      const fileInput = document.querySelector('input[type="file"]')
      if (fileInput) fileInput.value = ''
      
      // Переходим в список товаров
      if (onSuccess) {
        onSuccess()
      }

    } catch (error) {
      console.error('Error creating category:', error)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    const fileInput = document.querySelector('input[type="file"]')
    if (fileInput) fileInput.value = ''
  }

  return (
    <div className="min-h-screen bg-creamy p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-cormorant font-bold text-choco-dark mb-6">
            Додати нову категорію
          </h2>

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

            {/* Изображение */}
            <div>
              <label className="block text-sm font-medium text-choco-dark mb-2">
                Зображення категорії *
              </label>
              
              {!selectedImage ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-dark-creamy transition-colors">
                  <div className="space-y-2">
                    <div className="text-4xl">📁</div>
                    <div className="text-choco-light">
                      <label htmlFor="category-image" className="cursor-pointer">
                        <span className="text-dark-creamy hover:text-choco-dark font-medium">
                          Натисніть для завантаження
                        </span>
                        <span className="text-choco-light"> або перетягніть файл</span>
                      </label>
                      <input
                        id="category-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        required
                      />
                    </div>
                    <p className="text-xs text-choco-light">
                      PNG, JPG, WebP до 5MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="border border-gray-300 rounded-lg p-4">
                    <div className="flex items-center space-x-4">
                      {/* Превью изображения */}
                      <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={URL.createObjectURL(selectedImage)}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      
                      {/* Информация о файле */}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-choco-dark">
                          {selectedImage.name}
                        </p>
                        <p className="text-xs text-choco-light">
                          {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      
                      {/* Кнопка удаления */}
                      <button
                        type="button"
                        onClick={removeImage}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Видалити зображення"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Кнопки */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => {
                  setFormData({ name: '', description: '' })
                  setSelectedImage(null)
                  const fileInput = document.querySelector('input[type="file"]')
                  if (fileInput) fileInput.value = ''
                }}
                className="px-6 py-2 border border-gray-300 text-choco-dark rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Очистити
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-dark-creamy text-choco-dark rounded-lg hover:bg-choco-light hover:text-creamy transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Створення...' : 'Створити категорію'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CategoryCreate