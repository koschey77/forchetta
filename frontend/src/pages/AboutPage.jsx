import VideoPlayer from '../components/ui/VideoPlayer';

const AboutPage = () => {
  return (
    <main className="flex-grow bg-creamy relative overflow-hidden">
      <div className="w-full max-w-[1440px] px-[15px] sm:px-[30px] lg:px-[60px] mx-auto py-8 md:py-[50px]">
        
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

        </div>
      </div>
    </main>
  );
};

export default AboutPage;