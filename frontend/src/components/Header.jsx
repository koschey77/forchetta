const Header = () => {
  return (
    <header className="w-full h-[87px] bg-[#F5EEE0]">
      <div
        className="w-full flex items-center justify-between h-[87px] px-[60px] py-[10px]"
        style={{
          background: "linear-gradient(180deg, #FFEDCA 0%, #F6DDAA 100%)",
          maxWidth: "none",
        }}
      >
        {/* Logo */}
        <div className="w-[125px] h-[67px]">
          <img src="/forchetta-logo.png" alt="Logo" className="w-full h-full object-contain" />
        </div>

        {/* Navigation Bar */}
        <nav className="flex items-center gap-8 w-[593px] h-[43px]">
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
        <div className="flex items-center px-[8px] py-[5px] gap-5 w-[211px] h-[50px]">
          {/* People Icon */}
          <button className="w-[30px] h-[30px] hover:opacity-70 transition">
            <img src="/people.png" alt="Profile" className="w-full h-full" />
          </button>

          {/* Like Icon */}
          <button className="w-[30px] h-[30px] hover:opacity-70 transition">
            <img src="/like.png" alt="Favorites" className="w-full h-full" />
          </button>

          {/* Shopping Cart Icon */}
          <button className="w-[30px] h-[30px] hover:opacity-70 transition">
            <img src="/cart.png" alt="Shopping Cart" className="w-full h-full" />
          </button>

          {/* Hamburger Menu */}
          <button className="w-[45px] h-[40px] hover:opacity-70 transition">
            <img src="/icon_more.png" alt="Menu" className="w-full h-full" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header