import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import useFilterStore from '../../stores/useFilterStore';

const SLIDES = [
  {
    id: 1,
    title: "Ексклюзиви",
    subtitle: "Хочеться ще",
    desktopImg: "/assets/catalog-banner/catalog-featured-banner-desktop.png",
    mobileImg: "/assets/catalog-banner/catalog-featured-banner-mobile.png",
    sortOption: "featured-desc"
  },
  {
    id: 2,
    title: "Новинки",
    subtitle: "Смак, який закохує з першого шматочка",
    desktopImg: "/assets/catalog-banner/catalog-new-banner-desktop.png",
    mobileImg: "/assets/catalog-banner/catalog-new-banner-mobile.png",
    sortOption: "new"
  },
  {
    id: 3,
    title: "Акції",
    subtitle: "Вигідні пропозиції",
    desktopImg: "/assets/catalog-banner/catalog-sales-banner-desktop.png",
    mobileImg: "/assets/catalog-banner/catalog-sales-banner-mobile.png",
    sortOption: "sales"
  },
  {
    id: 4,
    title: "Топ продажів",
    subtitle: "Задоволення кожного дня!",
    desktopImg: "/assets/catalog-banner/catalog-topseller-banner-desktop.png",
    mobileImg: "/assets/catalog-banner/catalog-topseller-banner-mobile.png",
    sortOption: "salesCount-desc"
  }
];

const CatalogBanner = () => {
  const resetFilters = useFilterStore((state) => state.resetFilters);
  const setSortOption = useFilterStore((state) => state.setSortOption);

  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: 'start', slidesToScroll: 1 }, 
    [Autoplay({ delay: 10000, stopOnInteraction: false })]
  );

  const handleBannerClick = (sortOption) => {
    resetFilters();
    setSortOption(sortOption);
  };

  return (
    <div className="relative w-full max-w-[1440px] mx-auto px-[15px] sm:px-[30px] lg:px-[60px] mb-8">
      {/* Заголовок "Спеціальні пропозиції" */}
      <h2 className="absolute md:static top-[15px] left-0 right-0 w-full text-center md:text-left z-20 pointer-events-none font-cormorant font-normal text-[32px] sm:text-[40px] leading-[40px] sm:leading-[48px] text-creamy md:text-choco-light mb-0 md:mb-[15px]">
        Спеціальні пропозиції
      </h2>

      {/* Карусель */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-[20px]">
          {SLIDES.map((slide) => (
            <div 
              key={slide.id} 
              // На мобільному беремо 100% ширини (1 слайд), на планшеті та десктопі — 50% (2 слайди)
               className="relative flex-[0_0_100%] md:flex-[0_0_50%] pl-[20px] shrink-0"
            >
              {/* Обгортка самого банера */}
              <button 
                onClick={() => handleBannerClick(slide.sortOption)}
                className="relative flex w-full h-[600px] md:h-[250px] overflow-hidden group cursor-pointer text-left focus:outline-none"
              >
                {/* Фонові зображення (Mobile vs Desktop) */}
                <picture className="absolute inset-0 w-full h-full -z-10">
                  <source media="(min-width: 768px)" srcSet={slide.desktopImg} />
                  <img 
                    src={slide.mobileImg} 
                    alt={slide.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = slide.desktopImg;
                    }}
                  />
                </picture>

                {/* Темний градієнт для кращої читабельності тексту */}
                <div className="absolute inset-0 transition-opacity duration-300" style={{
                  background: 'radial-gradient(47.08% 194.66% at 70.38% 50%, rgba(102, 102, 102, 0) 0%, rgba(89, 49, 9, 0.4) 77.04%)'
                }} />

                {/* Контент банера */}
                <div className="relative z-10 flex w-full flex-col justify-start items-center h-full text-center md:items-start md:text-left px-[15px] pt-[140px] md:pt-[80px] md:px-[60px]">
                  <h3 className="font-cormorant font-normal text-[32px] sm:text-[40px] leading-[40px] sm:leading-[48px] text-creamy mb-[5px] md:mb-[10px]">
                    {slide.title}
                  </h3>
                  <p className="font-montserrat font-medium text-[13px] sm:text-[14px] leading-[16px] sm:leading-[17px] text-creamy">
                    {slide.subtitle}
                  </p>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CatalogBanner;
