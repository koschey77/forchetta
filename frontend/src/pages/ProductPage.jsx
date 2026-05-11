import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { productsAPI, reviewsAPI } from "../services/api"
import { ImagePlaceholderIcon, WeightIcon, ClockIcon, TemperatureIcon, StarIcon } from "../components/icons"
import { Carousel, CarouselContent, CarouselItem, CarouselDots } from "../components/ui/carousel"
import ProductPageSkeleton from "../components/catalog/ProductPageSkeleton"
import NoConnection from "../components/errors/NoConnection"
import Error404 from "../components/errors/Error404"
import FavoriteButton from "../components/common/FavoriteButton"
import { useAddToCartAction } from "../hooks/useAddToCartAction"
import { useViewedStore } from "../stores/useViewedStore"
import ProductSectionSlider from "../components/ui/carousel/ProductSectionSlider"

const ProductPage = () => {
  const { id } = useParams()

  const { addId } = useViewedStore()

  // Добавляем товар в просмотренные
  useEffect(() => {
    if (id) {
      addId(id)
    }
  }, [id, addId])

  // TanStack Query для получения товара по ID
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsAPI.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 минут
  })

  // TanStack Query для получения рекомендуемых товаров (Спеціальні пропозиції)
  const { data: recommendedData } = useQuery({
    queryKey: ['recommendedProducts'],
    queryFn: () => productsAPI.getRecommendations(),
    staleTime: 5 * 60 * 1000,
  });


  const [reviewsLimit, setReviewsLimit] = useState(10);

  // TanStack Query для получения отзывов
  const { data: reviewsData } = useQuery({
    queryKey: ['productReviews', id, reviewsLimit],
    queryFn: () => reviewsAPI.getProductReviews(id, { page: 1, limit: reviewsLimit }),
    enabled: !!id,
  });

  // Деструктуризация product с дефолтними значениями
  const {
    images = [], name = "", isFeatured = false, qty = 0, summary = "", weight = 0,
    shelfLife = "", storageConditions = "", description = "", ingredients = "",
    price = 0,  discountPrice = null, averageRating = 0, reviewsCount = 0 } = product || {}

  // Получаем изображения из товара
  const imageUrls = images?.length > 0 ? images.map(img => img.url) : []

  const [mainImage, setMainImage] = useState(imageUrls[0] || null)
  const [carouselApi, setCarouselApi] = useState(null)
  
  const { handleAddToCart, isAdding } = useAddToCartAction(product)

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

  // Форматирование цени
  const formatPrice = (price) => {
    return `${price} грн`
  }

  // Функция для рендера звездочек рейтинга
  const renderRatingStars = (rating) => {
    return (
      <div className="flex items-center gap-[2px]">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon 
            key={star} 
            className="w-5 h-5 pointer-events-none" 
            fill={star <= rating ? "#DFB300" : "none"} 
            stroke="#DFB300" 
          />
        ))}
      </div>
    );
  };

  // Функция для отображения цени
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

    // Если бекенд ответил 404 или 400 (недопустимий ID) — показиваем страницу 404
    if (status === 404 || status === 400) {
      return (
        <div className="min-h-[70vh] flex items-center justify-center">
          <Error404 />
        </div>
      )
    }

    // Во всех остальних случаях (сервер виключен, нет сети, 500 ошибка)
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
          <div className="w-full md:hidden mb-6 flex flex-col gap-2">
            <h1 className="text-[30px] leading-[36px] font-normal font-cormorant text-choco-light">{name || "Загрузка..."}</h1>
            {reviewsCount > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[16px] font-bold font-montserrat text-choco-light">{averageRating}</span>
                  {renderRatingStars(averageRating)}
                </div>
                <span className="text-[14px] font-montserrat text-choco-light opacity-80 cursor-pointer hover:underline" onClick={() => document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' })}>
                  {reviewsCount} {reviewsCount === 1 ? 'відгук' : (reviewsCount >= 2 && reviewsCount <= 4) ? 'відгуки' : 'відгуків'}
                </span>
              </div>
            )}
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
                          
                            {/* Favorite Button */}
                            <FavoriteButton 
                              productId={product.id || product._id}
                              className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center transition-colors hover:scale-110 z-10"
                            />
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
                
                {/* Индикатори (точки) поверх картинки */}
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
                <h3 className="text-[30px] leading-[36px] lg:text-[48px] lg:leading-[58px] font-normal lg:font-bold font-cormorant text-choco-light">
                  {name || "Загрузка..."}
                </h3>
                {reviewsCount > 0 && (
                  <div className="flex items-center gap-3 mt-[-5px]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[18px] font-bold font-montserrat text-choco-light">{averageRating}</span>
                      {renderRatingStars(averageRating)}
                    </div>
                    <span className="text-[16px] font-montserrat text-choco-light opacity-80 cursor-pointer hover:underline" onClick={() => document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' })}>
                      {reviewsCount} {reviewsCount === 1 ? 'відгук' : (reviewsCount >= 2 && reviewsCount <= 4) ? 'відгуки' : 'відгуків'}
                    </span>
                  </div>
                )}
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
                  <button 
                    onClick={(e) => handleAddToCart(e, 1)}
                    disabled={isAdding}
                    className={`w-[270px] bg-choco-light text-creamy py-4 rounded-lg uppercase font-semibold text-[18px] leading-[22px] font-montserrat transition-all ${
                      isAdding ? 'opacity-50 cursor-not-allowed' : 'hover:bg-choco-light-50 active:scale-[0.98]'
                    }`}
                  >
                    {isAdding ? "Додається..." : "Додати в кошик"}
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
                <button 
                  onClick={(e) => handleAddToCart(e, 1)}
                  disabled={isAdding}
                  className={`w-full lg:flex-1 max-w-[300px] bg-choco-light text-creamy py-5 rounded-lg uppercase font-medium text-[18px] transition-all hover:bg-choco-light-50 ${
                    isAdding ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.98]'
                  }`}
                >
                  {isAdding ? "Додається..." : "Додати в кошик"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Відгуки */}
        {reviewsData && reviewsData.reviews && reviewsData.reviews.length > 0 && (
          <div id="reviews-section" className="w-full max-w-[1440px] mx-auto px-[15px] sm:px-[30px] lg:px-[60px] mt-[20px] md:mt-[40px] pt-[30px] border-t border-creamy flex flex-col gap-6">
            <h3 className="text-[24px] lg:text-[32px] md:leading-[36px] font-normal lg:font-bold font-cormorant text-choco-light">
              Відгуки покупців
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
              {reviewsData.reviews.map((review) => (
                <div key={review._id} className="flex flex-col gap-3 border-b border-creamy pb-5 md:border-none md:pb-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-choco-light/10 flex items-center justify-center text-choco-light font-bold overflow-hidden shrink-0">
                        {review.user?.avatar ? (
                          <img src={review.user.avatar} alt={review.user.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="uppercase">{review.user?.name?.charAt(0) || 'К'}</span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-[16px] text-choco-light">
                          {review.user?.name || "Користувач"}
                        </span>
                        <span className="text-[12px] opacity-70 text-choco-light">
                          {new Date(review.createdAt).toLocaleDateString('uk-UA')}
                        </span>
                      </div>
                    </div>
                    {renderRatingStars(review.rating)}
                  </div>
                  <p className="text-[14px] leading-[20px] font-montserrat text-choco-light opacity-90 mt-1 line-clamp-4">
                    {review.text}
                  </p>
                  {review.adminReply && (
                    <div className="mt-2 pl-3 border-l-2 border-wine-red text-[13px] font-montserrat text-choco-light flex flex-col gap-1">
                      <span className="font-semibold">Відповідь Forchetta:</span>
                      <p className="opacity-90">{review.adminReply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Кнопка Показати ще */}
            {reviewsData.reviews.length < reviewsData.totalReviews && (
              <div className="flex justify-center mt-4">
                <button 
                  onClick={() => setReviewsLimit(prev => prev + 10)}
                  className="px-6 py-2 border border-choco-light text-choco-light hover:bg-choco-light hover:text-creamy font-montserrat font-medium rounded-full transition-colors"
                >
                  Показати ще
                </button>
              </div>
            )}
          </div>
        )}

        {/* Рекомендовані товари (Спеціальні пропозиції) */}
        {recommendedData && recommendedData.length > 0 && (
          <div className="mt-[20px] md:mt-[40px] mb-[40px] md:mb-[80px]">
            <ProductSectionSlider 
              title="Спеціальні пропозиції"
              products={recommendedData}
              linkUrl="/catalog?sortOption=salesCount-desc"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductPage