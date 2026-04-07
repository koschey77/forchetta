import { createContext, useContext, useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

const CarouselContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useCarousel = () => {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error('useCarousel должен использоваться внутри <Carousel />');
  }
  return context;
};

export const Carousel = ({
  children,
  options = { loop: false },
  className = '',
  onSlideChange,
  setApi,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback((api) => {
    if (!api) return;
    const index = api.selectedScrollSnap();
    setSelectedIndex(index);
    if (onSlideChange) {
      onSlideChange(index);
    }
  }, [onSlideChange]);

  useEffect(() => {
    if (!emblaApi) return;
    
    onSelect(emblaApi);
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    
    if (setApi) {
      setApi(emblaApi);
    }

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect, setApi]);

  const scrollTo = useCallback((index) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  return (
    <CarouselContext.Provider value={{ emblaRef, emblaApi, selectedIndex, scrollTo }}>
      <div className={`relative ${className}`}>
        {children}
      </div>
    </CarouselContext.Provider>
  );
};

export const CarouselContent = ({ className = '', children }) => {
  const { emblaRef } = useCarousel();
  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className={`flex ${className}`}>
        {children}
      </div>
    </div>
  );
};

export const CarouselItem = ({ className = '', children }) => {
  return (
    <div className={`min-w-0 flex-[0_0_100%] ${className}`}>
      {children}
    </div>
  );
};

export const CarouselDots = ({ className = '' }) => {
  const { emblaApi, selectedIndex, scrollTo } = useCarousel();
  const [scrollSnaps, setScrollSnaps] = useState([]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    const onInit = () => setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('reInit', onInit);
    return () => emblaApi.off('reInit', onInit);
  }, [emblaApi]);

  if (scrollSnaps.length < 2) return null;

  return (
    <div className={`flex justify-center gap-[20px] ${className}`}>
      {scrollSnaps.map((_, index) => (
        <button
          key={index}
          className={`w-[11px] h-[11px] rounded-full transition-all duration-300 ${
            index === selectedIndex 
              ? 'bg-creamy' 
              : 'bg-choco-light hover:bg-choco-light/80'
          }`}
          onClick={() => scrollTo(index)}
          aria-label={`Перейти к слайду ${index + 1}`}
        />
      ))}
    </div>
  );
};
