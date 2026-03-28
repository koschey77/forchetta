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
    weights: []
  },
  
  // Текущая сортировка
  sortOption: '',
  
  // UI состояния
  isFilterOpen: false,

  // =============================================
  // СОСТОЯНИЕ ПАГИНАЦИИ
  // =============================================
  
  // Текущая страница
  currentPage: 1,
  
  // Количество товаров на странице
  itemsPerPage: 12,
  
  // Общее количество страниц
  totalPages: 0,
  
  // Общее количество товаров
  totalItems: 0,
  
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
        weights: []
      }
    })
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
  
  // Установка данных пагинации из API response
  setPaginationData: (paginationData) => {
    set({ 
      currentPage: paginationData.currentPage || 1,
      totalPages: paginationData.totalPages || 0,
      totalItems: paginationData.total || 0
    })
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
           appliedFilters.priceRange[1] < 2500
  },
  
  // Получение количества активных фильтров
  getActiveFiltersCount: () => {
    const { appliedFilters } = get()
    let count = 0
    
    if (appliedFilters.categories.length > 0) count++
    if (appliedFilters.ingredients.length > 0) count++
    if (appliedFilters.weights.length > 0) count++
    if (appliedFilters.priceRange[0] > 1 || appliedFilters.priceRange[1] < 2500) count++
    
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
        weights: []
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