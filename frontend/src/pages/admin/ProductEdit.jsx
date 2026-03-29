import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productsAPI, categoriesAPI } from '../../services/api'
import { PRODUCT_ENUMS } from '../../constants/enums'
import toast from 'react-hot-toast'

const ProductEdit = ({ productId, onCancel, onSuccess }) => {
  const queryClient = useQueryClient()
  
  // Загрузка товара по ID
  const { 
    data: product, 
    isLoading: productLoading, 
    error: productError 
  } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productsAPI.getById(productId),
    enabled: !!productId,
  })
  
  // Загрузка категорий
  const { 
    data: categories = [], 
    isLoading: categoriesLoading 
  } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: categoriesAPI.getAll,
    staleTime: 60 * 1000,
  })
  
  // Mutation для обновления товара
  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }) => productsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      queryClient.invalidateQueries({ queryKey: ['product', productId] })
      toast.success('Товар оновлено успішно!')
      if (onSuccess) onSuccess()
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Помилка оновлення товару')
    },
  })
  
  // Используем константы из файла (БЕЗ ХАРДКОДА!)
  const shelfLifeOptions = PRODUCT_ENUMS.shelfLife
  const storageOptions = PRODUCT_ENUMS.storageConditions
  
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
    isFeatured: false
  })

  const [selectedImages, setSelectedImages] = useState([])
  const [existingImages, setExistingImages] = useState([])

  // Заполняем форму данными товара из TanStack Query
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        summary: product.summary || '',
        description: product.description || '',
        ingredients: product.ingredients || '',
        contains: {
          lactose: product.contains?.lactose || false,
          gluten: product.contains?.gluten || false,
          nuts: product.contains?.nuts || false,
          palmOil: product.contains?.palmOil || false,
        },
        weight: product.weight || '',
        price: product.price || '',
        discountPrice: product.discountPrice || '',
        category: product.category?._id || '',
        qty: product.qty || '',
        shelfLife: product.shelfLife || '',
        storageConditions: product.storageConditions || '',
        isFeatured: product.isFeatured || false
      })
      setExistingImages(product.images || [])
    }
  }, [product])

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
    
    // Проверяем общее количество (существующие + новые)
    const totalImages = existingImages.length + selectedImages.length + files.length
    if (totalImages > maxImages) {
      toast.error(`Максимум ${maxImages} зображень (зараз: ${existingImages.length} існуючих + ${selectedImages.length} нових)`)
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

    setSelectedImages(prevImages => [...prevImages, ...validFiles])
    e.target.value = ''
  }

  const removeNewImage = (index) => {
    setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index))
  }

  const removeExistingImage = (index) => {
    setExistingImages(prevImages => prevImages.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Базовая валидация
    if (!formData.name || !formData.description || !formData.price || !formData.category || !formData.qty || !formData.shelfLife || !formData.storageConditions) {
      toast.error('Будь ласка, заповніть всі обов\'язкові поля')
      return
    }

    // Проверяем что есть хотя бы одно изображение
    if (existingImages.length === 0 && selectedImages.length === 0) {
      toast.error('Додайте хоча б одне зображення')
      return
    }

    // Подготавливаем изображения для отправки
    let imagesToSend = null

    // Если есть новые изображения, конвертируем их в base64
    if (selectedImages.length > 0) {
      const imagePromises = selectedImages.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.readAsDataURL(file)
        })
      })
      
      imagesToSend = await Promise.all(imagePromises)
    }
    
    // Подготавливаем данные для отправки
    const productData = {
        ...formData,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : 0,
        weight: formData.weight ? Number(formData.weight) : 0,
        qty: Number(formData.qty),
      // Передаем существующие изображения (после возможного удаления)
      existingImages: existingImages,
    }

    // Добавляем новые изображения если есть
    if (imagesToSend) {
      productData.images = imagesToSend
    }

    // Используем TanStack Query mutation
    updateProductMutation.mutate(
      { id: productId, data: productData },
      {
        onSuccess: () => {
          if (onSuccess) onSuccess()
        }
      }
    )
  }

  if (productLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-creamy flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-choco-dark mx-auto"></div>
          <p className="mt-4 text-choco-light">Завантаження товару...</p>
        </div>
      </div>
    )
  }

  // Обработка ошибки загрузки товара
  if (productError) {
    return (
      <div className="min-h-screen bg-creamy p-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={onCancel}
            className="text-choco-light hover:text-choco-dark transition-colors mb-4"
          >
            ← Повернутися до списку
          </button>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-choco-dark mb-2">Помилка завантаження</h2>
            <p className="text-choco-light">Не вдалося завантажити товар для редагування</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-creamy p-4">
      <div className="max-w-3xl mx-auto">
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
              Редагувати товар
            </h1>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Основная информация */}
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
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-creamy focus:border-transparent"
                  required
                  disabled={categoriesLoading}
                >
                  <option value="">
                    {categoriesLoading ? "Завантаження..." : "Оберіть категорію"}
                  </option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
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
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-creamy focus:border-transparent resize-none"
                placeholder="Короткий опис для карточки товару"
              />
            </div>

            {/* Полное описание */}
            <div>
              <label className="block text-sm font-medium text-choco-dark mb-2">
                Повний опис *
              </label>
              <textarea
                name="description" 
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-creamy focus:border-transparent resize-none"
                placeholder="Детальний опис товару"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ингредиенты */}
              <div>
                <label className="block text-sm font-medium text-choco-dark mb-2">
                  Склад
                </label>
                <textarea
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-creamy focus:border-transparent resize-none"
                  placeholder="Перелік інгредієнтів"
                />
              </div>

              {/* Аллергены */}
              <div>
                <label className="block text-sm font-medium text-choco-dark mb-2">
                  Містить алергени
                </label>
                <div className="space-y-2">
                  {[
                    { key: 'lactose', label: 'Лактозу' },
                    { key: 'gluten', label: 'Глютен' },
                    { key: 'nuts', label: 'Горіхи' },
                    { key: 'palmOil', label: 'Пальмову олію' }
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        name={`contains.${key}`}
                        checked={formData.contains[key]}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-dark-creamy focus:ring-dark-creamy"
                      />
                      <span className="ml-2 text-sm text-choco-light">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Цена */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-choco-dark mb-2">
                  Кількість на складі *
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

              <div>
                <label className="block text-sm font-medium text-choco-dark mb-2">
                  Термін зберігання *
                </label>
                <select
                  name="shelfLife"
                  value={formData.shelfLife}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-creamy focus:border-transparent"
                  required
                >
                  <option value="">Оберіть термін</option>
                  {shelfLifeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-choco-dark mb-2">
                  Умови зберігання *
                </label>
                <select
                  name="storageConditions"
                  value={formData.storageConditions}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-creamy focus:border-transparent"
                  required
                >
                  <option value="">Оберіть умови</option>
                  {storageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Изображения */}
            <div>
              <label className="block text-sm font-medium text-choco-dark mb-2">
                Зображення товару
              </label>
              
              {/* Существующие изображения */}
              {existingImages.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm text-choco-light mb-2">Поточні зображення:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {existingImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image.url}
                          alt={`Existing ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Новые изображения */}
              {selectedImages.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm text-choco-light mb-2">Нові зображення:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {selectedImages.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`New ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Добавление новых изображений */}
              {(existingImages.length + selectedImages.length) < 5 && (
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-creamy focus:border-transparent"
                />
              )}
              
              <p className="text-xs text-choco-light mt-2">
                Можна додати {5 - existingImages.length - selectedImages.length} зображень 
                (загалом: {existingImages.length + selectedImages.length}/5)
              </p>
            </div>

            {/* Рекомендуемый товар */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-dark-creamy focus:ring-dark-creamy"
                />
                <span className="ml-2 text-sm text-choco-dark">Рекомендований товар</span>
              </label>
            </div>

            {/* Кнопки */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 text-choco-dark rounded-lg hover:bg-gray-50 transition-colors"
                disabled={updateProductMutation.isPending}
              >
                Скасувати
              </button>
              <button
                type="submit"
                disabled={updateProductMutation.isPending}
                className="px-6 py-2 bg-dark-creamy text-choco-dark rounded-lg hover:bg-choco-light hover:text-creamy transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateProductMutation.isPending ? 'Оновлення...' : 'Оновити товар'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProductEdit