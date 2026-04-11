import { create } from 'zustand';
import api from '../services/api';
import { useUserStore } from './useUserStore';
import toast from 'react-hot-toast';

const useCartStore = create((set, get) => ({
  cartItems: [], // Формат: [ { product: { ... }, quantity: 1 } ]
  isLoading: false,

  // Загрузка корзины с сервера (только для авторизованных)
  fetchCart: async () => {
    const user = useUserStore.getState().user;
    if (!user) {
      set({ cartItems: [] });
      return;
    }
    
    set({ isLoading: true });
    try {
      const data = await api.cart.get();
      set({ cartItems: data, isLoading: false });
    } catch (error) {
      console.error("Error fetching cart from server:", error);
      set({ isLoading: false });
    }
  },

  addToCart: async (product, quantity = 1) => {
    const user = useUserStore.getState().user;
    if (!user) {
      useUserStore.getState().openAuthModal();
      return;
    }

    try {
      const productId = product._id || product.id;
      await api.cart.add({ productId, quantity });
      await get().fetchCart(); // Стягиваем свежие данные с сервера
      toast.success("Додано до кошика");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Помилка при додаванні");
    }
  },

  updateQuantity: async (productId, quantity) => {
    const user = useUserStore.getState().user;
    if (!user) return;

    try {
      if (quantity === 0) {
        await api.cart.remove(productId);
      } else {
        await api.cart.update(productId, { quantity });
      }
      await get().fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Помилка оновлення кількості");
    }
  },

  removeFromCart: async (productId) => {
    const user = useUserStore.getState().user;
    if (!user) return;

    try {
      await api.cart.remove(productId);
      await get().fetchCart();
      toast.success("Видалено з кошика");
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Помилка при видаленні");
    }
  },

  clearCart: async () => {
    const user = useUserStore.getState().user;
    if (!user) {
      set({ cartItems: [] });
      return;
    }

    try {
      await api.cart.clear();
      set({ cartItems: [] });
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  }
}));

export default useCartStore;
