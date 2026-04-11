import axiosInstance from "../lib/axios.js"

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

  // CRUD операции (для админки)
  getById: (id) => axiosInstance.get(`/products/${id}`).then(res => res.data),
  
  create: (data) => axiosInstance.post("/products", data).then(res => res.data),
  
  update: (id, data) => axiosInstance.put(`/products/${id}`, data).then(res => res.data),
  
  delete: (id) => axiosInstance.delete(`/products/${id}`).then(() => ({ success: true })),
  
  // Специальные эндпоинты
  getFeatured: () => axiosInstance.get("/products/featured").then(res => res.data),
  
  getRecommendations: () => axiosInstance.get("/products/recommendations").then(res => res.data),
  
  getAvailableWeights: () => axiosInstance.get("/products/weights").then(res => res.data),
  
  toggleFeatured: (id) => axiosInstance.patch(`/products/${id}`).then(res => res.data),
}

export const categoriesAPI = {
  getAll: () => axiosInstance.get("/categories").then(res => res.data.categories),
  
  getById: (id) => axiosInstance.get(`/categories/${id}`).then(res => res.data),
  
  create: (data) => axiosInstance.post("/categories", data).then(res => res.data),
  
  update: (id, data) => axiosInstance.put(`/categories/${id}`, data).then(res => res.data),
  
  delete: (id) => axiosInstance.delete(`/categories/${id}`).then(() => ({ success: true })),
}

export const userAPI = {
  getProfile: () => axiosInstance.get("/users/profile").then(res => res.data),
  
  updateProfile: (data) => axiosInstance.put("/users/profile", data).then(res => res.data),
  
  addAddress: (data) => axiosInstance.post("/users/addresses", data).then(res => res.data),
  
  deleteAddress: (id) => axiosInstance.delete(`/users/addresses/${id}`).then(res => res.data),
  
  toggleFavorite: (productId) => axiosInstance.post(`/users/favorites/${productId}`).then(res => res.data),
}

export const adminUserAPI = {
  getAll: () => axiosInstance.get("/users").then(res => res.data),
  
  getById: (id) => axiosInstance.get(`/users/${id}`).then(res => res.data),
  
  create: (data) => axiosInstance.post("/users", data).then(res => res.data),
  
  update: (id, data) => axiosInstance.put(`/users/${id}`, data).then(res => res.data),
  
  updateRole: (id, role) => axiosInstance.patch(`/users/${id}/role`, { role }).then(res => res.data),
  
  toggleStatus: (id) => axiosInstance.patch(`/users/${id}/status`).then(res => res.data),
}

export const orderAPI = {
  // Для обычного пользователя
  create: (data) => axiosInstance.post("/orders", data).then(res => res.data),
  getMyOrders: () => axiosInstance.get("/orders/my-orders").then(res => res.data),
  getById: (id) => axiosInstance.get(`/orders/${id}`).then(res => res.data),
  
  // Для админа
  getAll: () => axiosInstance.get("/orders").then(res => res.data),
  update: (id, data) => axiosInstance.put(`/orders/${id}`, data).then(res => res.data),
  updateStatus: (id, status) => axiosInstance.put(`/orders/${id}/status`, { status }).then(res => res.data),
  delete: (id) => axiosInstance.delete(`/orders/${id}`).then(res => res.data),
}

export const cartAPI = {
  get: () => axiosInstance.get("/cart").then(res => res.data),
  add: (data) => axiosInstance.post("/cart/add", data).then(res => res.data),
  update: (id, data) => axiosInstance.put(`/cart/${id}`, data).then(res => res.data),
  remove: (id) => axiosInstance.delete(`/cart/${id}`).then(res => res.data),
  clear: () => axiosInstance.delete("/cart").then(res => res.data),
}

const api = {
  products: productsAPI,
  categories: categoriesAPI,
  users: userAPI,
  adminUsers: adminUserAPI,
  orders: orderAPI,
  cart: cartAPI,
}

export default api