import axiosInstance from "../lib/axios.js"

// =============================================
// PRODUCTS API
// =============================================

export const productsAPI = {
  // Получение всех товаров
  getAll: async () => {
    const response = await axiosInstance.get("/products")
    return response.data.products
  },

  // Получение товаров с фильтрами (для каталога)
  getAllWithFilters: async (filters = {}, pagination = { page: 1, limit: 12 }, sortOption = '') => {
    const params = new URLSearchParams();

    // Добавляем пагинацию
    params.append('page', pagination.page.toString());
    params.append('limit', pagination.limit.toString());

    // Добавляем фильтры
    if (filters.categories && filters.categories.length > 0) {
      params.append('categories', filters.categories.join(','));
    }

    if (filters.ingredients && filters.ingredients.length > 0) {
      params.append('ingredients', filters.ingredients.join(','));
    }

    if (filters.priceRange && filters.priceRange.length === 2) {
      params.append('priceMin', filters.priceRange[0].toString());
      params.append('priceMax', filters.priceRange[1].toString());
    }

    if (filters.weights && filters.weights.length > 0) {
      params.append('weights', filters.weights.join(','));
    }

    // Добавляем сортировку
    if (sortOption) {
      switch (sortOption) {
        case 'price-asc':
          params.append('sortBy', 'price');
          params.append('sortOrder', 'asc');
          break;
        case 'price-desc':
          params.append('sortBy', 'price');
          params.append('sortOrder', 'desc');
          break;
        case 'new':
          params.append('sortBy', 'new');
          break;
        case 'sales':
          params.append('sortBy', 'sales');
          break;
        default:
          break;
      }
    }

    const queryString = params.toString();
    const url = queryString ? `/products?${queryString}` : '/products';
    
    const response = await axiosInstance.get(url);
    return response.data; // Возвращаем весь объект с products и pagination
  },

  // Получение товаров по категории  
  getByCategory: async (category) => {
    const response = await axiosInstance.get(`/products/category/${category}`)
    return response.data.products
  },

  // Получение рекомендуемых товаров
  getFeatured: async () => {
    const response = await axiosInstance.get("/products/featured")
    return response.data
  },

  // Получение рекомендованных товаров
  getRecommendations: async () => {
    const response = await axiosInstance.get("/products/recommendations")
    return response.data
  },

  // Получение товара по ID
  getById: async (productId) => {
    const response = await axiosInstance.get(`/products/${productId}`)
    return response.data
  },

  // Создание товара
  create: async (productData) => {
    const response = await axiosInstance.post("/products", productData)
    return response.data
  },

  // Обновление товара
  update: async (id, productData) => {
    const response = await axiosInstance.put(`/products/${id}`, productData)
    return response.data
  },

  // Удаление товара
  delete: async (productId) => {
    await axiosInstance.delete(`/products/${productId}`)
    return { success: true }
  },

  // Переключение статуса "рекомендуемый"
  toggleFeatured: async (productId) => {
    const response = await axiosInstance.patch(`/products/${productId}`)
    return response.data
  },
}

// =============================================
// CATEGORIES API
// =============================================

export const categoriesAPI = {
  // Получение всех категорий
  getAll: async () => {
    const response = await axiosInstance.get("/categories")
    return response.data.categories
  },

  // Получение категории по ID
  getById: async (id) => {
    const response = await axiosInstance.get(`/categories/${id}`)
    return response.data
  },

  // Создание категории
  create: async (categoryData) => {
    const response = await axiosInstance.post("/categories", categoryData)
    return response.data
  },

  // Обновление категории
  update: async (id, categoryData) => {
    const response = await axiosInstance.put(`/categories/${id}`, categoryData)
    return response.data
  },

  // Удаление категории
  delete: async (id) => {
    await axiosInstance.delete(`/categories/${id}`)
    return { success: true }
  },
}

// =============================================
// ОБЪЕДИНЕННЫЙ API ОБЪЕКТ  
// =============================================

const api = {
  products: productsAPI,
  categories: categoriesAPI,
}

export default api