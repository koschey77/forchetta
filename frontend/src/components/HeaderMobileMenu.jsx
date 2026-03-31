import { DotsIcon, HeartIcon, CartIcon, MenuIcon, HomeIcon } from "./icons/index.jsx"
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

const NAV_ITEMS = ["Новинки", "Набори", "Акції", "Журнал"]

const HeaderMobileMenu = ({ 
  onCatalogClick, 
  onFavoritesClick, 
  onCartClick,
  onHomeClick
}) => {
  return (
    <>
      {/* Нижнее мобильное меню - показывается только на <640px */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 h-[107px] bg-creamy px-[15px] pb-[40px] pt-[12px] shadow-[0_-2px_10px_rgba(0,0,0,0.05)] border-t border-choco-light/10">
        <div className="flex items-center justify-between">
          
          {/* Домой */}
          <button
            aria-label="Главная"
            onClick={onHomeClick}
            className="flex w-[48px] flex-col items-center gap-[2px] transition duration-300 hover:opacity-80"
          >
            <HomeIcon className="shrink-0 w-[30px] h-[30px]" />
            <span className="text-center text-[10px] font-light leading-[12px] text-choco-light">Головна</span>
          </button>

          {/* Избранное */}
          <button
            aria-label="Избранное"
            onClick={onFavoritesClick}
            className="flex w-[41px] flex-col items-center gap-[1px] transition duration-300 hover:opacity-80"
          >
            <HeartIcon className="shrink-0 text-choco-light" />
            <span className="text-center text-[10px] font-light leading-[12px] text-choco-light">Обране</span>
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

          {/* Корзина */}
          <button
            aria-label="Корзина"
            onClick={onCartClick}
            className="flex w-[36px] flex-col items-center gap-[3px] transition duration-300 hover:opacity-80"
          >
            <CartIcon className="shrink-0 text-choco-light" strokeWidth={3} />
            <span className="text-center text-[10px] font-light leading-[12px] text-choco-light">Кошик</span>
          </button>

          {/* Меню (больше) с Radix UI */}
          <div className="sm:hidden">
            <DropdownMenu.Root modal={false}>
              <DropdownMenu.Trigger asChild>
                <button className="flex w-[37px] flex-col items-center gap-[3px] transition duration-300 hover:opacity-80">
                  <div className="flex h-[30px] items-center justify-center">
                    <MenuIcon className="shrink-0 w-[37px] h-[30px]" />
                  </div>
                  <span className="text-center text-[10px] font-light leading-[12px] text-choco-light">Більше</span>
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="bg-creamy border border-choco-light/10 rounded-xl py-4 px-4 min-w-[200px] z-50 mb-2"
                  sideOffset={8}
                  align="center"
                  side="top"
                >
                  {NAV_ITEMS.map((item) => (
                    <DropdownMenu.Item
                      key={item}
                      className="rounded-xl px-3 py-2 text-left font-normal text-[16px] leading-[20px] text-choco-light transition duration-300 hover:bg-dark-creamy/70 cursor-pointer outline-none"
                      onSelect={() => console.log(item)}
                    >
                      {item}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
          
        </div>
      </nav>
    </>
  )
}

export default HeaderMobileMenu