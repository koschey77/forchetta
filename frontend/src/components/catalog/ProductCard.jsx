import { useNavigate } from 'react-router-dom';
import { CartSolidIcon } from '../icons';
import FavoriteButton from '../common/FavoriteButton';
import { useAddToCartAction } from '../../hooks/useAddToCartAction';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  // Визначаємо, чи переданий "сирий" об'єкт Mongoose, чи вже адаптований
  const isRaw = typeof product.price === 'number';
  
  // Якщо raw - формуємо власні значення для UI, якщо ні - беремо ті, що передали
  const displayPrice = isRaw ? `${product.discountPrice || product.price} грн / ${product.weight} г` : product.price;
  const displayOldPrice = isRaw ? (product.discountPrice ? `${product.price} грн` : null) : product.oldPrice;
  const displayTitle = isRaw ? product.name : (product.title || product.name);
  
  let computedTag = null;
  if(isRaw && !product.tag && product.discountPrice) {
    const discount = Math.round((1 - product.discountPrice / product.price) * 100);
    computedTag = { text: `-${discount}%`, type: "red" };
  } else {
    computedTag = product.tag;
  }
  
  const { handleAddToCart, isAdding } = useAddToCartAction(product);

  const handleProductClick = () => {
    navigate(`/product/${product._id || product.id}`);
  };

  // Логіка статусу (пріоритет: Ексклюзив -> Новинка -> Топ продажів)
  const isExclusive = product.isFeatured === true;
  const isNew = product.isNewProduct === true;
  const isTopSeller = product.isTopSeller === true;
  
  let statusBadge = null;
  if (isExclusive) {
    statusBadge = { text: "Ексклюзив", bgClass: "bg-[#FDCE13]/90 text-choco-dark w-[90px]" };
  } else if (isNew) {
    statusBadge = { text: "Новинка", bgClass: "bg-choco-light/90 text-creamy px-3 w-auto min-w-[70px]" };
  } else if (isTopSeller) {
    statusBadge = { text: "Топ продажів", bgClass: "bg-dark-creamy/90 text-choco-dark px-3 w-auto min-w-[100px]" };
  } else if (computedTag && computedTag.type !== "red") {
    // Зворотна сумісність
    statusBadge = { 
      text: computedTag.text, 
      bgClass: computedTag.type === 'dark' ? "bg-choco-dark/90 text-creamy px-3 w-auto min-w-[90px]" : "bg-dark-creamy/90 text-choco-dark px-3 w-auto min-w-[100px]" 
    };
  }

  // Логіка знижки
  let discountBadge = null;
  if (computedTag && computedTag.type === "red") {
    discountBadge = { text: computedTag.text, bgClass: "bg-wine-red/90 text-creamy w-[60px]" };
  }

  const baseBadgeStyles = "flex items-center justify-center h-[30px] rounded-[13.5px] font-montserrat font-medium text-[12px] leading-[15px] z-10 text-center";

  return (
    <div 
      className="flex flex-col group cursor-pointer h-full pb-6 bg-creamy overflow-hidden transition-shadow duration-300"
      onClick={handleProductClick}
    >
      <div className="relative w-full h-[185px] mb-4 overflow-hidden">
        <img
          src={product?.images?.[0]?.url || product?.images?.[0] || product?.image}
          alt={product?.name || product?.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        
        {/* Контейнер для бейджів */}
        <div className="absolute top-2 left-2 flex flex-col gap-2 z-10 items-start">
          {statusBadge && (
            <div className={`${baseBadgeStyles} ${statusBadge.bgClass}`}>
              {statusBadge.text}
            </div>
          )}
          {discountBadge && (
            <div className={`${baseBadgeStyles} ${discountBadge.bgClass}`}>
              {discountBadge.text}
            </div>
          )}
        </div>
        
        <FavoriteButton 
          productId={product._id || product.id}
          className="absolute top-1 right-1 p-1 rounded-full hover:bg-black/10 transition-colors"
        />
      </div>

      <div className="flex flex-col flex-grow px-4">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-0.5 flex-grow pr-2">
            <h3 className="line-clamp-4 text-[12px] font-figma-light leading-[12px] text-choco-light sm:text-[17px] sm:font-semibold sm:leading-snug sm:text-text-primary mb-2.5 w-[114px] sm:w-auto h-auto min-h-[48px] sm:min-h-0">
              {displayTitle}
            </h3>
            <div className="flex flex-col gap-0.5">
              {displayOldPrice && (
                <span className="w-[114px] h-[15px] font-montserrat font-figma-light text-figma-xs text-choco-light line-through opacity-60 sm:text-[13px] sm:font-medium sm:text-text-secondary sm:w-auto sm:h-auto">
                  {displayOldPrice} 
                </span>
              )}
              <span className="w-[114px] h-[15px] font-montserrat font-figma-light text-figma-xs text-choco-light flex-none order-1 grow-0 whitespace-nowrap overflow-hidden sm:font-medium sm:text-[14px] sm:leading-[17px] sm:w-auto sm:h-auto">
                {displayPrice} 
              </span>
            </div>
          </div>

          <button
            className={`mt-2 transition-transform flex-shrink-0 z-10 ${isAdding ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
            onClick={(e) => handleAddToCart(e, 1)}
            disabled={isAdding}
          >
            <CartSolidIcon className="w-5 h-5 sm:w-[30px] sm:h-[30px] text-choco-light hover:text-choco-dark transition-colors cursor-pointer" />
          </button>
        </div>
      </div>
    </div>
  )
};

export default ProductCard;