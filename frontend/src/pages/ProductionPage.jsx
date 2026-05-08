import { Link } from 'react-router-dom';

const ProductionPage = () => {
  return (
    <main className="flex-grow bg-creamy relative overflow-hidden">
      <div className="w-full max-w-[1440px] px-[15px] sm:px-[30px] lg:px-[60px] mx-auto py-[20px]">
        
        <div className="flex flex-col gap-[40px] md:gap-[60px]">
          
          {/* Секція 1: Головний банер (Hero) */}
          <div className="flex flex-col items-center justify-center w-full gap-[250px] md:gap-[100px] min-h-[492px] md:min-h-[525px]">
            <h1 className="font-great-vibes font-normal text-[102px] leading-[128px] md:text-[250px] md:leading-[313px] text-choco-light text-center w-full">
              Forchetta
            </h1>
            <p className="font-great-vibes font-normal text-[20px] leading-[25px] md:text-[45px] md:leading-[56px] text-choco-light text-center w-full max-w-[1250px]">
              Ми впевнені: досконалий десерт починається не на кухні, а на фермерських плантаціях. Контроль якості в Forchetta — це безперервний ланцюг, де кожен етап є важливим.
            </p>
          </div>

          {/* Секція 2: Мапа інгредієнтів */}
          <div className="w-full flex justify-center">
            <div className="relative w-full max-w-[1182px]">
              <picture className="w-full block">
                <source media="(min-width: 768px)" srcSet="/assets/production/production-desktop.png" />
                <img 
                  src="/assets/production/production-mobile.png" 
                  alt="Мапа походження наших інгредієнтів" 
                  className="w-full h-auto object-contain"
                  loading="lazy"
                />
              </picture>
              
              {/* Надпис Еквадор */}
              <span className="absolute right-[15%] top-[26%] md:right-[5%] md:top-[40%] font-great-vibes font-normal text-[40px] leading-[50px] md:text-[50px] md:leading-[63px] text-choco-light pointer-events-none">
                Еквадор
              </span>
              
              {/* Текстовий блок: Виробництво */}
              <div className="absolute left-[15px] top-[37%] md:left-[45%] md:top-[55%] w-[calc(100%-30px)] md:w-[640px] flex flex-col gap-[10px]">
                <h2 className="font-cormorant font-normal text-[50px] leading-[61px] md:text-[100px] md:leading-[121px] text-choco-light">
                  Виробництво
                </h2>
                <p className="font-montserrat font-light text-[18px] leading-[22px] md:text-[24px] md:leading-[29px] text-choco-light">
                  <span className="font-semibold">Селекція інгредієнтів:</span> Ми не купуємо готову какао-масу. Наші спеціалісти відбирають найкращі лоти какао-бобів безпосередньо з плантацій Кот-д&apos;Івуару, Еквадору та Мадагаскару. Кожна партія проходить вхідний лабораторний контроль.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Секція 3: Серце фабрики (Workshop) - На всю ширину екрану */}
      <div className="w-full mt-[40px] md:mt-[60px] pb-[40px]">
        <div className="relative w-full">
          <picture>
            <source media="(min-width: 768px)" srcSet="/assets/production/workshop.png" />
            <img 
              src="/assets/production/workshop-mobile.png" 
              alt="Цех переробки какао-бобів" 
              className="w-full min-h-[550px] md:min-h-[850px] lg:min-h-[900px] object-cover"
              loading="lazy"
            />
          </picture>
          
          {/* Текстовий блок: Серце фабрики */}
          <div className="absolute left-[15px] top-[40px] md:left-[5%] xl:left-[140px] md:top-[10%] lg:top-[12%] w-[calc(100%-30px)] md:w-[408px] flex flex-col items-start gap-[20px] md:gap-[30px]">
            <h3 className="font-montserrat font-light md:font-semibold text-[18px] leading-[22px] md:text-[24px] md:leading-[29px] text-creamy">
              Серце фабрики - цех переробки какао-бобів
            </h3>
            
            <p className="font-montserrat font-light text-[18px] leading-[22px] md:text-[24px] md:leading-[29px] text-creamy">
              Ми одна з небагатьох фабрик, що працює за повним циклом. Саме тут народжується «душа» Forchetta.
            </p>

            <p className="font-montserrat font-light text-[18px] leading-[22px] md:text-[24px] md:leading-[29px] text-creamy">
              <span className="md:font-semibold">Унікальний купаж:</span> ми самостійно обсмажуємо, дрібнимо та коншуємо какао-боби. Це дозволяє нам створювати унікальну авторську суміш (купаж). Поєднуючи боби з різних регіонів, ми досягаємо того самого впізнаваного смаку Forchetta — балансу вершкової ніжності та інтенсивного какао.
            </p>

            <p className="font-montserrat font-light text-[18px] leading-[22px] md:text-[24px] md:leading-[29px] text-creamy">
              <span className="md:font-semibold">Відродження традицій:</span> наші технологічні карти базуються на старовинних рецептах родини Форкевичів, де пропорції шоколаду та натуральних інгредієнтів вивірені десятиліттями.
            </p>
          </div>
        </div>
      </div>

      {/* Контейнер для наступних секцій по сітці (з відступами) */}
      <div className="w-full max-w-[1440px] px-[15px] sm:px-[30px] lg:px-[60px] mx-auto flex flex-col gap-[40px] md:gap-[60px] pb-[40px] md:pb-[60px]">
        
        {/* Секція 4: Добірні горіхи (Картинка зліва) */}
        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-[20px]">
          {/* Картинка */}
          <div className="w-full md:w-[450px] lg:w-[640px] flex-none order-1">
            <img 
              src="/assets/production/nuts.png" 
              alt="Добірні горіхи"
              className="w-full h-auto object-cover rounded-none aspect-square md:aspect-auto md:h-[450px] lg:h-[642px]"
            />
          </div>

          {/* Текстовий блок */}
          <div className="w-full md:flex-1 text-choco-light font-montserrat text-[18px] leading-[22px] md:text-[24px] md:leading-[29px] order-2">
            <p className="font-light">
              <span className="font-semibold">Добірні горіхи:</span> Ми використовуємо лише цільний золотистий фундук та добірний арахіс, які проходять калібрування та делікатне обсмажування безпосередньо перед використанням. Наш авторський горіх проходить процес делікатної карамелізації за родинним методом, що зберігає його хрускіт всередині шоколаду.
            </p>
          </div>
        </div>

        {/* Секція 5: Справжня ваніль (Картинка справа) */}
        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-[20px]">
          {/* Текстовий блок - порядок змінено на мобільному */}
          <div className="w-full md:flex-1 text-choco-light font-montserrat text-[18px] leading-[22px] md:text-[24px] md:leading-[29px] order-2 md:order-1">
            <p className="font-light">
              <span className="font-semibold">Справжня ваніль:</span> Жодних синтетичних замінників. Тільки натуральна стручкова ваніль сорту Bourbon, яка надає нашим тортам та цукеркам витонченого, глибокого аромату.
            </p>
          </div>

          {/* Картинка */}
          <div className="w-full md:w-[450px] lg:w-[640px] flex-none order-1 md:order-2">
            <img 
              src="/assets/production/vanil.png" 
              alt="Справжня ваніль"
              className="w-full h-auto object-cover rounded-none aspect-square md:aspect-auto md:h-[450px] lg:h-[642px]"
            />
          </div>
        </div>

      </div>

      {/* Секція 6: Кухар (Cook) - На всю ширину екрану */}
      <div className="w-full pb-[40px] md:pb-[60px]">
        <div className="relative w-full">
          <picture>
            <source media="(min-width: 768px)" srcSet="/assets/production/cook.png" />
            <img 
              src="/assets/production/cook-mobile.png" 
              alt="Поєднання технологій та ручної праці" 
              className="w-full min-h-[600px] md:min-h-[850px] lg:min-h-[900px] object-cover"
              loading="lazy"
            />
          </picture>
          
          {/* Текстовий блок: Кухар */}
          <div className="absolute left-[15px] top-[40px] md:left-[5%] xl:left-[140px] md:top-[12%] lg:top-[15%] w-[276px] md:w-[431px] flex flex-col items-start gap-[20px] md:gap-[30px]">
            <h3 className="font-montserrat font-semibold text-[24px] leading-[29px] text-choco-light">
              Поєднання технологій та ручної праці
            </h3>
            
            <p className="font-montserrat font-light text-[18px] leading-[22px] md:text-[24px] md:leading-[29px] text-choco-light">
              На фабриці Forchetta інноваційне обладнання зустрічається з майстерністю людських рук. Наші шоколатьє та кондитери — це митці, які пройшли навчання у кращих європейських майстрів. Наші шоколатьє контролюють температуру шоколаду з точністю до градуса, щоб він мав ідеальний блиск та характерний «дзвінкий» хрускіт при розламуванні.
            </p>
          </div>
        </div>
      </div>

      {/* Контейнер для нижніх секцій по сітці */}
      <div className="w-full max-w-[1440px] px-[15px] sm:px-[30px] lg:px-[60px] mx-auto flex flex-col gap-[40px] md:gap-[60px] pb-[40px] md:pb-[60px]">
        
        {/* Секція 7: Handmade етап (Картинка справа) */}
        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-[20px]">
          {/* Текстовий блок - порядок змінено на мобільному */}
          <div className="w-full md:flex-1 text-choco-light font-montserrat text-[18px] leading-[22px] md:text-[24px] md:leading-[29px] order-2 md:order-1">
            <p className="font-light">
              <span className="font-semibold">Handmade етап:</span> найскладніші процеси — декорування мусових тістечок, ручне глазурування цукерок <Link to="/product/69f5d9ee5ae5297d0071d158" className="font-semibold underline decoration-[1px] decoration-choco-light/40 underline-offset-[5px] hover:text-wine-red hover:decoration-wine-red transition-all duration-300">Forchetta Gold</Link> та збирання шарів нашого легендарного Інжирного торта — довіряються лише теплим рукам майстрів. Це надає кожному виробу енергію домашнього затишку.
            </p>
          </div>

          {/* Картинка */}
          <div className="w-full md:w-[450px] lg:w-[640px] flex-none order-1 md:order-2">
            <img 
              src="/assets/production/handmade.png" 
              alt="Handmade етап"
              className="w-full h-auto object-cover rounded-none aspect-square md:aspect-auto md:h-[450px] lg:h-[642px]"
            />
          </div>
        </div>

      </div>

      {/* Секція 8: Свіжість продукції (На всю ширину екрану) */}
      <div className="w-full flex flex-col items-center pb-[40px] md:pb-[60px]">
        <div className="relative w-full">
          <picture>
            <source media="(min-width: 768px)" srcSet="/assets/production/fresh.png" />
            <img 
              src="/assets/production/fresh-mobile.png" 
              alt="Свіжість продукції" 
              className="w-full min-h-[800px] md:min-h-[1200px] object-cover object-top"
              loading="lazy"
            />
          </picture>
          
          {/* Текстовий блок 1 (Перший) */}
          <div className="absolute left-[15px] top-[40px] md:left-1/2 md:-translate-x-1/2 md:top-[50px] w-[calc(100%-30px)] md:w-full md:max-w-[964px] lg:max-w-[1320px] flex flex-col items-start gap-[10px] lg:gap-[20px] px-0 md:px-[30px] xl:px-0">
            <h3 className="font-montserrat font-semibold text-[20px] md:text-[18px] md:leading-[22px] lg:text-[24px] lg:leading-[29px] text-creamy">
              Свіжість продукції - наш пріоритет
            </h3>
            <p className="font-montserrat font-light md:font-semibold text-[16px] md:text-[18px] md:leading-[22px] lg:font-light lg:text-[24px] lg:leading-[29px] text-creamy">
              Торти та тістечка <span>готуються вночі</span>, щоб уже о 8:00 ранку вони чекали на вас у фірмових магазинах Києва. Ми гарантуємо ідеальну текстуру крему та пишність бісквіта, адже шлях від фабрики до вітрини займає лічені години.
            </p>
          </div>

          {/* Текстовий блок 2 (Другий) */}
          <div className="absolute left-[calc(50%-271px/2+46px)] top-[1004px] md:left-auto md:right-[15px] xl:right-[15%] md:top-[50%] w-[271px] md:w-[400px] flex flex-col items-start gap-[0px] md:gap-[10px]">
            <h3 className="font-montserrat font-semibold text-[18px] leading-[22px] md:text-[24px] md:leading-[29px] text-choco-light">
              Спеціалізований транспорт
            </h3>
            <p className="font-montserrat font-light text-[16px] leading-[20px] md:text-[18px] md:leading-[22px] text-choco-light">
              з температурним контролем працює в режимі 24/7.
            </p>
          </div>
        </div>

        {/* Текстовий блок 3 (Третій) - Під зображенням */}
        <div className="w-full max-w-[1320px] px-0 md:px-[30px] xl:px-0 mt-[20px] md:mt-[40px] flex justify-center text-center mx-auto">
          <p className="w-[343px] md:w-full font-montserrat font-light md:font-semibold text-[18px] leading-[22px] md:text-[24px] md:leading-[29px] text-[#2B1A12] md:text-choco-light">
            Київська мережа: фірмові магазини у Києві — це осередки родинного затишку Форкевичів, де кожен гість може бути впевнений у якості продукту «сьогоднішнього дня».
          </p>
        </div>
      </div>

    </main>
  );
};

export default ProductionPage;