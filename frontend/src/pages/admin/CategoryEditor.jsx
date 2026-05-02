import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { categoriesAPI } from '../../services/api'
import imageService from '../../services/imageService'

const CategoryEditor = ({ categoryId = null, onCancel, onSuccess }) => {
  const queryClient = useQueryClient()
  const isEdit = categoryId !== null
  
  // Стан форми
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null
  })

  // Состояние для drag & drop
  const [isDragging, setIsDragging] = useState(false)

  // Завантаження даних для редагування
  const { data: category, isLoading } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => categoriesAPI.getById(categoryId),
    enabled: isEdit && !!categoryId,
  })

  // Мутация для создания/обновления
  const saveMutation = useMutation({
    mutationFn: (data) => {
      return isEdit 
        ? categoriesAPI.update(categoryId, data)
        : categoriesAPI.create(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      toast.success(isEdit ? 'Категорію оновлено!' : 'Категорію створено!')
      if (onSuccess) onSuccess()
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Помилка збереження')
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('Введіть назву категорії')
      return
    }

    if (!formData.description.trim()) {
      toast.error('Введіть опис категорії')
      return
    }

    // Конвертируем файл в base64 если есть
    const processSubmit = async () => {
      const submitData = {
        name: formData.name,
        description: formData.description
      }
      
      // Відправляємо зображення тільки якщо це новий файл
      if (formData.image instanceof File) {
        try {
          const base64 = await imageService.fileToBase64(formData.image)
          submitData.image = base64
        } catch (error) {
          console.error('Error processing image:', error)
          toast.error('Помилка обробки зображення')
          return
        }
      }
      // Якщо formData.image це об'єкт з URL (існуюче зображення) - не відправляємо його
      // Backend сохранит существующее изображение автоматически

      saveMutation.mutate(submitData)
    }

    processSubmit()
  }

  // Обработчики изображений с imageService
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file && imageService.validateSingleFile(file)) {
      setFormData(prev => ({ ...prev, image: file }))
    }
    e.target.value = '' // Очищаем input
  }

  // Drag & Drop обработчики из imageService
  const { handleDragEnter, handleDragLeave, handleDragOver, handleDrop } = imageService.createDragHandlers(
    setIsDragging,
    (files) => {
      if (files.length > 0) {
        const file = files[0] // Только одно изображение для категории
        setFormData(prev => ({ ...prev, image: file }))
      }
    },
    1, // Максимум 1 изображение для категории
    0  // Для категорії завжди 0 - ми замінюємо зображення, а не додаємо до існуючого
  )

  // Управление формой при смене категории или режима  
  useEffect(() => {
    if (category && isEdit) {
      // Заповнюємо форму даними категорії
      setFormData({
        name: category.name || '',
        description: category.description || '',
        image: category.image || null
      })
    } else {
      // Очищаем форму (создание новой или смена categoryId)
      setFormData({
        name: '',
        description: '',
        image: null
      })
    }
  }, [category, isEdit, categoryId])

  if (isLoading && isEdit) {
    return (
      <div className="min-h-screen bg-creamy flex items-center justify-center">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-choco-dark mx-auto"></div>
          <p className="mt-4 text-choco-light">Завантаження категорії...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-creamy flex items-center justify-center p-6">
      <div className="bg-[#F5EEE0] rounded-[30px] w-[345px] h-[935px] px-[16px] pt-[40px] pb-[50px] flex flex-col gap-[40px] sm:w-[817px] sm:h-[631px] sm:pl-[145px] sm:pr-[158px] sm:py-[41px] sm:gap-[50px]">
        
        {/* Header */}
        <div className="flex items-start w-full">
          <div className="font-montserrat font-light text-[18px] leading-[22px] text-choco-dark sm:text-[24px] sm:leading-[29px] sm:text-black">
            {isEdit ? 'Редагувати категорію' : 'Додати категорію'}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-[29px] w-full sm:grid sm:grid-cols-[292px_261px] sm:gap-x-[50px] sm:gap-y-[9px] sm:items-start sm:justify-center">
          
          {/* Name Input */}
          <div className="w-[288px] sm:w-[292px] sm:col-start-1 sm:row-start-1">
            <div className="font-montserrat font-normal text-[16px] leading-[20px] text-[#888888] mb-[4px]">Оберіть назву *</div>
            <div className="w-[288px] sm:w-[292px] h-[43px] bg-creamy border border-choco-light rounded-[31px] flex items-center px-[20px]">
              <input 
                className="bg-transparent outline-none w-full font-montserrat text-[16px] text-choco-dark placeholder-[#888888]"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Назва категорії"
                required
              />
            </div>
          </div>

          {/* Image Upload with Drag & Drop */}
          <div 
            className={`w-[288px] h-[264px] bg-creamy border-2 border-dashed rounded-[10px] flex flex-col items-center pt-[22px] pb-[33px] pl-[29px] pr-[40px] gap-[44px] sm:w-[261px] sm:h-[318px] sm:rounded-[20px] sm:col-start-2 sm:row-start-1 sm:row-span-2 transition-all cursor-pointer ${
              isDragging 
                ? 'border-wine-red bg-wine-red/10' 
                : 'border-choco-light hover:border-wine-red'
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="categoryImage"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
            <label 
              htmlFor="categoryImage" 
              className="w-full h-full flex flex-col items-center justify-center gap-[44px] cursor-pointer"
            >
              <div className={`font-montserrat font-normal text-[16px] leading-[20px] text-center transition-colors ${
                isDragging ? 'text-wine-red' : 'text-[#888888]'
              }`}>
                {isDragging 
                  ? 'Відпустіть щоб завантажити'
                  : formData.image 
                    ? 'Змінити фото категорії' 
                    : 'Додайте фото категорії'
                }
              </div>
              
              {formData.image && !isDragging ? (
                <div className="w-[120px] h-[80px] rounded-lg overflow-hidden">
                  <img 
                    src={imageService.getDisplayUrl(formData.image)}
                    alt="Category preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className={`relative w-[54px] h-[54px] transition-colors ${
                  isDragging ? 'opacity-75' : 'opacity-100'
                }`}>
                  <span className={`absolute top-1/2 left-1/2 w-[54px] h-[3px] -translate-x-1/2 -translate-y-1/2 transition-colors ${
                    isDragging ? 'bg-wine-red' : 'bg-choco-light/50'
                  }`}></span>
                  <span className={`absolute top-1/2 left-1/2 w-[54px] h-[3px] -translate-x-1/2 -translate-y-1/2 rotate-90 transition-colors ${
                    isDragging ? 'bg-wine-red' : 'bg-choco-light/50'
                  }`}></span>
                </div>
              )}
              
              <div className={`font-montserrat font-normal text-[13px] leading-[16px] text-center w-[186px] transition-colors ${
                isDragging ? 'text-wine-red' : 'text-[#888888]'
              }`}>
                {isDragging 
                  ? 'Відпустіть файл тут'
                  : 'Перетягніть фото сюди або натисніть щоб завантажити'
                }
              </div>
            </label>
          </div>

          {/* Description */}
          <div className="w-[288px] sm:w-[292px] sm:col-start-1 sm:row-start-2">
            <div className="font-montserrat font-normal text-[16px] leading-[20px] text-[#888888] mb-[4px]">Опис категорії *</div>
            <div className="w-[288px] sm:w-[292px] h-[200px] bg-creamy border border-choco-light rounded-[10px] p-[20px_30px]">
              <textarea 
                className="w-full h-full bg-transparent outline-none font-montserrat text-[14px] leading-[17px] text-choco-dark placeholder-[#888888] resize-none"
                placeholder="Введіть опис категорії..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>
          </div>
        </form>

        {/* Buttons */}
        <div className="flex flex-col items-center gap-[15px] w-full sm:flex-row sm:justify-center sm:gap-[27px]">
          <button 
            onClick={handleSubmit}
            disabled={saveMutation.isPending}
            className="order-1 sm:order-2 w-[252px] h-[54px] sm:w-[287px] bg-wine-red rounded-[31px] text-creamy font-montserrat font-medium text-[16px] leading-[19px] hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saveMutation.isPending 
              ? 'Збереження...' 
              : (isEdit ? 'Зберегти зміни' : 'Додати категорію')
            }
          </button>
          <button 
            onClick={onCancel}
            type="button" 
            className="order-2 sm:order-1 w-[252px] h-[54px] sm:w-[287px] bg-creamy border border-choco-light rounded-[31px] text-choco-dark font-montserrat font-normal text-[16px] leading-[20px] hover:bg-creamy transition-colors"
          >
            Скасувати
          </button>
        </div>
      </div>
    </div>
  )
}

export default CategoryEditor