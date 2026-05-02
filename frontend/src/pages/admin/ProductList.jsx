import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { productsAPI } from '../../services/api'
import { EditIcon, BasketIcon, StarIcon } from '../../components/icons'
import useFilterStore from '../../stores/useFilterStore'
import CategoryFilter from '../../components/catalog/filters/CategoryFilter'
import FilterControls from '../../components/catalog/filters/FilterControls'
import SearchFilter from '../../components/catalog/filters/SearchFilter'
import NoResults from '../../components/errors/NoResults'
import { TopPaginationControls, BottomPaginationControls } from '../../components/common/pagination'

const ProductList = ({ onEditProduct }) => {
  const queryClient = useQueryClient()
  
  // Фільтри для адмінки
  const { appliedFilters, currentPage, itemsPerPage, setItemsPerPage, hasAppliedFilters } = useFilterStore()
  
  // TanStack Query для загрузки товаров
  const { 
    data: productsResponse, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['admin-products', appliedFilters, currentPage, itemsPerPage],
    queryFn: () => productsAPI.getMany({ 
      ...appliedFilters, 
      page: currentPage,
      limit: itemsPerPage
    }),
    staleTime: 0, // Завжди актуальні дані в адмінці
    refetchOnWindowFocus: true, // Обновлять при фокусе окна
  })
  
  // Витягуємо дані з відповіді API
  const products = productsResponse?.products || []
  const totalItems = productsResponse?.pagination?.total || 0
  const totalPages = productsResponse?.pagination?.totalPages || 0
  const hasFilters = hasAppliedFilters()

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

  // Mutation для изменения статуса isFeatured
  const toggleFeatured = useMutation({
    mutationFn: productsAPI.toggleFeatured,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      toast.success('Статус "Топ продажів" оновлено')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Помилка оновлення статусу')
    },
  })

  const handleToggleFeatured = async (id) => {
    toggleFeatured.mutate(id)
  }

  const handleDelete = async (id, name) => {
    if (window.confirm(`Ви дійсно хочете видалити товар "${name}"?`)) {
      deleteProduct.mutate(id)
    }
  }

  const handleEdit = (productId) => {
    if (onEditProduct) {
      onEditProduct(productId)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'UAH'
    }).format(price)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-creamy p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-choco-dark mx-auto"></div>
            <p className="mt-4 text-choco-light">Завантаження товарів...</p>
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
            <p className="text-red-600">Помилка завантаження товарів</p>
            <button 
              onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-products'] })}
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
        {/* Row 1: Add Button and Clear Filters */}
        <div className="flex justify-between items-center gap-4 mb-4">
          <button
            onClick={() => onEditProduct && onEditProduct(null)}
            className="w-full sm:w-[226px] h-[40px] bg-wine-red rounded-[31px] flex items-center justify-center gap-[10px] sm:gap-[14px] hover:opacity-90 transition-opacity"
          >
            <span className="text-creamy text-[20px] sm:text-[15px] leading-none">+</span>
            <span className="font-montserrat font-medium text-[14px] text-creamy whitespace-nowrap">Додати товар</span>
          </button>

          {/* Clear Filters Button */}
          <div className="w-auto">
            <FilterControls />
          </div>
        </div>

        {/* Row 2: Search and Category Filter */}
        <div className="flex justify-between items-center mb-[22px] gap-4">
          <div className="flex-1 sm:max-w-[400px]">
            <SearchFilter />
          </div>
          <div className="flex-1 sm:w-[298px] sm:flex-none h-[40px]">
            <CategoryFilter />
          </div>
        </div>

        {/* Row 3: Счетчик товаров + Пагинация (соответствует структуре каталога) */}
        <div className="flex flex-col gap-4 md:gap-0 md:flex-row md:items-center md:justify-between mb-6">
          {/* Mobile: елементи в одному рядку */}
          <div className="flex flex-row justify-between items-center gap-2 md:hidden">
            {/* Счетчик товаров */}
            <div className="text-base font-montserrat font-semibold text-choco-light flex-1">
              {totalItems > 0 ? (
                <>
                  <span>{hasFilters ? "Знайдено товарів:" : "Кількість товарів:"} </span>
                  <span className="font-montserrat text-base font-bold">{totalItems}</span>
                </>
              ) : (
                <span className="opacity-0">Кількість товарів: 0</span>
              )}
            </div>

            {/* Пагинация */}
            <div className="flex-shrink-0">
              <TopPaginationControls itemsPerPage={itemsPerPage} onItemsPerPageChange={setItemsPerPage} pageSizeOptions={[12, 24, 48]} />
            </div>
          </div>

          {/* Desktop: счетчик слева, пагинация справа */}
          <div className="hidden md:flex md:flex-row md:items-center md:justify-between md:w-full">
            {/* Счетчик товаров (прижат влево к поиску) */}
            <div className="text-lg font-montserrat font-semibold text-choco-light whitespace-nowrap">
              {totalItems > 0 ? (
                <>
                  <span>{hasFilters ? "Знайдено товарів:" : "Кількість товарів: "} </span>
                  <span className="font-montserrat text-lg font-bold">{totalItems}</span>
                </>
              ) : (
                <span className="opacity-0">Кількість товарів: 0</span>
              )}
            </div>

            {/* Пагинация (прижата вправо к фильтру) */}
            <TopPaginationControls itemsPerPage={itemsPerPage} onItemsPerPageChange={setItemsPerPage} pageSizeOptions={[12, 24, 48]} />
          </div>
        </div>

        {products.length === 0 ? (
          hasFilters ? (
            <NoResults />
          ) : (
            <div className="text-center py-12 bg-[rgba(245,238,224,0.4)] rounded-[12px]">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-[18px] font-montserrat font-semibold text-choco-light mb-2">Немає товарів</h3>
              <p className="text-[14px] font-medium text-choco-light font-montserrat">Додайте перший товар для відображення</p>
            </div>
          )
        ) : (
          <div className="w-full bg-[rgba(245,238,224,0.4)] rounded-[12px]" style={{ minHeight: "620px" }}>
            {/* Unified Table Headers (responsive) */}
            <div className="grid grid-cols-[60px_1fr_100px_50px_30px_30px] md:grid-cols-[150px_1fr_150px_80px_60px_60px] gap-1 md:gap-4 mb-[20px] md:mb-[25px]">
              <div className="font-montserrat font-medium md:font-semibold text-[12px] md:text-[18px] text-choco-light text-center">Фото</div>
              <div className="font-montserrat font-medium md:font-semibold text-[12px] md:text-[18px] text-choco-light text-center">Назва</div>
              <div className="font-montserrat font-medium md:font-semibold text-[12px] md:text-[18px] text-choco-light text-center">
                <div className="md:hidden">Категорія</div>
                <div className="hidden md:block">Категорія</div>
              </div>
              <div className="font-montserrat font-medium md:font-semibold text-[12px] md:text-[18px] text-choco-light text-center">Ціна</div>
              <div className="font-montserrat font-medium md:font-semibold text-[12px] md:text-[18px] text-choco-light text-center">
                <div className="md:hidden">К-ть</div>
                <div className="hidden md:block">К-ть</div>
              </div>
              <div className="font-montserrat font-medium md:font-semibold text-[12px] md:text-[18px] text-choco-light text-center">Дії</div>
            </div>

            {/* Header Line (desktop only) */}
            <div className="hidden md:block w-full h-[1px] bg-choco-light opacity-60 mb-[25px]"></div>

            {/* Unified Product Rows (responsive) */}
            <div className="space-y-[20px] md:space-y-[25px]">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="grid grid-cols-[60px_1fr_90px_50px_30px_30px] md:grid-cols-[150px_1fr_150px_80px_60px_60px] gap-1 md:gap-4 items-center"
                >
                  {/* Photo (responsive) */}
                  <div className="flex justify-center">
                    <div className="w-[50px] h-[50px] rounded-[25px] md:w-[120px] md:h-[60px] md:rounded-[20px] overflow-hidden bg-gray-100 flex items-center justify-center">
                      {product.images && product.images.length > 0 ? (
                        <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-gray-400 text-xs">Без фото</div>
                      )}
                    </div>
                  </div>

                  {/* Name (responsive) */}
                  <div className="flex justify-center items-center px-1">
                    <span className="font-montserrat font-medium text-[10px] md:text-[14px] text-choco-light text-center line-clamp-3">
                      {product.name}
                    </span>
                  </div>

                  {/* Category (responsive) */}
                  <div className="flex justify-center items-center">
                    <span className="font-montserrat font-medium text-[10px] md:text-[12px] text-choco-light text-center line-clamp-2">
                      {product.category?.name}
                    </span>
                  </div>

                  {/* Price (responsive) */}
                  <div className="flex justify-center items-center">
                    <div className="text-center">
                      <div className="font-montserrat font-semibold text-[10px] md:text-[12px] text-choco-light">
                        {formatPrice(product.discountPrice > 0 ? product.discountPrice : product.price)}
                      </div>
                      {product.discountPrice > 0 && (
                        <div className="font-montserrat text-[8px] md:text-[10px] text-gray-400 line-through">{formatPrice(product.price)}</div>
                      )}
                    </div>
                  </div>

                  {/* Quantity (responsive) */}
                  <div className="flex justify-center items-center">
                    <span
                      className={`font-montserrat font-semibold text-[10px] md:text-[12px] ${
                        product.qty === 0 ? "text-error-red" : product.qty <= 5 ? "text-warning-yellow" : "text-correct-green"
                      }`}
                    >
                      {product.qty}
                    </span>
                  </div>

                  {/* Actions (responsive) */}
                  <div className="flex justify-center items-center">
                    <div className="flex flex-col items-center gap-[3px]">
                      <button
                        onClick={() => handleToggleFeatured(product._id)}
                        className="w-[20px] h-[20px] md:w-[31px] md:h-[31px] bg-creamy-light rounded-full flex items-center justify-center transition-colors hover:opacity-80"
                        title={product.isFeatured ? "Прибрати з 'Топ продаж'": "Додати в 'Топ продаж'"}
                      >
                        <StarIcon 
                          className="w-[10px] h-[10px] md:w-[14.74px] md:h-[14.57px]" 
                          fill={product.isFeatured ? "#DAA520" : "none"}
                          stroke={product.isFeatured ? "#DAA520" : "#893E3E"}
                        />
                      </button>
                      <button
                        onClick={() => handleEdit(product._id)}
                        className="w-[20px] h-[20px] md:w-[31px] md:h-[31px] bg-creamy-light rounded-full flex items-center justify-center transition-colors hover:opacity-80"
                        title="Редагувати"
                      >
                        <EditIcon className="w-[10px] h-[10px] md:w-[14.74px] md:h-[14.57px]" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id, product.name)}
                        className="w-[20px] h-[20px] md:w-[31px] md:h-[31px] bg-creamy-light rounded-full flex items-center justify-center transition-colors hover:opacity-80"
                        title="Видалити"
                      >
                        <BasketIcon className="w-[10px] h-[10px] md:w-[14px] md:h-[15.77px]" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Нижняя пагинация (стрелки) */}
        <div className="mb-20">
          <BottomPaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              const { setCurrentPage } = useFilterStore.getState()
              setCurrentPage(page)
            }}
            scrollToTop={true}
          />
        </div>
      </div>
    </div>
  )
}

export default ProductList