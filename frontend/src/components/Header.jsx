import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import { useUserStore } from "../stores/useUserStore"
import useCartStore from "../stores/useCartStore"
import useFilterStore from "../stores/useFilterStore"
import api from "../services/api"
import { Logo } from "./Logos/Logo.jsx"
import LogoHover from "./Logos/LogoHover.jsx"
import { ProfileIcon, HeartIcon, CartIcon, DotsIcon, MenuIcon } from "./icons/index.jsx"
import HeaderSearch from "./common/HeaderSearch.jsx"
import HeaderMobileMenu from "./HeaderMobileMenu.jsx"
import HeaderMenu from "./HeaderMenu.jsx"

const NAV_ITEMS = [
  { value: "new", label: "Новинки" },
  { value: "sets", label: "Набори" },
  { value: "sales", label: "Акції" },
  { value: "blog", label: "Журнал" }
]

// Перевикористовувані компоненти
const UserAvatar = ({ userAvatar, onClick, className = "", strokeWidth = 3 }) => {
  const [imageError, setImageError] = useState(false)
  
  // Скидаємо помилку при зміні аватара
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

const Header = () => {
  const navigate = useNavigate()
  const { user, openAuthModal } = useUserStore()
  const cartItems = useCartStore((state) => state.cartItems)
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)

  const cartItemsCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)
  const favoritesCount = user?.favorites?.length || 0

  const handleFavoritesClick = () => {
    if (!user) return openAuthModal()
    navigate("/user-panel?page=favorites")
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

  const resetFilters = useFilterStore(state => state.resetFilters)
  const updateFilter = useFilterStore(state => state.updateFilter)
  const setSortOption = useFilterStore(state => state.setSortOption)
  const queryClient = useQueryClient()

  const handleNavItemClick = (itemValue) => {
    if (itemValue === 'blog') {
      navigate('/journal');
      return;
    }

    navigate('/catalog');
    
    // Скидаємо всі поточні фільтри
    resetFilters();
    
    if (itemValue === 'new' || itemValue === 'sales') {
      setSortOption(itemValue);
    } else if (itemValue === 'sets') {
      setSortOption(''); // Для наборів сортування за замовчуванням
      const categories = queryClient.getQueryData(['categories']) || [];
      const targetCategory = categories.find(c => c.name === 'Подарункові набори' || c.name === 'Подарункові набори ');
      
      if (targetCategory) {
        updateFilter('categories', [targetCategory._id]);
      } else {
        api.categories.getAll().then(res => {
          const target = res.find(c => c.name === 'Подарункові набори' || c.name === 'Подарункові набори ');
          if (target) updateFilter('categories', [target._id]);
        }).catch(err => console.error("Error fetching categories", err));
      }
    }
  }

  return (
    <>
      {/* Єдиний адаптивний хедер */}
      <header className="h-[87px] sm:h-[87px] w-full bg-creamy font-[Montserrat] shadow-sm relative z-50">
        <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-[15px] sm:px-[30px] lg:px-[60px]">
          
          {/* Логотип - завжди показується */}
          <button
            aria-label="Перейти на головну"
            onClick={handleLogoClick}
            className="group h-[53.75px] sm:h-[67px] w-[100px] sm:w-[125px] shrink-0 active:scale-95 transition-transform duration-300"
          >
            {/* Desktop: SVG Logo, інше: img */}
            <div className="hidden lg:block">
              <Logo className="block lg:group-hover:hidden" />
              <LogoHover className="hidden lg:group-hover:block" />
            </div>
            <img 
              src="/forchetta-logo.png" 
              alt="Forchetta Logo" 
              className="lg:hidden w-full h-full object-contain"
            />
          </button>

          {/* Центральна навігація - показується за breakpoints */}
          <nav className="flex-1 flex justify-center">
            
            {/* Навігаційні посилання - тільки Desktop xl: >=1280px */}
            <div className="hidden xl:flex h-[43px] items-center gap-[30px]">
              <HeaderSearch isMobile={false} />
              
              <CatalogButton onClick={handleCatalogClick} />
              
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.value}
                  aria-label={item.label}
                  onClick={() => handleNavItemClick(item.value)}
                  className="whitespace-nowrap font-normal text-[16px] leading-[20px] text-choco-light transition duration-300 hover:text-choco-light-50"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Tablet: md-xl (768px-1279px) - пошук + каталог, без навігації */}
            <div className="hidden md:flex xl:hidden h-[43px] items-center gap-[30px]">
              <HeaderSearch isMobile={false} />
              <CatalogButton onClick={handleCatalogClick} />
            </div>

            {/* Small screens: sm-md (640px-767px) - пошук + каталог */}
            <div className="hidden sm:flex md:hidden h-[43px] items-center gap-[30px]">
              <HeaderSearch isMobile={true} />
              <CatalogButton onClick={handleCatalogClick} />
            </div>
          </nav>

          {/* Мобільна права секція (<640px) - пошук + профіль */}
          <div className="sm:hidden flex items-center gap-[20px] py-[5px]">
            <HeaderSearch isMobile={true} />
            <UserAvatar userAvatar={user?.avatar} onClick={handleProfileClick} strokeWidth={2} />
          </div>

          {/* Права секція дій - показується на sm+ */}
          <div className="hidden sm:flex items-center gap-[30px] py-[5px]">
            
            {/* Профіль - показується на sm+ */}
            <div className="relative flex items-center">
              <UserAvatar userAvatar={user?.avatar} onClick={handleProfileClick} strokeWidth={2} />
            </div>
            
            {/* Обране - показується на sm+ (>=640px) */}
            <IconButton 
              icon={HeartIcon} 
              label="Обране" 
              onClick={handleFavoritesClick}
              strokeWidth={2}
              badgeCount={favoritesCount}
            />
            
            {/* Кошик - показується на sm+ */}
            <IconButton 
              icon={CartIcon} 
              label="Кошик" 
              onClick={handleCartClick} 
              strokeWidth={2}
              badgeCount={cartItemsCount}
            />
            
            {/* Меню десктопа (Mega Menu Trigger) - показується на sm+ */}
            <div className="hidden sm:block">
              <button 
                onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                className={`h-[40px] w-[45px] flex items-center justify-center rounded-xl transition duration-300 hover:bg-dark-creamy/60 ${isMegaMenuOpen ? 'bg-dark-creamy/60' : ''}`}
              >
                <MenuIcon className="shrink-0 text-choco-light" />
              </button>
            </div>
            
          </div>
        </div>

        {/* Выпадающее Mega Menu */}
        <HeaderMenu 
          isOpen={isMegaMenuOpen} 
          onClose={() => setIsMegaMenuOpen(false)} 
        />
      </header>

      {/* Мобильное нижнее меню - только <640px */}
      <HeaderMobileMenu 
        onCatalogClick={handleCatalogClick}
        onFavoritesClick={handleFavoritesClick}
        onCartClick={handleCartClick}
        onHomeClick={handleLogoClick}
        favoritesCount={favoritesCount}
        cartItemsCount={cartItemsCount}
        onMoreClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
      />
    </>
  )
}

export default Header