import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { categoriesAPI } from '../../services/api'
import { EditIcon, BasketIcon } from '../../components/icons'

const CategoryList = ({ onEditCategory }) => {
  const queryClient = useQueryClient()
  
  // TanStack Query для загрузки категорий
  const { 
    data: categories = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: categoriesAPI.getAll, // Используем getAll для категорий (нет пагинации в backend)
    staleTime: 0, // Всегда актуальные данные в админке
    refetchOnWindowFocus: true, // Обновлять при фокусе окна
  })

  // Mutation для удаления категории
  const deleteCategory = useMutation({
    mutationFn: categoriesAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      toast.success('Категорію видалено успішно!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Помилка видалення категорії')
    },
  })

  const handleDelete = async (id, name) => {
    if (window.confirm(`Ви дійсно хочете видалити категорію "${name}"?`)) {
      deleteCategory.mutate(id)
    }
  }

  const handleEdit = (categoryId) => {
    if (onEditCategory) {
      onEditCategory(categoryId)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-creamy p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-choco-dark mx-auto"></div>
            <p className="mt-4 text-choco-light">Завантаження категорій...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-creamy p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-8">
            <p className="text-red-600">Помилка завантаження категорій</p>
            <button 
              onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-categories'] })}
              className="mt-4 px-4 py-2 bg-choco-dark text-creamy rounded-lg hover:opacity-90"
            >
              Оновити
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="w-full max-w-[1440px] mx-auto py-[12px]">
        {/* Header Button */}
        <div className="flex justify-start mb-[26px]">
          <button
            onClick={() => onEditCategory && onEditCategory(null)}
            className="w-full sm:w-[226px] h-[40px] bg-wine-red rounded-[31px] flex items-center justify-center gap-[10px] sm:gap-[14px] hover:opacity-90 transition-opacity"
          >
            <span className="text-creamy text-[20px] sm:text-[15px] leading-none">+</span>
            <span className="font-montserrat font-medium text-[14px] text-creamy whitespace-nowrap">Додати категорію</span>
          </button>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-12 bg-[rgba(245,238,224,0.4)] rounded-[12px]">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-[18px] font-montserrat font-semibold text-choco-light mb-2">Немає категорій</h3>
            <p className="text-[14px] font-medium text-choco-light font-montserrat">Додайте першу категорію для відображення</p>
          </div>
        ) : (
          <div className="w-full bg-[rgba(245,238,224,0.4)] rounded-[12px]" style={{minHeight: '620px'}}>
            
            {/* Unified Table Headers (responsive) */}
            <div className="grid grid-cols-[80px_1fr_80px_60px] md:grid-cols-[200px_1fr_200px_120px] gap-2 md:gap-4 mb-[20px] md:mb-[25px]">
              <div className="font-montserrat font-medium md:font-semibold text-[14px] md:text-[18px] text-choco-light text-center">Фото</div>
              <div className="font-montserrat font-medium md:font-semibold text-[14px] md:text-[18px] text-choco-light text-center">Назва</div>
              <div className="font-montserrat font-medium md:font-semibold text-[14px] md:text-[18px] text-choco-light text-center">
                <div className="md:hidden">Дата</div>
                <div className="md:hidden">створення</div>
                <div className="hidden md:block">Дата створення</div>
              </div>
              <div className="font-montserrat font-medium md:font-semibold text-[14px] md:text-[18px] text-choco-light text-center">Дії</div>
            </div>

            {/* Header Line (desktop only) */}
            <div className="hidden md:block w-full h-[1px] bg-choco-light opacity-60 mb-[25px]"></div>
            
            {/* Unified Category Rows (responsive) */}
            <div className="space-y-[20px] md:space-y-[25px]">
              {categories.map((category) => (
                <div key={category._id} className="grid grid-cols-[80px_1fr_80px_60px] md:grid-cols-[200px_1fr_200px_120px] gap-2 md:gap-4 items-center">
                  
                  {/* Photo (responsive) */}
                  <div className="flex justify-center">
                    <div className="w-[60px] h-[60px] rounded-[50px] md:w-[152px] md:h-[72px] md:rounded-[30px] overflow-hidden bg-gray-100 flex items-center justify-center">
                      <img src={category.image.url} alt={category.name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  
                  {/* Name (responsive) */}
                  <div className="flex justify-center items-center">
                    <span className="font-montserrat font-medium text-[12px] md:text-[14px] text-choco-light text-center">
                      {category.name}
                    </span>
                  </div>
                  
                  {/* Creation Date (responsive) */}
                  <div className="flex justify-center items-center">
                    <span className="font-montserrat font-semibold text-[14px] md:text-[16px] text-choco-light">
                      {new Date(category.createdAt).toLocaleDateString('uk-UA')}
                    </span>
                  </div>
                  
                  {/* Actions (responsive) */}
                  <div className="flex justify-center items-center">
                    <div className="flex flex-col items-center gap-[3px]">
                      <button
                        onClick={() => handleEdit(category._id)}
                        className="w-[25px] h-[25px] md:w-[31px] md:h-[31px] bg-creamy-light rounded-full flex items-center justify-center transition-colors hover:opacity-80"
                        title="Редагувати"
                      >
                        <EditIcon className="w-[12px] h-[12px] md:w-[14.74px] md:h-[14.57px]" />
                      </button>
                      <button
                        onClick={() => handleDelete(category._id, category.name)}
                        className="w-[25px] h-[25px] md:w-[31px] md:h-[31px] bg-creamy-light rounded-full flex items-center justify-center transition-colors hover:opacity-80"
                        title="Видалити"
                      >
                        <BasketIcon className="w-[12px] h-[12px] md:w-[14px] md:h-[15.77px]" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoryList