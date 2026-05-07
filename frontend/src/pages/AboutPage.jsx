import VideoPlayer from '../components/ui/VideoPlayer';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <main className="flex-grow bg-creamy relative overflow-hidden">
      <div className="w-full max-w-[1440px] px-[15px] sm:px-[30px] lg:px-[60px] mx-auto py-[20px]">
        
        {/* Секції будуть додаватися сюди */}
        <div className="flex flex-col gap-[40px] md:gap-[60px]">
          
          {/* Секція 1: Головний текстовий банер (Hero) */}
          <div className="flex flex-col items-center justify-center w-full gap-[210px] md:gap-[100px] min-h-[433px] md:min-h-[525px]">
            <h1 className="font-great-vibes font-normal text-[102px] leading-[128px] md:text-[250px] md:leading-[313px] text-choco-light text-center w-full">
              Forchetta
            </h1>
            <p className="font-great-vibes font-normal text-[20px] leading-[25px] md:text-[45px] md:leading-[56px] text-choco-light text-center w-full max-w-[1320px]">
              Фабрика «Forchetta» — кондитерська фабрика, де пристрасть до солодощів перетворюється на бездоганний смак.
            </p>
          </div>

          {/* Секція 2: Наші цінності + Відео */}
          <div className="flex flex-col items-center w-full gap-[30px] md:gap-[50px]">
            {/* Текстовий блок */}
            <div className="flex flex-col items-center justify-center w-full gap-[10px] max-w-[1440px]">
              <div className="w-full text-choco-light font-montserrat text-[18px] leading-[22px] md:text-[24px] md:leading-[29px]">
                <p className="font-semibold mb-4">Наші цінності прості:</p>
                <p className="font-light">
                  Натуральність у кожному інгредієнті<br />
                  Ми віримо, що досконалий смак починається з якісних інгредієнтів. Тому в основі наших виробів — лише інгредієнти найвищого ґатунку: відбірні какао-боби, натуральні вершки, свіжі ягоди та хрусткі горіхи.
                </p>
              </div>
            </div>

            {/* Відеоплеєр з бобами */}
            <div className="relative flex justify-center items-center w-[350px] md:w-[530px]">
              
              {/* Какао-боби (спільне зображення поверх відео) */}
              <img 
                src="/assets/about/cacao-beans.png" 
                alt="Какао боби"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-[500px] md:min-w-[800px] z-10 pointer-events-none opacity-80"
              />

              <VideoPlayer 
                videoUrl="https://res.cloudinary.com/dmdlogqqf/video/upload/v1778152256/1-Video_Chocolate_Fin_kly5r4.mp4"
                posterUrl="https://res.cloudinary.com/dmdlogqqf/video/upload/v1778152256/1-Video_Chocolate_Fin_kly5r4.jpg"
                className="w-full h-[350px] md:h-[530px] !aspect-square rounded-none relative z-0"
              />
            </div>
          </div>

          {/* Секція 3: Естетика пакування */}
          <div className="flex flex-col items-start w-full gap-[30px] md:gap-[64px] max-w-[1440px]">
            {/* Текстовий блок */}
            <div className="w-full text-choco-light font-montserrat text-[18px] leading-[22px] md:text-[24px] md:leading-[29px]">
              <p className="font-semibold mb-2 lg:mb-4">Естетика в кожній деталі пакування</p>
              <p className="font-light">
                Ми пропонуємо зручне та дизайнерське пакування для кожного нашого смаколика,
                щоб покупець відчув атмосферу свята та естетичну насолоду ще до першого шматочка, адже знайомство з десертом починається з погляду на коробку та дотику до стрічки
              </p>
            </div>

            {/* Картинки (Десктоп і Мобайл версії перемикаються класами) */}
            <div className="w-full relative flex justify-center md:justify-start">
              {/* Для десктопу / планшету */}
              <img 
                src="/assets/about/box-desktop.png" 
                alt="Дизайнерське пакування Forchetta"
                className="hidden md:block w-auto max-w-full h-auto object-contain"
              />
              {/* Для мобільної версії */}
              <img 
                src="/assets/about/box-mobile.png" 
                alt="Дизайнерське пакування Forchetta"
                className="block md:hidden w-full h-auto object-contain"
              />
            </div>
          </div>

          {/* Секція 4: Любов в кожну плитку + Відео на всю ширину */}
          <div className="flex flex-col items-start w-full gap-[30px] md:gap-[50px] max-w-[1440px]">
            {/* Текстовий блок */}
            <div className="w-full text-choco-light font-montserrat text-[18px] leading-[22px] md:text-[24px] md:leading-[29px]">
              <p className="font-semibold mb-2 lg:mb-4">Любов, яку ми вкладаємо в кожну плитку</p>
              <p className="font-light">
                Наші шоколатьє — справжні архітектори смаку. Завдяки їхньому досвіду та пристрасті до справи, наші цукерки та шоколадні плитки мають той самий ідеальний хрускіт і насичений аромат.
              </p>
            </div>

            {/* Повноекранне відео */}
            <div className="w-full">
              <VideoPlayer 
                videoUrl="https://res.cloudinary.com/dmdlogqqf/video/upload/v1778152243/2-Video_Chocolate_Pr_mgx8hg.mp4"
                posterUrl="https://res.cloudinary.com/dmdlogqqf/video/upload/v1778152243/2-Video_Chocolate_Pr_mgx8hg.jpg"
                className="w-full h-[450px] md:h-auto !aspect-auto md:!aspect-video rounded-none [&>video]:object-cover"
              />
            </div>
          </div>

          {/* Секція 5: Дизайн як натхнення */}
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-[20px] max-w-[1440px]">
            {/* Текстовий блок - порядок змінено на мобільному */}
            <div className="w-full md:flex-1 text-choco-light font-montserrat text-[18px] leading-[22px] md:text-[24px] md:leading-[29px] order-2 md:order-1">
              <p className="font-semibold mb-2 lg:mb-4">Дизайн як натхнення</p>
              <p className="font-light">
                Ми створюємо не просто торти, а візуальну насолоду. Кожне тістечко — це витвір кондитерського мистецтва, що стане окрасою вашого свята.
              </p>
            </div>

            {/* Картинка */}
            <div className="w-full md:w-[450px] lg:w-[640px] flex-none order-1 md:order-2">
              <img 
                src="/assets/about/design.png" 
                alt="Дизайн як натхнення"
                className="w-full h-auto object-cover rounded-none aspect-square md:aspect-auto md:h-[450px] lg:h-[642px]"
              />
            </div>
          </div>

          {/* Секція 6: Гарантована свіжість */}
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-[20px] max-w-[1440px]">
            {/* Картинка */}
            <div className="w-full md:w-[450px] lg:w-[640px] flex-none order-1">
              <img 
                src="/assets/about/fresh.png" 
                alt="Гарантована свіжість"
                className="w-full h-auto object-cover rounded-none aspect-square md:aspect-auto md:h-[450px] lg:h-[642px]"
              />
            </div>

            {/* Текстовий блок */}
            <div className="w-full md:flex-1 text-choco-light font-montserrat text-[18px] leading-[22px] md:text-[24px] md:leading-[29px] order-2">
              <p className="font-semibold mb-2 lg:mb-4">Гарантована свіжість</p>
              <p className="font-light">
                Ми не довіряємо доставку стороннім сервісам. Завдяки власній логістиці продукція потрапляє у наші фірмові магазини максимально оперативно, щоб ви насолоджувалися десертами, створеними «тільки-но сьогодні».
              </p>
            </div>
          </div>

          {/* Секція 7: Наша фірмова продукція */}
          <div className="relative w-[calc(100%+30px)] sm:w-[calc(100%+60px)] lg:w-[calc(100%+120px)] -ml-[15px] sm:-ml-[30px] lg:-ml-[60px] flex flex-col justify-end px-[15px] pb-[40px] md:px-[60px] md:pb-[60px] min-h-[890px] md:min-h-[1360px]">
            {/* Фонове зображення (Десктоп) */}
            <img 
              src="/assets/about/choco.png" 
              alt="Наша фірмова продукція"
              className="absolute inset-0 w-full h-full object-cover hidden md:block z-0"
            />
            {/* Фонове зображення (Мобайл) */}
            <img 
              src="/assets/about/choco-mobile.png" 
              alt="Наша фірмова продукція"
              className="absolute inset-0 w-full h-full object-cover block md:hidden z-0"
            />
            
            {/* Градієнтний оверлей */}
            <div 
              className="absolute inset-0 z-10"
              style={{
                background: 'linear-gradient(180deg, #F5EEE0 7.73%, rgba(245, 238, 224, 0) 31.64%, rgba(43, 26, 18, 0) 63.76%, #1F110B 86.72%)'
              }}
            ></div>

            {/* Текст */}
            <div className="relative z-20 w-full md:w-[750px] font-montserrat text-[18px] leading-[22px] md:text-[24px] md:leading-[29px] text-[#F5EEE0]">
              <p className="font-semibold mb-2 lg:mb-4">Наша фірмова продукція - смак, що запам&apos;ятовується</p>
              <p className="font-light">
                Ми пишаємося кожним нашим виробом, але є такі, в які клієнти Forchetta закохуються з першого шматочка:
              </p>
            </div>
          </div>

          {/* Секція 8: Інжирний торт (Картинка зліва) */}
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-[20px] max-w-[1440px]">
            {/* Картинка */}
            <div className="w-full md:w-[450px] lg:w-[640px] flex-none order-1">
              <img 
                src="/assets/about/cake.png" 
                alt="Фірмовий Інжирний торт Forchetta"
                className="w-full h-auto object-cover rounded-none aspect-square md:aspect-auto md:h-[450px] lg:h-[642px]"
              />
            </div>

            {/* Текстовий блок */}
            <div className="w-full md:flex-1 text-choco-light font-montserrat text-[18px] leading-[22px] md:text-[24px] md:leading-[29px] order-2">
              <p className="font-light">
                <Link to="/product/69c133bfdf6ffec91df2e695" className="font-semibold underline decoration-[1px] decoration-choco-light/40 underline-offset-[5px] hover:text-wine-red hover:decoration-wine-red transition-all duration-300">Фірмовий Інжирний торт Forchetta</Link> — наша гордість та справжній гастрономічний ексклюзив. Тонке поєднання солодкого інжиру, хрустких горіхів та ніжного шоколаду створює багатогранний смак, який неможливо забути. Це ідеальний баланс текстур та природної солодкості.
              </p>
            </div>
          </div>

          {/* Секція 9: Цукерки Forchetta Gold (Картинка справа) */}
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-[20px] max-w-[1440px]">
            {/* Текстовий блок - порядок змінено на мобільному */}
            <div className="w-full md:flex-1 text-choco-light font-montserrat text-[18px] leading-[22px] md:text-[24px] md:leading-[29px] order-2 md:order-1">
              <p className="font-light">
                <Link to="/product/69f5d9ee5ae5297d0071d158" className="font-semibold underline decoration-[1px] decoration-choco-light/40 underline-offset-[5px] hover:text-wine-red hover:decoration-wine-red transition-all duration-300">Цукерки Forchetta Gold</Link> — втілення розкоші в шоколадному мистецтві. Це добірні інгредієнти, одягнені в золотисту оболонку досконалості. Кожна цукерка — як маленький витвір мистецтва, створений для тих, хто цінує преміальну якість та вишукану подачу.
              </p>
            </div>

            {/* Картинка */}
            <div className="w-full md:w-[450px] lg:w-[640px] flex-none order-1 md:order-2">
              <img 
                src="/assets/about/candies.png" 
                alt="Цукерки Forchetta Gold"
                className="w-full h-auto object-cover rounded-none aspect-square md:aspect-auto md:h-[450px] lg:h-[642px]"
              />
            </div>
          </div>

          {/* Секція 10: Подарункові набори / Відео / Футер текст */}
          <div className="flex flex-col items-center justify-center w-full gap-[30px] md:gap-[50px] max-w-[1440px] pt-[20px] md:pt-[40px]">
            {/* Текстовий блок - Заголовок */}
            <div className="w-full text-choco-light font-montserrat text-left flex flex-col gap-2">
              <h2 className="text-[20px] leading-[24px] md:text-[24px] md:leading-[29px] font-semibold">
                Подарункові набори
              </h2>
              <p className="text-[16px] leading-[20px] md:text-[24px] md:leading-[29px] font-light">
                Ми створюємо торти, тістечка та цукерки для ваших найважливіших дат - Нового року, Дня закоханих, Великодня
              </p>
            </div>

            {/* Блок з відео */}
            <div className="w-full">
              <VideoPlayer 
                videoUrl="https://res.cloudinary.com/dmdlogqqf/video/upload/v1778152247/3-Video_Ester_wwnuqg.mp4"
                posterUrl="https://res.cloudinary.com/dmdlogqqf/video/upload/so_0,f_auto,q_auto/v1778152247/3-Video_Ester_wwnuqg.jpg" 
                className="w-full h-[450px] md:h-auto !aspect-auto md:!aspect-[1322/810] !rounded-none [&>video]:object-cover" 
              />
            </div>

            {/* Текстовий блок - Футер */}
            <div className="w-full text-center text-choco-light font-great-vibes text-[36px] leading-[44px] md:text-[45px] md:leading-[56px] pt-[20px] pb-[40px] md:pb-[60px]">
              Спробуйте наші солодощі, що надихають.<br />
              Спробуйте Forchetta!
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default AboutPage;