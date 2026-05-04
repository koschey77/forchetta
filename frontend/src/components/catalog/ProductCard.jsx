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

  const tagStyles = {
    'dark': 'absolute top-2 left-2 w-[90px] h-[30px] bg-choco-dark border border-choco-light text-creamy flex items-center justify-center rounded-[13.5px] font-montserrat font-medium text-[12px] leading-[15px]',
    'light': 'absolute top-2 left-2 w-[100px] h-[30px] bg-dark-creamy text-choco-dark flex items-center justify-center rounded-[13.5px] font-montserrat font-medium text-[12px] leading-[15px]',
    'red': 'absolute top-2 left-2 w-[60px] h-[30px] bg-wine-red text-creamy flex items-center justify-center rounded-[13.5px] font-montserrat font-medium text-[12px] leading-[15px]',
  };


  const handleProductClick = () => {
    navigate(`/product/${product._id || product.id}`);
  };

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
        
        {/* Бейдж "Топ продажів" з прив'язкою до isFeatured */}
        {product.isFeatured && (
          <div className="absolute top-2 left-2 z-10 px-3 h-[30px] bg-dark-creamy text-choco-dark flex items-center justify-center rounded-[13.5px] font-montserrat font-medium text-[12px] leading-[15px]">
            Топ продажів
          </div>
        )}

        {/* Запасні/старі теги для сумісності */}
        {!product.isFeatured && computedTag && (
          <div className={`${tagStyles[computedTag.type]} z-10`}>{computedTag.text}</div>
        )}
        
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