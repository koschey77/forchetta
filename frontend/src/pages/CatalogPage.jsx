import { useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import CatalogHeader from '../components/catalog/CatalogHeader';
import Sidebar from '../components/catalog/Sidebar';
import ProductCard from '../components/catalog/ProductCard';
import Pagination from '../components/catalog/Pagination';
import { productsAPI } from '../services/api';
import useFilterStore from '../stores/useFilterStore';

const CatalogPage = () => {
  // Получаем состояние фильтров из централизованного стора
  const { 
    appliedFilters, 
    sortOption, 
    isFilterOpen, 
    hasAppliedFilters,
    applyFilters,
    currentPage,
    itemsPerPage,
    totalPages,
    totalItems,
    setPaginationData,
    setCurrentPage
  } = useFilterStore();

  // TanStack Query для загрузки товаров
  const { 
    data: apiResponse, 
    isLoading: productsLoading, 
    error 
  } = useQuery({
    queryKey: ['products', appliedFilters, sortOption, currentPage, itemsPerPage],
    queryFn: () => productsAPI.getAllWithFilters(
      appliedFilters, 
      { page: currentPage, limit: itemsPerPage }, 
      sortOption
    ),
    staleTime: 2 * 60 * 1000, // 2 минуты свежие данные для каталога
  });

  // Извлекаем товары из ответа API с мемоизацией для стабильности ссылок
  const products = useMemo(() => apiResponse?.products || [], [apiResponse?.products]);

  // Обновляем данные пагинации при получении нового ответа  
  useEffect(() => {
    if (apiResponse?.pagination) {
      setPaginationData(apiResponse.pagination);
    }
  }, [apiResponse, setPaginationData]);

  // Функция адаптации backend данных в frontend формат
  const adaptProductData = (backendProduct) => {
    // Определяем тег на основе скидости
    let tag = null;
    if (backendProduct.discountPrice && backendProduct.discountPrice > 0) {
      const discount = Math.round((1 - backendProduct.discountPrice / backendProduct.price) * 100);
      tag = { text: `-${discount}%`, type: "red" };
    }
    
    return {
      id: backendProduct._id,
      title: backendProduct.name,
      price: `${backendProduct.discountPrice || backendProduct.price} грн / ${backendProduct.weight} г`,
      oldPrice: backendProduct.discountPrice ? `${backendProduct.price} грн` : null,
      image: backendProduct.images[0].url,
      tag,
      // Статистика лайков
      likesCount: backendProduct.likesCount || 0,
      // Добавляем оригинальные данные для совместимости
      originalProduct: backendProduct
    };
  };

  // Обрабатываем только адаптацию данных - фильтрация и сортировка на backend
  const displayProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    return products.map(adaptProductData);
  }, [products]);

  // Получаем информацию о примененных фильтрах из стора
  const hasFiltersApplied = hasAppliedFilters();

  // Компонент "товары не найдены"
  const NoProductsMessage = ({ isMobile = false }) => (
    <div className={`${isMobile ? 'col-span-2' : 'col-span-full'} flex flex-col justify-center items-center py-20`}>
      <div className={`text-choco-light ${isMobile ? 'text-lg' : 'text-xl'} mb-2`}>
        {hasFiltersApplied
          ? 'Товари за заданими фільтрами не знайдені'
          : appliedFilters.categories.length > 0 
            ? 'Товари в цих категоріях не знайдені' 
            : 'Товари не знайдені'
        }
      </div>
      <div className={`text-choco-light text-sm ${isMobile ? 'text-center' : ''}`}>
        {hasFiltersApplied
          ? 'Спробуйте скинути фільтри або вибрати інші параметри'
          : 'Спробуйте вибрати іншу категорію'
        }
      </div>
    </div>
  );



  const handleApplyFilters = (filters) => {
    // Используем метод из стора который автоматически закрывает на мобильных
    applyFilters(filters);
  };

  return (
    <div className="min-h-screen bg-creamy py-6">
      <div className="w-full">
        {/* Название выбранной категории */}
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-[60px] mb-4">
          <div className="text-center">
            <h2 className="text-2xl font-montserrat font-semibold leading-[29px] text-choco-light">
              {hasFiltersApplied 
                ? <>Знайдено товарів: <span className="font-cormorant oldstyle">{totalItems}</span></>
                : 'Всі категорії'
              }
            </h2>
          </div>
        </div>
        
        <CatalogHeader />
        
        {/* Основной контент с минимальной высотой для предотвращения перекрытия Footer */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-[60px] mt-6 pb-16 min-h-[600px]">
          {/* Desktop и Tablet версия - flex layout */}
          <div className="hidden sm:flex items-start gap-6">
            <Sidebar 
              className={`${isFilterOpen ? '' : 'hidden'}`} 
              onApplyFilters={handleApplyFilters} 
              products={products} 
            />
            
            <div className={`grid gap-x-6 gap-y-8 flex-grow transition-all duration-300 ease-in-out ${
              isFilterOpen 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            }`}>
              {productsLoading ? (
                <div className="col-span-full flex justify-center items-center py-20">
                  <div className="text-choco-light text-xl">Завантаження товарів...</div>
                </div>
              ) : error ? (
                <div className="col-span-full flex justify-center items-center py-20">
                  <div className="text-choco-light text-xl">Помилка завантаження товарів</div>
                </div>
              ) : displayProducts.length > 0 ? (
                displayProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <NoProductsMessage />
              )}
            </div>
          </div>

          {/* Mobile версия (<640px) */}
          <div className="sm:hidden relative z-10">
            {/* Фильтры */}
            <Sidebar 
              className={`w-full ${isFilterOpen ? 'block' : 'hidden'}`} 
              onApplyFilters={handleApplyFilters} 
              products={products} 
            />
            
            {/* Товары */}
            <div className={`grid gap-x-4 gap-y-8 grid-cols-2 ${isFilterOpen ? 'hidden' : 'block'}`}>
                {productsLoading ? (
                  <div className="col-span-2 flex justify-center items-center py-20">
                    <div className="text-choco-light text-lg">Завантаження...</div>
                  </div>
                ) : error ? (
                  <div className="col-span-2 flex justify-center items-center py-20">
                    <div className="text-choco-light text-lg">Помилка завантаження</div>
                  </div>
                ) : displayProducts.length > 0 ? (
                  displayProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <NoProductsMessage isMobile={true} />
                )}
            </div>
          </div>

          {/* Пагинация - показывается для всех размеров экранов */}
          {!productsLoading && !error && (
            <Pagination />
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;