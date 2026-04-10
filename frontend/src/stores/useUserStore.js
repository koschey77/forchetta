import { create } from "zustand"
import axios from "../lib/axios"
import { toast } from "react-hot-toast"
import { queryClient } from "../main"
import useCartStore from "./useCartStore"

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,
  verificationEmail: null,

  signup: async ({ name, email, password }) => {
    set({ loading: true })

    try {
      await axios.post("/auth/signup", { name, email, password })
      
      // Сохраняем email для верификации
      set({ 
        verificationEmail: email, 
        loading: false 
      })
      
      toast.success("Код надіслано на email.")
      
      return { 
        needsVerification: true, 
        email
      }
    } catch (error) {
      set({ loading: false })
      const errorData = error.response?.data
      toast.error(errorData?.message || "Помилка під час реєстрації")
      throw error
    }
  },

  // Функция для верификации email кода
  verifyEmail: async ({ email, verificationCode }) => {
    set({ loading: true })

    try {
      // При успешной верификации пользователь создается и автоматически авторизируется
      const res = await axios.post("/auth/verify-email", { email, verificationCode })
      
      set({ 
        user: res.data.user, 
        verificationEmail: null,
        loading: false
      })
      
      // Синхронизируем корзину после регистрации и входа
      useCartStore.getState().syncCartWithServer()
      
      toast.success("Реєстрація завершена! Ласкаво просимо!")
      return res.data
    } catch (error) {
      set({ loading: false })
      const errorData = error.response?.data
      
      if (errorData?.attemptsExceeded || errorData?.shouldClear) {
        // Попытки исчерпаны - очищаем email
        set({ verificationEmail: null })
      }
      throw error
    }
  },

  // Функция для повторной отправки кода верификации (один раз)
  resendVerificationCode: async (email) => {
    set({ loading: true })

    try {
      const res = await axios.post("/auth/resend-verification-code", { email })
      
      set({ loading: false })
      
      toast.success("Новий код надіслано на email!")
      return res.data
    } catch (error) {
      set({ loading: false })
      const errorData = error.response?.data
      toast.error(errorData?.message || "Помилка повторної відправки коду")
      throw error
    }
  },

  login: async (email, password) => {
    set({ loading: true })

    try {
      const res = await axios.post("/auth/login", { email, password })
      set({ user: res.data, loading: false })
      
      // Синхронизируем корзину после логина
      useCartStore.getState().syncCartWithServer()
      
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
      queryClient.clear() // Очищаем кэш React Query (корзина, избранное и т.д.)
      useCartStore.getState().clearCart() // Очищаем локальную корзину
    } catch (error) {
      toast.error(error.response?.data?.message || "Помилка при виході")
      set({ user: null })
      queryClient.clear() // Очищаем кэш даже при ошибке выхода
      useCartStore.getState().clearCart() // Очищаем локальную корзину
    }
  },

  // Функция для отправки кода восстановления пароля на email
  forgotPassword: async (email) => {
    set({ loading: true })

    try {
      const res = await axios.post("/auth/forgot-password", { email })
      set({ loading: false })
      toast.success(res.data.message || "Код відновлення відправлено на email. Перевірте пошту!")
      return res.data
    } catch (error) {
      set({ loading: false })
      toast.error(error.response?.data?.message || "Помилка при відправці коду відновлення")
      throw error
    }
  },

  // Функция для сброса пароля по коду восстановления
  resetPassword: async ({ email, resetCode, newPassword }) => {
    set({ loading: true })

    try {
      const res = await axios.post("/auth/reset-password", { email, resetCode, newPassword })
      set({ loading: false })
      toast.success(res.data.message || "Пароль успішно змінено! Увійдіть з новим паролем")
      return res.data
    } catch (error) {
      set({ loading: false })
      toast.error(error.response?.data?.message || "Помилка при зміні пароля")
      throw error
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
      queryClient.clear() // Если сессия истекла, чистим приватный кэш
    }
  },

  refreshToken: async () => {
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

// Предотвращение бесконечного цикла:
//     используем originalRequest._retry = true.
// Игнорирование /auth/refresh-token: 
//      Если сам рефреш падает с 401, он не пытается обновить токен бесконечно.
// Паттерн Singleton для промиса: 
//    Если несколько запросов падают одновременно (например, грузятся картинки и корзина), 
//    первый запрос создает refreshPromise. Остальные видят if (refreshPromise), 
//    просто останавливаются и ждут его (await refreshPromise), а затем повторяют свои запросы.
// Централизация логики выхода: 
//    Если рефреш или повторный запрос падает окончательно, 
//    он корректно вызывает useUserStore.getState().logout().
let refreshPromise = null;

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		
		// Не обрабатываем ошибки refresh-token запросов - они должны завершиться сами
		if (originalRequest.url?.includes('/auth/refresh-token')) {
			return Promise.reject(error);
		}
		
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

// Автоматическая проверка аутентификации при инициализации приложения
useUserStore.getState().checkAuth();
