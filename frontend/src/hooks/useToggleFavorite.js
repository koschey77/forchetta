import { useMutation } from '@tanstack/react-query';
import api from '../services/api';
import { useUserStore } from '../stores/useUserStore';
import toast from 'react-hot-toast';

export const useToggleFavorite = () => {
  return useMutation({
    mutationFn: (productId) => api.users.toggleFavorite(productId),
    
    // Оптимистичное обновление: срабатывает МГНОВЕННО до ответа сервера
    onMutate: async (productId) => {
      const { user } = useUserStore.getState();
      if (!user) return;

      // 1. Сохраняем предыдущее состояние (для отката при ошибке)
      const previousFavorites = user.favorites || [];

      // 2. Проверяем, есть ли товар уже в избранном
      const isFavorite = previousFavorites.some(
        (fav) => (fav._id || fav) === productId
      );

      // 3. Создаем новый массив (мгновенно меняемUI)
      const newFavorites = isFavorite
        ? previousFavorites.filter((fav) => (fav._id || fav) !== productId)
        // Для оптимистичного добавления кидаем фейковый объект с нужным ID
        : [...previousFavorites, { _id: productId }];

      // 4. Обновляем состояние Zustand
      useUserStore.setState({
        user: { ...user, favorites: newFavorites }
      });

      // 5. Возвращаем контекст для onError
      return { previousFavorites };
    },

    // Ошибка: откатываем интерфейс к предыдущему состоянию
    onError: (err, productId, context) => {
      const { user } = useUserStore.getState();
      if (user && context?.previousFavorites) {
        useUserStore.setState({
          user: { ...user, favorites: context.previousFavorites }
        });
      }
      toast.error('Помилка при оновленні улюблених. Перевірте зʼєднання.');
      console.error('Toggle favorite error:', err);
    },

    // Успех: сервер возвращает точный актуальный список избранного (с заполненными полями)
    onSuccess: (updatedFavoritesFromServer) => {
      const { user } = useUserStore.getState();
      if (user) {
        useUserStore.setState({
          user: { ...user, favorites: updatedFavoritesFromServer }
        });
      }
    }
  });
};
