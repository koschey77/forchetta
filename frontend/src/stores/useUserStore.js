import { create } from "zustand"
import axios from "../lib/axios"
import { toast } from "react-hot-toast"

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,
  verificationEmail: null,
  verificationLoading: false,

  signup: async ({ name, email, password }) => {
    set({ loading: true })

    try {
      // Новая логика: signup теперь только отправляет код, не создает пользователя
      await axios.post("/auth/signup", { name, email, password })
      
      // Сохраняем email для верификации
      set({ 
        verificationEmail: email, 
        loading: false 
      })
      
      toast.success("Код надіслано на email. Перевірте пошту!")
      
      return { needsVerification: true, email }
    } catch (error) {
      set({ loading: false })
      toast.error(error.response?.data?.message || "Помилка під час реєстрації")
      throw error
    }
  },

  // Функция для верификации email кода
  verifyEmail: async ({ email, verificationCode }) => {
    set({ verificationLoading: true })

    try {
      // При успешной верификации пользователь создается и автоматически авторизируется
      const res = await axios.post("/auth/verify-email", { email, verificationCode })
      
      set({ 
        user: res.data.user, 
        verificationEmail: null,
        verificationLoading: false
      })
      
      toast.success("Реєстрація завершена! Ласкаво просимо!")
      return res.data
    } catch (error) {
      set({ verificationLoading: false })
      toast.error(error.response?.data?.message || "Невірний код верифікації")
      throw error
    }
  },

  // Функция для повторной отправки кода
  resendVerificationCode: async (email) => {
    set({ verificationLoading: true })

    try {
      await axios.post("/auth/resend-verification", { email })
      set({ verificationLoading: false })
      toast.success("Новий код надіслано на email. Перевірте пошту!")
    } catch (error) {
      set({ verificationLoading: false })
      toast.error(error.response?.data?.message || "Помилка при повторній відправці коду")
      throw error
    }
  },

  login: async (email, password) => {
    set({ loading: true })

    try {
      const res = await axios.post("/auth/login", { email, password })
      set({ user: res.data, loading: false })
      toast.success("Успішний вхід!")
    } catch (error) {
      set({ loading: false })
      toast.error(error.response?.data?.message || "Помилка входу")
      throw error
    }
  },

  logout: async () => {
    try {
      await axios.post("/auth/logout")
      set({ user: null })
    } catch (error) {
      toast.error(error.response?.data?.message || "Помилка при виході")

    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true })
    try {
      const response = await axios.get("/auth/profile")
      set({ user: response.data, checkingAuth: false })
    } catch (error) {
      console.log(error.message)
      set({ checkingAuth: false, user: null })
    }
  },

  refreshToken: async () => {
    // Prevent multiple simultaneous refresh attempts
    if (get().checkingAuth) return

    set({ checkingAuth: true })
    try {
      const response = await axios.post("/auth/refresh-token")
      set({ checkingAuth: false })
      return response.data
    } catch (error) {
      set({ user: null, checkingAuth: false })
      throw error
    }
  },
}))

// Axios interceptor for token refresh
let refreshPromise = null;

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// If a refresh is already in progress, wait for it to complete
				if (refreshPromise) {
					await refreshPromise;
					return axios(originalRequest);
				}

				// Start a new refresh process
				refreshPromise = useUserStore.getState().refreshToken();
				await refreshPromise;
				refreshPromise = null;

				return axios(originalRequest);
			} catch (refreshError) {
				// If refresh fails, redirect to login or handle as needed
				useUserStore.getState().logout();
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);
