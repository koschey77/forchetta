import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { orderAPI, cartAPI } from '../services/api';
import useCartStore from '../stores/useCartStore';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const session_id = searchParams.get('session_id'); // Якщо Stripe верне щось
  const { fetchCart } = useCartStore();
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    const completeOrder = async () => {
      try {
        if (orderId) {
          // Отримуємо деталі оформленого замовлення
          const order = await orderAPI.getById(orderId);
          // Дістаємо ID товарів, які реально були куплені
          const purchasedItemIds = order.items.map(i => i.product._id || i.product);
          // Видаляємо тільки їх з кошика
          await cartAPI.removeMany(purchasedItemIds);
        } else {
          // Фолбек: якщо orderId немає, просто очищуємо все
          await cartAPI.clear();
        }
        
        await fetchCart();
        setCleared(true);
      } catch (err) {
        console.error("Помилка очищення кошику", err);
      }
    };

    if (!cleared) {
      completeOrder();
    }
  }, [cleared, fetchCart, orderId]);

  return (
    <div className="min-h-screen bg-black/40 flex flex-col items-center justify-center p-4">
      {/* Modal Container */}
      <div className="relative bg-[#F5EEE0] rounded-[20px] w-[345px] sm:w-[718px] pt-[34px] sm:pt-[35px] pb-[65px] px-[20px] sm:px-[50px] flex flex-col items-center shadow-2xl">
        
        {/* Close Button */}
        <Link to="/" className="absolute top-[20px] right-[20px] sm:top-[35px] sm:right-[35px] text-[#705A5A] hover:opacity-70 transition-opacity">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </Link>

        {/* Content Wrapper */}
        <div className="flex flex-col items-center gap-[30px] w-full">
          
          {/* Top Section: Image & Text */}
          <div className="flex flex-col items-center gap-[20px] w-full max-w-[355px]">
            
            {/* Image */}
            <div className="w-[117px] h-[183px]">
              <img 
                src="/sweet_62.png" 
                alt="Успішне замовлення" 
                className="w-full h-full object-contain"
              />
            </div>

            {/* Title & Subtitle */}
            <div className="flex flex-col items-center gap-[21px] w-full text-center">
              <h1 className="font-serif font-bold text-[48px] leading-[58px] text-[#705A5A] m-0 p-0">
                Дякуємо за<br/>замовлення
              </h1>
              
              <p className="font-montserrat font-normal text-[16px] leading-[20px] text-[#705A5A] m-0 p-0 max-w-[307px]">
                Ми повідомимо про його готовність найближчим часом.
              </p>
            </div>

          </div>

          {/* Bottom Section: Buttons */}
          <div className="flex flex-col gap-[20px] w-full max-w-[307px]">
            
            <Link 
              to="/user-panel?page=history" 
              className="flex justify-center items-center py-[10px] w-full h-[40px] border border-[#893E3E] rounded-[50px] text-[#893E3E] font-montserrat font-medium text-[16px] sm:text-[18px] hover:bg-[#893E3E] hover:text-[#F5EEE0] transition-colors"
            >
              До історії замовлень
            </Link>

            <Link 
              to="/catalog" 
              className="flex justify-center items-center py-[10px] w-full h-[40px] bg-[#893E3E] rounded-[50px] text-[#F5EEE0] font-montserrat font-medium text-[16px] sm:text-[18px] hover:bg-opacity-90 transition-colors"
            >
              Продовжити покупки
            </Link>

          </div>
          
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
