import { create } from "zustand"
import { toast } from "react-hot-toast"
import axiosInstance from "../lib/axios.js"

const useCategoryStore = create((set, get) => ({
  categories: [],
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  createCategory: async (categoryData) => {
    set({ loading: true, error: null })
    try {
      const res = await axiosInstance.post("/categories", categoryData)
      set((prevState) => ({
        categories: [...prevState.categories, res.data],
        loading: false,
      }))
      toast.success("Категорію успішно створено!")
      return res.data
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Помилка створення категорії"
      set({ loading: false, error: errorMsg })
      toast.error(errorMsg)
      throw error
    }
  },

  fetchAllCategories: async () => {
    set({ loading: true, error: null })
    try {
      const response = await axiosInstance.get("/categories")
      set({ categories: response.data.categories, loading: false })
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Помилка завантаження категорій"
      set({ error: errorMsg, loading: false })
      toast.error(errorMsg)
    }
  },

  updateCategory: async (id, categoryData) => {
    set({ loading: true, error: null })
    try {
      const res = await axiosInstance.put(`/categories/${id}`, categoryData)
      set((prevState) => ({
        categories: prevState.categories.map(category => 
          category._id === id ? res.data : category
        ),
        loading: false,
      }))
      toast.success("Категорію успішно оновлено!")
      return res.data
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Помилка оновлення категорії"
      set({ loading: false, error: errorMsg })
      toast.error(errorMsg)
      throw error
    }
  },

  deleteCategory: async (id) => {
    set({ loading: true, error: null })
    try {
      await axiosInstance.delete(`/categories/${id}`)
      set((prevState) => ({
        categories: prevState.categories.filter(category => category._id !== id),
        loading: false,
      }))
      toast.success("Категорію успішно видалено!")
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Помилка видалення категорії"
      set({ loading: false, error: errorMsg })
      toast.error(errorMsg)
      throw error
    }
  },

  getCategoryById: async (id) => {
    set({ loading: true, error: null })
    try {
      const res = await axiosInstance.get(`/categories/${id}`)
      set({ loading: false })
      return res.data
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Помилка завантаження категорії"
      set({ loading: false, error: errorMsg })
      toast.error(errorMsg)
      throw error
    }
  },
}))

export default useCategoryStore