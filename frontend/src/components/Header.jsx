import { useState } from "react"
import { Link } from "react-router-dom"
import { useUserStore } from "../stores/useUserStore"

const Header = () => {
  const { user, logout } = useUserStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    setIsProfileMenuOpen(false) // Закрываем профильное меню при открытии основного
  }

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen)
    setIsMobileMenuOpen(false) // Закрываем основное меню при открытии профильного
  }

  return (
    <header className="w-full h-[87px] bg-[#F5EEE0] relative">
      <div
        className="w-full flex items-center justify-between h-[87px] px-4 md:px-[60px] py-[10px]"
        style={{
          background: "linear-gradient(180deg, #FFEDCA 0%, #F6DDAA 100%)",
          maxWidth: "none",
        }}
      >
        {/* Logo */}
        <Link to="/" className="w-[100px] h-[54px] md:w-[125px] md:h-[67px]">
          <img src="/forchetta-logo.png" alt="Logo" className="w-full h-full object-contain hover:opacity-80 transition" />
        </Link>

        {/* Navigation Bar - Hidden on mobile */}
        <nav className="hidden md:flex items-center gap-8 w-[593px] h-[43px]">
          {/* Search and Catalog */}
          <div className="flex items-center gap-2 w-[163px] h-[41px]">
            {/* Search Icon */}
            <div className="w-[25px] h-[25px]">
              <img src="/Swarch.png" alt="Search" className="w-full h-full" />
            </div>

            {/* Catalog Button */}
            <button className="flex items-center gap-[6px] px-[17px] py-[10px] w-[130px] h-[41px] bg-[#F5EEE0] rounded-[31px] hover:opacity-70 transition">
              <div className="w-6 h-6">
                <img src="/dots-menu.png" alt="Menu" className="w-full h-full" />
              </div>
              <span className="font-sans text-base leading-5 text-center text-[#2B1A12] w-[66px] h-5">Каталог</span>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            <a href="#" className="font-sans text-base leading-5 text-[#2B1A12] w-[76px] h-5 hover:opacity-70 transition">
              Новинки
            </a>
            <a href="#" className="font-sans text-base leading-5 text-[#2B1A12] w-[66px] h-5 hover:opacity-70 transition">
              Набори
            </a>
            <a href="#" className="font-sans text-base leading-5 text-[#2B1A12] w-[41px] h-5 hover:opacity-70 transition">
              Акції
            </a>
            <a href="#" className="font-sans text-base leading-5 text-[#2B1A12] w-[119px] h-5 hover:opacity-70 transition">
              Журнал / Блог
            </a>
          </div>
        </nav>

        {/* Right Side Icons */}
        <div className="flex items-center px-[8px] py-[5px] gap-3 md:gap-5 w-auto md:w-[211px] h-[50px] relative">
          {/* Like Icon */}
          <button className="w-[30px] h-[30px] hover:opacity-70 transition">
            <img src="/like.png" alt="Favorites" className="w-full h-full" />
          </button>

          {/* Shopping Cart Icon */}
          <button className="w-[30px] h-[30px] hover:opacity-70 transition">
            <img src="/cart.png" alt="Shopping Cart" className="w-full h-full" />
          </button>

          {/* Profile Avatar/Icon - Unified with responsive behavior */}
          <div className="group relative flex items-center">
            <button 
              onClick={toggleProfileMenu}
              className="w-[30px] h-[30px] hover:opacity-70 transition relative md:pointer-events-none flex items-center justify-center"
            >
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover border border-[#8B7355]/20"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-[#8B7355]/10 flex items-center justify-center border border-[#8B7355]/20">
                  <img src="/people.png" alt="Profile" className="w-[18px] h-[18px]" />
                </div>
              )}
            </button>

            {/* Desktop Profile Menu - CSS Only with group-hover */}
            <div className="absolute top-[40px] right-0 w-[160px] bg-white shadow-lg rounded-lg py-2 
                            opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                            transition-all duration-200 ease-in-out z-50 hidden md:block
                            hover:opacity-100 hover:visible">
              {user ? (
                <>
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-[#2B1A12] text-sm font-medium">{user.name}</p>
                    <p className="text-[#8B7355] text-xs">{user.email}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-[#2B1A12] text-sm hover:bg-[#F5EEE0] transition-colors"
                  >
                    Вихід
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="block px-4 py-2 text-[#2B1A12] text-sm hover:bg-[#F5EEE0] transition-colors"
                  >
                    Реєстрація
                  </Link>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-[#2B1A12] text-sm hover:bg-[#F5EEE0] transition-colors"
                  >
                    Вхід
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Profile Menu - Separate menu for mobile profile actions */}
            {isProfileMenuOpen && (
              <div 
                className="absolute top-[40px] right-0 w-[200px] bg-white shadow-lg rounded-lg py-2 z-50 md:hidden"
              >
                {user ? (
                  <>
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-[#2B1A12] text-sm font-medium">{user.name}</p>
                      <p className="text-[#8B7355] text-xs">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        logout()
                        setIsProfileMenuOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 text-[#2B1A12] text-sm hover:bg-[#F5EEE0] transition-colors"
                    >
                      Вихід
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-[#2B1A12] text-sm hover:bg-[#F5EEE0] transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Вхід
                    </Link>
                    <Link
                      to="/signup"
                      className="block px-4 py-2 text-[#2B1A12] text-sm hover:bg-[#F5EEE0] transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Реєстрація
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Hamburger Menu - Only visible on mobile */}
          <button 
            onClick={toggleMobileMenu}
            className="block md:hidden w-[40px] h-[35px] hover:opacity-70 transition"
          >
            <img src="/icon_more.png" alt="Menu" className="w-full h-full" />
          </button>
        </div>
      </div>

      {/* Main Mobile Menu - Navigation only */}
      {isMobileMenuOpen && (
        <div 
          className="absolute top-[87px] left-0 w-full bg-[#F5EEE0] shadow-lg z-40 md:hidden"
          style={{
            background: "linear-gradient(180deg, #FFEDCA 0%, #F6DDAA 100%)",
          }}
        >
          <div className="px-4 py-6 space-y-6">
            {/* Search Section */}
            <div className="flex items-center gap-4">
              <div className="w-[25px] h-[25px]">
                <img src="/Swarch.png" alt="Search" className="w-full h-full" />
              </div>
              <span className="font-sans text-base text-[#2B1A12]">Пошук</span>
            </div>

            {/* Catalog Section */}
            <div className="flex items-center gap-4">
              <div className="w-6 h-6">
                <img src="/dots-menu.png" alt="Menu" className="w-full h-full" />
              </div>
              <span className="font-sans text-base text-[#2B1A12]">Каталог</span>
            </div>

            {/* Navigation Links */}
            <div className="space-y-4 pl-2">
              <a href="#" className="block font-sans text-base text-[#2B1A12] hover:opacity-70 transition py-2">
                Новинки
              </a>
              <a href="#" className="block font-sans text-base text-[#2B1A12] hover:opacity-70 transition py-2">
                Набори
              </a>
              <a href="#" className="block font-sans text-base text-[#2B1A12] hover:opacity-70 transition py-2">
                Акції
              </a>
              <a href="#" className="block font-sans text-base text-[#2B1A12] hover:opacity-70 transition py-2">
                Журнал / Блог
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header