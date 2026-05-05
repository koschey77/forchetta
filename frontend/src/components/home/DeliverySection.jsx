import { DeliveryIcon, PaymentIcon, PickupIcon } from '../icons'

export default function DeliverySection() {
  return (
    <section className="w-full flex justify-center mt-[50px] lg:mt-[64px]">
      <div className="w-full max-w-[1440px] px-[15px] lg:px-[64px] flex flex-col items-center gap-[50px] lg:gap-[64px]">
        {/* Заголовок */}
        <h2 className="text-choco-light lg:text-choco-dark font-serif text-[48px] leading-[58px] font-bold text-center lg:text-left w-full lg:max-w-[1312px]">
          Доставка та оплата
        </h2>

        {/* Блок з елементами */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-between w-full lg:max-w-[1264px] gap-[30px] lg:gap-0 mx-auto">
          
          {/* Оплата (Перша на десктопі, остання на мобільному) */}
          <div className="flex flex-col items-center gap-[30px] w-full lg:w-[288px] order-5 lg:order-1">
            <PaymentIcon className="w-[80px] h-[77px] text-choco-light" />
            <div className="flex flex-col items-center gap-[20px] w-full">
              <h3 className="font-montserrat font-light text-[18px] leading-[22px] text-center uppercase text-choco-light">
                Оплата
              </h3>
              <p className="font-montserrat font-light text-[18px] leading-[22px] text-center text-choco-light w-full max-w-[287px]">
                Оплата на картку або готівкою
              </p>
            </div>
          </div>

          {/* Розділювач 1 */}
          <div className="hidden lg:block w-[1px] h-[261px] bg-choco-light order-2"></div>
          <div className="block lg:hidden w-[261px] h-[1px] bg-choco-light order-2"></div>

          {/* Самовивіз (Друга на десктопі, перша на мобільному) */}
          <div className="flex flex-col items-center gap-[30px] w-full lg:w-[288px] order-1 lg:order-3">
            <PickupIcon className="w-[86px] h-[86px] text-choco-light" />
            <div className="flex flex-col items-center gap-[20px] w-full">
              <h3 className="font-montserrat font-light text-[18px] leading-[22px] text-center uppercase text-choco-light">
                Самовивіз
              </h3>
              <p className="font-montserrat font-light text-[18px] leading-[22px] text-center text-choco-light w-full max-w-[287px]">
                Самовивіз з Печерського р-ну,<br /> м. Київ
              </p>
            </div>
          </div>

          {/* Розділювач 2 */}
          <div className="hidden lg:block w-[1px] h-[261px] bg-choco-light order-4"></div>
          <div className="block lg:hidden w-[261px] h-[1px] bg-choco-light order-4"></div>

          {/* Доставка (Третя на десктопі, друга на мобільному) */}
          <div className="flex flex-col items-center gap-[39px] w-full lg:w-[288px] order-3 lg:order-5">
            <DeliveryIcon className="w-[102px] h-[70px] text-choco-light" />
            <div className="flex flex-col items-center gap-[10px] w-full">
              <h3 className="font-montserrat font-light text-[18px] leading-[22px] text-center uppercase text-choco-light">
                Доставка
              </h3>
              <p className="font-montserrat font-light text-[18px] leading-[22px] text-center text-choco-light w-full max-w-[287px]">
                Доставка на таксі (за тарифами служби таксі)
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
