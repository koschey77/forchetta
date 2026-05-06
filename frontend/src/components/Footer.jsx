import { Link } from 'react-router-dom';
import LogoFooter from './Logos/LogoFooter';
import LogoFooterMobile from './Logos/LogoFooterMobile';
import { FacebookIcon, TelegramIcon, InstagramIcon } from './icons';

const Footer = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Додати логіку відправки email підписки
    console.log('Newsletter subscription');
  };

  return (
    <footer className="bg-choco-dark text-creamy font-montserrat w-full relative z-60">
      {/* Єдиний адаптивний контейнер */}
      <div
        className="w-full max-w-[1440px] mx-auto px-[15px] sm:px-[30px] lg:px-[60px] py-8 sm:pt-[60px] sm:pb-[20px] pt-[170px] pb-[120px] 
                      min-h-[730px] sm:min-h-[400px] xl:min-h-[554px]"
      >
        <div className="w-full max-w-[1320px] mx-auto flex flex-col gap-8">
          {/* Newsletter секція - тільки Desktop та Tablet */}
          <div className="hidden sm:flex flex-row justify-between items-start xl:items-center gap-8 xl:gap-12">
            <div className="flex-1 xl:max-w-xl">
              <h2
                className="font-bold text-[32px] xl:text-[40px] leading-[48px] xl:leading-[60px] mb-4 text-dark-creamy 
                           xl:whitespace-nowrap"
              >
                Залишайся на солодкій хвилі
              </h2>
              <p className="text-base font-normal leading-relaxed text-white max-w-xl">
                Приєднуйся та першим дізнавайся про новинки, сезонні десерти та особливі пропозиції
              </p>
            </div>

            {/* Desktop: форма справа, Tablet: логотип справа */}
            <div className="w-full sm:w-auto xl:w-auto mt-4 xl:mt-0 flex-none">
              {/* Форма підписки - тільки Desktop */}
              <form className="hidden xl:flex flex-row gap-4 w-[538px] h-[46px]" onSubmit={handleSubmit}>
                <input
                  type="email"
                  placeholder="Email"
                  aria-label="Email address"
                  className="bg-creamy text-choco-light placeholder-choco-light px-3 py-3 rounded-[31px] w-[272px] h-[46px] 
                           focus:outline-none focus:ring-2 focus:ring-creamy/50 text-base font-normal leading-5"
                />
                <button
                  type="submit"
                  className="border border-creamy text-creamy px-[30px] py-4 rounded-[44px] 
                           hover:bg-creamy hover:text-choco-dark transition-colors duration-300 
                           font-normal w-[250px] h-[46px] text-base leading-5 flex items-center justify-center whitespace-nowrap"
                >
                  Приєднатися
                </button>
              </form>

              {/* Логотип - Tablet: справа від тексту */}
              <div className="hidden sm:block xl:hidden">
                <LogoFooterMobile idPrefix="tablet" className="w-[180px] h-24" />
              </div>
            </div>
          </div>

          {/* Розділювач - тільки Desktop та Tablet */}
          <div className="hidden sm:block border-t border-creamy w-full"></div>

          {/* Основний контент: Desktop та Tablet навігація, Mobile логотип */}
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-3 w-full gap-8 sm:gap-0">
            {/* Desktop: Логотип зліва */}
            <div className="hidden xl:block flex-none">
              <LogoFooter className="w-[227px] h-[120.93px]" />
            </div>

            {/* Mobile: Логотип по центру */}
            <div className="sm:hidden flex-none">
              <LogoFooterMobile idPrefix="mobile" className="w-[180px] h-24" />
            </div>

            {/* Навігація - тільки Desktop та Tablet */}
            <nav
              className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-[75px] 
                          w-full lg:w-[980px] lg:h-[182px] lg:flex lg:flex-row lg:items-start lg:p-0"
            >
              {/* Каталог */}
              <div className="flex flex-col items-start gap-4 xl:w-[188.75px] xl:h-[182px]">
                <h3 className="font-bold text-sm leading-[17px] text-creamy">Каталог</h3>
                <a href="#" className="font-normal text-sm leading-[17px] text-creamy hover:opacity-80 transition-opacity">
                  Торти
                </a>
                <a href="#" className="font-normal text-sm leading-[17px] text-creamy hover:opacity-80 transition-opacity">
                  Цукерки
                </a>
                <a href="#" className="font-normal text-sm leading-[17px] text-creamy hover:opacity-80 transition-opacity">
                  Тістечка
                </a>
                <a href="#" className="font-normal text-sm leading-[17px] text-creamy hover:opacity-80 transition-opacity">
                  Шоколад
                </a>
                <a href="#" className="font-normal text-sm leading-[17px] text-creamy hover:opacity-80 transition-opacity">
                  Подарункові набори
                </a>
              </div>

              {/* Про компанію */}
              <div className="flex flex-col items-start gap-4 xl:w-[188.75px] xl:h-[149px]">
                <h3 className="font-bold text-sm leading-[17px] text-creamy">Про компанію</h3>
                <Link to="/" className="font-normal text-sm leading-[17px] text-creamy hover:opacity-80 transition-opacity">
                  Головна
                </Link>
                <a href="#" className="font-normal text-sm leading-[17px] text-creamy hover:opacity-80 transition-opacity">
                  Про нас
                </a>
                <a href="#" className="font-normal text-sm leading-[17px] text-creamy hover:opacity-80 transition-opacity">
                  Наше виробництво
                </a>
                <Link to="/shops" className="font-normal text-sm leading-[17px] text-creamy hover:opacity-80 transition-opacity">
                  Магазини
                </Link>
              </div>

              {/* Допомога */}
              <div className="flex flex-col items-start gap-4 xl:w-[188.75px] xl:h-[116px]">
                <h3 className="font-bold text-sm leading-[17px] text-creamy">Допомога</h3>
                <a href="#" className="font-normal text-sm leading-[17px] text-creamy hover:opacity-80 transition-opacity">
                  FAQ
                </a>
                <a href="#" className="font-normal text-sm leading-[17px] text-creamy hover:opacity-80 transition-opacity">
                  Доставка та оплата
                </a>
                <a href="#" className="font-normal text-sm leading-[17px] text-creamy hover:opacity-80 transition-opacity">
                  Контакти
                </a>
              </div>

              {/* Контакти і адреса */}
              <div className="flex flex-col items-start gap-4 xl:w-[188.75px] xl:h-[157px]">
                <h3 className="font-bold text-sm leading-[17px] text-creamy">Контакти і адреса</h3>
                <p className="font-normal text-sm leading-[17px] text-creamy">м.Київ, вул. Хрещатик 10А</p>
                <a href="mailto:forchetta@gmail.com" className="font-normal text-sm leading-[17px] text-creamy hover:opacity-80 transition-opacity">
                  forchetta@gmail.com
                </a>
                <a href="tel:+380999876240" className="font-light text-sm leading-[17px] text-creamy hover:opacity-80 transition-opacity">
                  Tel: +38(099) 987 62 40
                </a>

                {/* Соціальні іконки в Desktop версії */}
                <div className="hidden xl:flex flex-row items-start gap-[15px] w-[105px] h-[25px]">
                  <button aria-label="Instagram" className="hover:scale-110 transition-transform">
                    <InstagramIcon width={25} height={25} />
                  </button>
                  <button aria-label="Telegram" className="hover:scale-110 transition-transform">
                    <TelegramIcon width={25} height={25} />
                  </button>
                  <button aria-label="Facebook" className="hover:scale-110 transition-transform">
                    <FacebookIcon width={25} height={25} />
                  </button>
                </div>
              </div>
            </nav>
          </div>

          {/* Mobile: Контакти та соціальні іконки */}
          <div className="sm:hidden flex flex-col items-center gap-[40px] w-full">
            {/* Контакти */}
            <div className="flex flex-col items-center gap-5 w-full max-w-[315px]">
              <p className="text-creamy font-light text-lg leading-[22px] text-center">м. Київ, вул. Хрещатик 10А</p>
              <a
                href="mailto:forchetta@gmail.com"
                className="text-creamy font-light text-lg leading-[22px] text-center hover:opacity-80 transition-opacity"
              >
                forchetta@gmail.com
              </a>
              <a href="tel:+380999876240" className="text-creamy font-light text-lg leading-[22px] text-center hover:opacity-80 transition-opacity">
                Tel: +38(099) 987 62 40
              </a>
            </div>

            {/* Соціальні іконки для Mobile */}
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

          {/* Разделитель - только Desktop и Tablet */}
          <div className="hidden sm:block border-t border-creamy w-full"></div>

          {/* Bottom Legal Bar - только Desktop и Tablet */}
          <div className="hidden sm:flex flex-col md:flex-row justify-between items-center text-xs">
            <p className="text-creamy font-normal">© 2026 Forchetta. Усі права захищено.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="#" className="text-creamy hover:opacity-80 transition-opacity text-xs font-normal">
                Cookies
              </a>
              <span className="hidden md:inline text-creamy text-xs font-normal">|</span>
              <a href="#" className="text-creamy hover:opacity-80 transition-opacity text-xs font-normal">
                Договір оферти
              </a>
              <span className="hidden md:inline text-creamy text-xs font-normal">|</span>
              <a href="#" className="text-creamy hover:opacity-80 transition-opacity text-xs font-normal">
                Політика конфіденційності
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
};

export default Footer;