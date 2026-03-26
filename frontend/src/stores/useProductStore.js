import { create } from "zustand"
import toast from "react-hot-toast"
import axiosInstance from "../lib/axios"

export const useProductStore = create((set) => ({
  products: [],
  allProducts: [], // Полный список всех товаров для подсчета по категориям
  featuredProducts: [],
  recommendedProducts: [],
  selectedProduct: null,
  loading: false,
  error: null,
  
  // Константы из модели
  shelfLifeOptions: ['36 годин', '2 доби', '3 доби', '4 доби', '5 діб', '14 діб', '21 доба', '6 місяців'],
  storageOptions: ['від +2°C до +6°C', 'до +20°C'],

  setProducts: (products) => set({ products }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  createProduct: async (productData) => {
    set({ loading: true, error: null })
    try {
      const res = await axiosInstance.post("/products", productData)
      set((prevState) => ({
        products: [...prevState.products, res.data],
        allProducts: [...prevState.allProducts, res.data], // Добавляем в оба массива
        loading: false,
      }))
      toast.success("Товар успішно створено!")
      return res.data
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Помилка створення товару"
      set({ loading: false, error: errorMsg })
      toast.error(errorMsg)
      throw error
    }
  },

  updateProduct: async (id, productData) => {
    set({ loading: true, error: null })
    try {
      const res = await axiosInstance.put(`/products/${id}`, productData)
      set((prevState) => ({
        products: prevState.products.map(product => 
          product._id === id ? res.data : product
        ),
        allProducts: prevState.allProducts.map(product => 
          product._id === id ? res.data : product
        ), // Обновляем в обоих массивах
        loading: false,
      }))
      toast.success("Товар успішно оновлено!")
      return res.data
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Помилка оновлення товару"
      set({ loading: false, error: errorMsg })
      toast.error(errorMsg)
      throw error
    }
  },

  fetchAllProducts: async () => {
    set({ loading: true, error: null })
    try {
      const response = await axiosInstance.get("/products")
      // Сохраняем полный список в allProducts и отображаем в products
      set({ 
        allProducts: response.data.products, 
        products: response.data.products, 
        loading: false 
      })
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Помилка завантаження товарів"
      set({ error: errorMsg, loading: false })
      toast.error(errorMsg)
    }
  },

  fetchProductsByCategory: async (category) => {
    set({ loading: true, error: null })
    try {
      const response = await axiosInstance.get(`/products/category/${category}`)
      // Обновляем только products, allProducts оставляем нетронутым
      set({ products: response.data.products, loading: false })
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Помилка завантаження товарів"
      set({ error: errorMsg, loading: false })
      toast.error(errorMsg)
    }
  },

  fetchFeaturedProducts: async () => {
    set({ loading: true, error: null })
    try {
      const response = await axiosInstance.get("/products/featured")
      set({ featuredProducts: response.data, loading: false })
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Помилка завантаження рекомендованих товарів"
      set({ error: errorMsg, loading: false })
      console.log("Error fetching featured products:", error)
    }
  },

  fetchRecommendedProducts: async () => {
    set({ loading: true, error: null })
    try {
      const response = await axiosInstance.get("/products/recommendations")
      set({ recommendedProducts: response.data, loading: false })
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Помилка завантаження рекомендацій"
      set({ error: errorMsg, loading: false })
      console.log("Error fetching recommended products:", error)
    }
  },

  deleteProduct: async (productId) => {
    set({ loading: true, error: null })
    try {
      await axiosInstance.delete(`/products/${productId}`)
      set((prevState) => ({
        products: prevState.products.filter((product) => product._id !== productId),
        allProducts: prevState.allProducts.filter((product) => product._id !== productId), // Удаляем из всех массивов
        featuredProducts: prevState.featuredProducts.filter((product) => product._id !== productId),
        recommendedProducts: prevState.recommendedProducts.filter((product) => product._id !== productId),
        loading: false,
      }))
      toast.success("Товар успішно видалено!")
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Помилка видалення товару"
      set({ loading: false, error: errorMsg })
      toast.error(errorMsg)
    }
  },

  toggleFeaturedProduct: async (productId) => {
    set({ loading: true, error: null })
    try {
      const response = await axiosInstance.patch(`/products/${productId}`)
      const updatedProduct = response.data
      
      set((prevState) => ({
        products: prevState.products.map((product) =>
          product._id === productId ? updatedProduct : product
        ),
        allProducts: prevState.allProducts.map((product) =>
          product._id === productId ? updatedProduct : product
        ), // Обновляем в обоих массивах
        loading: false,
      }))
      
      toast.success(`Товар ${updatedProduct.isFeatured ? 'додано до' : 'видалено з'} рекомендованих!`)
      return updatedProduct
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Помилка оновлення товару"
      set({ loading: false, error: errorMsg })
      toast.error(errorMsg)
    }
  },

  fetchProductById: async (productId) => {
    set({ loading: true, error: null })
    try {
      const response = await axiosInstance.get(`/products/${productId}`)
      set({ selectedProduct: response.data, loading: false })
      return response.data
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Помилка завантаження товару"
      set({ error: errorMsg, loading: false })
      toast.error(errorMsg)
    }
  },

  clearSelectedProduct: () => set({ selectedProduct: null }),

  // Вспомогательные методы
  getProductsByCategory: (category) => (state) => 
    state.products.filter(product => product.category === category),

  getFeaturedProductsCount: (state) => 
    state.products.filter(product => product.isFeatured).length,

  getProductsInStock: (state) => 
    state.products.filter(product => product.qty > 0),

  getDiscountedProducts: (state) => 
    state.products.filter(product => product.discountPrice > 0),
}))
