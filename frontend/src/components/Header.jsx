import { useNavigate } from "react-router-dom"
import { useUserStore } from "../stores/useUserStore"
import { Logo } from "./Logos/Logo.jsx"
import { SearchIcon, ProfileIcon, HeartIcon, CartIcon, DotsIcon, MenuIcon } from "./icons/index.jsx"
import HeaderMobileMenu from "./HeaderMobileMenu.jsx"
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

const NAV_ITEMS = ["Новинки", "Набори", "Акції", "Журнал"]

// Переиспользуемые компоненты
const UserAvatar = ({ userAvatar, onClick, className = "", strokeWidth = 3 }) => (
  <button
    aria-label="Профиль"
    onClick={onClick}
    className={`rounded-full transition duration-300 ${
      userAvatar ? "p-0 hover:ring-2 hover:ring-choco-light/30" : "p-1 hover:bg-dark-creamy/60"
    } ${className}`}
  >
    {userAvatar ? (
      <img src={userAvatar} alt="Аватар пользователя" className="min-w-[30px] h-[30px] rounded-full object-cover" />
    ) : (
      <ProfileIcon className="shrink-0 text-choco-light" strokeWidth={strokeWidth} />
    )}
  </button>
)

const IconButton = ({ icon: Icon, label, onClick, className = "", strokeWidth = 2, ...props }) => (
  <button 
    aria-label={label}
    onClick={onClick}
    className={`rounded-full p-1 transition duration-300 hover:bg-dark-creamy/60 ${className}`}
    {...props}
  >
    <Icon className="shrink-0 text-choco-light" strokeWidth={strokeWidth} />
  </button>
)

const CatalogButton = ({ onClick, className = "" }) => (
  <button
    aria-label="Открыть каталог"
    onClick={onClick}
    className={`group flex h-[41px] w-[130px] items-center gap-[6px] rounded-[31px] bg-button-primary px-[17px] py-[10px] text-[16px] leading-[20px] text-choco-light transition duration-300 hover:scale-[1.02] hover:bg-choco-light hover:text-creamy ${className}`}
  >
    <DotsIcon className="shrink-0 group-hover:fill-creamy group-hover:stroke-creamy" />
    <span className="font-normal">Каталог</span>
  </button>
)

const MenuDropdown = () => (
  <div className="hidden sm:block">
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <button className="h-[40px] w-[45px] flex items-center justify-center rounded-xl transition duration-300 hover:bg-dark-creamy/60">
          <MenuIcon className="shrink-0" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="bg-creamy shadow-lg border border-choco-light/20 rounded-xl py-2 px-2 min-w-[200px] z-50"
          sideOffset={5}
          align="end"
        >
          {NAV_ITEMS.map((item) => (
            <DropdownMenu.Item
              key={item}
              className="rounded-xl px-4 py-3 text-left font-normal text-[16px] leading-[20px] text-choco-light transition duration-300 hover:bg-dark-creamy/50 hover:text-choco-dark cursor-pointer outline-none"
              onSelect={() => console.log(item)}
            >
              {item}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  </div>
)

const Header = () => {
  const navigate = useNavigate()
  const { user } = useUserStore()

  const handleFavoritesClick = () => console.log("favorites")
  const handleCartClick = () => navigate('/cart')
  const handleCatalogClick = () => navigate('/catalog')
  const handleLogoClick = () => navigate('/')
  
  const handleProfileClick = () => {
    if (user) {
      navigate('/profile')
    } else {
      navigate('/login')
    }
  }

  return (
    <>
      {/* Единый адаптивный хедер */}
      <header className="h-[87px] sm:h-[87px] w-full bg-creamy font-[Montserrat]">
        <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-[16px] sm:px-[60px]">
          
          {/* Логотип - всегда показывается */}
          <button
            aria-label="Перейти на главную"
            onClick={handleLogoClick}
            className="h-[53.75px] sm:h-[67px] w-[100px] sm:w-[125px] shrink-0 transition-transform duration-300 hover:scale-[1.02]"
          >
            {/* Desktop: SVG Logo, остальные: img */}
            <div className="hidden xl:block">
              <Logo />
            </div>
            <img 
              src="/forchetta-logo.png" 
              alt="Forchetta Logo" 
              className="xl:hidden w-full h-full object-contain"
            />
          </button>

          {/* Центральная навигация - показывается по breakpoints */}
          <nav className="flex-1 flex justify-center">
            
            {/* Навигационные ссылки - только Desktop xl: >=1280px */}
            <div className="hidden xl:flex h-[43px] items-center gap-[30px]">
              <IconButton 
                icon={SearchIcon} 
                label="Открыть поиск" 
                onClick={() => console.log('search')}
              />
              
              <CatalogButton onClick={handleCatalogClick} />
              
              {NAV_ITEMS.map((item) => (
                <button
                  key={item}
                  aria-label={item}
                  onClick={() => console.log(item)}
                  className="whitespace-nowrap font-normal text-[16px] leading-[20px] text-choco-light transition duration-300 hover:text-choco-light-50"
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Tablet: md-xl (768px-1279px) - поиск + каталог, без навигации */}
            <div className="hidden md:flex xl:hidden h-[43px] items-center gap-[30px]">
              <IconButton 
                icon={SearchIcon} 
                label="Открыть поиск" 
                onClick={() => console.log('search')}
              />
              <CatalogButton onClick={handleCatalogClick} />
            </div>

            {/* Small screens: sm-md (640px-767px) - поиск + каталог */}
            <div className="hidden sm:flex md:hidden h-[43px] items-center gap-[30px]">
              <IconButton 
                icon={SearchIcon} 
                label="Открыть поиск" 
                onClick={() => console.log('search')}
              />
              <CatalogButton onClick={handleCatalogClick} />
            </div>
          </nav>

          {/* Мобильная правая секция (<640px) - поиск + профиль */}
          <div className="sm:hidden flex items-center gap-[20px] px-[8px] py-[5px]">
            <IconButton 
              icon={SearchIcon} 
              label="Открыть поиск" 
              onClick={() => console.log('search')}
              strokeWidth={2}
            />
            <UserAvatar userAvatar={user?.avatar} onClick={handleProfileClick} strokeWidth={2} />
          </div>

          {/* Правая секция действий - показывается на sm+ */}
          <div className="hidden sm:flex items-center gap-[30px] px-[8px] py-[5px]">
            
            {/* Профиль - показывается на sm+ */}
            <div className="relative flex items-center">
              <UserAvatar userAvatar={user?.avatar} onClick={handleProfileClick} strokeWidth={2} />
            </div>
            
            {/* Избранное - показывается на sm+ (>=640px) */}
            <IconButton 
              icon={HeartIcon} 
              label="Избранное" 
              onClick={handleFavoritesClick}
              strokeWidth={2}
            />
            
            {/* Корзина - показывается на sm+ */}
            <IconButton 
              icon={CartIcon} 
              label="Корзина" 
              onClick={handleCartClick} 
              strokeWidth={2}
            />
            
            {/* Меню кнопка - показывается на sm+ (>=640px) */}
            <MenuDropdown />
            
          </div>
        </div>
      </header>

      {/* Мобильное нижнее меню - только <640px */}
      <HeaderMobileMenu 
        onCatalogClick={handleCatalogClick}
        onFavoritesClick={handleFavoritesClick}
        onCartClick={handleCartClick}
        onHomeClick={handleLogoClick}
      />
    </>
  )
}

export default Header