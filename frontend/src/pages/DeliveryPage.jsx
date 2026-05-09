import { 
  AddressDeliveryIcon, 
  DeliveryFastIcon, 
  SecureIcon, 
  QualityIcon, 
  HeartIcon,
  CalendarIcon,
  ContactClockIcon
} from '../components/icons';

const DeliveryPage = () => {
  return (
    <div className="bg-creamy p-[15px] md:p-[30px] xl:p-[60px] w-full min-h-screen">
      <div className="flex flex-col max-w-[1440px] mx-auto gap-[30px] md:gap-[40px] xl:gap-[60px]">
        
        {/* Header Section */}
        <div className="flex flex-col gap-[10px] items-start">
          <h1 className="text-[24px] leading-[29px] font-montserrat font-semibold text-choco-light">
            Доставка та оплата
          </h1>
          <div className="flex flex-col items-start gap-[10px]">
            <h2 className="text-[24px] leading-[29px] font-montserrat font-light text-choco-light">
              Швидко, безпечно та з турботою про ваші солодощі
            </h2>
            <p className="text-[16px] leading-[20px] font-montserrat font-normal text-choco-light">
              Ми дбайливо пакуємо кожне замовлення, щоб ваші солодощі приїхали свіжими, красивими та вчасно.
            </p>
          </div>
        </div>

        {/* Доставка Section */}
        <div className="flex flex-col gap-[15px] md:gap-[30px]">
          <h3 className="text-2xl md:text-[32px] md:leading-[39px] font-cormorant font-semibold text-choco-dark">
            Доставка
          </h3>
          
          <div className="bg-light-creamy rounded-[10px] p-[20px] md:p-[28px_35px_38px_35px] flex flex-col md:flex-row gap-5 md:gap-[80px] items-center md:items-start shadow-none">
            {/* Left Image/Icon */}
            <div className="flex-shrink-0">
              <AddressDeliveryIcon className="w-[100px] h-[100px] md:w-[174px] md:h-[174px]" />
            </div>
            
            {/* Right Info */}
            <div className="flex flex-col w-full gap-[20px] md:gap-[60px] justify-center mt-2 md:mt-0">
              <div className="flex flex-col gap-[10px]">
                <h4 className="text-[20px] md:text-[24px] md:leading-[29px] font-montserrat font-light text-choco-light">
                  Адресна доставка
                </h4>
                <p className="text-[14px] md:text-[16px] md:leading-[20px] font-montserrat font-normal text-choco-light">
                  Доставляємо замовлення за вказаною адресою кур&apos;єром щодня.
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-[20px] md:gap-[150px] items-start md:items-center">
                <div className="flex items-center gap-[15px]">
                  <ContactClockIcon className="w-[24px] h-[24px] md:w-[30px] md:h-[30px] text-choco-dark" />
                  <div className="flex flex-col gap-[10px]">
                    <span className="text-[14px] md:text-[16px] md:leading-[20px] font-montserrat font-normal text-choco-dark">Час доставки</span>
                    <span className="text-[14px] md:text-[16px] md:leading-[20px] font-montserrat font-normal text-choco-dark">10:00 – 21:00</span>
                  </div>
                </div>

                <div className="flex items-center gap-[15px]">
                  <CalendarIcon className="w-[24px] h-[24px] md:w-[30px] md:h-[30px] text-choco-dark" />
                  <div className="flex flex-col gap-[10px]">
                    <span className="text-[14px] md:text-[16px] md:leading-[20px] font-montserrat font-normal text-choco-dark">Коли доставляємо</span>
                    <span className="text-[14px] md:text-[16px] md:leading-[20px] font-montserrat font-normal text-choco-dark">Щодня</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-[16px] md:text-[24px] md:leading-[29px] font-montserrat font-light text-choco-light">
            Оберіть бажану дату доставки та часовий проміжок при оформленні замовлення.
          </p>
        </div>

        {/* Оплата Section */}
        <div className="flex flex-col gap-[10px] md:gap-[30px]">
          <div className="flex flex-col gap-[10px]">
            <h3 className="text-[24px] md:text-[32px] md:leading-[39px] font-cormorant font-semibold text-choco-dark">
              Оплата
            </h3>
            <p className="text-[16px] md:text-[24px] md:leading-[29px] font-montserrat font-light text-choco-light">
              Оплачуйте замовлення онлайн швидко та безпечно.
            </p>
          </div>
          
          <div className="bg-light-creamy rounded-[10px] p-[20px] md:p-[60px_30px] shadow-none w-full">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-[15px] md:gap-[30px] w-full justify-items-center">
              
              {/* Visa */}
              <img src="/assets/cards/visa.png" alt="Visa" className="w-full max-w-[160px] md:max-w-[290px] h-auto object-contain" />

              {/* Mastercard */}
              <img src="/assets/cards/mastercard.png" alt="Mastercard" className="w-full max-w-[160px] md:max-w-[290px] h-auto object-contain" />

              {/* American Express */}
              <img src="/assets/cards/express.png" alt="American Express" className="w-full max-w-[160px] md:max-w-[290px] h-auto object-contain" />

              {/* Diners Club */}
              <img src="/assets/cards/club.png" alt="Diners Club International" className="w-full max-w-[160px] md:max-w-[290px] h-auto object-contain" />

            </div>
          </div>
        </div>

        {/* Footnote Benefits block */}
        <div className="bg-dark-creamy rounded-[10px] p-[30px] md:p-[40px] xl:p-[50px_40px] mt-2 md:mt-4 grid grid-cols-1 md:grid-cols-2 xl:flex xl:flex-row items-center gap-[30px] md:gap-[40px] xl:justify-between xl:gap-[30px] w-full">
          
          <div className="flex flex-row items-center gap-[20px] xl:gap-[30px] w-[280px] md:w-auto mx-auto md:mx-0">
            <SecureIcon className="w-[40px] h-[40px] xl:w-[50px] xl:h-[50px] flex-shrink-0 text-choco-light" />
            <div className="flex flex-col gap-[5px] xl:gap-[10px] max-w-[153px]">
              <span className="text-[20px] xl:text-[24px] leading-[24px] xl:leading-[29px] font-montserrat font-light text-choco-light">Безпечно</span>
              <span className="text-[14px] xl:text-[16px] leading-[18px] xl:leading-[20px] font-montserrat font-normal text-choco-light">Захищені платежі та особисті дані</span>
            </div>
          </div>

          <div className="flex flex-row items-center gap-[20px] xl:gap-[30px] w-[280px] md:w-auto mx-auto md:mx-0">
            <DeliveryFastIcon className="w-[40px] h-[40px] xl:w-[50px] xl:h-[50px] flex-shrink-0 text-choco-light" />
            <div className="flex flex-col gap-[5px] xl:gap-[10px] max-w-[218px]">
              <span className="text-[20px] xl:text-[24px] leading-[24px] xl:leading-[29px] font-montserrat font-light text-choco-light">Швидко</span>
              <span className="text-[14px] xl:text-[16px] leading-[18px] xl:leading-[20px] font-montserrat font-normal text-choco-light">Доставляємо замовлення щодня з 10:00 до 21:00</span>
            </div>
          </div>

          <div className="flex flex-row items-center gap-[20px] xl:gap-[30px] w-[280px] md:w-auto mx-auto md:mx-0">
            <HeartIcon className="w-[40px] h-[40px] xl:w-[50px] xl:h-[50px] flex-shrink-0 text-choco-light" strokeWidth={2} />
            <div className="flex flex-col gap-[5px] xl:gap-[10px] max-w-[177px]">
              <span className="text-[20px] xl:text-[24px] leading-[24px] xl:leading-[29px] font-montserrat font-light text-choco-light">З турботою</span>
              <span className="text-[14px] xl:text-[16px] leading-[18px] xl:leading-[20px] font-montserrat font-normal text-choco-light">Дбайливо пакуємо кожне замовлення</span>
            </div>
          </div>

          <div className="flex flex-row items-center gap-[20px] xl:gap-[30px] w-[280px] md:w-auto mx-auto md:mx-0">
            <QualityIcon className="w-[40px] h-[40px] xl:w-[50px] xl:h-[50px] flex-shrink-0 text-choco-light" />
            <div className="flex flex-col gap-[5px] xl:gap-[10px] max-w-[177px]">
              <span className="text-[20px] xl:text-[24px] leading-[24px] xl:leading-[29px] font-montserrat font-light text-choco-light">Якісно</span>
              <span className="text-[14px] xl:text-[16px] leading-[18px] xl:leading-[20px] font-montserrat font-normal text-choco-light">Гарантуємо свіжість та якість солодощів</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default DeliveryPage;
