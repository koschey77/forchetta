import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import ProductCard from '../../catalog/ProductCard';
import ProductCardSkeleton from '../../catalog/ProductCardSkeleton';

export default function ProductSectionSlider({ title, linkUrl, linkText = "Переглянути асортимент", products = [], isLoading = false, onLinkClick, className, compact = false }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    loop: false,
    dragFree: true,
  })

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState([])
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false)

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])
  const scrollTo = useCallback((index) => emblaApi && emblaApi.scrollTo(index), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setPrevBtnEnabled(emblaApi.canScrollPrev())
    setNextBtnEnabled(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
  }, [emblaApi, onSelect])

  return (
    <section className={clsx("w-full max-w-[1440px] mx-auto bg-creamy", className || "px-[15px] sm:px-[30px] lg:px-[60px] mt-[50px] md:mt-[64px]")}>
      {/* Шапка слайдера */}
      <div className={clsx("flex justify-center sm:justify-between items-center", compact ? "mb-[20px] sm:mb-[25px]" : "mb-[30px] sm:mb-[40px]")}>
        <h2 className="font-cormorant font-bold text-choco-dark text-[48px] leading-[58px] text-center sm:text-left w-full max-w-[343px] sm:max-w-none mx-auto sm:mx-0">
          {title}
        </h2>

        {/* Кнопки переключения для десктопа/планшета */}
        <div className="hidden sm:flex items-center gap-[10px]">
          {!isLoading && products.length > 0 && (
            <>
              {/* Левая стрелка */}
              <button
                onClick={scrollPrev}
                disabled={!prevBtnEnabled}
                className={clsx(
                  "flex items-center justify-center w-[35px] h-[35px] rounded-[17.5px] border border-choco-light text-choco-light transition-all",
                  !prevBtnEnabled ? "opacity-50 cursor-default" : "hover:bg-choco-light hover:text-creamy",
                )}
                aria-label="Previous slide"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>

              {/* Правая стрелка */}
              <button
                onClick={scrollNext}
                disabled={!nextBtnEnabled}
                className={clsx(
                  "flex items-center justify-center w-[35px] h-[35px] rounded-[17.5px] bg-choco-light border-2 border-transparent text-creamy transition-all",
                  !nextBtnEnabled ? "opacity-50 cursor-default" : "hover:border-creamy hover:bg-choco-dark",
                )}
                aria-label="Next slide"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Обертка для слайдера */}
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4 sm:-ml-6">
            {isLoading
              ? // Скелетоны при загрузке (ровно 6)
                [...Array(6)].map((_, i) => (
                  <div key={i} className="flex-none w-[280px] sm:w-[320px] lg:w-[345px] pl-4 sm:pl-6">
                    <ProductCardSkeleton />
                  </div>
                ))
              : // Реальные товары (строго 6)
                products.slice(0, 6).map((product) => (
                  <div key={product._id || product.id} className="flex-none w-[280px] sm:w-[320px] lg:w-[345px] pl-4 sm:pl-6">
                    <ProductCard product={product} />
                  </div>
                ))}
          </div>
        </div>
      </div>

      {/* Точки переключения (только Мобилка) */}
      {!isLoading && scrollSnaps.length > 1 && (
        <div className="flex justify-center items-center gap-[20px] mt-[30px] sm:hidden">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={clsx(
                "w-[11px] h-[11px] rounded-full transition-colors duration-200",
                index === selectedIndex ? "bg-choco-dark" : "bg-choco-light",
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Кнопка "Переглянути всі" під слайдером */}
      {linkUrl && (
        <div className={clsx("flex justify-center", compact ? "mt-[20px] sm:mt-[25px]" : "mt-[40px] sm:mt-[50px]")}>
          <Link
            to={linkUrl}
            onClick={onLinkClick}
            className="flex items-center justify-center w-full max-w-[370px] h-[67px] px-[30px] py-[16px] bg-choco-light hover:bg-choco-light/90 rounded-[7px] text-creamy font-montserrat font-light text-[16px] leading-[20px] uppercase transition-colors"
          >
            {linkText}
          </Link>
        </div>
      )}
    </section>
  )
}