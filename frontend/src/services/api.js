import axiosInstance from "../lib/axios.js"

// PRODUCTS API

export const productsAPI = {
  // Универсальный метод для получения товаров (каталог, поиск, админка)
  getMany: async (params = {}) => {
    // Автоматическая сериализация Axios - передаем объект напрямую
    const response = await axiosInstance.get("/products", { 
      params: {
        page: params.page || 1,
        limit: params.limit || 12,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
        // Массивы автоматически превращаются в строки через запятую
        categories: params.categories?.join(','),
        ingredients: params.ingredients?.join(','),
        weights: params.weights?.join(','),
        // Диапазон цен
        priceMin: params.priceRange?.[0],
        priceMax: params.priceRange?.[1],
        // Поиск
        search: params.search?.trim(),
      }
    });
    return response.data;
  },

  // Убрали getAll() - используем универсальный getMany() с явными параметрами

  // Метод для совместимости с существующим кодом
  getAllWithFilters: async (filters = {}, pagination = { page: 1, limit: 12 }, sortOption = '') => {
    // Мапим старый формат sortOption в новый формат
    let sortBy = '', sortOrder = '';
    if (sortOption) {
      const [field, order] = sortOption.includes('-') ? sortOption.split('-') : [sortOption, ''];
      sortBy = field;
      sortOrder = order;
    }

    return await productsAPI.getMany({
      ...filters,
      ...pagination,
      sortBy,
      sortOrder
    });
  },

  // Специальные эндпоинты 
  getFeatured: () => axiosInstance.get("/products/featured").then(res => res.data),
  
  getRecommendations: () => axiosInstance.get("/products/recommendations").then(res => res.data),

  // CRUD операции (для админки)
  getById: (id) => axiosInstance.get(`/products/${id}`).then(res => res.data),
  
  create: (data) => axiosInstance.post("/products", data).then(res => res.data),
  
  update: (id, data) => axiosInstance.put(`/products/${id}`, data).then(res => res.data),
  
  delete: (id) => axiosInstance.delete(`/products/${id}`).then(() => ({ success: true })),

  // Специальные эндпоинты
  toggleFeatured: (id) => axiosInstance.patch(`/products/${id}`).then(res => res.data),
}

// =============================================
// CATEGORIES API
// =============================================

export const categoriesAPI = {
  // Backend для категорий не поддерживает пагинацию - возвращает все категории
  getAll: () => axiosInstance.get("/categories").then(res => res.data.categories),
  
  getById: (id) => axiosInstance.get(`/categories/${id}`).then(res => res.data),
  
  create: (data) => axiosInstance.post("/categories", data).then(res => res.data),
  
  update: (id, data) => axiosInstance.put(`/categories/${id}`, data).then(res => res.data),
  
  delete: (id) => axiosInstance.delete(`/categories/${id}`).then(() => ({ success: true })),
}

// ОБЪЕДИНЕННЫЙ API ОБЪЕКТ  

const api = {
  products: productsAPI,
  categories: categoriesAPI,
}

export default api