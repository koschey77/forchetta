import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '../services/api';
import ProductSectionSlider from '../components/ui/carousel/ProductSectionSlider';
import { CartRemoveIcon, CartMinusIcon, CartPlusIcon } from '../components/icons';
import useCartStore from '../stores/useCartStore';

const CartPage = () => {
  const { cartItems, fetchCart, updateQuantity, removeFromCart } = useCartStore();

  // TanStack Query для получения рекомендуемых товаров (Спеціальні пропозиції)
  const { data: recommendedData } = useQuery({
    queryKey: ['recommendedProducts'],
    queryFn: () => productsAPI.getRecommendations(),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Заглушки для інших стейтів (пакування, подарункові пакети)
  // ...
  const [selectedPackagings, setSelectedPackagings] = useState({ 1: false, 2: false }); // Стан для обох пакетів
  const [packagingCounts, setPackagingCounts] = useState({ 1: 1, 2: 1 });
  const [unselectedItems, setUnselectedItems] = useState([]); // ID товарів, з яких зняли галочку

  const handlePackagingQuantity = (id, delta) => {
    setPackagingCounts(prev => ({
      ...prev,
      [id]: Math.max(1, prev[id] + delta)
    }));
    // Якщо натискаємо +/-, автоматично вибираємо цей пакет
    setSelectedPackagings(prev => ({ ...prev, [id]: true }));
  };

  const togglePackaging = (id) => {
    setSelectedPackagings(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleItemSelection = (pid) => {
    setUnselectedItems(prev => 
      prev.includes(pid) ? prev.filter(id => id !== pid) : [...prev, pid]
    );
  };
  
  const subtotal = cartItems.reduce((acc, item) => {
    const product = item.product || {};
    const pid = product._id || product.id;
    if (unselectedItems.includes(pid)) return acc; // Пропускаем необрані товари
    
    const priceToUse = product.discountPrice > 0 ? product.discountPrice : (product.price || 0);
    return acc + (priceToUse * item.quantity);
  }, 0);
  
  const packagingPrice = 
    (selectedPackagings[1] ? 10 * packagingCounts[1] : 0) + 
    (selectedPackagings[2] ? 15 * packagingCounts[2] : 0);
  const defaultDeliveryFreeAmount = 800;
  const remainingForFreeDelivery = Math.max(0, defaultDeliveryFreeAmount - subtotal);
  const totalPrice = subtotal + packagingPrice;

  return (
    <div className="min-h-screen bg-creamy font-sans relative pb-[50px] xl:pb-[100px]">
      <div className="px-[16px] lg:px-[30px] xl:px-[60px] max-w-[1440px] mx-auto">
        <h1 className="font-serif text-[32px] lg:text-[40px] xl:text-figma-hero font-semibold text-choco-light mb-[10px] lg:mb-[10px] xl:mb-[20px] text-center lg:text-left xl:text-left mt-2 lg:mt-4">
          Мій кошик
        </h1>

        <div className="flex flex-col lg:flex-row justify-between gap-[40px] lg:gap-[20px] xl:gap-[133px]">
          
          {/* ЛІВА КОЛОНКА: ТОВАРИ */}
          <div className="flex flex-col w-full lg:w-[595px] xl:w-[760px] gap-[20px] lg:gap-[50px] xl:gap-[46px]">
            
            {cartItems.map((item, index) => {
              const product = item.product || {};
              const pid = product._id || product.id || index;
              
              const currentItemPrice = product.discountPrice > 0 ? product.discountPrice : (product.price || 0);
              const oldItemPrice = product.discountPrice > 0 ? product.price : (product.oldPrice || null);
              const discountPercent = product.discountPrice > 0 ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
              const isSelected = !unselectedItems.includes(pid);

              return (
              <div key={pid} className={`box-border flex flex-row lg:flex-col justify-start lg:justify-center items-center lg:items-start p-[12px_16px_20px_14px] lg:p-[12px_16px_20px_14px] xl:p-[20px] gap-[25px] lg:gap-[10px] xl:gap-[14px] w-full lg:w-[595px] lg:h-[233.27px] xl:w-[758px] xl:h-[291.85px] border border-choco-light rounded-[15px] xl:rounded-[20px] relative transition-colors ${isSelected ? 'bg-[#F5EEE0] lg:bg-[#F5EEE0] xl:bg-transparent' : 'opacity-60 bg-transparent'} hover:border-choco-light/50`}>
                
                {/* Чекбокс МОБІЛЬНИЙ */}
                <button 
                  onClick={() => toggleItemSelection(pid)}
                  className={`flex lg:hidden flex-shrink-0 items-center justify-center p-[5px] w-[30px] h-[30px] rounded-[15px] transition-colors ${isSelected ? 'bg-[#893E3E] text-[#F5F7F8] border-none' : 'border-[0.5px] border-[rgba(59,59,59,0.85)] text-black bg-transparent hover:bg-black/5'}`}
                >
                  {isSelected ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10.5L8 14.5L16 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.25 5.25V0H6.75V5.25H12V6.75H6.75V12H5.25V6.75H0V5.25H5.25Z" fill="currentColor" />
                    </svg>
                  )}
                </button>

                {/* Основний контейнер контенту (Мобілка: справа від чекбокса, Планшет/Десктоп: на всю ширину) */}
                <div className="flex flex-col items-start gap-[10px] lg:gap-0 xl:gap-0 w-[258px] lg:w-full lg:h-full">

                  {/* ТОП-БАР (Знижка + дата + кнопка видалення) */}
                  <div className="flex flex-row justify-between items-center w-[258px] lg:w-[510px] xl:pl-[53px] xl:w-[718px] lg:mx-auto xl:mx-0 mb-[10px]">
                    
                    {/* Ліва частина: знижка + дата */}
                    <div className="flex flex-row justify-between items-center w-[133px] h-[21px] gap-[52px]">
                      {discountPercent > 0 ? (
                        <div className="flex flex-row justify-center items-center p-[2px_10px] gap-[10px] mx-auto lg:mx-0 w-[59px] h-[21px] bg-[#893E3E] rounded-[10.5px]">
                          <span className="font-sans font-light text-[14px] leading-[17px] text-center text-[#E3D6BF] w-[33px] h-[17px]">
                            -{discountPercent}%
                          </span>
                        </div>
                      ) : product.discount ? (
                        <div className="flex flex-row justify-center items-center px-[10px] py-[2px] gap-[10px] w-[59px] h-[21px] bg-[#893E3E] rounded-[10.5px]">
                          <span className="font-sans font-light text-[14px] leading-[17px] text-[#E3D6BF]">{product.discount}</span>
                        </div>
                      ) : (
                        <div className="w-[59px] h-[21px]"></div>
                      )}
                      {product.date && (
                        <span className="font-sans font-light text-[12px] leading-[15px] text-[#705A5A] hidden xl:block w-[67px] h-[15px]">
                          {product.date}
                        </span>
                      )}
                    </div>

                    {/* Кнопка видалення */}
                    <button 
                      onClick={() => removeFromCart(pid)}
                      className="flex justify-center items-center w-[20.4px] h-[20.4px] text-[#705A5A] hover:text-[#893E3E] transition-colors relative"
                    >
                      {/* Хрестик з ліній для 1-в-1 збігу */}
                      <div className="absolute w-[18.4px] h-[0px] border-2 border-current -rotate-45 transition-colors"></div>
                      <div className="absolute w-[18.4px] h-[0px] border-2 border-current -rotate-[135deg] transition-colors"></div>
                      <CartRemoveIcon className="w-[16px] h-[16px] xl:w-[20.4px] xl:h-[20.4px] absolute opacity-0" />
                    </button>
                  </div>

                  {/* ОСНОВНИЙ КОНТЕНТ ТОВАРУ */}
                  <div className="flex flex-col lg:flex-row items-start lg:items-center xl:items-center gap-[0] lg:gap-[20px] xl:gap-[20px] w-[258px] lg:w-[510px] lg:h-[162.42px] xl:w-[718px] xl:h-[209px] lg:mx-auto xl:mx-0">
                    
                    {/* Мобільний Рядок Фото+Інфо / Планшетно-Десктопна Ліва Колонка */}
                    <div className="flex flex-col lg:flex-col xl:flex-col justify-between lg:justify-center items-start lg:items-center xl:items-end w-[258px] lg:w-[157px] lg:h-[162.42px] xl:w-[204px] xl:h-[209px] gap-[10px] lg:gap-[15px] xl:gap-[10px]">
                      
                      {/* Контейнер Картинки (і чекбокса на десктопі/планшеті) */}
                      <div className="flex flex-row items-center gap-[23px] w-full xl:w-[204px] lg:justify-center xl:justify-center">
                        {/* Чекбокс ДЕСКТОП/ПЛАНШЕТ */}
                        <button 
                          onClick={() => toggleItemSelection(pid)}
                          className={`hidden lg:flex flex-shrink-0 items-center justify-center p-[5px] w-[30px] h-[30px] rounded-[15px] transition-colors ${isSelected ? 'bg-[#893E3E] text-[#F5F7F8] border-none' : 'border-[0.5px] border-[rgba(59,59,59,0.85)] text-black bg-transparent hover:bg-black/5'}`}
                        >
                          {isSelected ? (
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10.5L8 14.5L16 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          ) : (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5.25 5.25V0H6.75V5.25H12V6.75H6.75V12H5.25V6.75H0V5.25H5.25Z" fill="currentColor" />
                            </svg>
                          )}
                        </button>

                        {/* Мобільний Рядок: Назва + Вага (зліва від картинки) */}
                        <div className="flex flex-row lg:hidden justify-between items-start w-[258px] h-[89px] gap-[33px]">
                          {/* Зображення */}
                          <div className="w-[119px] h-[89px] bg-white rounded-[10px] flex-shrink-0 overflow-hidden mx-auto lg:mx-0">
                            <img src={product.images?.[0]?.url || product.img || '/placeholder.png'} alt={product.name} className="w-full h-full object-cover" />
                          </div>

                          {/* МОБІЛЬНА ІНФО (Назва + Вага) */}
                          <div className="flex flex-col items-start w-[123px] h-[59px] gap-[10px] mx-auto">
                            <h3 className="font-sans font-medium text-[14px] leading-[17px] text-[#705A5A] w-[123px] h-[34px] line-clamp-2">
                              {product.name}
                            </h3>
                            <div className="flex flex-row justify-between items-center w-[123px] h-[15px] gap-[58px]">
                              <span className="font-sans font-light text-[12px] leading-[15px] text-[#705A5A] w-[48px] h-[15px]">Вага:</span>
                              <span className="font-sans font-light text-[12px] leading-[15px] text-[#705A5A] w-[20px] h-[15px] whitespace-nowrap">{product.weight} г</span>
                            </div>
                          </div>
                        </div>

                        {/* Зображення ДЛЯ ПЛАНШЕТА/ДЕСКТОПА */}
                        <div className="hidden lg:block w-[157px] h-[117.42px] xl:w-[151px] xl:h-[136px] bg-white rounded-[10px] flex-shrink-0 overflow-hidden mx-auto lg:mx-0">
                          <img src={product.images?.[0]?.url || product.img || '/placeholder.png'} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                      </div>

                      {/* Керування кількістю (Десктоп/Планшет) */}
                      <div className="hidden lg:flex lg:flex-row xl:flex-col justify-center items-center lg:gap-[18px] xl:gap-[11px] lg:w-[157px] lg:h-[30px] xl:w-[157px] xl:h-[63px] lg:ml-[53px] xl:ml-0">
                        <div className="flex flex-row justify-center items-center gap-[18px] w-[157px] h-[30px]">
                          <button 
                            onClick={() => updateQuantity(pid, Math.max(1, item.quantity - 1))}
                            className="text-[#705A5A] hover:text-[#893E3E] w-[20px] h-[20px] flex items-center justify-center"
                          >
                            <CartMinusIcon />
                          </button>
                          <div className="box-border flex flex-row justify-center items-center w-[52px] h-[30px] border border-[#705A5A] rounded-[15.5px]">
                            <span className="font-sans font-light text-[16px] leading-[20px] text-center text-[#705A5A]">{item.quantity}</span>
                          </div>
                          <button 
                            onClick={() => updateQuantity(pid, item.quantity + 1)}
                            className="text-[#705A5A] hover:text-[#893E3E] w-[20px] h-[20px] flex items-center justify-center"
                          >
                            <CartPlusIcon />
                          </button>
                        </div>
                        <span className="font-sans font-light text-[18px] leading-[22px] text-[#705A5A] xl:block hidden">
                          Додати кількість
                        </span>
                      </div>

                    </div>

                    {/* Мобільний Рядок Ціни+Контролів / Планшетно-Десктопна Права Колонка */}
                    <div className="flex flex-col items-end lg:items-start lg:justify-between xl:justify-center w-[258px] h-[47px] lg:w-[333px] lg:h-[162px] xl:w-[243px] xl:h-[163px] gap-[0] lg:gap-[40px] xl:gap-[34px] self-stretch xl:self-auto">
                      
                      {/* Lg/Xl ІНФО (Назва + Вага) - Приховано на мобілці */}
                      <div className="hidden lg:flex flex-col justify-center items-start lg:gap-[10px] xl:gap-[14px] lg:w-[226px] lg:h-[69px] xl:w-[243px] xl:h-[75px] lg:mx-auto xl:mx-0">
                        <div className="flex flex-col items-start gap-[6px] lg:w-[226px] xl:w-[243px] lg:h-[44px] xl:h-[44px]">
                          <h3 className="font-sans font-light lg:text-[18px] xl:text-[18px] lg:leading-[22px] xl:leading-[22px] text-[#705A5A] w-full line-clamp-2">
                            {product.name}
                          </h3>
                        </div>
                        <div className="flex flex-row justify-between w-full lg:w-[209px] lg:h-[15px] gap-[58px]">
                          <span className="font-sans font-medium lg:text-[12px] xl:text-[14px] lg:leading-[15px] xl:leading-[17px] text-[#705A5A] whitespace-nowrap lg:h-[15px]">
                            {product.weight} г
                          </span>
                        </div>
                      </div>

                      {/* Controls & Price (Mobile: flex-row gap 109px | Lg/Xl: column) */}
                      <div className="flex flex-col flex-shrink-0 items-end lg:items-start w-[258px] mt-[0px] h-[47px] lg:h-[57px] xl:w-[97px] xl:h-[54px] lg:mx-auto">
                        
                        {/* Old Price */}
                        {oldItemPrice ? (
                          <span className="font-sans font-light text-[14px] lg:font-normal lg:text-[16px] xl:text-[16px] leading-[17px] lg:leading-[20px] line-through text-[#705A5A] opacity-50 lg:opacity-100 w-[258px] lg:w-[72px] lg:h-[20px] text-right lg:text-left">
                            {oldItemPrice * item.quantity} грн
                          </span>
                        ) : (
                          <span className="hidden lg:block xl:block lg:w-[72px] lg:h-[20px] xl:w-[72px] xl:h-[20px]"></span>
                        )}
                        
                        <div className="flex flex-row justify-between lg:justify-start items-center lg:items-center w-[258px] h-[30px] lg:w-full mt-[10px] lg:mt-[5px] xl:mt-[5px]">
                          
                          {/* МОБІЛЬНЕ Керування лічильником */}
                          <div className="flex flex-row lg:hidden justify-center items-center h-[30px] gap-[8px] w-[119px]">
                            <button 
                              onClick={() => updateQuantity(pid, Math.max(1, item.quantity - 1))}
                              className="text-[#705A5A] hover:text-[#893E3E] w-[20px] h-[20px] flex items-center justify-center p-0"
                            >
                              <CartMinusIcon />
                            </button>
                            <div className="box-border flex flex-row justify-center items-center w-[40px] h-[30px] border border-[#705A5A] rounded-[15.5px]">
                              <span className="font-sans font-light text-[16px] leading-[20px] text-[#705A5A] text-center">{item.quantity}</span>
                            </div>
                            <button 
                              onClick={() => updateQuantity(pid, item.quantity + 1)}
                              className="text-[#705A5A] hover:text-[#893E3E] w-[20px] h-[20px] flex items-center justify-center p-0"
                            >
                              <CartPlusIcon />
                            </button>
                          </div>

                          {/* Підсумкова ціна */}
                          <span className="font-sans font-semibold text-[18px] lg:text-[18px] xl:text-[24px] leading-[22px] lg:leading-[22px] xl:leading-[29px] text-[#705A5A] w-[68px] lg:w-[73px] lg:h-[22px] text-center lg:text-left whitespace-nowrap">
                            {currentItemPrice * item.quantity} грн
                          </span>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </div>

              </div>
            );
            })}

            {/* Плашка безкоштовної доставки */}
            <div className="box-border flex flex-col lg:flex-row justify-center items-center px-[20px] py-[15px] lg:px-[20px] lg:gap-[25px] w-full lg:w-[595px] lg:h-[99px] xl:w-full border border-choco-light rounded-[20px]">
              <div className="flex flex-row lg:justify-between items-center gap-[20px] lg:gap-[20px] xl:gap-[283px] w-full lg:w-[555px] xl:w-full text-choco-light">
                <div className="flex flex-row items-center gap-[20px] mx-auto lg:mx-0 w-full lg:w-[317px] lg:h-[44px]">
                  <span className="font-sans font-light text-[14px] lg:text-[18px] xl:text-[18px] leading-[17px] lg:leading-[22px] max-w-[200px] lg:max-w-none lg:w-[317px] text-center lg:text-left">
                    {remainingForFreeDelivery > 0 
                      ? "Для безкоштовної доставки додайте товарів на суму:" 
                      : "У вас безкоштовна доставка!"}
                  </span>
                </div>
                {remainingForFreeDelivery > 0 && (
                  <span className="font-sans font-semibold text-[18px] lg:text-[24px] xl:text-[24px] leading-[22px] lg:leading-[29px] whitespace-nowrap mx-auto lg:mx-0 lg:w-[100px]">
                    {remainingForFreeDelivery} грн
                  </span>
                )}
              </div>
            </div>
            
          </div>

          {/* ПРАВА КОЛОНКА / МОБІЛЬНИЙ НИЗ */}
          <div className="flex flex-col w-full lg:w-[349px] xl:w-[425px] lg:h-[721px] xl:h-[774.7px] gap-[40px] lg:gap-[60px] xl:gap-[115px] lg:justify-start xl:justify-center mx-auto lg:mx-0">
            
            {/* Додаткові упаковки */}
            <div className="flex flex-col gap-[20px] lg:gap-[40px] xl:gap-[40px] w-full lg:w-[349px] xl:w-[425px] lg:h-[483px] xl:h-[483px]">
              
              {/* Заголовки */}
              <div className="flex flex-col items-center gap-[10px] lg:gap-[40px] xl:gap-[40px] w-full lg:w-[349px] xl:w-[425px] lg:h-[91px] xl:h-[91px]">
                <h2 className="font-sans font-semibold text-[18px] lg:text-[24px] xl:text-[24px] leading-[22px] lg:leading-[29px] xl:leading-[29px] text-center text-choco-light">
                  Додати до замовлення:
                </h2>
                <p className="font-sans font-light text-[14px] lg:text-[18px] xl:text-[18px] leading-[17px] lg:leading-[22px] xl:leading-[22px] text-center text-choco-light hidden lg:block xl:block w-full lg:w-[228px] xl:w-[228px] lg:h-[22px] xl:h-[22px]">
                  Подарункове пакування
                </p>
              </div>
              
              {/* Список упаковок */}
              <div className="flex flex-col gap-[20px] lg:gap-[20px] w-full lg:w-[349px] xl:w-[425px] lg:h-[352px] xl:h-[352px] lg:items-center xl:px-[42px] xl:items-center">
                
                {/* Пакет 1 */}
                <div className="flex flex-row justify-center items-center gap-[15px] lg:gap-[16px] xl:gap-[16px] w-full lg:w-[349px] xl:w-[341px] lg:h-[166px] xl:h-[166px]">
                  {/* Кнопка вибору */}
                  <button 
                    onClick={() => togglePackaging(1)}
                    className={`flex-shrink-0 box-border flex justify-center items-center w-[30px] h-[30px] lg:w-[30px] lg:h-[30px] xl:w-[39px] xl:h-[39px] rounded-[56px] transition-colors relative pointer-events-auto ${selectedPackagings[1] ? 'bg-wine-red text-[#F5F7F8] border-none hover:opacity-90' : 'border-[0.5px] border-[rgba(59,59,59,0.85)] text-black hover:bg-black/5'}`}
                  >
                    {selectedPackagings[1] ? (
                      <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 5L5 9L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.25 5.25V0H6.75V5.25H12V6.75H6.75V12H5.25V6.75H0V5.25H5.25Z" fill="currentColor" />
                      </svg>
                    )}
                  </button>
                  
                  {/* Права частина пакета */}
                  <div className="flex flex-col justify-center items-start gap-[10px] w-full lg:w-[284px] xl:w-[284px] lg:h-[166px] xl:h-[166px]">
                    <div className="flex flex-row items-start gap-[10px] w-full lg:w-[264px] xl:w-[283px] lg:h-[125px] xl:h-[125px]">
                      <div className="flex flex-col justify-center items-center w-[80px] h-[80px] lg:w-[140px] lg:h-[125px] xl:w-[160px] xl:h-[142px] mt-[-10px] lg:mt-0 xl:mt-0 xl:gap-[10px] bg-transparent flex-shrink-0">
                         <div className="w-full h-full lg:w-[140px] xl:w-[140px] lg:h-[125px] xl:h-[125px] bg-[#EBEBEB] rounded-[10px]" style={{backgroundImage: "url(/packet02.png)", backgroundSize: "cover", backgroundPosition: "center"}}></div>
                      </div>
                      <span className="font-sans font-light text-[14px] leading-[17px] text-choco-light w-[112px] lg:h-[34px] xl:h-[34px] mt-[10px] lg:mt-0 xl:mt-0">
                        Паперовий пакет
                      </span>
                    </div>

                    <div className="flex flex-row items-center gap-[20px] lg:gap-[39px] xl:gap-[63px] w-full lg:w-[262px] xl:w-[283px] lg:h-[31px] xl:h-[31px]">
                      <div className="flex flex-row justify-between items-center w-[120px] lg:w-[162px] xl:w-[162px] h-[31px]">
                        <button 
                          onClick={() => handlePackagingQuantity(1, -1)}
                          className="w-[24px] h-[24px] lg:w-[24px] lg:h-[24px] flex items-center justify-center text-choco-light hover:text-wine-red"
                        >
                          <svg width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 0H12V2H0V0Z" fill="currentColor"/></svg>
                        </button>
                        <div className="box-border flex justify-center items-center w-[50px] lg:w-[61px] xl:w-[61px] h-[31px] lg:h-[31px] border border-choco-light rounded-[15.5px] px-[5px] lg:px-[30px] xl:px-[30px]">
                          <span className="font-sans font-light text-[16px] lg:text-[16px] leading-[20px] lg:leading-[20px] text-center text-choco-light">{packagingCounts[1]}</span>
                        </div>
                        <button 
                          onClick={() => handlePackagingQuantity(1, 1)}
                          className="w-[24px] h-[24px] lg:w-[24px] lg:h-[24px] flex items-center justify-center text-choco-light hover:text-wine-red"
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.25 5.25V0H6.75V5.25H12V6.75H6.75V12H5.25V6.75H0V5.25H5.25Z" fill="currentColor" /></svg>
                        </button>
                      </div>
                      <span className="font-sans font-semibold text-[16px] lg:text-[18px] xl:text-[18px] leading-[20px] lg:leading-[22px] xl:leading-[22px] text-center text-choco-light lg:w-[58px] xl:w-[58px] lg:h-[22px] xl:h-[22px]">
                        {10 * packagingCounts[1]} грн
                      </span>
                    </div>
                  </div>
                </div>

                {/* Пакет 2 */}
                <div className="flex flex-row justify-center items-center gap-[15px] lg:gap-[16px] xl:gap-[16px] w-full lg:w-[349px] xl:w-[341px] lg:h-[166px] xl:h-[166px]">
                  {/* Кнопка вибору */}
                  <button 
                    onClick={() => togglePackaging(2)}
                    className={`flex-shrink-0 flex justify-center items-center w-[30px] h-[30px] lg:w-[30px] lg:h-[30px] xl:w-[39px] xl:h-[39px] rounded-[56px] transition-colors relative pointer-events-auto ${selectedPackagings[2] ? 'bg-wine-red text-[#F5F7F8] border-none hover:opacity-90' : 'border-[0.5px] border-[rgba(59,59,59,0.85)] text-black hover:bg-black/5'}`}
                  >
                    {selectedPackagings[2] ? (
                      <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 5L5 9L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.25 5.25V0H6.75V5.25H12V6.75H6.75V12H5.25V6.75H0V5.25H5.25Z" fill="currentColor" />
                      </svg>
                    )}
                  </button>
                  
                  {/* Права частина пакета */}
                  <div className="flex flex-col justify-center items-start gap-[10px] lg:gap-[10px] w-full lg:w-[284px] xl:w-[284px] lg:h-[166px] xl:h-[166px]">
                    <div className="flex flex-row items-start gap-[10px] lg:gap-[10px] w-full lg:w-[264px] xl:w-[284px] lg:h-[125px] xl:h-[125px]">
                      <div className="flex flex-col justify-center items-center w-[80px] h-[80px] lg:w-[140px] lg:h-[125px] xl:w-[160px] xl:h-[142px] mt-[-10px] lg:mt-0 xl:mt-0 xl:gap-[10px] bg-transparent flex-shrink-0">
                        <div className="w-full h-full lg:w-[140px] xl:w-[140px] lg:h-[125px] xl:h-[125px] bg-[#3B2929] rounded-[10px]" style={{backgroundImage: "url(/packet01.png)", backgroundSize: "cover", backgroundPosition: "center"}}></div>
                      </div>
                      <span className="font-sans font-light text-[14px] lg:text-[14px] leading-[17px] text-choco-light w-[114px] lg:w-[114px] lg:h-[34px] xl:h-[34px] mt-[10px] lg:mt-0 xl:mt-0">
                        Подарунковий пакет
                      </span>
                    </div>

                    <div className="flex flex-row items-center gap-[20px] lg:gap-[39px] xl:gap-[64px] w-full lg:w-[264px] xl:w-[283px] lg:h-[31px] xl:h-[31px]">
                      <div className="flex flex-row justify-between items-center w-[120px] lg:w-[162px] xl:w-[162px] h-[31px] lg:h-[31px]">
                        <button 
                          onClick={() => handlePackagingQuantity(2, -1)}
                          className="w-[24px] h-[24px] lg:w-[24px] lg:h-[24px] flex items-center justify-center text-choco-light hover:text-wine-red"
                        >
                          <svg width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 0H12V2H0V0Z" fill="currentColor"/></svg>
                        </button>
                        <div className="box-border flex justify-center items-center w-[50px] lg:w-[61px] xl:w-[61px] h-[31px] lg:h-[31px] border border-choco-light rounded-[15.5px] px-[5px] lg:px-[30px] xl:px-[30px]">
                          <span className="font-sans font-light text-[16px] lg:text-[16px] leading-[20px] lg:leading-[20px] text-center text-choco-light">{packagingCounts[2]}</span>
                        </div>
                        <button 
                          onClick={() => handlePackagingQuantity(2, 1)}
                          className="w-[24px] h-[24px] lg:w-[24px] lg:h-[24px] flex items-center justify-center text-choco-light hover:text-wine-red"
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.25 5.25V0H6.75V5.25H12V6.75H6.75V12H5.25V6.75H0V5.25H5.25Z" fill="currentColor" /></svg>
                        </button>
                      </div>
                      <span className="font-sans font-semibold text-[16px] lg:text-[18px] xl:text-[18px] leading-[20px] lg:leading-[22px] xl:leading-[22px] text-center text-choco-light lg:w-[57px] xl:w-[57px] lg:h-[22px] xl:h-[22px]">
                        {15 * packagingCounts[2]} грн
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Картка оформлення замовлення */}
            <div className="w-full mt-4 lg:mt-0">
              <div className="bg-dark-creamy lg:bg-transparent xl:bg-transparent rounded-[10px] lg:rounded-none xl:rounded-none p-[25px_15px_20px] lg:p-[0px_42px] xl:p-[0px_42px] flex flex-col gap-[20px] lg:gap-[16px] xl:gap-[25px] mx-auto shadow-lg lg:shadow-none xl:shadow-none w-full lg:w-[349px] lg:h-[151px] xl:w-[425px] xl:h-[164px] lg:items-center xl:items-center">
                
                <div className="flex flex-row justify-between items-center w-full lg:w-[349px] xl:w-[341px] lg:h-[39px] xl:h-[39px]">
                  <span className="font-sans font-semibold text-[18px] lg:text-[24px] xl:text-[24px] leading-[22px] lg:leading-[29px] xl:leading-[29px] text-[#705A5A] whitespace-nowrap">
                    До сплати
                  </span>
                  <span className="font-sans font-semibold text-[22px] lg:text-[32px] xl:text-[32px] leading-[27px] lg:leading-[39px] xl:leading-[39px] text-[#705A5A] whitespace-nowrap text-right">
                    {totalPrice} грн
                  </span>
                </div>

                <div className="flex flex-col items-center gap-[10px] lg:gap-[20px] xl:gap-[20px] w-full lg:w-[349px] xl:w-[341px] lg:h-[100px] xl:h-[100px]">
                  <Link 
                    to="/checkout" 
                    state={{ unselectedItems, selectedPackagings, packagingCounts }}
                    className="flex flex-col items-center justify-center p-[9px_10px] gap-[10px] w-full lg:w-[349px] xl:w-[341px] lg:h-[40px] xl:h-[40px] bg-[#893E3E] rounded-[50px] font-sans font-semibold text-[14px] lg:text-[16px] xl:text-[18px] lg:leading-[20px] xl:leading-[22px] text-center text-[#F5EEE0] hover:opacity-90 transition-opacity"
                  >
                    Оформити
                  </Link>
                  <Link to="/catalog" className="box-border flex flex-row justify-center items-center p-[5px_20px] lg:p-[5px_40px] xl:p-[5px_40px] gap-[10px] w-full lg:w-[349px] xl:w-[341px] h-[40px] lg:h-[40px] xl:h-[40px] border border-[#893E3E] rounded-[50px] font-sans font-normal text-[14px] lg:text-[16px] xl:text-[16px] leading-[20px] text-center text-[#893E3E] hover:bg-[#893E3E] hover:text-white transition-colors group">
                    <svg width="20" height="17" viewBox="0 0 20 17" fill="none" className="-rotate-90 group-hover:text-white text-[#893E3E]">
                      <path d="M15.8333 8.5L9.99998 14.3333L4.16665 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Повернутися до покупок
                  </Link>
                </div>

              </div>
            </div>

          </div>

        </div>

        {/* Рекомендовані товари (Спеціальні пропозиції) */}
        {recommendedData && recommendedData.length > 0 && (
          <div className="md:mb-[10px] w-full mt-2 md:mt-2 overflow-hidden">
            <ProductSectionSlider 
              title="Спеціальні пропозиції"
              products={recommendedData}
              linkUrl="/catalog?sortOption=salesCount-desc"
              className="mt-2 md:mt-3"
              compact={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;