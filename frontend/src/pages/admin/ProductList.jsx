import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { productsAPI, categoriesAPI } from '../../services/api'

const ProductList = ({ onEditProduct }) => {
  const queryClient = useQueryClient()
  
  // TanStack Query для загрузки товаров
  const { 
    data: productsResponse, 
    isLoading: productsLoading, 
    error: productsError 
  } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => productsAPI.getMany({ limit: 100 }), // Явно указываем лимит для админки
    staleTime: 0, // Всегда актуальные данные в админке
    refetchOnWindowFocus: true, // Обновлять при фокусе окна
  })
  
  // Извлекаем товары из ответа API
  const products = productsResponse?.products || []

  // TanStack Query для загрузки категорий
  const { 
    data: categories = [], 
    isLoading: categoriesLoading 
  } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: categoriesAPI.getAll,
    staleTime: 0, // Всегда актуальные данные в админке
    refetchOnWindowFocus: true, // Обновлять при фокусе окна
  })

  // Mutation для удаления товара
  const deleteProduct = useMutation({
    mutationFn: productsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      toast.success('Товар видалено успішно!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Помилка видалення товару')
    },
  })

  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const handleDelete = async (productId, productName) => {
    if (window.confirm(`Ви впевнені, що хочете видалити "${productName}"?`)) {
      deleteProduct.mutate(productId)
    }
  }

  const handleEdit = (productId) => {
    if (onEditProduct) {
      onEditProduct(productId)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesCategory = filter === 'all' || product.category?._id === filter
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'UAH'
    }).format(price)
  }

  if ((productsLoading || categoriesLoading) && products.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-choco-dark"></div>
      </div>
    )
  }

  if (productsError) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <p className="text-red-600 mb-4">Помилка завантаження товарів</p>
          <button 
            onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-products'] })}
            className="px-4 py-2 bg-choco-dark text-creamy rounded-lg hover:opacity-90"
          >
            Оновити
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-cormorant font-bold text-choco-dark">
          Список товарів ({products.length})
        </h2>
        <button
          onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-products'] })}
          disabled={productsLoading}
          className="px-4 py-2 bg-dark-creamy text-choco-dark rounded-lg hover:bg-button-primary transition-colors disabled:opacity-50"
        >
          {productsLoading ? 'Оновлення...' : 'Оновити'}
        </button>
      </div>

      {/* Фильтры */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filter === 'all'
                ? 'bg-choco-dark text-creamy'
                : 'bg-creamy text-choco-light hover:bg-dark-creamy'
            }`}
          >
            Всі ({products.length})
          </button>
          {categories.map(category => {
            const count = products.filter(p => p.category?._id === category._id).length
            return (
              <button
                key={category._id}
                onClick={() => setFilter(category._id)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  filter === category._id
                    ? 'bg-choco-dark text-creamy'
                    : 'bg-creamy text-choco-light hover:bg-dark-creamy'
                }`}
              >
                {category.name} ({count})
              </button>
            )
          })}
        </div>

        {/* Поиск */}
        <div className="max-w-md">
          <input
            type="text"
            placeholder="Пошук товарів..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-creamy focus:border-transparent"
          />
        </div>
      </div>

      {/* Список товаров */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-choco-light">
            {searchTerm ? 'Товарів не знайдено за запитом' : 'Товарів поки що немає'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex gap-8">
                {/* ЛЕВАЯ ЧАСТЬ - ИЗОБРАЖЕНИЯ */}
                <div className="flex-shrink-0">
                  {product.images && product.images.length > 0 ? (
                    <div className="space-y-3">
                      {/* Основное изображение */}
                      <div className="w-32 h-24 rounded-lg overflow-hidden border">
                        <img 
                          src={product.images[0].url} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none' }}
                        />
                      </div>
                      
                      {/* Остальные изображения под основным */}
                      {product.images.length > 1 && (
                        <div className="flex gap-2 max-w-[128px]">
                          {product.images.slice(1, 6).map((img, index) => (
                            <img 
                              key={index + 1}
                              src={img.url} 
                              alt={`${product.name} ${index + 2}`}
                              className="w-8 h-6 object-cover rounded border opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
                              onError={(e) => { e.target.style.display = 'none' }}
                            />
                          ))}
                          {product.images.length > 6 && (
                            <div className="w-8 h-6 bg-gray-100 border rounded text-xs flex items-center justify-center text-gray-500">
                              +{product.images.length - 6}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Кнопки действий под картинками */}
                      <div className="flex flex-col gap-1 mt-3">
                        <button
                          onClick={() => handleEdit(product._id)}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200 transition-colors"
                          title="Редагувати товар"
                        >
                          Редагувати
                        </button>
                        <button
                          onClick={() => handleDelete(product._id, product.name)}
                          className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded hover:bg-red-200 transition-colors"
                          title="Видалити товар"
                        >
                          Видалити
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-32 h-24 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-8 h-8 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div className="text-xs text-gray-400">Без фото</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ПРАВАЯ ЧАСТЬ - ИНФОРМАЦИЯ */}
                <div className="flex-1 max-w-2xl">
                  {/* Верхние две части: 2/3 + 1/3 */}
                  <div className="flex gap-4 mb-4">
                    {/* ПЕРВАЯ ЧАСТЬ - 2/3 пространства */}
                    <div className="flex-[2] space-y-3">
                      {/* Название */}
                      <h3 className="text-lg font-medium text-gray-800">{product.name}</h3>

                      {/* Краткий опис */}
                      {product.summary && (
                        <div>
                          <ul className="space-y-0.5 text-gray-600">
                            {product.summary.split(/[\n,]/).filter(item => item.trim()).map((item, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-gray-400 mr-1 text-xs">•</span>
                                <span className="text-xs whitespace-pre-line">{item.trim()}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Склад */}
                      {product.ingredients && (
                        <div className="flex items-start gap-1">
                          <span className="font-medium text-gray-800 text-xs">Склад:</span>
                          <span className="text-gray-600 text-xs leading-relaxed whitespace-pre-line">{product.ingredients}</span>
                        </div>
                      )}

                      {/* Полное описание */}
                      {product.description && (
                        <div className="flex items-start gap-1">
                          <span className="font-medium text-gray-800 text-xs">Опис:</span>
                          <span className="text-gray-600 text-xs leading-relaxed whitespace-pre-line">{product.description}</span>
                        </div>
                      )}
                    </div>

                    {/* ВТОРАЯ ЧАСТЬ - 1/3 пространства */}
                    <div className="flex-[1] space-y-2">
                      {/* Рекомендований */}
                      {product.isFeatured && (
                        <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          ⭐ Рекомендований
                        </span>
                      )}

                      {/* Категорія */}
                      <div className="flex items-center gap-1">
                        {product.category?.image?.url && (
                          <img 
                            src={product.category.image.url} 
                            alt={product.category.name}
                            className="w-6 h-6 rounded object-cover"
                            onError={(e) => { e.target.style.display = 'none' }}
                          />
                        )}
                        <span className="text-xs text-gray-600">{product.category?.name || 'Без категорії'}</span>
                      </div>

                      {/* Характеристики */}
                      <div className="space-y-1">
                        {product.weight > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-gray-600 text-xs">Вага:</span>
                            <span className="font-medium text-gray-800 text-xs">{product.weight} г</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <span className="text-gray-600 text-xs">Термін зберігання:</span>
                          <span className="font-medium text-gray-800 text-xs">{product.shelfLife}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-600 text-xs">Умови зберігання:</span>
                          <span className="font-medium text-gray-800 text-xs">{product.storageConditions}</span>
                        </div>
                      </div>

                      {/* Містить алергени */}
                      {product.contains && Object.values(product.contains).some(v => v) && (
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="text-xs font-medium text-gray-800">Містить:</span>
                          {product.contains.lactose && <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">Лактоза</span>}
                          {product.contains.gluten && <span className="px-1.5 py-0.5 bg-orange-100 text-orange-800 text-xs rounded">Глютен</span>}
                          {product.contains.nuts && <span className="px-1.5 py-0.5 bg-red-100 text-red-800 text-xs rounded">Горіхи</span>}
                          {product.contains.palmOil && <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 text-xs rounded">Пальмова олія</span>}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* НИЖНЯЯ ЧАСТЬ - Количество и цена на всю ширину */}
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">Кількість на складі:</span>
                        <span className={`px-1.5 py-0.5 text-xs rounded-full font-medium ${
                          product.qty > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.qty} шт
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">Ціна:</span>
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-sm text-gray-800">
                            {formatPrice(product.discountPrice > 0 ? product.discountPrice : product.price)}
                          </span>
                          {product.discountPrice > 0 && (
                            <span className="text-xs text-gray-400 line-through">
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductList