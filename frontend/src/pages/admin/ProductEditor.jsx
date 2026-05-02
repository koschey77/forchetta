import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { productsAPI, categoriesAPI } from '../../services/api'
import { PRODUCT_ENUMS } from '../../constants/enums'
import { CloseIcon, CheckboxIcon } from '../../components/icons'
import imageService from '../../services/imageService'

const ProductEditor = ({ productId = null, onCancel, onSuccess }) => {
  const queryClient = useQueryClient()
  const isEdit = productId !== null
  
  // Стан форми
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
    images: []
  })

  // Состояния для изображений
  const [selectedImages, setSelectedImages] = useState([]) // Нові файли
  const [existingImages, setExistingImages] = useState([]) // Существующие изображения (при редактировании)
  const [isDragging, setIsDragging] = useState(false)

  // Загрузка продукта для редактирования
  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productsAPI.getById(productId),
    enabled: isEdit && !!productId,
    staleTime: 0, // Завжди завантажуємо свіжі дані для редагування
    refetchOnMount: true, // Перезагружаем при каждом монтировании
  })

  // Загрузка категорий
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: categoriesAPI.getAll,
    staleTime: 5 * 60 * 1000
  })

  // Мутация для создания/обновления
  const saveMutation = useMutation({
    mutationFn: (data) => {
      return isEdit 
        ? productsAPI.update(productId, data)
        : productsAPI.create(data)
    },
    onSuccess: () => {
      // Інвалідуємо кеші: загальний список + конкретний товар
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      if (isEdit) {
        queryClient.invalidateQueries({ queryKey: ['product', productId] })
      }
      toast.success(isEdit ? 'Товар оновлено!' : 'Товар створено!')
      if (onSuccess) onSuccess()
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Помилка збереження')
    }
  })

  // Заповнення форми при завантаженні
  useEffect(() => {
    if (product && isEdit) {
      setFormData({
        name: product.name || '',
        summary: product.summary || '',
        description: product.description || '',
        ingredients: product.ingredients || '',
        contains: product.contains || {
          lactose: false,
          gluten: false,
          nuts: false,
          palmOil: false
        },
        weight: product.weight || '',
        price: product.price || '',
        discountPrice: product.discountPrice || '',
        category: product.category?._id || '',
        qty: product.qty || '',
        shelfLife: product.shelfLife || '',
        storageConditions: product.storageConditions || '',
        isFeatured: product.isFeatured || false,
        images: product.images || []
      })
      
      // Загружаем существующие изображения и очищаем новие
      setExistingImages(product.images || [])
      setSelectedImages([]) // Очищаем вибранние файли при загрузке
    } else if (!isEdit) {
      // Очищаем состояние при переходе в режим создания
      setExistingImages([])
      setSelectedImages([])
    }
  }, [product, isEdit])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleIngredientToggle = (key) => {
    setFormData(prev => ({
      ...prev,
      contains: {
        ...prev.contains,
        [key]: !prev.contains[key]
      }
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Валидация 
    if (!formData.name || !formData.description || !formData.price || !formData.category || !formData.qty || !formData.shelfLife || !formData.storageConditions) {
      toast.error('Будь ласка, заповніть всі обов\'язкові поля')
      return
    }

    try {
      // Конвертируем новие изображения в base64
      const base64Images = await imageService.filesToBase64(selectedImages)
      
      // Подготавливаем данние правильно для backend updateProduct
      const dataToSave = {
        ...formData,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : 0,
        weight: formData.weight ? Number(formData.weight) : 0,
        qty: Number(formData.qty),
        // Для редактирования разделяем существующие и новие изображения
        ...(isEdit ? {
          existingImages: existingImages, // Обекти {url, public_id, version}
          images: base64Images            // Base64 строки
        } : {
          images: base64Images            // Для создания только base64
        })
      }

      saveMutation.mutate(dataToSave)
    } catch {
      toast.error('Помилка обробки зображень')
    }
  }

  if (productLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-creamy">
        <div className="text-lg text-choco-light">Завантаження...</div>
      </div>
    )
  }

  // Компонент загрузки фото с функциональностью
  const PhotoUpload = () => {
    // Drag & Drop обработчики из imageService
    const { handleDragEnter, handleDragLeave, handleDragOver, handleDrop } = imageService.createDragHandlers(
      setIsDragging,
      (files) => setSelectedImages(prev => [...prev, ...files]),
      5,
      existingImages.length + selectedImages.length
    )
    
    const handleFileSelect = (e) => {
      const files = Array.from(e.target.files)
      const validation = imageService.validateFiles(files, 5, existingImages.length + selectedImages.length)
      
      if (validation.valid && validation.files.length > 0) {
        setSelectedImages(prev => [...prev, ...validation.files])
      } else if (validation.errors.length > 0) {
        validation.errors.forEach(error => toast.error(error))
      }
    }

    const removeExistingImage = (index) => {
      setExistingImages(prev => prev.filter((_, i) => i !== index))
    }

    const removeNewImage = (index) => {
      setSelectedImages(prev => prev.filter((_, i) => i !== index))
    }

    const totalImages = existingImages.length + selectedImages.length
    const canAddMore = totalImages < 5

    return (
      <div className="w-full lg:w-[477px] space-y-[12px] lg:space-y-[8px] lg:h-[312px]">
        <label className="block text-[16px] text-slate-500 font-montserrat lg:h-[20px]">Додайте фото продукту</label>
        <div className="flex flex-col lg:flex-row gap-[11px] lg:gap-[25px] lg:h-[284px]">
          
          {/* Основной блок загрузки */}
          <div 
            onClick={() => canAddMore && document.getElementById('file-input').click()}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`w-full lg:w-[226px] h-[280px] lg:h-[283px] border-2 border-dashed rounded-[5px] lg:rounded-[48px] bg-light-creamy flex flex-col items-center justify-center gap-[28px] transition-all cursor-pointer p-[20px] lg:px-[30px] lg:py-[20px]
              ${isDragging 
                ? 'border-choco-light bg-[#F8F2E8] scale-105' 
                : canAddMore 
                  ? 'border-choco-light/50 hover:border-choco-light hover:bg-[#F8F2E8]' 
                  : 'border-gray-300 bg-gray-50 cursor-not-allowed opacity-50'
              }`}
          >
            <div className="w-[109px] h-[109px] rounded-[88px] border border-choco-light/50 flex items-center justify-center">
              <div className="relative w-[54px] h-[54px]">
                <span className="absolute left-0 right-0 top-1/2 h-0.5 bg-choco-light/50 transform -translate-y-1/2"></span>
                <span className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-choco-light/50 transform -translate-x-1/2"></span>
              </div>
            </div>
            <div className="text-center text-[13px] leading-4 text-slate-500 font-montserrat w-[186px] lg:h-[48px] lg:leading-[16px]">
              {canAddMore 
                ? "Перетяніть фото сюди або натисніть щоб завантажити" 
                : "Максимум 5 зображень"
              }
            </div>
            
            <input
              id="file-input"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={!canAddMore}
            />
          </div>
          
          {/* Превью существующих и нових изображений */}
          <div className="grid grid-cols-4 lg:flex lg:flex-wrap lg:justify-center lg:items-center lg:content-center gap-[11px] lg:gap-x-[20px] lg:gap-y-[11px] lg:w-[226px] lg:h-[284px]">
            
            {/* Существующие изображения */}
            {existingImages.map((image, index) => (
              <div key={`existing-${index}`} className="relative w-full lg:w-[103px] h-[80px] lg:h-[135px] rounded-[5px] lg:rounded-[24px] overflow-hidden group">
                <img 
                  src={image.url} 
                  alt={`Фото ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(index)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
            
            {/* Новие изображения */}
            {selectedImages.map((file, index) => (
              <div key={`new-${index}`} className="relative w-full lg:w-[103px] h-[80px] lg:h-[135px] rounded-[5px] lg:rounded-[24px] overflow-hidden group">
                <img 
                  src={URL.createObjectURL(file)} 
                  alt={`Нове фото ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
            
            {/* Пустие слоти */}
            {Array.from({ length: Math.max(0, 4 - totalImages) }).map((_, i) => (
              <div key={`empty-${i}`} className="w-full lg:w-[103px] h-[80px] lg:h-[135px] border-2 border-dashed border-choco-light/50 rounded-[5px] lg:rounded-[24px] bg-light-creamy flex flex-col items-center justify-center lg:gap-[28px] lg:p-[20px] lg:px-[30px]">
                <div className="w-[50px] h-[50px] lg:w-[40px] lg:h-[40px] rounded-full border border-choco-light/50 flex items-center justify-center">
                  <div className="relative w-[18px] h-[18px]">
                    <span className="absolute left-0 right-0 top-1/2 h-0.5 bg-choco-light/50 transform -translate-y-1/2"></span>
                    <span className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-choco-light/50 transform -translate-x-1/2"></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-creamy">
      <div className="mx-auto w-full max-w-[375px] lg:max-w-[1024px] px-[15px] lg:px-[30px] pt-[10px] lg:pt-[20px] pb-[30px] lg:pb-[40px]">
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-[20px] lg:space-y-[40px]">
            
            {/* Заголовок (только на десктопе) */}
            <div className="hidden lg:block">
              <h1 className="font-cormorant text-[30px] leading-[36px] text-choco-dark mb-6">
                {isEdit ? 'Редагувати товар' : 'Створити товар'}
              </h1>
            </div>

            {/* Секция: Название и Фото */}
            <section className="space-y-[24px]">
              <h2 className="hidden lg:block font-cormorant text-[30px] leading-[36px] text-choco-dark">Назва та фото</h2>
              
              <div className="flex flex-col lg:flex-row gap-[20px]">
                <div className="w-full lg:w-[349px] space-y-[20px] lg:space-y-[16px]">
                  {/* Название товара */}
                  <div className="space-y-[6px] lg:space-y-[4px]">
                    <label className="block text-[16px] text-slate-500 font-montserrat">Назва товару</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full h-[43px] px-[20px] py-[8px] bg-light-creamy border border-choco-light rounded-[31px] text-[16px] text-gray-600 placeholder-gray-400 outline-none focus:ring-2 focus:ring-choco-light-50 font-montserrat"
                    />
                  </div>
                  
                  {/* Короткий опис */}
                  <div className="space-y-[6px] lg:space-y-[4px]">
                    <label className="block text-[16px] text-slate-500 font-montserrat">Короткий опис</label>
                    <textarea
                      value={formData.summary}
                      onChange={(e) => handleInputChange('summary', e.target.value)}
                      rows={4}
                      className="w-full px-[30px] py-[20px] bg-light-creamy border border-choco-light rounded-[10px] text-[14px] text-gray-600 placeholder-gray-400 outline-none focus:ring-2 focus:ring-choco-light-50 resize-none font-montserrat"
                    />
                  </div>
                  
                  {/* Повний опис товара */}
                  <div className="space-y-[6px] lg:space-y-[4px]">
                    <label className="block text-[16px] text-slate-500 font-montserrat">Повний опис товару</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={8}
                      className="w-full px-[30px] py-[20px] bg-light-creamy border border-choco-light rounded-[10px] text-[14px] text-slate-500 placeholder-gray-400 outline-none focus:ring-2 focus:ring-choco-light-50 resize-none font-montserrat"
                      placeholder="Введіть опис продукту..."
                    />
                  </div>
                </div>

                <div className="w-full lg:w-[477px]">
                  <PhotoUpload />
                </div>
              </div>
            </section>

            {/* Секция: Состав и Категория */}
            <section className="space-y-[24px] max-w-[1320px] mx-auto">
              <h2 className="hidden lg:block font-cormorant text-[30px] leading-[36px] text-choco-dark w-full lg:w-[1320px] h-[36px]">Склад та категорія</h2>
              
              <div className="flex flex-col lg:flex-row lg:justify-between gap-[20px] w-full lg:w-[865px] lg:h-[119px]">
                {/* Состав */}
                <div className="space-y-[8px] w-full lg:w-[410px] lg:h-[119px]">
                  <label className="block text-[16px] leading-[20px] text-slate-500 font-montserrat w-full lg:w-[410px] lg:h-[20px]">Склад</label>
                  <textarea
                    value={formData.ingredients}
                    onChange={(e) => handleInputChange('ingredients', e.target.value)}
                    className="w-full lg:w-[410px] h-[91px] px-[30px] py-[20px] bg-light-creamy border border-choco-light rounded-[10px] text-[14px] leading-[17px] text-slate-500 placeholder-slate-500 outline-none focus:ring-2 focus:ring-choco-light-50 resize-none font-montserrat"
                    placeholder="Зазначте склад продукту"
                  />
                </div>
                
                {/* Категория */}
                <div className="space-y-[10px] w-full lg:w-[410px] lg:h-[80px]">
                  <label className="block text-[16px] leading-[20px] text-slate-500 font-montserrat w-[250px] lg:h-[20px]">Категорія</label>
                  <div className="relative">
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full lg:w-[410px] h-[46px] px-[20px] py-[12px] bg-light-creamy border border-choco-light rounded-[31px] text-[16px] leading-[24px] text-slate-600 appearance-none outline-none focus:ring-2 focus:ring-choco-light-50 font-inter"
                    >
                      <option value="">Оберіть категорію</option>
                      {categoriesData?.map((option) => (
                        <option key={option._id} value={option._id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-slate-600" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 8l4 4 4-4" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Секция: Цена */}
            <section className="space-y-[24px] max-w-[1320px] mx-auto">
              <h2 className="hidden lg:block font-cormorant text-[30px] leading-[36px] text-choco-dark w-full lg:w-[1320px] h-[36px]">Ціна продукту</h2>
              
              <div className="flex flex-col lg:flex-row lg:justify-between gap-[20px] lg:gap-[45px] w-full lg:w-[865px] lg:h-[78px]">
                {/* Цена товара */}
                <div className="space-y-[4px] w-full lg:w-[410px] lg:h-[78px]">
                  <label className="block text-[16px] leading-[20px] text-slate-500 font-montserrat w-[98px] lg:h-[20px]">Ціна товару</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="w-full lg:w-[410px] h-[43px] px-[20px] py-[8px] bg-light-creamy border border-choco-light rounded-[31px] text-[16px] leading-[24px] text-slate-500 placeholder-slate-500 outline-none focus:ring-2 focus:ring-choco-light-50 font-inter"
                    placeholder="Введіть ціну"
                  />
                </div>
                
                {/* Акционная цена */}
                <div className="space-y-[4px] w-full lg:w-[410px] lg:h-[78px]">
                  <label className="block text-[16px] leading-[20px] text-slate-500 font-montserrat w-[108px] lg:h-[20px]">Акційна ціна</label>
                  <input
                    type="number"
                    value={formData.discountPrice}
                    onChange={(e) => handleInputChange('discountPrice', e.target.value)}
                    className="w-full lg:w-[410px] h-[43px] px-[20px] py-[8px] bg-light-creamy border border-choco-light rounded-[31px] text-[16px] leading-[24px] text-slate-500 placeholder-slate-500 outline-none focus:ring-2 focus:ring-choco-light-50 font-inter"
                    placeholder="Ціна зі знижкою"
                  />
                </div>
              </div>
            </section>

            {/* Секция: Вес и Количество */}
            <section className="space-y-[24px] max-w-[1320px] mx-auto">
              <h2 className="hidden lg:block font-cormorant text-[30px] leading-[36px] text-choco-dark w-[344px] lg:h-[36px]">Вага та кількість</h2>
              
              <div className="flex flex-col lg:flex-row lg:justify-between gap-[20px] w-full lg:w-[865px] lg:h-[78px]">
                {/* Вес */}
                <div className="space-y-[4px] w-full lg:w-[410px] lg:h-[78px]">
                  <label className="block text-[16px] leading-[20px] text-slate-500 font-montserrat w-[39px] lg:h-[20px]">Вага</label>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    className="w-full lg:w-[410px] h-[43px] px-[20px] py-[8px] bg-light-creamy border border-choco-light rounded-[31px] text-[16px] leading-[24px] text-slate-500 placeholder-slate-500 outline-none focus:ring-2 focus:ring-choco-light-50 font-inter"
                    placeholder="Вага в грамах"
                  />
                </div>
                
                {/* Количество */}
                <div className="space-y-[4px] w-full lg:w-[410px] lg:h-[78px]">
                  <label className="block text-[16px] leading-[20px] text-slate-500 font-montserrat w-[152px] lg:h-[20px]">Кількість одиниць</label>
                  <input
                    type="number"
                    value={formData.qty}
                    onChange={(e) => handleInputChange('qty', e.target.value)}
                    className="w-full lg:w-[410px] h-[43px] px-[20px] py-[8px] bg-light-creamy border border-choco-light rounded-[31px] text-[16px] leading-[24px] text-slate-500 placeholder-slate-500 outline-none focus:ring-2 focus:ring-choco-light-50 font-inter"
                    placeholder="Кількість"
                  />
                </div>
              </div>
            </section>

            {/* Секция: Дополнительние свойства */}
            <section className="space-y-[24px]">
              <h2 className="hidden lg:block font-cormorant text-[30px] leading-[36px] text-choco-dark">Умови зберігання та інші варіанти</h2>
              
              <div className="flex flex-col lg:flex-row gap-[29px]">
                {/* Условия хранения */}
                <div className="w-full lg:w-[300px] space-y-[15px]">
                  <label className="block text-[16px] text-gray-600 font-montserrat">Умови зберігання</label>
                  <div className="space-y-[15px]">
                    {PRODUCT_ENUMS.storageConditions.map((condition) => (
                      <div key={condition} className="flex items-center gap-[15px]">
                        <button
                          type="button"
                          onClick={() => handleInputChange('storageConditions', condition)}
                          className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                            formData.storageConditions === condition
                              ? 'border-2 border-choco-light'
                              : 'border border-choco-light/50'
                          }`}
                        >
                          {formData.storageConditions === condition && (
                            <div className="w-2.5 h-2.5 bg-choco-light rounded-full"></div>
                          )}
                        </button>
                        <span className="text-[16px] text-gray-600">{condition}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Аллергени */}
                <div className="w-full lg:w-[183px] space-y-[15px]">
                  <label className="block text-[16px] text-choco-light font-light">Містить алергени</label>
                  <div className="space-y-[15px]">
                    {Object.entries(formData.contains).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-[10px] text-[16px] text-choco-light font-light">
                        <button
                          type="button"
                          onClick={() => handleIngredientToggle(key)}
                          className="w-[22px] h-[22px] border border-choco-light rounded-[5px] flex items-center justify-center transition-colors hover:bg-choco-light-50"
                        >
                          {value && (
                            <CheckboxIcon className="text-choco-light" />
                          )}
                        </button>
                        <span>
                          {key === 'lactose' && 'Лактоза'}
                          {key === 'gluten' && 'Глютен'}
                          {key === 'nuts' && 'Горіхи'}
                          {key === 'palmOil' && 'Пальмова олія'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Срок хранения */}
              <div className="space-y-[10px] w-full lg:w-[273px]">
                <label className="block text-[16px] text-gray-600 font-montserrat">Термін зберігання</label>
                <div className="relative">
                  <select
                    value={formData.shelfLife}
                    onChange={(e) => handleInputChange('shelfLife', e.target.value)}
                    className="w-full h-[46px] px-5 bg-light-creamy border border-choco-light rounded-[31px] text-[16px] text-slate-600 appearance-none outline-none focus:ring-2 focus:ring-choco-light-50 font-montserrat"
                  >
                    <option value="">Термін зберігання</option>
                    {PRODUCT_ENUMS.shelfLife?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-600" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 8l4 4 4-4" />
                    </svg>
                  </div>
                </div>
              </div>
            </section>

            {/* Кнопки действий */}
            <section>
              <div className="w-full lg:w-[349px] space-y-[12px]">
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className={`w-full h-[50px] rounded-[31px] text-[14px] font-medium transition-colors font-montserrat ${
                    saveMutation.isPending
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-wine-red text-creamy hover:bg-wine-red/90'
                  }`}
                >
                  {saveMutation.isPending ? 'Збереження...' : (isEdit ? 'Оновити товар' : 'Додати товар')}
                </button>
                
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-full h-[50px] border border-wine-red text-wine-red rounded-[31px] text-[13px] bg-transparent hover:bg-wine-red/5 transition-colors flex items-center justify-center gap-[10px] font-montserrat"
                >
                  <CloseIcon className="w-4 h-4" />
                  <span>Скасувати</span>
                </button>
              </div>
            </section>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductEditor