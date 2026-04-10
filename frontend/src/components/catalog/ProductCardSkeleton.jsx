const ProductCardSkeleton = () => (
  <div className="flex flex-col group h-full pb-6 bg-creamy overflow-hidden">
    {/* Скелетон для изображения */}
    <div className="w-full h-[185px] mb-4 bg-[#E3D6BF]/40 animate-pulse rounded-sm"></div>
    
    <div className="flex flex-col flex-grow px-4">
      <div className="flex justify-between items-start gap-2">
        {/* Скелетон для текста */}
        <div className="flex flex-col gap-2.5 flex-grow pt-1">
          <div className="h-3 sm:h-4 bg-[#E3D6BF]/50 animate-pulse rounded w-full"></div>
          <div className="h-3 sm:h-4 bg-[#E3D6BF]/50 animate-pulse rounded w-2/3"></div>
          <div className="h-3 sm:h-4 bg-[#E3D6BF]/50 animate-pulse rounded w-1/3 mt-1"></div>
        </div>
        
        {/* Скелетон для кнопки корзины */}
        <div className="w-5 h-5 sm:w-[30px] sm:h-[30px] bg-[#E3D6BF]/60 animate-pulse rounded-full flex-shrink-0 mt-1"></div>
      </div>
    </div>
  </div>
);

export default ProductCardSkeleton;