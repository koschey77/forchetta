const statsData = [
  {
    number: "10x",
    text: "Більше смаків",
    desktopOrder: "order-1",
    mobileOrder: "order-4" 
  },
  {
    number: "100%",
    text: "Ручна робота",
    desktopOrder: "order-2",
    mobileOrder: "order-1"
  },
  {
    number: "5k+",
    text: "Замовлень виконано",
    desktopOrder: "order-3",
    mobileOrder: "order-2"
  },
  {
    number: "300+",
    text: "5-зіркових відгуків",
    desktopOrder: "order-4",
    mobileOrder: "order-3"
  }
];

export default function StatsSection() {
  return (
    <section className="w-full bg-creamy mt-[50px] md:mt-[64px]">
      <div className="mx-auto w-full max-w-[1440px] px-[15px] md:px-[30px] lg:px-[60px]">
        {/* Контейнер списка */}
        <div className="grid grid-cols-2 gap-y-[18px] gap-x-[13px] md:flex md:flex-row md:flex-nowrap md:justify-between items-start w-full max-w-[343px] md:max-w-[963px] lg:max-w-[1316px] mx-auto">
          {statsData.map((stat, index) => (
            <div 
              key={index} 
              className={`flex flex-col items-center gap-[8px] w-[161px] md:w-[119px] lg:w-auto shrink-0 ${stat.mobileOrder} md:order-none mx-auto md:mx-0`}
            >
              {/* Цифра */}
              <div className="font-montserrat font-bold text-[48px] md:text-[64px] leading-[1.2] text-wine-red text-center">
                {stat.number}
              </div>
              {/* Текст */}
              <div className="font-montserrat font-medium md:font-normal text-[14px] md:text-[16px] leading-[17px] md:leading-[20px] text-choco-dark text-center">
                {stat.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
