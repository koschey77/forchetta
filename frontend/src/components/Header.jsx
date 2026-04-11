import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useUserStore } from "../stores/useUserStore"
import useCartStore from "../stores/useCartStore"
import { Logo } from "./Logos/Logo.jsx"
import { SearchIcon, ProfileIcon, HeartIcon, CartIcon, DotsIcon, MenuIcon } from "./icons/index.jsx"
import HeaderMobileMenu from "./HeaderMobileMenu.jsx"
import { MenuDropdown } from "./ui/dropdowns"

const NAV_ITEMS = [
  { value: "new", label: "Новинки" },
  { value: "sets", label: "Набори" },
  { value: "sales", label: "Акції" },
  { value: "blog", label: "Журнал" }
]

// Переиспользуемые компоненты
const UserAvatar = ({ userAvatar, onClick, className = "", strokeWidth = 3 }) => {
  const [imageError, setImageError] = useState(false)
  
  // Сбрасываем ошибку при изменении аватара
  useEffect(() => {
    setImageError(false)
  }, [userAvatar])
  
  const handleImageError = () => {
    setImageError(true)
  }

  const hasValidImage = userAvatar && !imageError

  return (
    <button
      aria-label="Профиль"
      onClick={onClick}
      className={`rounded-full transition duration-300 ${
        hasValidImage ? "p-0 hover:ring-2 hover:ring-choco-light/30" : "p-1 hover:bg-dark-creamy/60"
      } ${className}`}
    >
      {hasValidImage ? (
        <img 
          src={userAvatar} 
          alt="Аватар пользователя" 
          className="min-w-[30px] h-[30px] rounded-full object-cover"
          onError={handleImageError}
        />
      ) : (
        <ProfileIcon className="shrink-0 text-choco-light" strokeWidth={strokeWidth} />
      )}
    </button>
  )
}

const IconButton = ({ icon: Icon, label, onClick, className = "", strokeWidth = 2, badgeCount = 0, ...props }) => (
  <button 
    aria-label={label}
    onClick={onClick}
    className={`relative rounded-full p-1 transition duration-300 hover:bg-dark-creamy/60 ${className}`}
    {...props}
  >
    <Icon className="shrink-0 text-choco-light" strokeWidth={strokeWidth} />
    {badgeCount > 0 && (
      <div className="absolute flex justify-center items-center w-[16px] h-[16px] right-[0px] top-[0px] bg-choco-light rounded-[10px]">
        <span className="font-montserrat font-bold text-[10px] leading-[12px] text-center text-dark-creamy">
          {badgeCount > 99 ? '99+' : badgeCount}
        </span>
      </div>
    )}
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

const HeaderMenuDropdown = () => (
  <div className="hidden sm:block">
    <MenuDropdown
      variant="navigation"
      options={NAV_ITEMS}
      selected={""}
      onChange={(value) => console.log(value)}
      showCheckmarks={false}
      customTrigger={
        <button className="h-[40px] w-[45px] flex items-center justify-center rounded-xl transition duration-300 hover:bg-dark-creamy/60">
          <MenuIcon className="shrink-0" />
        </button>
      }
    />
  </div>
)

const Header = () => {
  const navigate = useNavigate()
  const { user, openAuthModal } = useUserStore()
  const cartItems = useCartStore((state) => state.cartItems)

  const cartItemsCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)
  const favoritesCount = user?.favorites?.length || 0

  const handleFavoritesClick = () => {
    if (!user) return openAuthModal()
    console.log("favorites")
  }
  
  const handleCartClick = () => {
    if (!user) return openAuthModal()
    navigate('/cart')
  }
  
  const handleCatalogClick = () => navigate('/catalog')
  const handleLogoClick = () => navigate('/')
  
  const handleProfileClick = () => {
    if (user) {
      navigate('/profile')
    } else {
      openAuthModal()
    }
  }

  return (
    <>
      {/* Единый адаптивный хедер */}
      <header className="h-[87px] sm:h-[87px] w-full bg-creamy font-[Montserrat]">
        <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-[15px] sm:px-[30px] lg:px-[60px]">
          
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
                  key={item.value}
                  aria-label={item.label}
                  onClick={() => console.log(item.value)}
                  className="whitespace-nowrap font-normal text-[16px] leading-[20px] text-choco-light transition duration-300 hover:text-choco-light-50"
                >
                  {item.label}
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
          <div className="sm:hidden flex items-center gap-[20px] py-[5px]">
            <IconButton 
              icon={SearchIcon} 
              label="Открыть поиск" 
              onClick={() => console.log('search')}
              strokeWidth={2}
            />
            <UserAvatar userAvatar={user?.avatar} onClick={handleProfileClick} strokeWidth={2} />
          </div>

          {/* Правая секция действий - показывается на sm+ */}
          <div className="hidden sm:flex items-center gap-[30px] py-[5px]">
            
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
              badgeCount={favoritesCount}
            />
            
            {/* Корзина - показывается на sm+ */}
            <IconButton 
              icon={CartIcon} 
              label="Корзина" 
              onClick={handleCartClick} 
              strokeWidth={2}
              badgeCount={cartItemsCount}
            />
            
            {/* Меню кнопка - показывается на sm+ (>=640px) */}
            <HeaderMenuDropdown />
            
          </div>
        </div>
      </header>

      {/* Мобильное нижнее меню - только <640px */}
      <HeaderMobileMenu 
        onCatalogClick={handleCatalogClick}
        onFavoritesClick={handleFavoritesClick}
        onCartClick={handleCartClick}
        onHomeClick={handleLogoClick}
        favoritesCount={favoritesCount}
        cartItemsCount={cartItemsCount}
      />
    </>
  )
}

export default Header