import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import HeroSlider from '../components/ui/carousel/HeroSlider'
import HomeCategories from '../components/home/HomeCategories'
import ProductSectionSlider from '../components/ui/carousel/ProductSectionSlider'
import PromoBanner from '../components/home/PromoBanner'
import AboutSection from '../components/home/AboutSection'
import StatsSection from '../components/home/StatsSection'
import StoreShowcaseSection from '../components/home/StoreShowcaseSection'
import DeliverySection from '../components/home/DeliverySection'
import api from '../services/api'
import useFilterStore from '../stores/useFilterStore'

export default function HomePage() {
  const resetFilters = useFilterStore(state => state.resetFilters);
  const updateFilter = useFilterStore(state => state.updateFilter);
  const queryClient = useQueryClient();

  // Завантажуємо Ексклюзиви (Featured)
  const { data: featuredData, isLoading: isFeaturedLoading } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: api.products.getFeatured
  })

  // Завантажуємо Подарункові набори (з динамічним пошуком ID категорії)
  const { data: giftSetsData, isLoading: isGiftSetsLoading } = useQuery({
    queryKey: ['giftSetsProducts'],
    queryFn: async () => {
      try {
        // Спочатку отримуємо всі категорії, щоб знайти ObjectID "Подарункові набори"
        const categories = await api.categories.getAll();
        const targetCategory = categories.find(c => c.name === 'Подарункові набори' || c.name === 'Подарункові набори ');
        
        // Якщо категорії немає в базі, нічого не шукаємо
        if (!targetCategory) return [];
        
        // Передаємо _id категорії, оскільки backend очікує ObjectId, а не стрічку
        return api.products.getMany({ limit: 6, categories: [targetCategory._id] });
      } catch (error) {
        console.error("Error fetching gift sets:", error);
        return [];
      }
    }
  })

  // Адаптуємо отримані дані
  const displayFeaturedProducts = useMemo(() => {
    if (!featuredData) return [];
    return Array.isArray(featuredData) ? featuredData : (featuredData.products || []);
  }, [featuredData]);

  const displayGiftSets = useMemo(() => {
    if (!giftSetsData) return [];
    return Array.isArray(giftSetsData) ? giftSetsData : (giftSetsData.products || []);
  }, [giftSetsData]);

  // Функція для встановлення фільтру по Подарунковим наборам
  const handleGiftSetsClick = () => {
    resetFilters();
    // Отримуємо категорії з кешу (викликаного в useQuery вище або HomeCategories)
    const categories = queryClient.getQueryData(['categories']) || [];
    const targetCategory = categories.find(c => c.name === 'Подарункові набори' || c.name === 'Подарункові набори ');
    if (targetCategory) {
      updateFilter('categories', [targetCategory._id]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-creamy">
      {/* Секція №1 - Hero Баннер */}
      <HeroSlider />
      
      {/* Секція №2 - Сетка Категорий */}
      <HomeCategories />

      {/* Секція №3 - Ексклюзивні десерти */}
      <ProductSectionSlider 
        title="Наші ексклюзиви"
        linkUrl="/catalog?isFeatured=true"
        products={displayFeaturedProducts}
        isLoading={isFeaturedLoading}
      />

      {/* Секція №4 - Промо-баннер (Новинка) */}
      <PromoBanner />

      {/* Секція №5 - Чому саме ми? */}
      <AboutSection />

      {/* Секція №6 - Статистика */}
      <StatsSection />

      {/* Секція №7 - Де нас знайти */}
      <StoreShowcaseSection />

      {/* Секція №8 - Доставка та оплата */}
      <DeliverySection />

      {/* Секція №9 - Подарункові набори */}
      <ProductSectionSlider 
        title="Подарункові набори"
        linkUrl="/catalog"
        linkText="Переглянути весь асортимент"
        products={displayGiftSets}
        isLoading={isGiftSetsLoading}
        onLinkClick={handleGiftSetsClick}
      />
    </div>
  )
}
