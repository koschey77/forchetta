import { Link } from 'react-router-dom';
import { FacebookSvgIcon, InstagramSvgIcon, TelegramSvgIcon, PhoneIcon } from './icons/index.jsx';

const HeaderMenu = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 top-[87px] bg-choco-dark/20 z-40 transition-opacity"
        onClick={onClose}
      />
      <div className="absolute top-full left-[15px] right-[15px] md:left-0 md:right-0 w-[calc(100%-30px)] md:w-full z-50 md:border-t md:border-choco-light/10 shadow-lg bg-creamy rounded-[5px] md:rounded-b-[10px] mt-[12px] md:mt-0 flex flex-col md:block gap-[12px] md:gap-0 max-h-[calc(100vh-180px)] md:max-h-[calc(100vh-87px)] overflow-y-auto overflow-x-hidden pb-[30px] p-[10px] md:p-0 md:pb-0 scrollbar-hide">
        
        {/* Контейнер меню. Grid відповідає за адаптивність за ТЗ */}
        <div className="mx-auto w-full md:max-w-[1440px] md:px-10 py-0 md:py-[34px] xl:px-[60px] 
                        flex flex-col md:grid gap-[12px] md:gap-8 
                        md:grid-cols-2 
                        lg:grid-cols-[1fr_1fr_326px] 
                        xl:grid-cols-[1fr_1fr_1fr_1fr_326px]">
          
          {/* 1. ІНФОРМАЦІЯ */}
          <div className="flex flex-col gap-[20px] md:gap-5 p-[10px_15px_15px] md:p-0 bg-dark-creamy/45 md:bg-transparent rounded-[5px] md:rounded-none xl:col-start-1">
            <h3 className="font-cormorant font-semibold text-[16px] leading-[19px] uppercase text-choco-dark/50">
              ІНФОРМАЦІЯ
            </h3>
            <ul className="flex flex-col gap-[10px] md:gap-2.5">
              <li><Link to="/" onClick={onClose} className="font-montserrat font-normal text-[16px] leading-[20px] text-choco-light hover:text-choco-dark transition-colors">Головна</Link></li>
              <li><Link to="/about" onClick={onClose} className="font-montserrat font-normal text-[16px] leading-[20px] text-choco-light hover:text-choco-dark transition-colors">Про нас</Link></li>
              <li><Link to="/sales" onClick={onClose} className="font-montserrat font-normal text-[16px] leading-[20px] text-choco-light hover:text-choco-dark transition-colors">Акції</Link></li>
              <li><Link to="/public-offer" onClick={onClose} className="font-montserrat font-normal text-[16px] leading-[20px] text-choco-light hover:text-choco-dark transition-colors">Публічна Оферта</Link></li>
              <li><Link to="/privacy-policy" onClick={onClose} className="font-montserrat font-normal text-[16px] leading-[20px] text-choco-light hover:text-choco-dark transition-colors">Політика конфіденційності</Link></li>
              <li><Link to="/404" onClick={onClose} className="font-montserrat font-normal text-[16px] leading-[20px] text-choco-light hover:text-choco-dark transition-colors">404</Link></li>
            </ul>
          </div>

          {/* 2. КАТАЛОГ */}
          <div className="flex flex-col gap-[20px] md:gap-5 p-[10px_15px_15px] md:p-0 bg-dark-creamy/45 md:bg-transparent rounded-[5px] md:rounded-none xl:col-start-2 lg:col-start-2 md:col-start-2">
            <h3 className="font-cormorant font-semibold text-[16px] leading-[19px] uppercase text-choco-dark/50">
              КАТАЛОГ
            </h3>
            <ul className="flex flex-col gap-[10px] md:gap-2.5">
              <li><Link to="/catalog?category=Торти" onClick={onClose} className="font-montserrat font-normal text-[16px] leading-[20px] text-choco-light hover:text-choco-dark transition-colors">Торти</Link></li>
              <li><Link to="/catalog?category=Тістечка" onClick={onClose} className="font-montserrat font-normal text-[16px] leading-[20px] text-choco-light hover:text-choco-dark transition-colors">Тістечка</Link></li>
              <li><Link to="/catalog?category=Цукерки" onClick={onClose} className="font-montserrat font-normal text-[16px] leading-[20px] text-choco-light hover:text-choco-dark transition-colors">Цукерки</Link></li>
              <li><Link to="/catalog?category=Шоколад" onClick={onClose} className="font-montserrat font-normal text-[16px] leading-[20px] text-choco-light hover:text-choco-dark transition-colors">Шоколад</Link></li>
              <li><Link to="/catalog?category=Подарункові набори" onClick={onClose} className="font-montserrat font-normal text-[16px] leading-[20px] text-choco-light hover:text-choco-dark transition-colors">Подарункові набори</Link></li>
            </ul>
          </div>

          {/* 3. КАБІНЕТ (падає на 2-й рядок при 1024-1280px) */}
          <div className="flex flex-col gap-[20px] md:gap-5 p-[10px_15px_15px] md:p-0 bg-dark-creamy/45 md:bg-transparent rounded-[5px] md:rounded-none xl:col-start-3 lg:col-start-1 md:col-start-1">
            <h3 className="font-cormorant font-semibold text-[16px] leading-[19px] uppercase text-choco-dark/50">
              КАБІНЕТ
            </h3>
            <ul className="flex flex-col gap-[10px] md:gap-2.5">
              <li><Link to="/profile" onClick={onClose} className="font-montserrat font-normal text-[16px] leading-[20px] text-choco-light hover:text-choco-dark transition-colors">Загальні дані</Link></li>
              <li><Link to="/user-panel?page=orders" onClick={onClose} className="font-montserrat font-normal text-[16px] leading-[20px] text-choco-light hover:text-choco-dark transition-colors">Мої замовлення</Link></li>
              <li><Link to="/user-panel?page=addresses" onClick={onClose} className="font-montserrat font-normal text-[16px] leading-[20px] text-choco-light hover:text-choco-dark transition-colors">Адреси доставки</Link></li>
              <li><Link to="/user-panel?page=bonuses" onClick={onClose} className="font-montserrat font-normal text-[16px] leading-[20px] text-choco-light hover:text-choco-dark transition-colors">Бонуси</Link></li>
            </ul>
          </div>

          {/* 4. ДОПОМОГА (падає на 2-й рядок при 1024-1280px, поруч із КАБІНЕТОМ) */}
          <div className="flex flex-col gap-[20px] md:gap-5 p-[10px_15px_15px] md:p-0 bg-dark-creamy/45 md:bg-transparent rounded-[5px] md:rounded-none xl:col-start-4 lg:col-start-2 md:col-start-2">
            <h3 className="font-cormorant font-semibold text-[16px] leading-[19px] uppercase text-choco-dark/50">
              ДОПОМОГА
            </h3>
            <ul className="flex flex-col gap-[10px] md:gap-2.5">
              <li><Link to="/delivery" onClick={onClose} className="font-montserrat font-normal text-[16px] leading-[20px] text-choco-light hover:text-choco-dark transition-colors">Доставка та оплата</Link></li>
              <li><Link to="/stores" onClick={onClose} className="font-montserrat font-normal text-[16px] leading-[20px] text-choco-light hover:text-choco-dark transition-colors">Магазини</Link></li>
              <li><Link to="/contacts" onClick={onClose} className="font-montserrat font-normal text-[16px] leading-[20px] text-choco-light hover:text-choco-dark transition-colors">Контакти</Link></li>
            </ul>
          </div>

          {/* 5. КОЛОНКА БАНЕРІВ ТА КОНТАКТІВ (займає 2 рядки на lg, або падає вниз і центрується на md/мобілках) */}
          <div className="flex flex-col items-center lg:items-start gap-[4px] md:gap-4 
                          xl:col-start-5 
                          lg:col-start-3 lg:row-span-2 lg:row-start-1
                          md:col-start-1 md:col-span-2 mt-0 md:mt-4 lg:mt-0">
            
            {/* Банери */}
            <div className="flex flex-col gap-[10px] md:gap-[5px] w-full md:w-[326px] max-w-[345px] lg:w-full">
              <Link to="/catalog?category=новинки" onClick={onClose} className="relative w-full h-[126px] rounded-[15px] overflow-hidden group block shrink-0">
                <img src="/Frame 1707481962.png" alt="Новинка" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </Link>
              <Link to="/catalog?featured=true" onClick={onClose} className="relative w-full h-[125px] rounded-[15px] overflow-hidden group block shrink-0">
                <img src="/Frame 1707481963.png" alt="Топ продажів" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </Link>
            </div>

            {/* Соц.мережі та Телефон */}
            <div className="flex flex-col items-center lg:items-end gap-[16px] md:gap-4 w-auto md:w-[326px] lg:w-full mt-[32px] md:mt-2 mb-[32px] md:mb-0 mx-auto lg:mx-0">
              <div className="flex gap-[15px] justify-center lg:justify-end">
                <a href="#" target="_blank" rel="noreferrer" className="hover:opacity-80 transition-opacity text-choco-light">
                  <InstagramSvgIcon className="w-[25px] h-[25px]" />
                </a>
                <a href="#" target="_blank" rel="noreferrer" className="hover:opacity-80 transition-opacity text-choco-light">
                  <TelegramSvgIcon className="w-[25px] h-[25px]" />
                </a>
                <a href="#" target="_blank" rel="noreferrer" className="hover:opacity-80 transition-opacity text-choco-light">
                  <FacebookSvgIcon className="w-[30px] h-[30px]" />
                </a>
              </div>
              
              <div className="flex items-center justify-center lg:justify-end gap-[10px] w-full h-[25px]">
                <PhoneIcon className="w-[25px] h-[25px] shrink-0 text-choco-light" />
                <a href="tel:+380999876240" className="font-montserrat font-normal text-[16px] xl:text-[18px] leading-[20px] text-choco-light hover:text-choco-dark transition-colors whitespace-nowrap">
                  +38(099) 987 62 40
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderMenu;