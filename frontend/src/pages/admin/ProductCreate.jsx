import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productsAPI, categoriesAPI } from '../../services/api'
import { PRODUCT_ENUMS } from '../../constants/enums'
import { MenuDropdown } from '../../components/ui/dropdowns'
import toast from 'react-hot-toast'

const ProductCreate = ({ onSuccess }) => {
  const queryClient = useQueryClient()
  
  // Загрузка категорий
  const { 
    data: categories = [], 
    isLoading: categoriesLoading 
  } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: categoriesAPI.getAll,
    staleTime: 60 * 1000,
  })
  
  // Mutation для создания товара
  const createProductMutation = useMutation({
    mutationFn: productsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      toast.success('Товар створено успішно!')
      if (onSuccess) onSuccess()
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Помилка створення товару')
    },
  })
  
  // Используем константы из файла (БЕЗ ХАРДКОДА!)
  const shelfLifeOptions = PRODUCT_ENUMS.shelfLife
  const storageOptions = PRODUCT_ENUMS.storageConditions
  
  // Подготовка данных для MenuDropdown
  const categoryOptions = categories.map(category => ({
    value: category._id,
    label: category.name
  }))
  
  const shelfLifeDropdownOptions = shelfLifeOptions.map(option => ({
    value: option,
    label: option
  }))
  
  const storageDropdownOptions = storageOptions.map(option => ({
    value: option,
    label: option
  }))
  const [formData, setFormData] = useState({
    name: '',
    summary: '',
    description: '',
    ingredients: '',
    contains: {
      lactose: false,
      gluten: false,
      nuts: false,
      palmOil: false
    },
    weight: '',
    price: '',
    discountPrice: '',
    category: '',
    qty: '',
    shelfLife: '',
    storageConditions: '',
    isFeatured: false,
    images: []  // Добавляем поле для изображений
  })

  const [selectedImages, setSelectedImages] = useState([])  // Состояние для выбранных файлов

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name.startsWith('contains.')) {
      const containsKey = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        contains: {
          ...prev.contains,
          [containsKey]: checked
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    const maxImages = 5
    
    // Проверяем общее количество (уже выбранные + новые)
    const totalImages = selectedImages.length + files.length
    if (totalImages > maxImages) {
      toast.error(`Можна додати ще ${maxImages - selectedImages.length} зображень (максимум ${maxImages} загальних)`)
      return
    }

    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      const maxSize = 5 * 1024 * 1024 // 5MB
      
      if (!validTypes.includes(file.type)) {
        toast.error(`Файл ${file.name} має неправильний формат. Підтримувані: JPG, PNG, WebP`)
        return false
      }
      
      if (file.size > maxSize) {
        toast.error(`Файл ${file.name} занадто великий. Максимум: 5MB`)
        return false
      }
      
      return true
    })

    // Добавляем новые файлы к уже выбранным
    setSelectedImages(prevImages => [...prevImages, ...validFiles])
    
    // Очищаем input для возможности выбора тех же файлов снова
    e.target.value = ''
  }

  // Обработчики для dropdown'ов
  const handleCategoryChange = (value) => {
    setFormData(prev => ({ ...prev, category: value }))
  }

  const handleShelfLifeChange = (value) => {
    setFormData(prev => ({ ...prev, shelfLife: value }))
  }

  const handleStorageConditionsChange = (value) => {
    setFormData(prev => ({ ...prev, storageConditions: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Базовая валидация
    if (!formData.name || !formData.description || !formData.price || !formData.category || !formData.qty || !formData.shelfLife || !formData.storageConditions) {
      toast.error('Будь ласка, заповніть всі обов\'язкові поля')
      return
    }

    try {
      // Конвертируем изображения в base64 для отправки
      const imagePromises = selectedImages.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.readAsDataURL(file)
        })
      })
      
      const base64Images = await Promise.all(imagePromises)
      
      // Подготавливаем данные для отправки, включая base64 изображения
      const productData = {
        ...formData,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : 0,
        weight: formData.weight ? Number(formData.weight) : 0,
        qty: Number(formData.qty),
        images: base64Images  // Отправляем base64 строки
      }

      createProductMutation.mutate(productData, {
        onSuccess: () => {
          // Очищаем форму
          setFormData({
            name: '',
            summary: '',
            description: '',
            ingredients: '',
            contains: { lactose: false, gluten: false, nuts: false, palmOil: false },
            weight: '',
            price: '',
            discountPrice: '',
            category: '',
            qty: '',
            shelfLife: '',
            storageConditions: '',
            isFeatured: false,
            images: []
          })
          setSelectedImages([])  // Очищаем выбранные изображения
        }
      })

    } catch (error) {
      console.error('Error preparing product data:', error)
      toast.error('Помилка підготовки даних')
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-cormorant font-bold text-choco-dark mb-6">Додати новий товар</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Название */}
          <div>
            <label className="block text-sm font-medium text-choco-dark mb-2">
              Назва товару *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-creamy focus:border-transparent"
              required
            />
          </div>

          {/* Категория */}
          <div>
            <label className="block text-sm font-medium text-choco-dark mb-2">
              Категорія *
            </label>
            <MenuDropdown
              variant="default"
              options={categoryOptions}
              selected={formData.category}
              onChange={handleCategoryChange}
              placeholder={categoriesLoading ? "Завантаження..." : "Оберіть категорію"}
              showCheckmarks={false}
            />
          </div>
        </div>

        {/* Изображения - отдельная секция */}
        <div>
          <label className="block text-sm font-medium text-choco-dark mb-2">
            Зображення товару (максимум 5) - можна додавати по одному або кілька разом
          </label>
          <div className="space-y-3">
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-creamy focus:border-transparent file:mr-3 file:px-3 file:py-1 file:border-0 file:bg-dark-creamy file:text-choco-dark file:rounded"
            />
            {selectedImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {selectedImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Превью ${index + 1}`}
                      className="w-full h-24 object-cover rounded border"
                    />
                    <div className="absolute -top-2 -right-2">
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = selectedImages.filter((_, i) => i !== index)
                          setSelectedImages(newImages)
                        }}
                        className="w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {selectedImages.length > 0 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-choco-light">
                  Обрано {selectedImages.length} з 5 зображень. Можна додати ще {5 - selectedImages.length}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedImages([])}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Очистити всі
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{/* теперь второй блок с ценами и количеством */}

          {/* Цена */}
          <div>
            <label className="block text-sm font-medium text-choco-dark mb-2">
              Ціна (грн) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-creamy focus:border-transparent"
              required
            />
          </div>

          {/* Цена со скидкой */}
          <div>
            <label className="block text-sm font-medium text-choco-dark mb-2">
              Ціна зі знижкою (грн)
            </label>
            <input
              type="number"
              name="discountPrice"
              value={formData.discountPrice}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-creamy focus:border-transparent"
            />
          </div>

          {/* Количество */}
          <div>
            <label className="block text-sm font-medium text-choco-dark mb-2">
              Кількість *
            </label>
            <input
              type="number"
              name="qty"
              value={formData.qty}
              onChange={handleInputChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-creamy focus:border-transparent"
              required
            />
          </div>

          {/* Вес */}
          <div>
            <label className="block text-sm font-medium text-choco-dark mb-2">
              Вага (г)
            </label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-creamy focus:border-transparent"
            />
          </div>

          {/* Срок годности */}
          <div>
            <label className="block text-sm font-medium text-choco-dark mb-2">
              Термін придатності *
            </label>
            <MenuDropdown
              variant="default"
              options={shelfLifeDropdownOptions}
              selected={formData.shelfLife}
              onChange={handleShelfLifeChange}
              placeholder="Оберіть термін"
              showCheckmarks={false}
            />
          </div>

          {/* Условия хранения */}
          <div>
            <label className="block text-sm font-medium text-choco-dark mb-2">
              Умови зберігання *
            </label>
            <MenuDropdown
              variant="default"
              options={storageDropdownOptions}
              selected={formData.storageConditions}
              onChange={handleStorageConditionsChange}
              placeholder="Оберіть умови"
              showCheckmarks={false}
            />
          </div>
        </div>

        {/* Краткое описание */}
        <div>
          <label className="block text-sm font-medium text-choco-dark mb-2">
            Короткий опис
          </label>
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleInputChange}
            rows="2"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-creamy focus:border-transparent"
            placeholder="Короткий опис товару..."
          />
        </div>

        {/* Описание */}
        <div>
          <label className="block text-sm font-medium text-choco-dark mb-2">
            Повний опис *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="6"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-creamy focus:border-transparent"
            placeholder="Детальний опис товару..."
            required
          />
        </div>

        {/* Ингредиенты */}
        <div>
          <label className="block text-sm font-medium text-choco-dark mb-2">
            Склад (інгредієнти)
          </label>
          <textarea
            name="ingredients"
            value={formData.ingredients}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-creamy focus:border-transparent"
            placeholder="Список інгредієнтів..."
          />
        </div>

        {/* Аллергены */}
        <div>
          <label className="block text-sm font-medium text-choco-dark mb-3">
            Містить алергени
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(formData.contains).map(([key, value]) => (
              <label key={key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name={`contains.${key}`}
                  checked={value}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-dark-creamy focus:ring-dark-creamy"
                />
                <span className="text-sm text-choco-light">
                  {key === 'lactose' && 'Лактоза'}
                  {key === 'gluten' && 'Глютен'}
                  {key === 'nuts' && 'Горіхи'}
                  {key === 'palmOil' && 'Пальмова олія'}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Featured товар */}
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-dark-creamy focus:ring-dark-creamy"
            />
            <span className="text-sm text-choco-dark">Рекомендований товар</span>
          </label>
        </div>

        {/* Кнопка отправки */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={createProductMutation.isPending}
            className={`w-full md:w-auto px-8 py-3 rounded-lg font-montserrat font-medium transition-colors ${
              createProductMutation.isPending
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-choco-dark text-creamy hover:bg-choco-light'
            }`}
          >
            {createProductMutation.isPending ? 'Створення...' : 'Створити товар'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProductCreate