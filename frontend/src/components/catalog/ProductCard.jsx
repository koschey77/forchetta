import { useState } from 'react';
import { HeartSolidIcon, HeartIcon, CartSolidIcon } from '../icons';

const ProductCard = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const tagStyles = {
    'dark': 'bg-button-secondary text-creamy',
    'light': 'bg-button-primary text-choco-dark',
    'red': 'bg-button-accent text-creamy',
  };

  const handleAddToCart = () => {
    // TODO: Добавить логику добавления в корзину
    console.log('Добавлен в корзину:', product.title);
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Добавить логику работы с избранным
  };

  return (
    <div className="flex flex-col group cursor-pointer h-full pb-6 bg-creamy overflow-hidden transition-shadow duration-300">
      <div className="relative w-full h-[185px] mb-4 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
        />
        {product.tag && (
          <div className={`absolute top-4 left-4 px-3.5 py-1.5 text-[11px] uppercase tracking-wide font-medium rounded-full ${tagStyles[product.tag.type]}`}>
            {product.tag.text}
          </div>
        )}
        <button 
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-black/10 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            handleToggleFavorite();
          }}
        >
          {isFavorite ? (
            <HeartSolidIcon 
              width={30} 
              height={30}
              className="text-creamy transition-all"
            />
          ) : (
            <HeartIcon 
              className="w-[30px] h-[30px] transition-all text-creamy hover:text-creamy/70"
              strokeWidth={1}
            />
          )}
        </button>
      </div>
      
      <div className="flex flex-col flex-grow px-4">
        <div className="flex justify-between">
          <div className="flex flex-col gap-0.5 flex-grow pr-2">
            <h3 className="text-[17px] font-semibold mb-2.5 leading-snug text-text-primary">
              {product.title}
            </h3>
            <div className="flex flex-col gap-0.5">
              {product.oldPrice && (
                <span className="text-[13px] line-through decoration-text-secondary opacity-60 font-medium text-text-secondary">
                  {product.oldPrice}
                </span>
              )}
              <span className="h-[17px] font-montserrat font-medium text-[14px] leading-[17px] text-left text-choco-light flex-none order-1 grow-0 whitespace-nowrap overflow-hidden">
                {product.price}
              </span>
            </div>
          </div>
          
          <button
            className="pb-0.5 hover:scale-110 transition-transform flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
          >
            <CartSolidIcon 
              width={30} 
              height={30}
              className="text-choco-light hover:text-choco-dark transition-colors cursor-pointer"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;