import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { categoriesAPI } from '../../services/api'

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
    <div className="min-h-screen bg-creamy p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-cormorant font-bold text-choco-dark">
              Категорії ({categories.length})
            </h2>
          </div>

          {categories.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📂</div>
              <h3 className="text-xl font-medium text-choco-dark mb-2">
                Немає категорій
              </h3>
              <p className="text-choco-light">
                Додайте першу категорію для відображення товарів
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Зображення
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Назва
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Опис
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Дата створення
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Дії
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map((category) => (
                    <tr key={category._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-20 w-20 rounded-lg overflow-hidden bg-gray-100">
                          {category.image?.url ? (
                            <img
                              src={category.image.url}
                              alt={category.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none'
                                e.target.nextSibling.style.display = 'flex'
                              }}
                            />
                          ) : null}
                          <div 
                            className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs text-center"
                            style={category.image?.url ? {display: 'none'} : {}}
                          >
                            Без фото
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-choco-dark">
                          {category.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-choco-light max-w-md" title={category.description}>
                          {category.description && category.description.length > 100 
                            ? category.description.substring(0, 100) + '...' 
                            : category.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-choco-light">
                          {new Date(category.createdAt).toLocaleDateString('uk-UA', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleEdit(category._id)}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200 transition-colors"
                            title="Редагувати категорію"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(category._id, category.name)}
                            className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded hover:bg-red-200 transition-colors"
                            title="Видалити категорію"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CategoryList