import LogoFooter from './Logos/LogoFooter';
import LogoFooterMobile from './Logos/LogoFooterMobile';
import { FacebookIcon, TelegramIcon, InstagramIcon } from './icons';

const Footer = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Добавить логику отправки email подписки
    console.log('Newsletter subscription');
  };

  return (
    <footer className="bg-choco-dark text-creamy font-montserrat w-full relative z-60">
      {/* Desktop версия */}
      <div className="hidden md:block">
        {/* Основной контейнер Footer */}
        <div className="w-full max-w-[1440px] mx-auto px-[50px] py-8 pt-[60px] pb-[20px] min-h-[554px]">
          {/* Внутренний контейнер 1320px */}
          <div className="w-full max-w-[1320px] mx-auto flex flex-col gap-8">
            {/* CTA Newsletter секция */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
              <div className="lg:max-w-xl">
                <h2 className="font-bold text-[40px] leading-[60px] mb-4 text-dark-creamy whitespace-nowrap">Залишайся на солодкій хвилі</h2>
                <p className="text-base font-normal leading-relaxed max-w-lg text-white">
                  Приєднуйся та першими дізнавайся про новинки, сезонні десерти та особливі пропозиції
                </p>
              </div>
              <div className="w-full lg:w-auto mt-4 lg:mt-0">
                <form className="flex flex-row gap-4 w-[538px] h-[46px]" onSubmit={handleSubmit}>
                  <input
                    type="email"
                    placeholder="Email"
                    aria-label="Email address"
                    className="bg-creamy text-choco-light placeholder-choco-light px-3 py-3 rounded-[31px] w-[272px] h-[46px] focus:outline-none focus:ring-2 focus:ring-creamy/50 text-base font-normal leading-5"
                  />
                  <button
                    type="submit"
                    className="border border-creamy text-creamy px-[30px] py-4 rounded-[44px] hover:bg-creamy hover:text-choco-dark transition-colors duration-300 font-normal w-[250px] h-[46px] text-base leading-5 flex items-center justify-center whitespace-nowrap"
                  >
                    Приєднатися
                  </button>
                </form>
              </div>
            </div>

            {/* Разделитель Line 4 */}
            <div className="border-t border-creamy w-full"></div>

            {/* Навигация + Логотип (Sitemap) */}
            <div className="flex flex-row justify-between items-start mb-3 p-0 w-full h-[182px]">
              {/* Логотип */}
              <div className="flex-none order-0 flex-grow-0">
                <LogoFooter className="w-[227px] h-[120.93px]" />
              </div>

              {/* 4 колонки навигации */}
              <nav className="flex flex-row items-start p-0 gap-[75px] w-[980px] h-[182px] flex-none order-4 flex-grow-0">
                {/* Каталог */}
                <div className="flex flex-col justify-center items-start p-0 gap-4 w-[188.75px] h-[182px] flex-none order-0 flex-grow">
                  <h3 className="w-[188.75px] h-[17px] font-montserrat font-bold text-sm leading-[17px] text-creamy flex-none order-0 self-stretch flex-grow-0">Каталог</h3>
                  <a href="#" className="w-[188.75px] h-[17px] font-montserrat font-normal text-sm leading-[17px] text-creamy flex-none order-1 flex-grow-0 hover:opacity-80 transition-opacity">
                    Торти
                  </a>
                  <a href="#" className="w-[188.75px] h-[17px] font-montserrat font-normal text-sm leading-[17px] text-creamy flex-none order-2 self-stretch flex-grow-0 hover:opacity-80 transition-opacity">
                    Цукерки
                  </a>
                  <a href="#" className="w-[188.75px] h-[17px] font-montserrat font-normal text-sm leading-[17px] text-creamy flex-none order-3 self-stretch flex-grow-0 hover:opacity-80 transition-opacity">
                    Тістечка
                  </a>
                  <a href="#" className="w-[188.75px] h-[17px] font-montserrat font-normal text-sm leading-[17px] text-creamy flex-none order-4 self-stretch flex-grow-0 hover:opacity-80 transition-opacity">
                    Шоколад
                  </a>
                  <a href="#" className="w-[188.75px] h-[17px] font-montserrat font-normal text-sm leading-[17px] text-creamy flex-none order-5 self-stretch flex-grow-0 hover:opacity-80 transition-opacity">
                    Подарункові набори
                  </a>
                </div>

                {/* Про компанію */}
                <div className="flex flex-col justify-center items-start p-0 gap-4 w-[188.75px] h-[149px] flex-none order-1 flex-grow">
                  <h3 className="w-[188.75px] h-[17px] font-montserrat font-bold text-sm leading-[17px] text-creamy flex-none order-0 self-stretch flex-grow-0">Про компанію</h3>
                  <a href="#" className="w-[188.75px] h-[17px] font-montserrat font-normal text-sm leading-[17px] text-creamy flex-none order-1 self-stretch flex-grow-0 hover:opacity-80 transition-opacity">
                    Головна
                  </a>
                  <a href="#" className="w-[188.75px] h-[17px] font-montserrat font-normal text-sm leading-[17px] text-creamy flex-none order-2 self-stretch flex-grow-0 hover:opacity-80 transition-opacity">
                    Історія бренду
                  </a>
                  <a href="#" className="w-[188.75px] h-[17px] font-montserrat font-normal text-sm leading-[17px] text-creamy flex-none order-3 self-stretch flex-grow-0 hover:opacity-80 transition-opacity">
                    Наше виробництво
                  </a>
                  <a href="#" className="w-[188.75px] h-[17px] font-montserrat font-normal text-sm leading-[17px] text-creamy flex-none order-4 self-stretch flex-grow-0 hover:opacity-80 transition-opacity">
                    Сертифікати
                  </a>
                </div>

                {/* Допомога */}
                <div className="flex flex-col justify-center items-start p-0 gap-4 w-[188.75px] h-[116px] flex-none order-2 flex-grow">
                  <h3 className="w-[76px] h-[17px] font-montserrat font-bold text-sm leading-[17px] text-creamy flex-none order-0 flex-grow-0">Допомога</h3>
                  <a href="#" className="w-[199px] h-[17px] font-montserrat font-normal text-sm leading-[17px] text-creamy flex-none order-1 flex-grow-0 hover:opacity-80 transition-opacity">
                    Поширені запитання (FAQ)
                  </a>
                  <a href="#" className="w-[129px] h-[17px] font-montserrat font-normal text-sm leading-[17px] text-creamy flex-none order-2 flex-grow-0 hover:opacity-80 transition-opacity">
                    Доставка і оплата
                  </a>
                  <a href="#" className="w-[67px] h-[17px] font-montserrat font-normal text-sm leading-[17px] text-creamy flex-none order-3 flex-grow-0 hover:opacity-80 transition-opacity">
                    Контакти
                  </a>
                </div>

                {/* Контакти і адреса */}
                <div className="flex flex-col justify-center items-start p-0 gap-4 w-[188.75px] h-[157px] flex-none order-3 flex-grow">
                  <h3 className="w-[188.75px] h-[17px] font-montserrat font-bold text-sm leading-[17px] text-creamy flex-none order-0 self-stretch flex-grow-0">Контакти і адреса</h3>
                  <p className="w-[189px] h-[17px] font-montserrat font-normal text-sm leading-[17px] text-creamy flex-none order-1 flex-grow-0">м. Київ, вул. Хрещатик 10А</p>
                  <a href="mailto:forchetta@gmail.com" className="w-[188.75px] h-[17px] font-montserrat font-normal text-sm leading-[17px] text-creamy flex-none order-2 self-stretch flex-grow-0 hover:opacity-80 transition-opacity">
                    forchetta@gmail.com
                  </a>
                  <a href="tel:+380999876240" className="w-[188.75px] h-[17px] font-montserrat font-light text-sm leading-[17px] text-creamy flex-none order-3 self-stretch flex-grow-0 hover:opacity-80 transition-opacity">
                    Tel: +38(099) 987 62 40
                  </a>

                  <div className="flex flex-row items-start p-0 gap-[15px] w-[105px] h-[25px] flex-none order-4 flex-grow-0">
                    <button aria-label="Instagram" className="hover:scale-110 transition-transform flex-none order-0 flex-grow-0">
                      <InstagramIcon width={25} height={25} />
                    </button>
                    <button aria-label="Telegram" className="hover:scale-110 transition-transform flex-none order-1 flex-grow-0">
                      <TelegramIcon width={25} height={25} />
                    </button>
                    <button aria-label="Facebook" className="hover:scale-110 transition-transform flex-none order-2 flex-grow-0">
                      <FacebookIcon width={25} height={25} />
                    </button>
                  </div>
                </div>
              </nav>
            </div>

            {/* Нижний разделитель */}
            <div className="border-t border-creamy w-full"></div>

            {/* Bottom Legal Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center text-xs">
              <p className="text-creamy font-normal">© 2026 Forchetta. Усі права захищено.</p>
              <div className="flex flex-wrap justify-center gap-3">
                <a href="#" className="text-creamy hover:opacity-80 transition-opacity text-xs font-normal">Cookies</a>
                <span className="hidden md:inline text-creamy text-xs font-normal">|</span>
                <a href="#" className="text-creamy hover:opacity-80 transition-opacity text-xs font-normal">Договір оферти</a>
                <span className="hidden md:inline text-creamy text-xs font-normal">|</span>
                <a href="#" className="text-creamy hover:opacity-80 transition-opacity text-xs font-normal">Політика конфіденційності</a>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Mobile версия - совершенно другая структура */}
      <div className="md:hidden w-[375px] mx-auto px-[30px] pt-[170px] pb-[120px] flex flex-col items-center text-center h-[730px] bg-[#2B1A12]">
        {/* Основной контейнер с логотипом и контактами */}
        <div className="flex flex-col items-center gap-[100px] w-[315px]">
          {/* Логотип по центру */}
          <div className="flex-none">
            <LogoFooterMobile className="w-[180px] h-24" />
          </div>

          {/* Контактная секция */}
          <div className="flex flex-col items-center gap-[40px] w-[315px]">
            {/* Контакты */}
            <div className="flex flex-col items-center gap-5 w-[315px]">
              <p className="text-creamy font-light text-lg leading-[22px] text-center">м. Київ, вул. Хрещатик 10А</p>
              <a href="mailto:forchetta@gmail.com" className="text-creamy font-light text-lg leading-[22px] text-center hover:opacity-80 transition-opacity">
                forchetta@gmail.com
              </a>
              <a href="tel:+380999876240" className="text-creamy font-light text-lg leading-[22px] text-center hover:opacity-80 transition-opacity">
                Tel: +38(099) 987 62 40
              </a>
            </div>

            {/* Социальные иконки */}
            <div className="flex items-start gap-[40px] w-[176px] h-[30px]">
              <button aria-label="Instagram" className="flex-none hover:scale-110 transition-transform">
                <InstagramIcon width={30} height={30} />
              </button>
              <button aria-label="Telegram" className="flex-none hover:scale-110 transition-transform">
                <TelegramIcon width={30} height={30} />
              </button>
              <button aria-label="Facebook" className="flex-none hover:scale-110 transition-transform">
                <FacebookIcon width={30} height={30} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
};

export default Footer;