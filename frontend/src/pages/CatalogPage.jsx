import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CatalogFilterIcon, CrossIcon } from '../components/icons';
import { MenuDropdown } from '../components/ui/dropdowns';
import Sidebar from '../components/catalog/Sidebar';
import ProductCard from '../components/catalog/ProductCard';
import { TopPaginationControls, BottomPaginationControls } from '../components/common/pagination';
import { productsAPI } from '../services/api';
import useFilterStore from '../stores/useFilterStore';

const CatalogPage = () => {
  // Получаем состояние фильтров из централизованного стора
  const { appliedFilters, sortOption, isFilterOpen, hasAppliedFilters, currentPage, itemsPerPage, setSortOption, setIsFilterOpen, setItemsPerPage } = useFilterStore();
  
  const sortOptions = [
    { value: 'price-asc', label: 'Від дешевих' },
    { value: 'price-desc', label: 'Від дорогих' },
    { value: 'new', label: 'Новинки' },
    { value: 'sales', label: 'Акції' },
  ];

  // TanStack Query для загрузки товаров
  const { 
    data: apiResponse, 
    isLoading: productsLoading, 
    error 
  } = useQuery({
    queryKey: ['products', appliedFilters, sortOption, currentPage, itemsPerPage],
    queryFn: () => {
      // Конвертируем UI формат сортировки в backend API формат
      let sortBy = '', sortOrder = '';
      if (sortOption) {
        const [field, order] = sortOption.includes('-') ? sortOption.split('-') : [sortOption, ''];
        sortBy = field;
        sortOrder = order;
      }

      return productsAPI.getMany({
        ...appliedFilters,
        page: currentPage,
        limit: itemsPerPage,
        sortBy,
        sortOrder
      });
    },
    staleTime: 2 * 60 * 1000, // 2 минуты свежие данные для каталога
  });

  // Извлекаем товары из ответа API с мемоизацией для стабильности ссылок
  // Извлекаем данные из TanStack Query response
  const products = useMemo(() => apiResponse?.products || [], [apiResponse?.products]);
  const totalItems = apiResponse?.pagination?.total || 0;
  const totalPages = apiResponse?.pagination?.totalPages || 0;

  // Функция адаптации backend данных в frontend формат
  const adaptProductData = (backendProduct) => {
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
  const NoProductsMessage = () => (
    <div className="col-span-2 sm:col-span-full flex flex-col justify-center items-center py-20">
      <div className="text-choco-light text-lg sm:text-xl mb-2">
        {hasFiltersApplied
          ? 'Товари за заданими фільтрами не знайдені'
          : appliedFilters.categories.length > 0 
            ? 'Товари в цих категоріях не знайдені' 
            : 'Товари не знайдені'
        }
      </div>
      <div className="text-choco-light text-sm text-center sm:text-left">
        {hasFiltersApplied
          ? 'Спробуйте скинути фільтри або вибрати інші параметри'
          : 'Спробуйте вибрати іншу категорію'
        }
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-creamy py-6">
      <div className="w-full">
        {/* Встроенный CatalogHeader */}
        <div className="w-full max-w-[1440px] mx-auto px-[15px] sm:px-[30px] lg:px-[60px]">
          <div className="flex flex-col gap-3">
            {/* На малых экранах < md: количество товаров и селектор СВЕРХУ */}
            <div className="flex md:hidden flex-row justify-between items-center gap-2 w-full">
              {/* Количество товаров */}
              <div className="text-sm sm:text-lg font-montserrat font-semibold text-choco-light flex-1 text-left min-h-[24px] flex items-center">
                {totalItems > 0 ? (
                  <>
                    {hasFiltersApplied ? "Знайдено:" : "Кількість товарів: "}{" "}
                    <span className="font-montserrat text-xs sm:text-sm font-bold">{totalItems}</span>
                  </>
                ) : (
                  <span className="opacity-0">Кількість товарів: 0</span>
                )}
              </div>

              {/* Селектор количества */}
              <div className="flex flex-shrink-0">
                <TopPaginationControls
                  itemsPerPage={itemsPerPage}
                  onItemsPerPageChange={setItemsPerPage}
                  pageSizeOptions={[12, 24, 48]}
                />
              </div>
            </div>

            {/* Desktop версия >= md: всё в одной строке ИЛИ мобильная версия < md: фильтры + сортировка */}
            <div className="flex flex-row justify-between items-center w-full gap-2 md:gap-4 h-[35px]">
              {/* Левая часть: кнопка фільтрів */}
              <div className="flex flex-row items-center gap-[10px] w-[126px] sm:w-[126px] h-[35px] flex-1 sm:flex-none">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="box-border flex flex-row justify-between items-center px-[15px] py-[5px] gap-[19px] w-full h-[35px] bg-choco-light border border-choco-light rounded-[5px] transition-all duration-200 hover:opacity-90"
                >
                  <div className="flex flex-row items-center gap-[5px] flex-1 h-[24px] text-creamy">
                    <CatalogFilterIcon width={24} height={24} strokeWidth={2} />
                    <span className="text-figma-base font-light text-center text-creamy">Фільтри</span>
                  </div>

                  <div className="w-[20px] h-[20px] flex items-center justify-center text-creamy">
                    {isFilterOpen && <CrossIcon width={20} height={20} />}
                  </div>
                </button>
              </div>

              {/* Правая часть - разная для desktop и mobile */}
              <div className="flex flex-row items-center gap-2 md:gap-4 flex-1 sm:flex-auto justify-start sm:justify-end md:justify-between">
                {/* Desktop: количество + селектор + сортировка */}
                <div className="hidden md:flex text-lg lg:text-xl font-montserrat font-semibold text-choco-light whitespace-nowrap min-h-[35px] items-center gap-1">
                  {totalItems > 0 ? (
                    <>
                      <span>{hasFiltersApplied ? "Знайдено товарів:" : "Кількість товарів:"}</span>
                      <span className="font-montserrat text-lg lg:text-xl font-bold">{totalItems}</span>
                    </>
                  ) : (
                    <span className="opacity-0">Кількість товарів: 0</span>
                  )}
                </div>

                <div className="hidden md:flex items-center gap-4">
                  <TopPaginationControls itemsPerPage={itemsPerPage} onItemsPerPageChange={setItemsPerPage} pageSizeOptions={[12, 24, 48]} />

                  {/* Сортировка - везде */}
                  <div className="flex flex-row items-center gap-[10px] w-[150px] h-[35px]">
                    <MenuDropdown
                      options={sortOptions}
                      selected={sortOption}
                      onChange={setSortOption}
                      placeholder="Сортування"
                      showCheckmarks={true}
                      variant="catalog"
                      triggerIcon={CatalogFilterIcon}
                    />
                  </div>
                </div>

                {/* Сортировка - только для мобильных */}
                <div className="flex md:hidden flex-row items-center gap-[10px] w-[150px] sm:w-[150px] h-[35px] flex-1 sm:flex-none">
                  <MenuDropdown
                    options={sortOptions}
                    selected={sortOption}
                    onChange={setSortOption}
                    placeholder="Сортування"
                    showCheckmarks={true}
                    variant="catalog"
                    triggerIcon={CatalogFilterIcon}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Основной контент с минимальной высотой для предотвращения перекрытия Footer */}
        <div className="max-w-[1440px] mx-auto px-[15px] sm:px-[30px] lg:px-[60px] mt-6 pb-16 min-h-[600px]">
          {/* Единый блок для всех экранов */}
          <div className="flex items-start gap-6">
            <Sidebar 
              className={`${isFilterOpen ? 'w-full min-w-[300px] sm:w-auto' : 'hidden'}`} 
            />
            
            {/* Товары - скрываются на мобильных когда открыты фильтры */}
            <div className={`grid gap-x-4 gap-y-8 sm:gap-x-6 flex-grow transition-all duration-300 ease-in-out ${
              isFilterOpen 
                ? 'hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            }`}>
              {productsLoading ? (
                <div className="col-span-2 sm:col-span-full flex justify-center items-center py-20">
                  <div className="text-choco-light text-lg sm:text-xl">Завантаження товарів...</div>
                </div>
              ) : error ? (
                <div className="col-span-2 sm:col-span-full flex justify-center items-center py-20">
                  <div className="text-choco-light text-lg sm:text-xl">Помилка завантаження товарів</div>
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

          {/* Пагинация - показывается для всех размеров экранов */}
          {!productsLoading && !error && (
            <BottomPaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                const { setCurrentPage } = useFilterStore.getState();
                setCurrentPage(page);
              }}
              className="mt-8"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;