import { Link } from 'react-router-dom';

export default function PromoBanner() {
  return (
    <section className="relative w-full overflow-hidden flex flex-col justify-center shrink-0 min-h-[400px] sm:min-h-[480px] mt-[50px] md:mt-[64px]">
      {/* Фоновые изображения */}
      <div className="absolute inset-0 w-full h-full z-0 block">
        {/* Мобильная версия */}
        <img 
          src="/assets/promo-banner-mobile.png" 
          alt="Цукерки Ягідна пісня" 
          className="w-full h-full object-cover block sm:hidden" 
        />
        {/* Десктопная версия */}
        <img 
          src="/assets/promo-banner-desktop.png" 
          alt="Цукерки Ягідна пісня" 
          className="w-full h-full object-cover hidden sm:block" 
        />
      </div>

      {/* Градиентный слой из Figma */}
      <div
        className="absolute inset-0 z-0 block pointer-events-none"
        style={{
          background: "linear-gradient(82.14deg, rgba(43, 26, 18, 0.9) 7.4%, rgba(43, 26, 18, 0) 99.52%)",
        }}
      ></div>

      {/* Контент баннера */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] flex flex-col items-start px-4 py-16 sm:px-[60px] sm:py-[112px]">
        {/* Контейнер текста и кнопок */}
        <div className="flex flex-col items-start gap-6 max-w-full sm:max-w-[560px]">
          {/* Надзаголовок и Заголовок */}
          <div className="flex flex-col items-start gap-4 w-full">
            <span className="font-montserrat font-normal text-[16px] leading-[20px] text-white uppercase tracking-wide">НОВИНКА</span>
            <h2 className="font-cormorant font-bold text-[36px] sm:text-[48px] leading-[1.2] text-white">Спробуй першим!</h2>
          </div>

          {/* Описание */}
          <div className="flex flex-col items-start gap-2 sm:gap-4 w-full">
            <p className="font-montserrat font-light text-[16px] sm:text-[18px] leading-[1.4] text-white">
              Новий смак, нове враження, новий привід потішити себе цукерками «Ягідна пісня». Перейдіть до сторінки товару, щоб дізнатися більше або
              замовити одразу.
            </p>
            <p className="font-montserrat font-light text-[16px] sm:text-[18px] leading-[1.4] text-white">
              Відкрийте смак, який легко стане вашим фаворитом.
            </p>
          </div>

          {/* Действия (Кнопки) */}
          <div className="flex flex-row items-center pt-4 gap-4 sm:gap-6">
            {/* Ссылка "Докладніше" */}
            <Link to={`/product/69f5c91b2211dcde8e70e22a`} className="flex flex-row items-center justify-center gap-2 group">
              <span className="font-montserrat font-normal text-[16px] leading-[20px] text-white group-hover:underline underline-offset-4">
                Докладніше
              </span>

              {/* Круглая кнопка со стрелочкой (Rotate 180 or 90 to point right) */}
              <div className="flex items-center justify-center w-[35px] h-[35px] bg-creamy border border-choco-light rounded-full transition-transform duration-300 group-hover:translate-x-1">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-choco-dark rotate-[-90deg]"
                >
                  <path d="M19 9L12 15L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}