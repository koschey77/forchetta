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
    set({ appliedFilters: filters })
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
      }
    })
  },
  
  // Обновление поискового запроса
  setSearchFilter: (searchTerm) => {
    set((state) => ({
      appliedFilters: {
        ...state.appliedFilters,
        search: searchTerm
      },
      currentPage: 1 // Сбрасываем на первую страницу при поиске
    }))
  },
  
  // =============================================
  // ACTIONS ДЛЯ СОРТИРОВКИ
  // =============================================
  
  // Установка сортировки
  setSortOption: (sortOption) => {
    set({ sortOption, currentPage: 1 }) // Сбрасываем на первую страницу при изменении сортировки
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
  setItemsPerPage: (itemsPerPage) => {
    set({ itemsPerPage, currentPage: 1 }) // Сбрасываем на первую страницу при изменении лимита
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
    set({ 
      appliedFilters: filters,
      currentPage: 1 // Сбрасываем на первую страницу при изменении фильтров
    })
    
    // Закрываем сайдбар только на мобильной версии
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      set({ isFilterOpen: false })
    }
  },
  
  // Обновление конкретного типа фильтра с сбросом пагинации
  updateFilter: (filterType, value) => {
    set((state) => ({
      appliedFilters: {
        ...state.appliedFilters,
        [filterType]: value
      },
      currentPage: 1 // Сбрасываем на первую страницу при изменении фильтра
    }))
  },
  
}))

export default useFilterStore