import { create } from 'zustand'

const useFilterStore = create((set, get) => ({
  // =============================================
  // СОСТОЯНИЕ ФИЛЬТРОВ И СОРТИРОВКИ
  // =============================================
  
  // Активные фильтры
  appliedFilters: {
    categories: [],
    ingredients: [],
    priceRange: [1, 2500],
    weights: [],
    search: '' // Поисковый запрос как дополнительный фильтр
  },
  
  // Текущая сортировка
  sortOption: '',
  
  // UI состояния
  isFilterOpen: false,

  // =============================================
  // СОСТОЯНИЕ ПАГИНАЦИИ (только client state)
  // =============================================
  
  // Текущая страница
  currentPage: 1,
  
  // Количество товаров на странице
  itemsPerPage: 12,
  
  // =============================================
  // ACTIONS ДЛЯ ФИЛЬТРОВ  
  // =============================================
  
  // Установка всех фильтров сразу
  setAppliedFilters: (filters) => {
    set((state) => {
      // Сбрасываем страницу только если фильтры реально изменились
      const filtersChanged = JSON.stringify(state.appliedFilters) !== JSON.stringify(filters);
      return {
        appliedFilters: filters,
        ...(filtersChanged && { currentPage: 1 })
      };
    })
  },
  
  // Сброс всех фильтров
  resetFilters: () => {
    set({
      appliedFilters: {
        categories: [],
        ingredients: [],
        priceRange: [1, 2500],
        weights: [],
        search: ''
      },
      currentPage: 1 // Сбрасываем страницу при сбросе фильтров
    })
  },
  
  // Обновление поискового запроса
  setSearchFilter: (searchTerm) => {
    set((state) => {
      // Сбрасываем страницу только если поисковый запрос РЕАЛЬНО изменился
      if (state.appliedFilters.search !== searchTerm) {
        return {
          appliedFilters: {
            ...state.appliedFilters,
            search: searchTerm
          },
          currentPage: 1 // Сбрасываем на первую страницу только при реальном изменении поиска
        };
      }
      // Если поиск не изменился, не трогаем currentPage
      return state;
    })
  },
  
  // =============================================
  // ACTIONS ДЛЯ СОРТИРОВКИ
  // =============================================
  
  // Установка сортировки
  setSortOption: (sortOption) => {
    set((state) => {
      // Якщо юзер клікнув на ту ж саму опцію сортування — скидаємо її
      if (state.sortOption === sortOption) {
        return { sortOption: '', currentPage: 1 };
      }
      // Інакше встановлюємо нову сортувальну опцію
      return { sortOption, currentPage: 1 };
    })
  },
  
  // Сброс сортировки
  resetSort: () => {
    set({ sortOption: '' })
  },

  // =============================================
  // ACTIONS ДЛЯ ПАГИНАЦИИ
  // =============================================
  
  // Установка текущей страницы
  setCurrentPage: (page) => {
    set({ currentPage: page })
  },
  
  // Установка количества товаров на страницу
  setItemsPerPage: (newItemsPerPage) => {
    set((state) => {
      // Сбрасываем страницу только при РЕАЛЬНОМ изменении количества
      if (state.itemsPerPage !== newItemsPerPage) {
        return { itemsPerPage: newItemsPerPage, currentPage: 1 };
      }
      // Если значение не изменилось, оставляем состояние как есть
      return state;
    });
  },

  // =============================================
  // UI ACTIONS
  // =============================================
  
  // Управление видимостью сайдбара фильтров
  setIsFilterOpen: (isOpen) => {
    set({ isFilterOpen: isOpen })
  },
  
  // Переключение сайдбара
  toggleFilterOpen: () => {
    set((state) => ({ isFilterOpen: !state.isFilterOpen }))
  },
  
  // Закрытие фильтров на мобильных устройствах после применения
  closeFiltersOnMobile: () => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      set({ isFilterOpen: false })
    }
  },
  
  // =============================================
  // ВЫЧИСЛЯЕМЫЕ ЗНАЧЕНИЯ (SELECTORS)
  // =============================================
  
  // Проверка, применены ли какие-либо фильтры
  hasAppliedFilters: () => {
    const { appliedFilters } = get()
    return appliedFilters.categories.length > 0 ||
           appliedFilters.ingredients.length > 0 || 
           appliedFilters.weights.length > 0 || 
           appliedFilters.priceRange[0] > 1 || 
           appliedFilters.priceRange[1] < 2500 ||
           (appliedFilters.search && appliedFilters.search.trim().length > 0)
  },
  
  // Получение количества активных фильтров
  getActiveFiltersCount: () => {
    const { appliedFilters } = get()
    let count = 0
    
    if (appliedFilters.categories.length > 0) count++
    if (appliedFilters.ingredients.length > 0) count++
    if (appliedFilters.weights.length > 0) count++
    if (appliedFilters.priceRange[0] > 1 || appliedFilters.priceRange[1] < 2500) count++
    if (appliedFilters.search && appliedFilters.search.trim().length > 0) count++
    
    return count
  },
  
  // =============================================
  // КОМПЛЕКСНЫЕ ACTIONS
  // =============================================
  
  // Сброс всех фильтров и сортировки
  resetAll: () => {
    set({
      appliedFilters: {
        categories: [],
        ingredients: [],
        priceRange: [1, 2500],
        weights: [],
        search: ''
      },
      sortOption: '',
      currentPage: 1,
      totalPages: 0,
      totalItems: 0
    })
  },
  
  // Применение фильтров с автоматическим закрытием на мобильных
  applyFilters: (filters) => {
    set((state) => {
      // Сбрасываем страницу только если фильтры реально изменились
      const filtersChanged = JSON.stringify(state.appliedFilters) !== JSON.stringify(filters);
      return {
        appliedFilters: filters,
        ...(filtersChanged && { currentPage: 1 })
      };
    })
    
    // Закрываем сайдбар только на мобильной версии
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      set({ isFilterOpen: false })
    }
  },
  
  // Обновление конкретного типа фильтра с сбросом пагинации
  updateFilter: (filterType, value) => {
    set((state) => {
      // Сбрасываем страницу только если значение фильтра реально изменилось
      const currentValue = state.appliedFilters[filterType];
      const valueChanged = JSON.stringify(currentValue) !== JSON.stringify(value);
      
      return {
        appliedFilters: {
          ...state.appliedFilters,
          [filterType]: value
        },
        ...(valueChanged && { currentPage: 1 })
      };
    })
  },
  
}))

export default useFilterStore