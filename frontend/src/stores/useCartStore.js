import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import { useUserStore } from './useUserStore';
import toast from 'react-hot-toast';

const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [], // Формат: [ { product: { ... }, quantity: 1 } ]
      isLoading: false,

      // Загрузка корзины с сервера (только для авторизованных)
      fetchCart: async () => {
        const user = useUserStore.getState().user;
        if (!user) return; // Гости используют локальный стейт, сервер не дергаем
        
        set({ isLoading: true });
        try {
          const data = await api.cart.get();
          set({ cartItems: data, isLoading: false });
        } catch (error) {
          console.error("Error fetching cart from server:", error);
          set({ isLoading: false });
        }
      },

      // Синхронизация: отправляем локальную корзину на сервер при входе,
      // получаем обратно слитую корзину и сохраняем
      syncCartWithServer: async () => {
        const { cartItems } = get();
        const user = useUserStore.getState().user;
        
        if (!user) return;

        try {
          if (cartItems.length > 0) {
            // Отправляем то, что накопили анонимно
            const localItems = cartItems.map(item => ({
              productId: item.product._id || item.product.id,
              quantity: item.quantity
            }));
            
            await api.cart.sync({ cartItems: localItems });
          }
          
          // В любом случае затягиваем итоговую корзину с сервера
          await get().fetchCart();
        } catch (error) {
          console.error("Error syncing cart:", error);
        }
      },

      addToCart: async (product, quantity = 1) => {
        const user = useUserStore.getState().user;
        const { cartItems } = get();
        const existingItem = cartItems.find(item => 
          (item.product._id || item.product.id) === (product._id || product.id)
        );

        if (user) {
          // Для авторизованного - шлем на сервер
          try {
            await api.cart.add({ productId: product._id || product.id, quantity });
            await get().fetchCart(); // Стягиваем свежие данные с сервера
            toast.success("Додано до кошика");
          } catch (error) {
            console.error("Error adding to cart:", error);
            toast.error("Помилка при додаванні");
          }
        } else {
          // Для гостя - обновляем локально
          if (existingItem) {
            set({ 
              cartItems: cartItems.map(item => 
                (item.product._id || item.product.id) === (product._id || product.id)
                  ? { ...item, quantity: item.quantity + quantity } 
                  : item
              ) 
            });
          } else {
            set({ cartItems: [...cartItems, { product, quantity }] });
          }
          toast.success("Додано до кошика");
        }
      },

      updateQuantity: async (productId, quantity) => {
        const user = useUserStore.getState().user;
        
        if (user) {
          try {
            if (quantity === 0) {
              await api.cart.remove(productId);
            } else {
              await api.cart.update(productId, { quantity });
            }
            await get().fetchCart();
          } catch (error) {
            console.error("Error updating quantity:", error);
          }
        } else {
          const { cartItems } = get();
          if (quantity <= 0) {
            set({ cartItems: cartItems.filter(item => (item.product._id || item.product.id) !== productId) });
          } else {
            set({ 
              cartItems: cartItems.map(item => 
                (item.product._id || item.product.id) === productId 
                  ? { ...item, quantity } 
                  : item
              ) 
            });
          }
        }
      },

      removeFromCart: async (productId) => {
        const user = useUserStore.getState().user;
        if (user) {
          try {
            await api.cart.remove(productId);
            await get().fetchCart();
            toast.success("Видалено з кошика");
          } catch (error) {
            console.error("Error removing from cart:", error);
          }
        } else {
          set({ cartItems: get().cartItems.filter(item => (item.product._id || item.product.id) !== productId) });
          toast.success("Видалено з кошика");
        }
      },

      clearCart: async () => {
        const user = useUserStore.getState().user;
        if (user) {
          try {
            await api.cart.clear();
          } catch (error) {
            console.error("Error clearing cart:", error);
          }
        }
        set({ cartItems: [] });
      }
      
    }),
    {
      name: 'forchetta-cart', // Имя ключа в localStorage (сохраняет только стейт)
    }
  )
);

export default useCartStore;
