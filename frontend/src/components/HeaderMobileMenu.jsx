import { DotsIcon, HeartIcon, CartIcon, MenuIcon, HomeIcon } from "./icons/index.jsx"

const HeaderMobileMenu = ({ 
  onCatalogClick, 
  onFavoritesClick, 
  onCartClick,
  onHomeClick,
  favoritesCount = 0,
  cartItemsCount = 0,
  onMoreClick
}) => {
  return (
    <>
      {/* Нижнє мобільне меню - показується тільки на <640px */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 h-[77px] bg-creamy px-[15px] py-[18px] shadow-[0_-2px_10px_rgba(0,0,0,0.05)] border-t border-choco-light/10">
        <div className="flex items-center justify-between">
          
          {/* Головна */}
          <button
            aria-label="Головна"
            onClick={onHomeClick}
            className="flex w-[48px] flex-col items-center gap-[2px] transition duration-300 hover:opacity-80"
          >
            <HomeIcon className="shrink-0 w-[30px] h-[30px]" />
            <span className="text-center text-[10px] font-light leading-[12px] text-choco-light">Головна</span>
          </button>

          {/* Обране */}
          <button
            aria-label="Обране"
            onClick={onFavoritesClick}
            className="flex w-[41px] flex-col items-center gap-[1px] transition duration-300 hover:opacity-80 relative"
          >
            <div className="relative">
              <HeartIcon className="shrink-0 text-choco-light" />
              {favoritesCount > 0 && (
                <div className="absolute flex justify-center items-center w-[20px] h-[20px] -right-[10px] -top-[3px] bg-choco-light rounded-[10px]">
                  <span className="font-montserrat font-bold text-[10px] leading-[12px] text-center text-dark-creamy">
                    {favoritesCount > 99 ? '99+' : favoritesCount}
                  </span>
                </div>
              )}
            </div>
            <span className="text-center text-[10px] font-light leading-[12px] text-choco-light mt-[2px]">Обране</span>
          </button>

          {/* Каталог */}
          <button
            aria-label="Каталог"
            onClick={onCatalogClick}
            className="group flex h-[41px] w-[120px] items-center gap-[6px] rounded-[22.5px] bg-dark-creamy px-[17px] py-[11px] pl-[22px] text-[12px] font-medium leading-[15px] text-choco-light transition duration-300 hover:scale-[1.02] hover:bg-choco-light hover:text-creamy"
          >
            <DotsIcon className="shrink-0 group-hover:fill-creamy group-hover:stroke-creamy" />
            <span>Каталог</span>
          </button>

          {/* Кошик */}
          <button
            aria-label="Кошик"
            onClick={onCartClick}
            className="flex w-[36px] flex-col items-center gap-[3px] transition duration-300 hover:opacity-80 relative"
          >
            <div className="relative">
              <CartIcon className="shrink-0 text-choco-light" strokeWidth={3} />
              {cartItemsCount > 0 && (
                <div className="absolute flex justify-center items-center w-[20px] h-[20px] -right-[10px] -top-[3px] bg-choco-light rounded-[10px] z-10">
                  <span className="font-montserrat font-bold text-[10px] leading-[12px] text-center text-dark-creamy">
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                  </span>
                </div>
              )}
            </div>
            <span className="text-center text-[10px] font-light leading-[12px] text-choco-light mt-[1px]">Кошик</span>
          </button>

          {/* Меню (більше) */}
          <div className="sm:hidden">
            <button 
              onClick={onMoreClick}
              className="flex w-[37px] flex-col items-center gap-[3px] transition duration-300 hover:opacity-80"
            >
              <div className="flex h-[30px] items-center justify-center">
                <MenuIcon className="shrink-0 w-[37px] h-[30px]" />
              </div>
              <span className="text-center text-[10px] font-light leading-[12px] text-choco-light">Більше</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  )
}

export default HeaderMobileMenu