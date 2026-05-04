import { Link } from 'react-router-dom';

const categories = [
  {
    path: '/catalog?category=торти',
    desktopImg: '/assets/category-cakes-desktop.png',
    tabletImg: '/assets/category-cakes-tablet.png',
    mobileImg: '/assets/category-cakes-mobile.png',
    title: 'ТОРТИ', // За мобильным макетом (на десктопе "Торти", на мобильнике капсом, мы сделаем uppercase)
  },
  {
    path: '/catalog?category=тістечка',
    desktopImg: '/assets/category-pastries-desktop.png',
    tabletImg: '/assets/category-pastries-tablet.png',
    mobileImg: '/assets/category-pastries-mobile.png',
    title: 'ТІСТЕЧКА',
  },
  {
    path: '/catalog?category=подарункові%20набори',
    desktopImg: '/assets/category-gift-sets-desktop.png',
    tabletImg: '/assets/category-gift-sets-tablet.png',
    mobileImg: '/assets/category-gift-sets-mobile.png',
    title: 'ПОДАРУНКОВІ НАБОРИ',
    colSpan: true // Для десктопа этот блок широкий
  },
  {
    path: '/catalog?category=шоколад',
    desktopImg: '/assets/category-chocolate-desktop.png',
    tabletImg: '/assets/category-chocolate-tablet.png',
    mobileImg: '/assets/category-chocolate-mobile.png',
    title: 'ШОКОЛАД',
  },
  {
    path: '/catalog?category=цукерки',
    desktopImg: '/assets/category-candies-desktop.png',
    tabletImg: '/assets/category-candies-tablet.png',
    mobileImg: '/assets/category-candies-mobile.png',
    title: 'ЦУКЕРКИ',
  }
];

export default function HomeCategories() {
  return (
    <section className="w-full max-w-[1440px] mx-auto px-[15px] sm:px-[30px] lg:px-[60px] py-[30px] sm:py-[50px] bg-creamy">
      {/* Header Секции */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 sm:gap-0 mb-[30px] sm:mb-[50px]">
        <h2 className="font-cormorant font-bold text-choco-dark text-[40px] sm:text-[48px] leading-[48px] sm:leading-[58px]">
          Категорії
        </h2>
      </div>

      {/* 
        Сетка Категорий. 
        На мобилках (до sm): 1 колонка, отступы 48px. 
        На Планшете (sm и выше): 2 колонки. 
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[48px] sm:gap-4 lg:gap-6">
        
        {/* Торты */}
        <Link to={categories[0].path} className="group relative block overflow-hidden w-full rounded-full sm:rounded-[20px]">
           <picture className="block w-full">
            <source media="(max-width: 639px)" srcSet={categories[0].mobileImg} />
            <source media="(max-width: 1023px)" srcSet={categories[0].tabletImg} />
            <img src={categories[0].desktopImg} alt={categories[0].title} className="w-full h-auto block transition-transform duration-500 group-hover:scale-105" loading="lazy" />
          </picture>
        </Link>

        {/* Пирожные / Конфеты (На планшете это вторая колонка) */}
        <Link to={categories[4].path} className="group relative block overflow-hidden w-full rounded-full sm:rounded-[20px] sm:order-2">
           <picture className="block w-full">
            <source media="(max-width: 639px)" srcSet={categories[4].mobileImg} />
            <source media="(max-width: 1023px)" srcSet={categories[4].tabletImg} />
            <img src={categories[4].desktopImg} alt={categories[4].title} className="w-full h-auto block transition-transform duration-500 group-hover:scale-105" loading="lazy" />
          </picture>
        </Link>
        
        {/* Пирожные */}
        <Link to={categories[1].path} className="group relative block overflow-hidden w-full rounded-full sm:rounded-[20px] sm:order-3">
           <picture className="block w-full">
            <source media="(max-width: 639px)" srcSet={categories[1].mobileImg} />
            <source media="(max-width: 1023px)" srcSet={categories[1].tabletImg} />
            <img src={categories[1].desktopImg} alt={categories[1].title} className="w-full h-auto block transition-transform duration-500 group-hover:scale-105" loading="lazy" />
          </picture>
        </Link>

        {/* Шоколад */}
        <Link to={categories[3].path} className="group relative block overflow-hidden w-full rounded-full sm:rounded-[20px] sm:order-4">
           <picture className="block w-full">
            <source media="(max-width: 639px)" srcSet={categories[3].mobileImg} />
            <source media="(max-width: 1023px)" srcSet={categories[3].tabletImg} />
            <img src={categories[3].desktopImg} alt={categories[3].title} className="w-full h-auto block transition-transform duration-500 group-hover:scale-105" loading="lazy" />
          </picture>
        </Link>

        {/* Подарункові набори (Занимает всю ширину на планшете/десктопе) */}
        <Link to={categories[2].path} className="group relative block overflow-hidden w-full sm:col-span-2 rounded-full sm:rounded-[20px] sm:order-5">
           <picture className="block w-full">
            <source media="(max-width: 639px)" srcSet={categories[2].mobileImg} />
            <source media="(max-width: 1023px)" srcSet={categories[2].tabletImg} />
            <img src={categories[2].desktopImg} alt={categories[2].title} className="w-full h-auto block transition-transform duration-500 group-hover:scale-105" loading="lazy" />
          </picture>
        </Link>
      </div>
    </section>
  )
}