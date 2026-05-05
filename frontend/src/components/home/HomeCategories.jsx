import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { categoriesAPI } from '../../services/api';
import useFilterStore from '../../stores/useFilterStore';

const categories = [
  {
    categoryFilter: 'Торти',
    desktopImg: '/assets/category-cakes-desktop.png',
    tabletImg: '/assets/category-cakes-tablet.png',
    mobileImg: '/assets/category-cakes-mobile.png',
    title: 'ТОРТИ', // За мобильным макетом (на десктопе "Торти", на мобильнике капсом, мы сделаем uppercase)
  },
  {
    categoryFilter: 'Тістечка',
    desktopImg: '/assets/category-pastries-desktop.png',
    tabletImg: '/assets/category-pastries-tablet.png',
    mobileImg: '/assets/category-pastries-mobile.png',
    title: 'ТІСТЕЧКА',
  },
  {
    categoryFilter: 'Подарункові набори',
    desktopImg: '/assets/category-gift-sets-desktop.png',
    tabletImg: '/assets/category-gift-sets-tablet.png',
    mobileImg: '/assets/category-gift-sets-mobile.png',
    title: 'ПОДАРУНКОВІ НАБОРИ',
    colSpan: true // Для десктопа этот блок широкий
  },
  {
    categoryFilter: 'Шоколад',
    desktopImg: '/assets/category-chocolate-desktop.png',
    tabletImg: '/assets/category-chocolate-tablet.png',
    mobileImg: '/assets/category-chocolate-mobile.png',
    title: 'ШОКОЛАД',
  },
  {
    categoryFilter: 'Цукерки',
    desktopImg: '/assets/category-candies-desktop.png',
    tabletImg: '/assets/category-candies-tablet.png',
    mobileImg: '/assets/category-candies-mobile.png',
    title: 'ЦУКЕРКИ',
  }
];

export default function HomeCategories() {
  const resetFilters = useFilterStore(state => state.resetFilters);
  const updateFilter = useFilterStore(state => state.updateFilter);

  // Завантажуємо всі доступні категорії з API (або з кешу)
  const { data: dbCategories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesAPI.getAll,
    staleTime: 10 * 60 * 1000, // Кешуємо на 10 хвилин
  });

  const handleCategoryClick = (categoryName) => {
    // Спочатку скидаємо всі активні фільтри
    resetFilters();

    // Знаходимо категорію в базі за назвою (наприклад 'Торти')
    const matchedCategory = dbCategories.find(c => c.name === categoryName);
    
    // Якщо знайшли її ID — встановлюємо фільтр саме по ID
    if (matchedCategory && matchedCategory._id) {
      updateFilter('categories', [matchedCategory._id]);
    } else {
      // Фолбек: якщо кеш ще порожній або категорія не знайдена
      // Ми не встановлюємо некоректний String фільтр, щоб не ламати бекенд
      console.warn(`Category ID for ${categoryName} not found in cache.`);
    }
  };

  return (
    <section className="w-full max-w-[1440px] mx-auto px-[15px] sm:px-[30px] lg:px-[60px] mt-[50px] md:mt-[64px] bg-creamy">
      {/* Header Секции */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 sm:gap-0 mb-[30px] sm:mb-[40px]">
        <h2 className="font-cormorant font-bold text-choco-dark text-[40px] sm:text-[48px] leading-[48px] sm:leading-[58px]">
          Категорії
        </h2>
      </div>

      {/* 
        Сетка Категорий. 
        На мобилках (до sm): 1 колонка. 
        На Планшете/Десктопе (sm и выше): Grid 2 колонки для точного трекинга. 
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[48px] sm:gap-4 lg:gap-6">
        
        {/* Торты */}
        <Link to="/catalog" onClick={() => handleCategoryClick(categories[0].categoryFilter)} className="group relative block overflow-hidden w-full h-full rounded-[100px] sm:rounded-[20px] transition-all duration-700 ease-in-out sm:col-start-1 sm:row-start-1 sm:row-span-1">
           <picture className="block w-full h-full">
            <source media="(max-width: 639px)" srcSet={categories[0].mobileImg} />
            <img src={categories[0].desktopImg} alt={categories[0].title} className="w-full h-full object-cover block transition-all duration-700 group-hover:scale-105" loading="lazy" />
          </picture>
        </Link>

        {/* Тістечка */}
        <Link to="/catalog" onClick={() => handleCategoryClick(categories[1].categoryFilter)} className="group relative block overflow-hidden w-full h-full rounded-[100px] sm:rounded-[20px] transition-all duration-700 ease-in-out sm:col-start-2 sm:row-start-1 sm:row-span-1">
           <picture className="block w-full h-full">
            <source media="(max-width: 639px)" srcSet={categories[1].mobileImg} />
            <img src={categories[1].desktopImg} alt={categories[1].title} className="w-full h-full object-cover block transition-all duration-700 group-hover:scale-105" loading="lazy" />
          </picture>
        </Link>

        {/* Подарункові набори */}
        <Link to="/catalog" onClick={() => handleCategoryClick(categories[2].categoryFilter)} className="group relative block overflow-hidden w-full h-full rounded-[100px] sm:rounded-[20px] transition-all duration-700 ease-in-out sm:col-start-1 sm:row-start-2 sm:row-span-2">
           <picture className="block w-full h-full">
            <source media="(max-width: 639px)" srcSet={categories[2].mobileImg} />
            <img src={categories[2].desktopImg} alt={categories[2].title} className="w-full h-full object-cover block transition-all duration-700 group-hover:scale-105" loading="lazy" />
          </picture>
        </Link>

        {/* Шоколад */}
        <Link to="/catalog" onClick={() => handleCategoryClick(categories[3].categoryFilter)} className="group relative block overflow-hidden w-full h-full rounded-[100px] sm:rounded-[20px] transition-all duration-700 ease-in-out sm:col-start-2 sm:row-start-2 sm:row-span-1">
           <picture className="block w-full h-full">
            <source media="(max-width: 639px)" srcSet={categories[3].mobileImg} />
            <img src={categories[3].desktopImg} alt={categories[3].title} className="w-full h-full object-cover block transition-all duration-700 group-hover:scale-105" loading="lazy" />
          </picture>
        </Link>

        {/* Цукерки */}
        <Link to="/catalog" onClick={() => handleCategoryClick(categories[4].categoryFilter)} className="group relative block overflow-hidden w-full h-full rounded-[100px] sm:rounded-[20px] transition-all duration-700 ease-in-out sm:col-start-2 sm:row-start-3 sm:row-span-1">
           <picture className="block w-full h-full">
            <source media="(max-width: 639px)" srcSet={categories[4].mobileImg} />
            <img src={categories[4].desktopImg} alt={categories[4].title} className="w-full h-full object-cover block transition-all duration-700 group-hover:scale-105" loading="lazy" />
          </picture>
        </Link>

      </div>
    </section>
  )
}