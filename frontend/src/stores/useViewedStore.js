import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useViewedStore = create(
  persist(
    (set) => ({
      viewedIds: [],
      addId: (id) =>
        set((state) => {
          // Убираем дубликаты и оставляем только 12 последних
          const newIds = [id, ...state.viewedIds.filter((item) => item !== id)].slice(0, 12);
          return { viewedIds: newIds };
        }),
      clearViewed: () => set({ viewedIds: [] }),
    }),
    {
      name: 'recently-viewed-storage',
    }
  )
);
