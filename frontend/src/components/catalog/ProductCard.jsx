import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartSolidIcon, HeartIcon, CartSolidIcon } from '../icons';

const ProductCard = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  const tagStyles = {
    'dark': 'absolute top-2 left-2 w-[90px] h-[30px] bg-choco-dark border border-choco-light text-creamy flex items-center justify-center rounded-[13.5px] font-montserrat font-medium text-[12px] leading-[15px]',
    'light': 'absolute top-2 left-2 w-[100px] h-[30px] bg-dark-creamy text-choco-dark flex items-center justify-center rounded-[13.5px] font-montserrat font-medium text-[12px] leading-[15px]',
    'red': 'absolute top-2 left-2 w-[60px] h-[30px] bg-wine-red text-creamy flex items-center justify-center rounded-[13.5px] font-montserrat font-medium text-[12px] leading-[15px]',
  };

  const handleAddToCart = () => {
    // TODO: Добавить логику добавления в корзину
    console.log('Добавлен в корзину:', product.title);
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Добавить логику работы с избранным
  };

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div 
      className="flex flex-col group cursor-pointer h-full pb-6 bg-creamy overflow-hidden transition-shadow duration-300"
      onClick={handleProductClick}
    >
      <div className="relative w-full h-[185px] mb-4 overflow-hidden">
        <img
          src={product?.image}
          alt={product?.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {product.tag && <div className={tagStyles[product.tag.type]}>{product.tag.text}</div>}
        <button
          className="absolute top-1 right-1 p-1 rounded-full hover:bg-black/10 transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            handleToggleFavorite()
          }}
        >
          {isFavorite ? (
            <HeartSolidIcon width={30} height={30} className="text-creamy transition-all" />
          ) : (
            <HeartIcon className="w-[30px] h-[30px] transition-all text-creamy hover:text-creamy/70" strokeWidth={1} />
          )}
        </button>
      </div>

      <div className="flex flex-col flex-grow px-4">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-0.5 flex-grow pr-2">
            <h3 className="text-[12px] font-figma-light leading-[12px] text-choco-light sm:text-[17px] sm:font-semibold sm:leading-snug sm:text-text-primary mb-2.5 w-[114px] sm:w-auto h-6 sm:h-auto">
              {product.title}
            </h3>
            <div className="flex flex-col gap-0.5">
              {product.oldPrice && (
                <span className="w-[114px] h-[15px] font-montserrat font-figma-light text-figma-xs text-choco-light line-through opacity-60 sm:text-[13px] sm:font-medium sm:text-text-secondary sm:w-auto sm:h-auto">
                  {product.oldPrice}
                </span>
              )}
              <span className="w-[114px] h-[15px] font-montserrat font-figma-light text-figma-xs text-choco-light flex-none order-1 grow-0 whitespace-nowrap overflow-hidden sm:font-medium sm:text-[14px] sm:leading-[17px] sm:w-auto sm:h-auto">
                {product.price}
              </span>
            </div>
          </div>

          <button
            className="mt-2 hover:scale-110 transition-transform flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation()
              handleAddToCart()
            }}
          >
            <CartSolidIcon className="w-5 h-5 sm:w-[30px] sm:h-[30px] text-choco-light hover:text-choco-dark transition-colors cursor-pointer" />
          </button>
        </div>
      </div>
    </div>
  )
};

export default ProductCard;