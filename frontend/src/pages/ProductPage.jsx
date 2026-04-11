import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { productsAPI } from "../services/api"
import { ImagePlaceholderIcon, HeartIcon, HeartSolidIcon, WeightIcon, ClockIcon, TemperatureIcon } from "../components/icons"
import { Carousel, CarouselContent, CarouselItem, CarouselDots } from "../components/ui/carousel"
import ProductPageSkeleton from "../components/catalog/ProductPageSkeleton"
import NoConnection from "../components/errors/NoConnection"
import Error404 from "../components/errors/Error404"

const ProductPage = () => {
  const { id } = useParams()

  // TanStack Query для получения товара по ID
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsAPI.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 минут
  })

  // Деструктуризация product с дефолтными значениями
  const {
    images = [], name = "", isFeatured = false, qty = 0, summary = "", weight = 0,
    shelfLife = "", storageConditions = "", description = "", ingredients = "",
    price = 0,  discountPrice = null } = product || {}

  // Получаем изображения из товара
  const imageUrls = images?.length > 0 ? images.map(img => img.url) : []

  const [mainImage, setMainImage] = useState(imageUrls[0] || null)
  const [isLiked, setIsLiked] = useState(false)
  const [carouselApi, setCarouselApi] = useState(null)

  // Обновляем главное изображение при загрузке товара
  useEffect(() => {
    if (images?.length > 0) {
      setMainImage(images[0].url)
    }
  }, [images])

  // Функция для определения статуса товара
  const getStockStatus = (qty) => {
    if (qty === 0) {
      return { text: "Немає в наявності", colorClass: "text-choco-dark" } // Choco Dark
    } else if (qty <= 3) {
      return { text: "Закінчується", colorClass: "text-wine-red" } // Wine Red
    } else {
      return { text: "Є в наявності", colorClass: "text-correct-green" } // Correct Green
    }
  }

  // Форматирование цены
  const formatPrice = (price) => {
    return `${price} грн`
  }

  // Функция переключения избранного
  const toggleLike = () => {
    setIsLiked(!isLiked)
    // Здесь можно добавить API вызов для сохранения в избранное
  }

  // Функция для отображения цены
  const renderPriceSection = (sizeClasses = "text-[24px] leading-[29px]", alignment = "items-center") => {
    const hasDiscount = discountPrice && discountPrice < price
    const currentPrice = hasDiscount ? discountPrice : price
    const oldPrice = hasDiscount ? price : null

    return (
      <div className={`flex flex-col gap-0.5 ${alignment}`}>
        {oldPrice && (
          <span className="text-[16px] md:text-[20px] font-medium text-choco-light line-through opacity-60">
            {formatPrice(oldPrice)}
          </span>
        )}
        <span className={`${sizeClasses} font-semibold font-montserrat text-choco-light`}>
          {formatPrice(currentPrice)}
        </span>
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return <ProductPageSkeleton />
  }

  // Error state
  if (error) {
    const status = error.response?.status;

    // Если бэкенд ответил 404 или 400 (недопустимый ID) — показываем страницу 404
    if (status === 404 || status === 400) {
      return (
        <div className="min-h-[70vh] flex items-center justify-center">
          <Error404 />
        </div>
      )
    }

    // Во всех остальных случаях (сервер выключен, нет сети, 500 ошибка)
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <NoConnection />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-creamy py-6">
      <div className="w-full">
        <div className="w-full max-w-[1440px] mx-auto px-[15px] sm:px-[30px] lg:px-[60px]">
          {/* Mobile Title */}
          <div className="w-full md:hidden mb-6">
            <h1 className="text-[30px] leading-[36px] font-normal font-cormorant text-choco-light">{name || "Загрузка..."}</h1>
          </div>

          <div className="w-full flex flex-col md:flex-row gap-5 lg:gap-10 items-start">
            {/* Left Column: Images */}
            <div className="w-full md:w-1/2 flex flex-col gap-8 overflow-hidden">
              {/* Main Photo Container - Carousel */}
              <Carousel
                className="w-full relative"
                setApi={setCarouselApi}
                onSlideChange={(index) => setMainImage(imageUrls[index])}
              >
                <CarouselContent>
                  {imageUrls.length > 0 ? (
                    imageUrls.map((img, idx) => (
                      <CarouselItem key={idx}>
                        <div
                          className="relative aspect-square w-full bg-cover bg-center bg-gray-100 flex items-center justify-center"
                          style={{ backgroundImage: `url(${img})` }}
                        >
                          {/* Badge */}
                          {isFeatured && (
                            <div className="absolute top-5 left-2 md:left-5 bg-dark-creamy rounded-full px-4 py-2 flex items-center justify-center">
                              <span className="text-choco-dark text-[9px] md:text-[14px] leading-[11px] md:leading-[17px] font-medium font-montserrat text-center">
                                Топ продажів
                              </span>
                            </div>
                          )}
                          
                          {/* Like Icon */}
                          <button 
                            onClick={toggleLike}
                            className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center transition-colors hover:scale-110 z-10"
                          >
                            {isLiked ? (
                              <HeartSolidIcon className="text-creamy w-[30px] h-[30px]" />
                            ) : (
                              <HeartIcon className="text-creamy w-[30px] h-[30px]" strokeWidth={2} />
                            )}
                          </button>
                        </div>
                      </CarouselItem>
                    ))
                  ) : (
                    <CarouselItem>
                      <div className="relative aspect-square w-full bg-gray-100 flex flex-col items-center justify-center text-choco-light/60">
                        <ImagePlaceholderIcon className="w-20 h-20 mb-4" />
                        <span className="text-sm font-medium text-center">Зображення відсутнє</span>
                      </div>
                    </CarouselItem>
                  )}
                </CarouselContent>
                
                {/* Индикаторы (точки) поверх картинки */}
                <CarouselDots className="absolute bottom-4 left-0 right-0 z-10" />
              </Carousel>

              {/* Thumbnail Navigation */}
              {imageUrls.length > 1 && (
                <div className="flex items-center justify-center w-full max-w-full overflow-hidden">
                  <div className="flex gap-3 md:gap-3 lg:gap-4 overflow-x-auto pb-2 snap-x scroll-smooth custom-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {imageUrls.map((img, idx) => (
                      <div
                        key={idx}
                        className={`w-[60px] h-[60px] md:w-[55px] md:h-[55px] lg:w-[70px] lg:h-[70px] xl:w-[85px] xl:h-[85px] bg-cover bg-center cursor-pointer transition-all shrink-0 snap-center rounded-sm ${
                          mainImage === img ? "ring-2 ring-choco-light opacity-100" : "opacity-60 hover:opacity-100"
                        }`}
                        style={{ backgroundImage: `url(${img})` }}
                        onClick={() => {
                          setMainImage(img);
                          if (carouselApi) {
                            carouselApi.scrollTo(idx);
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Info */}
            <div className="w-full md:w-1/2 flex flex-col gap-6 md:gap-6">
              {/* Title & Status */}
              <div className="hidden md:flex flex-col gap-4">
                <h3 className="text-[30px] leading-[36px] lg:text-[48px] lg:leading-[58px]font-normal lg:font-bold font-cormorant text-choco-light">
                  {name || "Загрузка..."}
                </h3>
                <span className={`text-[18px] font-semibold font-montserrat ${getStockStatus(qty || 0).colorClass}`}>
                  {getStockStatus(qty || 0).text}
                </span>
              </div>

              {/* Summary */}
              {summary && (
                <ul className="list-disc list-inside space-y-1 text-[16px] lg:text-[18px] leading-[22px] font-light md:font-semibold font-montserrat text-choco-light">
                  {summary.split("\n").map((point, idx) => (
                    <li key={idx} className="marker:text-choco-light">
                      {point.trim()}
                    </li>
                  ))}
                </ul>
              )}

              {/* Mobile Status and Price */}
              <div className="md:hidden flex flex-col items-center gap-4 py-2 border-y border-creamy w-full">
                <span className={`text-[18px] leading-[22px] font-semibold font-montserrat ${getStockStatus(qty || 0).colorClass}`}>
                  {getStockStatus(qty || 0).text}
                </span>
                {renderPriceSection("text-[24px] leading-[29px]", "items-center")}
                <button className="w-[270px] bg-choco-light text-creamy py-4 rounded-lg uppercase font-semibold text-[18px] leading-[22px] font-montserrat">
                  Додати в кошик
                </button>
              </div>

              {/* Specifications */}
              <div className="flex flex-col gap-[10px]">
                <h3 className="text-[16px] lg:text-[18px] leading-[20px] lg:leading-[22px] font-light lg:font-semibold font-montserrat text-choco-light">
                  Характеристики
                </h3>
                <div className="flex flex-col gap-[10px]">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-[10px]">
                      <WeightIcon />
                      <span className="text-[14px] lg:text-[18px] leading-[17px] lg:leading-[22px] font-light font-montserrat text-choco-light">
                        Вага:
                      </span>
                    </div>
                    <span className="text-[12px] md:text-[18px] leading-[15px] md:leading-[22px] font-medium font-montserrat text-choco-light">
                      {weight ? `${weight} г` : "Не вказано"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-[10px]">
                      <ClockIcon />
                      <span className="text-[14px] lg:text-[18px] leading-[17px] lg:leading-[22px] font-light font-montserrat text-choco-light">
                        Термін зберігання:
                      </span>
                    </div>
                    <span className="text-[12px] md:text-[18px] leading-[15px] md:leading-[22px] font-medium font-montserrat text-choco-light">
                      {shelfLife || "Не вказано"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-[10px]">
                      <TemperatureIcon />
                      <span className="text-[14px] lg:text-[18px] leading-[17px] lg:leading-[22px] font-light font-montserrat text-choco-light">
                        Умови зберігання:
                      </span>
                    </div>
                    <span className="text-[12px] md:text-[18px] leading-[15px] md:leading-[22px] font-medium font-montserrat text-choco-light">
                      {storageConditions || "Не вказано"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-[20px]">
                {description && (
                  <p className="text-[14px] lg:text-[18px] leading-[17px] lg:leading-[22px] font-medium md:font-normal font-montserrat text-choco-light">
                    <span className="font-semibold">Опис:</span> {description}
                  </p>
                )}
                {ingredients && (
                  <p className="text-[14px] lg:text-[18px] leading-[17px] lg:leading-[22px] font-medium md:font-normal font-montserrat text-choco-light">
                    <span className="font-semibold">Склад:</span> {ingredients}
                  </p>
                )}
              </div>

              {/* Footer Price & Button - Responsive Layout */}
              <div className="hidden md:flex flex-col lg:flex-row items-center lg:justify-between gap-6 lg:gap-8 mt-1 pt-1">
                {renderPriceSection("text-[32px]", "items-center lg:items-start")}
                <button className="w-full lg:flex-1 max-w-[300px] bg-choco-light text-creamy py-5 rounded-lg uppercase font-medium text-[18px] hover:bg-choco-light-50 transition-colors">
                  Додати в кошик
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage