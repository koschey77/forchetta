import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useCartStore from '../stores/useCartStore';
import { useUserStore } from '../stores/useUserStore';
import { orderAPI, cartAPI } from '../services/api';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, fetchCart } = useCartStore();
  const { user } = useUserStore();

  // Отримуємо стан, переданий з CartPage
  const { unselectedItems = [], selectedPackagings = {}, packagingCounts = {} } = location.state || {};

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Фільтруємо тільки обрані товари
  const activeItems = useMemo(() => {
    return cartItems.filter(item => {
      const pid = item.product?._id || item.product?.id;
      return !unselectedItems.includes(pid);
    });
  }, [cartItems, unselectedItems]);

  // Підрахунок сум товарів
  const productsSubtotal = activeItems.reduce((acc, item) => {
    const product = item.product || {};
    const priceToUse = product.discountPrice > 0 ? product.discountPrice : (product.price || 0);
    return acc + (priceToUse * item.quantity);
  }, 0);

  // Підрахунок вартості пакування
  const packagingPrice = 
    (selectedPackagings[1] ? 10 * (packagingCounts[1] || 1) : 0) + 
    (selectedPackagings[2] ? 15 * (packagingCounts[2] || 1) : 0);

  const subtotal = productsSubtotal + packagingPrice;

  // Логіка бонусів
  const userBonuses = user?.bonusPoints || 0;
  const [bonusInput, setBonusInput] = useState('');
  const [appliedBonuses, setAppliedBonuses] = useState(0);

  const handleApplyBonus = () => {
    const requestedPoints = Number(bonusInput) || 0;
    // Можемо списати не більше, ніж є на рахунку, і не більше ніж сума замовлення
    const allowedPoints = Math.min(requestedPoints, userBonuses, subtotal);
    setAppliedBonuses(allowedPoints);
  };

  const cashback = Math.round(subtotal * 0.05); // 5% кешбеку по дефолту
  const totalPrice = subtotal - appliedBonuses;

  // Форма даних для бекенду (модель Order)
  const [formData, setFormData] = useState({
    contactPhone: user?.phone || '',
    shippingAddress: {
      region: '',
      city: '',
      street: '',
      postalCode: '',
      apartment: '',
    },
    paymentMethod: 'card', // card | cash
    userNotes: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        [name]: value,
      },
    }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (activeItems.length === 0) {
      toast.error('Ваш кошик порожній');
      return;
    }

    // Проста валідація
    if (!formData.contactPhone || formData.contactPhone.length < 10) {
      toast.error('Будь ласка, введіть коректний номер телефону');
      return;
    }
    
    if (!formData.shippingAddress.city || !formData.shippingAddress.street) {
      toast.error("Будь ласка, заповніть обов'язкові поля адреси (Місто, Вулиця та Будинок)");
      return;
    }

    // Збираємо дані про додаткове пакування, щоб додати їх в коментар
    let finalNotes = formData.userNotes;
    const packagingNotes = [];
    if (selectedPackagings[1]) packagingNotes.push(`Паперовий пакет (${packagingCounts[1]} од.)`);
    if (selectedPackagings[2]) packagingNotes.push(`Подарунковий пакет (${packagingCounts[2]} од.)`);
    
    if (packagingNotes.length > 0) {
      finalNotes = finalNotes ? `${finalNotes}\n\nДодатково: ${packagingNotes.join(', ')}` : `Додатково: ${packagingNotes.join(', ')}`;
    }

    const payload = {
      items: activeItems.map(item => ({
        product: item.product?._id || item.product?.id,
        quantity: item.quantity
      })),
      shippingAddress: formData.shippingAddress,
      contactPhone: formData.contactPhone,
      paymentMethod: formData.paymentMethod,
      userNotes: finalNotes,
      appliedBonuses,
      packagingPrice // Відправляємо на бекенд для коректного підрахунку суми
    };

    try {
      setIsLoading(true);
      console.log('Дані для бекенду Order Schema:', payload);
      
      const res = await orderAPI.create(payload);
      
      // Якщо це оплата карткою і ми отримали URL від Stripe
      if (formData.paymentMethod === 'card' && res.url) {
        window.location.href = res.url;
        return; // Виходимо, корзину очистимо на сторінці /success
      }
      
      // Після успішного замовлення "готівкою" перенаправляємо на success-сторінку, де відбудеться часткове очищення
      toast.success('Замовлення успішно оформлено!');
      navigate(res.order?._id ? `/success?orderId=${res.order._id}` : '/success');
      
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Помилка при оформленні замовлення');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-creamy font-sans relative pb-[100px]">
      <div className="pt-[26px] xl:pt-[40px] px-[16px] xl:px-[60px] flex items-center gap-[12px] text-figma-xs xl:text-figma-sm text-choco-dark mb-[20px] xl:mb-[40px]">
        <Link to="/" className="hover:opacity-80">Головна</Link>
        <span className="text-choco-light">/</span>
        <Link to="/cart" className="hover:opacity-80 text-choco-light">Мій кошик</Link>
        <span className="text-choco-light">/</span>
        <span className="text-choco-light">Оформлення замовлення</span>
      </div>

      <div className="px-[16px] lg:px-[30px] xl:px-[60px] max-w-[1440px] mx-auto">
        <h1 className="font-serif text-[32px] lg:text-[40px] xl:text-figma-hero font-semibold text-choco-light mb-[30px] xl:mb-[50px] text-center lg:text-left">
          Оформлення замовлення
        </h1>

        <div className="flex flex-col lg:flex-row justify-between gap-[30px] xl:gap-[60px] items-start">
          
          {/* ЛІВА КОЛОНКА (ФОРМА) */}
          <form onSubmit={handleCheckout} className="w-full lg:w-[60%] flex flex-col gap-[40px]">
            
            {/* Контактні дані */}
            <div className="flex flex-col gap-[20px]">
              <h2 className="font-sans font-semibold text-[18px] text-choco-light">Контактні дані</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
                <div className="flex flex-col gap-[10px]">
                  <label className="text-[14px] text-choco-light">Номер телефону</label>
                  <input 
                    type="tel" 
                    name="contactPhone" 
                    value={formData.contactPhone} 
                    onChange={handleFieldChange} 
                    className="w-full h-[45px] border border-choco-light rounded-[25px] bg-transparent px-[20px] focus:outline-none text-choco-light" 
                    placeholder="+380..." 
                    required 
                  />
                </div>
              </div>
            </div>

            {/* Адреса доставки */}
            <div className="flex flex-col gap-[20px]">
              <h2 className="font-sans font-semibold text-[18px] text-choco-light">Адреса доставки</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
                <div className="flex flex-col gap-[10px]">
                  <label className="text-[14px] text-choco-light">Область</label>
                  <input 
                    type="text" 
                    name="region" 
                    value={formData.shippingAddress.region} 
                    onChange={handleAddressChange} 
                    className="w-full h-[45px] border border-choco-light rounded-[25px] bg-transparent px-[20px] focus:outline-none text-choco-light" 
                    placeholder="Київська область" 
                    required 
                  />
                </div>
                <div className="flex flex-col gap-[10px]">
                  <label className="text-[14px] text-choco-light">Місто</label>
                  <input 
                    type="text" 
                    name="city" 
                    value={formData.shippingAddress.city} 
                    onChange={handleAddressChange} 
                    className="w-full h-[45px] border border-choco-light rounded-[25px] bg-transparent px-[20px] focus:outline-none text-choco-light" 
                    placeholder="Місто..." 
                    required 
                  />
                </div>
                <div className="flex flex-col gap-[10px] sm:col-span-2">
                  <label className="text-[14px] text-choco-light">Вулиця / Адреса</label>
                  <input 
                    type="text" 
                    name="street" 
                    value={formData.shippingAddress.street} 
                    onChange={handleAddressChange} 
                    className="w-full h-[45px] border border-choco-light rounded-[25px] bg-transparent px-[20px] focus:outline-none text-choco-light" 
                    placeholder="Вулиця, буд..." 
                    required 
                  />
                </div>
                <div className="flex flex-col gap-[10px]">
                  <label className="text-[14px] text-choco-light">Квартира</label>
                  <input 
                    type="text" 
                    name="apartment" 
                    value={formData.shippingAddress.apartment} 
                    onChange={handleAddressChange} 
                    className="w-full h-[45px] border border-choco-light rounded-[25px] bg-transparent px-[20px] focus:outline-none text-choco-light" 
                    placeholder="Необов'язково" 
                  />
                </div>
                <div className="flex flex-col gap-[10px]">
                  <label className="text-[14px] text-choco-light">Поштовий індекс</label>
                  <input 
                    type="text" 
                    name="postalCode" 
                    value={formData.shippingAddress.postalCode} 
                    onChange={handleAddressChange} 
                    className="w-full h-[45px] border border-choco-light rounded-[25px] bg-transparent px-[20px] focus:outline-none text-choco-light" 
                    placeholder="01001" 
                    required 
                  />
                </div>
              </div>
            </div>

            {/* Спосіб оплати */}
            <div className="flex flex-col gap-[15px]">
              <h2 className="font-sans font-semibold text-[18px] text-choco-light mb-[5px]">Спосіб оплати</h2>
              <label className="flex items-center gap-[10px] cursor-pointer">
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="card" 
                  checked={formData.paymentMethod === 'card'} 
                  onChange={handleFieldChange} 
                  className="w-[18px] h-[18px] accent-choco-light" 
                />
                <span className="text-choco-light text-[16px]">Картка (Online)</span>
              </label>
              <label className="flex items-center gap-[10px] cursor-pointer">
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="cash" 
                  checked={formData.paymentMethod === 'cash'} 
                  onChange={handleFieldChange} 
                  className="w-[18px] h-[18px] accent-choco-light" 
                />
                <span className="text-choco-light text-[16px]">Готівкою при отриманні</span>
              </label>
            </div>

            {/* Коментар */}
            <div className="flex flex-col border border-white/50 bg-white/50 rounded-[15px] p-[20px] shadow-sm">
              <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsCommentOpen(!isCommentOpen)}>
                <h2 className="font-sans text-[18px] text-choco-light">Додати коментар</h2>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#705A5A" strokeWidth="1.5" className={`transition-transform duration-300 ${isCommentOpen ? 'rotate-45' : ''}`}><path d="M12 5v14M5 12h14"></path></svg>
              </div>
              {isCommentOpen && (
                <textarea 
                  name="userNotes" 
                  value={formData.userNotes} 
                  onChange={handleFieldChange}
                  className="w-full h-[100px] mt-[15px] border border-choco-light/50 rounded-[10px] bg-white p-[15px] resize-none focus:outline-none text-choco-light text-[14px]"
                  placeholder="Ваші побажання щодо замовлення..."
                ></textarea>
              )}
            </div>

          </form>

          {/* ПРАВА КОЛОНКА (Замовлення) */}
          <div className="w-full lg:w-[400px] xl:w-[420px] flex flex-col gap-[20px]">
            
            <div className="bg-white/80 backdrop-blur-sm rounded-[20px] p-[25px] flex flex-col shadow-[0_4px_20px_rgba(112,90,90,0.05)] border border-choco-light/10">
              <h2 className="font-sans font-semibold text-[20px] text-choco-light mb-[20px] text-center">Товари в замовленні</h2>
              
              <div className="flex flex-col w-full max-h-[400px] overflow-y-auto pr-[5px] custom-scrollbar">
                {activeItems.map((item, index) => {
                  const product = item.product || {};
                  const price = product.discountPrice > 0 ? product.discountPrice : (product.price || 0);
                  const total = price * item.quantity;
                  
                  return (
                    <div key={index} className="flex items-center gap-[15px] py-[15px] border-b border-choco-light/10 last:border-0 hover:bg-black/5 p-2 rounded-lg transition-colors">
                      <div className="w-[60px] h-[60px] bg-gray-100 rounded-[10px] overflow-hidden flex-shrink-0">
                        <img src={product.images?.[0]?.url || product.img || '/placeholder.png'} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col flex-grow">
                        <h3 className="text-choco-light text-[14px] leading-tight font-medium mb-[5px]">{product.name}</h3>
                        <span className="text-choco-light/70 text-[12px]">Вага: {product.weight || 'Н/Д'}</span>
                      </div>
                      <div className="flex flex-col justify-end items-end min-w-[70px]">
                        <span className="text-choco-light font-semibold text-[16px]">{total} грн</span>
                        <span className="text-choco-light/60 text-[11px]">{item.quantity} од.</span>
                      </div>
                    </div>
                  );
                })}

                {/* Додаємо відображення пакування, якщо воно обране */}
                {selectedPackagings[1] && (
                  <div className="flex items-center gap-[15px] py-[15px] border-b border-choco-light/10 last:border-0 hover:bg-black/5 p-2 rounded-lg transition-colors">
                    <div className="w-[60px] h-[60px] bg-gray-100 rounded-[10px] overflow-hidden flex-shrink-0">
                      <div className="w-full h-full bg-[#EBEBEB]" style={{backgroundImage: "url(/packet02.png)", backgroundSize: "cover", backgroundPosition: "center"}}></div>
                    </div>
                    <div className="flex flex-col flex-grow">
                      <h3 className="text-choco-light text-[14px] leading-tight font-medium mb-[5px]">Паперовий пакет</h3>
                    </div>
                    <div className="flex flex-col justify-end items-end min-w-[70px]">
                      <span className="text-choco-light font-semibold text-[16px]">{10 * packagingCounts[1]} грн</span>
                      <span className="text-choco-light/60 text-[11px]">{packagingCounts[1]} од.</span>
                    </div>
                  </div>
                )}

                {selectedPackagings[2] && (
                  <div className="flex items-center gap-[15px] py-[15px] border-b border-choco-light/10 last:border-0 hover:bg-black/5 p-2 rounded-lg transition-colors">
                    <div className="w-[60px] h-[60px] bg-gray-100 rounded-[10px] overflow-hidden flex-shrink-0">
                      <div className="w-full h-full bg-[#3B2929]" style={{backgroundImage: "url(/packet01.png)", backgroundSize: "cover", backgroundPosition: "center"}}></div>
                    </div>
                    <div className="flex flex-col flex-grow">
                      <h3 className="text-choco-light text-[14px] leading-tight font-medium mb-[5px]">Подарунковий пакет</h3>
                    </div>
                    <div className="flex flex-col justify-end items-end min-w-[70px]">
                      <span className="text-choco-light font-semibold text-[16px]">{15 * packagingCounts[2]} грн</span>
                      <span className="text-choco-light/60 text-[11px]">{packagingCounts[2]} од.</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-[15px]">
                <Link to="/cart" className="text-[#8AA7CE] text-[14px] hover:underline underline-offset-4 transition-all">Редагувати товари</Link>
              </div>
            </div>

            <div className="bg-transparent border border-choco-light/30 rounded-[15px] p-[20px] flex flex-col justify-center items-center shadow-sm">
              <h2 className="font-sans font-semibold text-[16px] text-choco-light mb-[10px]">Використати бонуси</h2>
              <span className="text-wine-red font-semibold mb-[15px]">У вас {(userBonuses).toFixed(0)} бонусів</span>
              
              <div className="flex w-full h-[40px] items-center rounded-[25px] overflow-hidden border border-choco-light/50 bg-white/50 focus-within:border-choco-light transition-colors">
                <input 
                  type="number"
                  placeholder="Введіть сума..."
                  value={bonusInput}
                  onChange={(e) => setBonusInput(e.target.value)}
                  max={userBonuses}
                  min={0}
                  className="flex-grow h-full bg-transparent px-[20px] focus:outline-none text-[14px] text-choco-light"
                />
                <button 
                  type="button" 
                  onClick={handleApplyBonus}
                  className="h-full px-[25px] bg-[#E3D6BF] text-choco-light text-[14px] font-medium transition-colors hover:bg-[#D4C3A6]"
                >
                  Застосувати
                </button>
              </div>
            </div>

            <div className="bg-white/50 backdrop-blur-md border border-choco-light/10 flex flex-col gap-[15px] p-[20px] rounded-[15px] shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-choco-light font-medium text-[16px]">Всього</span>
                <span className="text-choco-light text-[16px]">{subtotal} грн</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-choco-light font-medium text-[16px]">Очікуваний кешбек</span>
                <span className="text-[#22AD5C] font-semibold text-[16px]">+ {cashback} грн</span>
              </div>
              {appliedBonuses > 0 && (
                <div className="flex justify-between items-center bg-wine-red/5 p-2 rounded-lg -mx-2">
                  <span className="text-wine-red font-medium text-[16px]">Використано бонусів</span>
                  <span className="text-wine-red font-bold text-[16px]">- {appliedBonuses} грн</span>
                </div>
              )}
              
              <div className="w-full h-[1px] bg-choco-light/20 my-[5px]"></div>
              
              <div className="flex justify-between items-baseline">
                <span className="text-choco-light font-semibold text-[20px]">До сплати</span>
                <span className="text-choco-light font-bold text-[28px]">{totalPrice} грн</span>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full h-[50px] bg-wine-red text-[#F5EEE0] rounded-[25px] font-semibold text-[18px] transition-all hover:bg-opacity-90 hover:shadow-md mt-[10px] flex justify-center items-center active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Обробка...' : 'Оформити'}
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
