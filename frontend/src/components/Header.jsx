import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useUserStore } from "../stores/useUserStore"
import { Logo } from "./Logos/Logo.jsx"
import { 
  SearchIcon,
  ProfileIcon,
  HeartIcon,
  CartIcon,
  DotsIcon,
  HomeIcon,
  MenuIcon
} from "./icons/index.jsx"

const DesktopHeader = ({ onMenuToggle, onCatalogClick, onSearchClick, onProfileClick, onFavoritesClick, onCartClick, onLogoClick, userAvatar, user, logout }) => {
  const navItems = ["Новинки", "Набори", "Акції", "Журнал / Блог"]

  return (
    <header className="hidden h-[87px] w-full items-center bg-creamy md:flex">
      <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-[60px]">
        <button
          aria-label="Перейти на главную"
          onClick={onLogoClick}
          className="h-[67px] w-[125px] shrink-0 transition-transform duration-300 hover:scale-[1.02]"
        >
          <Logo />
        </button>

        <nav aria-label="Основная навигация" className="flex h-[43px] items-center gap-[30px]">
          <button aria-label="Открыть поиск" onClick={onSearchClick} className="rounded-full p-1 transition duration-300 hover:bg-dark-creamy/60">
            <SearchIcon className="shrink-0" />
          </button>

          <button
            aria-label="Открыть каталог"
            onClick={onCatalogClick}
            className="group flex h-[41px] w-[130px] items-center gap-[6px] rounded-[31px] bg-button-primary px-[17px] py-[10px] text-[16px] leading-[20px] text-choco-light transition duration-300 hover:scale-[1.02] hover:bg-choco-light hover:text-creamy"
          >
            <DotsIcon className="shrink-0 group-hover:fill-creamy group-hover:stroke-creamy" />
            <span className="font-normal">Каталог</span>
          </button>

          {navItems.map((item) => (
            <button
              key={item}
              aria-label={item}
              onClick={() => console.log(item)}
              className="whitespace-nowrap text-[16px] leading-[20px] text-choco-light transition duration-300 hover:text-choco-dark hover:opacity-80"
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-[30px] px-[8px] py-[5px]">
          {/* Профиль - аватар или иконка с hover меню */}
          <div className="group relative flex items-center">
            <button 
              aria-label="Профиль" 
              onClick={onProfileClick} 
              className={`rounded-full transition duration-300 ${
                userAvatar 
                  ? 'p-0 hover:ring-2 hover:ring-choco-light/30' 
                  : 'p-1 hover:bg-dark-creamy/60'
              }`}
            >
              {userAvatar ? (
                <img 
                  src={userAvatar} 
                  alt="Аватар пользователя" 
                  className="w-[30px] h-[30px] rounded-full object-cover"
                />
              ) : (
                <ProfileIcon className="shrink-0" />
              )}
            </button>

            {/* Desktop Profile Hover Menu */}
            <div className="absolute top-[40px] right-0 w-[180px] bg-creamy shadow-lg rounded-lg py-2 
                            opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                            transition-all duration-200 ease-in-out z-50
                            hover:opacity-100 hover:visible">
              {user ? (
                <>
                  <div className="px-4 py-2 border-b border-choco-light/20">
                    <p className="text-choco-dark text-sm font-medium truncate">{user.name}</p>
                    <p className="text-choco-light text-xs truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-choco-dark text-sm hover:bg-dark-creamy/50 transition-colors"
                  >
                    Вихід
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="block px-4 py-2 text-choco-dark text-sm hover:bg-dark-creamy/50 transition-colors"
                  >
                    Реєстрація
                  </Link>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-choco-dark text-sm hover:bg-dark-creamy/50 transition-colors"
                  >
                    Вхід
                  </Link>
                </>
              )}
            </div>
          </div>
          <button aria-label="Избранное" onClick={onFavoritesClick} className="rounded-full p-1 transition duration-300 hover:bg-dark-creamy/60">
            <HeartIcon className="shrink-0" />
          </button>
          <button aria-label="Корзина" onClick={onCartClick} className="rounded-full p-1 transition duration-300 hover:bg-dark-creamy/60">
            <CartIcon className="shrink-0" />
          </button>
          <button
            aria-label="Открыть меню"
            onClick={onMenuToggle}
            className="flex h-[40px] w-[45px] items-center justify-center rounded-xl transition duration-300 hover:bg-dark-creamy/60"
          >
            <MenuIcon className="shrink-0" />
          </button>
        </div>
      </div>
    </header>
  )
}

const MobileHeader = ({ isMenuOpen, onMenuToggle, onCatalogClick, onSearchClick, onProfileClick, onFavoritesClick, onCartClick, onLogoClick, userAvatar }) => {
  return (
    <>
      <header className="bg-[#F5EEE0] md:hidden">
        <div className="flex h-[100px] flex-col justify-end px-[16px] pb-[15px] pt-[20px]">
          <div className="flex h-[53.75px] items-center justify-between">
            <button
              aria-label="Перейти на главную"
              onClick={onLogoClick}
              className="h-[53.75px] w-[100px] transition-transform duration-300 hover:scale-[1.02]"
            >
              <img 
                src="/forchetta-logo.png" 
                alt="Forchetta Logo" 
                className="w-full h-full object-contain"
              />
            </button>

            <div className="flex items-center gap-[20px]">
              <button aria-label="Открыть поиск" onClick={onSearchClick} className="rounded-full p-1 transition duration-300 hover:bg-[#E3D6BF]/60">
                <SearchIcon className="shrink-0" />
              </button>
              {/* Профиль - аватар или иконка */}
              <button 
                aria-label="Профиль" 
                onClick={onProfileClick} 
                className={`rounded-full transition duration-300 ${
                  userAvatar 
                    ? 'p-0 hover:ring-2 hover:ring-choco-light/30' 
                    : 'p-1 hover:bg-[#E3D6BF]/60'
                }`}
              >
                {userAvatar ? (
                  <img 
                    src={userAvatar} 
                    alt="Аватар пользователя" 
                    className="w-[30px] h-[30px] rounded-full object-cover"
                  />
                ) : (
                  <ProfileIcon className="shrink-0" />
                )}
              </button>
            </div>
          </div>
        </div>

        <nav
          aria-label="Нижняя мобильная навигация"
          className="fixed bottom-0 left-0 right-0 z-50 h-[107px] bg-[#F5EEE0] px-[16px] pb-[40px] pt-[12px] shadow-[0_-2px_10px_rgba(0,0,0,0.05)] md:hidden"
        >
          <div className="flex items-center justify-between">
            <button
              aria-label="Главная"
              onClick={onLogoClick}
              className="flex w-[48px] flex-col items-center gap-[2px] transition duration-300 hover:opacity-80"
            >
              <HomeIcon className="shrink-0 w-[30px] h-[30px]" />
              <span className="text-center text-[10px] font-light leading-[12px] text-[#705A5A]">Головна</span>
            </button>

            <button
              aria-label="Избранное"
              onClick={onFavoritesClick}
              className="flex w-[41px] flex-col items-center gap-[1px] transition duration-300 hover:opacity-80"
            >
              <HeartIcon className="shrink-0" />
              <span className="text-center text-[10px] font-light leading-[12px] text-[#705A5A]">Обране</span>
            </button>

            <button
              aria-label="Каталог"
              onClick={onCatalogClick}
              className="group flex h-[41px] w-[120px] items-center gap-[6px] rounded-[22.5px] bg-[#E3D6BF] px-[17px] py-[11px] pl-[22px] text-[12px] font-medium leading-[15px] text-[#705A5A] transition duration-300 hover:scale-[1.02] hover:bg-[#705A5A] hover:text-[#F5EEE0]"
            >
              <DotsIcon className="shrink-0 group-hover:fill-[#F5EEE0] group-hover:stroke-[#F5EEE0]" />
              <span>Каталог</span>
            </button>

            <button
              aria-label="Корзина"
              onClick={onCartClick}
              className="flex w-[36px] flex-col items-center gap-[3px] transition duration-300 hover:opacity-80"
            >
              <CartIcon className="shrink-0" />
              <span className="text-center text-[10px] font-light leading-[12px] text-[#705A5A]">Кошик</span>
            </button>

            <button
              aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
              onClick={onMenuToggle}
              className="flex w-[37px] flex-col items-center gap-[3px] transition duration-300 hover:opacity-80"
            >
              <div className="flex h-[30px] items-center justify-center">
                <MenuIcon className="shrink-0 w-[37px] h-[30px]" />
              </div>
              <span className="text-center text-[10px] font-light leading-[12px] text-[#705A5A]">Більше</span>
            </button>
          </div>
        </nav>

        <div
          className={`fixed inset-x-0 top-[100px] z-40 overflow-hidden bg-[#F5EEE0] px-4 transition-all duration-300 ${isMenuOpen ? "max-h-[260px] border-t border-[#705A5A]/10 py-4" : "max-h-0 py-0"}`}
        >
          <nav aria-label="Мобильное меню" className="flex flex-col gap-3 text-[#705A5A]">
            {["Новинки", "Набори", "Акції", "Журнал / Блог"].map((item) => (
              <button
                key={item}
                aria-label={item}
                onClick={() => console.log(item)}
                className="rounded-xl px-3 py-2 text-left text-[16px] leading-[20px] transition duration-300 hover:bg-[#E3D6BF]/70"
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
      </header>
    </>
  )
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useUserStore()

  const handleMenuToggle = () => setIsMenuOpen((prev) => !prev)
  const handleSearchClick = () => console.log("search")
  const handleFavoritesClick = () => console.log("favorites")
  const handleCartClick = () => navigate('/cart')
  const handleCatalogClick = () => console.log("catalog")
  const handleLogoClick = () => navigate('/')
  
  // Логика для профиля: если есть пользователь - на профиль, иначе на логин
  const handleProfileClick = () => {
    if (user) {
      navigate('/profile')
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="font-[Montserrat]">
      <DesktopHeader
        onMenuToggle={handleMenuToggle}
        onCatalogClick={handleCatalogClick}
        onSearchClick={handleSearchClick}
        onProfileClick={handleProfileClick}
        onFavoritesClick={handleFavoritesClick}
        onCartClick={handleCartClick}
        onLogoClick={handleLogoClick}
        userAvatar={user?.avatar}
        user={user}
        logout={logout}
      />
      <MobileHeader
        isMenuOpen={isMenuOpen}
        onMenuToggle={handleMenuToggle}
        onCatalogClick={handleCatalogClick}
        onSearchClick={handleSearchClick}
        onProfileClick={handleProfileClick}
        onFavoritesClick={handleFavoritesClick}
        onCartClick={handleCartClick}
        onLogoClick={handleLogoClick}
        userAvatar={user?.avatar}
      />
    </div>
  )
}

export default Header