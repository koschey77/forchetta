import { CatalogFilterIcon, CrossIcon } from '../icons';
import useFilterStore from '../../stores/useFilterStore';
import { MenuDropdown } from '../ui/dropdowns';
import TopPaginationControls from './pagination/TopPaginationControls';

const CatalogHeader = ({ totalItems = 0, hasFilters = false }) => {
  // Получаем состояние сортировки из централизованного стора
  const { sortOption, setSortOption, isFilterOpen, setIsFilterOpen, itemsPerPage, setItemsPerPage } = useFilterStore();

  const sortOptions = [
    { value: 'price-asc', label: 'Від дешевих' },
    { value: 'price-desc', label: 'Від дорогих' },
    { value: 'new', label: 'Новинки' },
    { value: 'sales', label: 'Акції' },
    // { value: 'bestsellers', label: 'Топ продажів' }, // Пока нет статистики продаж
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-[15px] sm:px-[30px] lg:px-[60px]">
      <div className="flex flex-col gap-3">
        {/* На малых экранах < md: количество товаров и селектор СВЕРХУ */}
        <div className="flex md:hidden flex-row justify-between items-center gap-2 w-full">
          {/* Количество товаров */}
          {totalItems > 0 && (
            <div className="text-sm sm:text-lg font-montserrat font-semibold text-choco-light flex-1 text-left">
              {hasFilters ? "Знайдено:" : "Кількість товарів:"}{" "}
              <span className="font-cormorant oldstyle text-base sm:text-xl font-bold">{totalItems}</span>
            </div>
          )}

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
            {totalItems > 0 && (
              <div className="hidden md:block text-lg lg:text-xl font-montserrat font-semibold text-choco-light whitespace-nowrap">
                {hasFilters ? "Знайдено товарів:" : "Кількість товарів:"}{" "}
                <span className="font-cormorant oldstyle text-2xl lg:text-3xl font-bold">{totalItems}</span>
              </div>
            )}

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
  )
};

export default CatalogHeader;