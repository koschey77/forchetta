export default function AboutSection() {
  return (
    <section className="relative w-full bg-dark-creamy flex justify-center mt-[-2px]">
      {/* Top Wave (Transition from creamy to dark-creamy) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-0">
        <svg 
          viewBox="0 0 1440 150" 
          preserveAspectRatio="none" 
          className="w-full h-[40px] md:h-[80px] lg:h-[150px] text-creamy"
        >
          <path 
            d="M0,0 L0,60 C480,20 960,150 1440,120 L1440,0 Z" 
            fill="currentColor" 
          />
        </svg>
      </div>

      {/* Bottom Wave (Transition from dark-creamy back to creamy) */}
      <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-none z-0">
        <svg 
          viewBox="0 0 1440 150" 
          preserveAspectRatio="none" 
          className="w-full h-[40px] md:h-[80px] lg:h-[150px] text-creamy"
        >
          <path 
            d="M0,150 L0,80 C480,120 960,-10 1440,30 L1440,150 Z" 
            fill="currentColor" 
          />
        </svg>
      </div>

      {/* Container_About */}
      <div className="relative z-10 w-full max-w-[1440px] px-[15px] md:px-[30px] lg:px-[60px] py-[60px] md:py-[100px] lg:py-[164px] flex flex-col md:flex-row items-center md:items-center justify-between gap-[110px] md:gap-[40px] lg:gap-[80px]">
        
        {/* Content (Text + List) */}
        <div className="flex flex-col items-center md:items-start gap-[70px] md:gap-[41px] w-[343px] md:w-full md:max-w-[594px] lg:max-w-[620px] mx-auto md:mx-0">
          
          {/* Section Title */}
          <div className="flex flex-col items-center md:items-start w-full">
            <h2 className="font-cormorant font-bold text-[48px] leading-[58px] text-choco-light text-center md:text-left w-[168px] md:w-auto">
              Чому саме ми?
            </h2>
          </div>

          {/* List */}
          <div className="flex flex-col items-center md:items-start gap-[50px] w-full">
            
            {/* Item 1 */}
            <div className="flex flex-col items-center md:items-start gap-[20px] w-full">
              <h3 className="font-montserrat font-light text-[18px] md:text-[24px] leading-[22px] md:leading-[29px] text-choco-dark text-center md:text-left">
                Неповторний смак
              </h3>
              <p className="font-montserrat font-light md:font-normal text-[14px] md:text-[16px] leading-[17px] md:leading-[20px] text-choco-dark text-center md:text-left">
                Ми створюємо десерти за авторськими рецептами, де кожна деталь продумана до дрібниць.
              </p>
            </div>

            {/* Item 2 */}
            <div className="flex flex-col items-center md:items-start gap-[20px] w-full">
              <h3 className="font-montserrat font-light text-[18px] md:text-[24px] leading-[22px] md:leading-[29px] text-choco-dark text-center md:text-left">
                Зручна та естетична упаковка
              </h3>
              <p className="font-montserrat font-light md:font-normal text-[14px] md:text-[16px] leading-[17px] md:leading-[20px] text-choco-dark text-center md:text-left">
                Естетика в кожній деталі пакування Ми пропонуємо зручне та дизайнерське пакування для кожного нашого смаколика.
              </p>
            </div>

            {/* Item 3 */}
            <div className="flex flex-col items-center md:items-start gap-[20px] w-full">
              <h3 className="font-montserrat font-light text-[18px] md:text-[24px] leading-[22px] md:leading-[29px] text-choco-dark text-center md:text-left">
                Зручна вага та формат
              </h3>
              <p className="font-montserrat font-light md:font-normal text-[16px] leading-[20px] text-choco-dark text-center md:text-left md:max-w-[450px]">
                Замовляйте як невеликі десерти для себе, так і торти для особливих подій.
              </p>
            </div>

          </div>
        </div>

        {/* Image */}
        <div className="flex-none w-[343px] h-[354px] md:w-[349px] md:h-[381px] lg:w-[620px] lg:h-[640px] shrink-0 mx-auto md:mx-0">
          <img 
            src="/assets/about-girl.png" 
            alt="Співробітниця кондитерської з тортом" 
            className="w-full h-full object-cover rounded-[10px]"
            loading="lazy"
          />
        </div>

      </div>
    </section>
  );
}
