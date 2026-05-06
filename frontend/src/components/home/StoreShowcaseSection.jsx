import { Link } from 'react-router-dom'

export default function StoreShowcaseSection() {
  return (
    <section className="w-full bg-creamy flex justify-center mt-[50px] md:mt-[64px]">
      <div className="w-full max-w-[1440px] px-[15px] md:px-[30px] lg:px-[60px] flex flex-col md:flex-row items-center gap-[50px] md:gap-[40px] lg:gap-[80px]">
        {/* Зображення */}
        <div className="w-full md:flex-1 lg:w-1/2 flex justify-center h-[472px] md:h-[700px] lg:h-[640px]">
          <picture className="w-full h-full rounded-[10px] overflow-hidden flex">
            <img 
              src="/assets/store-front.png" 
              alt="Forchetta Store" 
              className="w-full h-full object-cover rounded-[10px]"
            />
          </picture>
        </div>

        {/* Контент */}
        <div className="w-full md:flex-1 lg:w-1/2 flex flex-col items-center md:items-start gap-[50px] md:gap-[64px]">
          <div className="flex flex-col items-center md:items-start gap-[16px]">
            <p className="text-[#893E3E] text-[16px] leading-[20px] font-normal uppercase text-center md:text-left">
              Де нас знайти
            </p>
            <h2 className="text-choco-dark font-serif text-[40px] lg:text-[48px] leading-[48px] md:leading-[1.2] font-normal text-center md:text-left">
              Десерти, які краще бачити наживо
            </h2>
          </div>

          <ul className="flex flex-col gap-[24px] text-[16px] md:text-[18px] text-choco-light font-semibold w-full">
            <li className="flex items-center gap-[10px]">
              <span className="w-[5px] h-[5px] rounded-full bg-choco-light flex-shrink-0"></span>
              <span>Свіжі десерти з вітрини</span>
            </li>
            <li className="flex items-center gap-[10px]">
              <span className="w-[5px] h-[5px] rounded-full bg-choco-light flex-shrink-0"></span>
              <span>Поруч і зручний графік</span>
            </li>
            <li className="flex items-center gap-[10px]">
              <span className="w-[5px] h-[5px] rounded-full bg-choco-light flex-shrink-0"></span>
              <span>Допоможемо обрати “те саме”</span>
            </li>
            <li className="flex items-center gap-[10px]">
              <span className="w-[5px] h-[5px] rounded-full bg-choco-light flex-shrink-0"></span>
              <span>Оплата зручним способом</span>
            </li>
          </ul>
          
          <div className="pt-[16px] flex justify-center md:justify-start w-full">
            <Link 
              to="/shops" 
              className="inline-flex w-[257px] justify-center items-center bg-wine-red text-light-gray rounded-[31px] border border-choco-light font-normal text-[16px] px-[30px] py-[16px] hover:bg-[#7a3737] transition-colors"
            >
              Переглянути магазини
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
