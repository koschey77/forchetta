import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useCallback, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'

const slides = [
  {
    id: 1,
    imageDesktop: '/assets/hero-1-desktop.png',
    imageTablet: '/assets/hero-1-tablet.png',
    imageMobile: '/assets/hero-1-mobile.png',
    buttonText: 'ДО КАТАЛОГУ',
    link: '/catalog'
  },
  {
    id: 2,
    imageDesktop: '/assets/hero-2-desktop.png',
    imageTablet: '/assets/hero-2-tablet.png',
    imageMobile: '/assets/hero-2-mobile.png',
    buttonText: 'ДО КАТАЛОГУ',
    link: '/catalog?category=весна'
  },
  {
    id: 3,
    imageDesktop: '/assets/hero-3-desktop.png',
    imageTablet: '/assets/hero-3-tablet.png',
    imageMobile: '/assets/hero-3-mobile.png',
    buttonText: 'ДО КАТАЛОГУ',
    link: '/catalog?category=подарункові%20набори'
  }
]

export default function HeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 10000, stopOnInteraction: false })
  ])
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollTo = useCallback((index) => emblaApi && emblaApi.scrollTo(index), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  return (
    <section className="relative w-full h-[500px] md:h-[569px] overflow-hidden bg-choco-dark">
      {/* Embla Carousel Viewport */}
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide) => (
            <div key={slide.id} className="relative flex-[0_0_100%] min-w-0 h-full">
              {/* Responsive Background Images */}
              <picture>
                <source media="(max-width: 639px)" srcSet={slide.imageMobile} />
                <source media="(max-width: 1023px)" srcSet={slide.imageTablet} />
                <img 
                  src={slide.imageDesktop} 
                  alt={slide.title} 
                  className="w-full h-full object-cover" 
                  loading="lazy"
                />
              </picture>
              
              {/* Overlay Content */}
              <div className="absolute inset-0 flex flex-col justify-end items-center pb-[75px] md:pb-[95px]">
                <Link 
                  to={slide.link}
                  className="flex items-center justify-center bg-creamy rounded-[31px] w-[192px] h-[52px] text-[#4C3D3D] font-montserrat font-normal text-[16px] leading-[20px] transition-transform hover:scale-105 duration-200"
                >
                  {slide.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-[20px]">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={clsx(
              "w-[11px] h-[11px] rounded-full transition-colors duration-200",
              index === selectedIndex ? "bg-creamy" : "bg-choco-light"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
