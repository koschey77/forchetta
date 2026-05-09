import { ContactEmailIcon, ContactPhoneIcon, ContactClockIcon, ContactLocationIcon } from '../components/icons';

const ContactsPage = () => {
  return (
    <div className="mx-auto max-w-[1440px] bg-creamy px-[15px] py-[30px] md:px-[30px] xl:px-[60px] w-full">
      <h1 className="text-3xl font-cormorant font-bold text-choco-dark mb-4 md:mb-6 xl:mb-12">Контакти</h1>
      
      <div className="flex flex-col md:flex-row justify-between gap-[30px] md:gap-5 xl:gap-5">
        
        {/* Left Column: Text & Cards */}
        <div className="flex flex-col w-full md:w-[50%] xl:w-[595px] gap-[20px] md:gap-5 xl:gap-[68px]">
          
          <p className="text-[16px] md:text-[20px] xl:text-[24px] font-montserrat font-light leading-[20px] md:leading-[26px] xl:leading-[29px] text-choco-light">
            Потрібна консультація чи хочете поділитися враженнями? Звертайтеся будь-яким зручним для вас способом:
          </p>

          <div className="grid grid-cols-2 gap-x-[12px] gap-y-[13px] md:gap-[15px] xl:gap-[20px] w-full">
            {/* Card 1: Email */}
            <div className="flex flex-col items-start bg-dark-creamy rounded-[10px] p-[10px_10px_15px_10px] md:p-[15px] xl:p-[20px] w-full gap-[5px]">
              <div className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] flex items-center justify-center">
                <ContactEmailIcon />
              </div>
              <div className="flex flex-col">
                <span className="font-montserrat font-medium text-[12px] md:text-[16px] xl:text-[18px] text-choco-light leading-[15px] md:leading-[20px] xl:leading-[22px]">Email:</span>
                <span className="font-montserrat font-light text-[12px] md:text-[13px] xl:text-[14px] text-choco-light leading-[15px] md:leading-[16px] xl:leading-[17px] break-all">forchetta@gmail.com</span>
              </div>
            </div>

            {/* Card 2: Гаряча лінія */}
            <div className="flex flex-col items-start bg-dark-creamy rounded-[10px] p-[10px_10px_15px_10px] md:p-[15px] xl:p-[20px] w-full gap-[5px]">
              <div className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] flex items-center justify-center">
                <ContactPhoneIcon />
              </div>
              <div className="flex flex-col">
                <span className="font-montserrat font-medium text-[12px] md:text-[16px] xl:text-[18px] text-choco-light leading-[15px] md:leading-[20px] xl:leading-[22px]">Гаряча лінія</span>
                <span className="font-montserrat font-light text-[12px] md:text-[13px] xl:text-[14px] text-choco-light leading-[15px] md:leading-[16px] xl:leading-[17px] -tracking-[0.5px] whitespace-nowrap">+38(099) 987 62 40</span>
              </div>
            </div>

            {/* Card 3: Графік роботи */}
            <div className="flex flex-col items-start bg-dark-creamy rounded-[10px] p-[10px_10px_15px_10px] md:p-[15px] xl:p-[20px] w-full gap-[5px]">
              <div className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] flex items-center justify-center">
                <ContactClockIcon />
              </div>
              <div className="flex flex-col">
                <span className="font-montserrat font-medium text-[12px] md:text-[16px] xl:text-[18px] text-choco-light leading-[15px] md:leading-[20px] xl:leading-[22px]">Графік роботи</span>
                <span className="font-montserrat font-light text-[12px] md:text-[13px] xl:text-[14px] text-choco-light leading-[15px] md:leading-[16px] xl:leading-[17px]">Пн–Пт: 09:30–18:00</span>
              </div>
            </div>

            {/* Card 4: Центральний офіс */}
            <div className="flex flex-col items-start bg-dark-creamy rounded-[10px] p-[10px_10px_15px_10px] md:p-[15px] xl:p-[20px] w-full gap-[5px]">
              <div className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] flex items-center justify-center">
                <ContactLocationIcon />
              </div>
              <div className="flex flex-col">
                <span className="font-montserrat font-medium text-[12px] md:text-[16px] xl:text-[18px] text-choco-light leading-[15px] md:leading-[20px] xl:leading-[22px]">Центральний офіс</span>
                <span className="font-montserrat font-light text-[12px] md:text-[13px] xl:text-[14px] text-choco-light leading-[15px] md:leading-[16px] xl:leading-[17px]">вул. Хрещатик 10А</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column / Bottom row on mobile: Image */}
        <div className="w-full md:w-[45%] xl:w-[640px] mt-[10px] md:mt-0 flex-shrink-0 flex">
          <picture className="w-full h-full">
            <source media="(min-width: 1280px)" srcSet="/assets/hares-desctop.png" />
            <source media="(min-width: 768px)" srcSet="/assets/hares-tablet-mobile.png" />
            <img 
              src="/assets/hares-tablet-mobile.png" 
              alt="Зайці Forchetta" 
              className="w-full h-full object-cover rounded-[10px] md:rounded-none" 
            />
          </picture>
        </div>

      </div>
    </div>
  );
};

export default ContactsPage;
