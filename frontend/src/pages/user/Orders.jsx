import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { orderAPI, productsAPI } from '../../services/api';
import NoConnection from '../../components/errors/NoConnection';
import ProductSectionSlider from '../../components/ui/carousel/ProductSectionSlider';

const ChevronDownIcon = ({ className = '', strokeWidth = '2' }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const OrderCard = ({ order }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const dateStr = new Date(order.createdAt).toLocaleDateString('uk-UA');

  const statusConfig = {
    pending: { label: 'В обробці', color: 'text-[#FFD874]' },
    processing: { label: 'Готується', color: 'text-[#4A90E2]' },
    shipped: { label: 'Відправлено', color: 'text-[#9B51E0]' },
    delivered: { label: 'Доставлено', color: 'text-[#66BC91]' },
    cancelled: { label: 'Скасовано', color: 'text-[#FF6C6C]' },
  };

  const statusObj = statusConfig[order.status] || { label: order.status, color: 'text-choco-light' };

  const items = order.items || [];
  const previewItems = items.slice(0, 2);
  const extraItemsQty = items.length > 2 ? items.length - 2 : 0;

  const paymentMethodLabel = order.paymentMethod === 'card' ? 'картою' : 'готівкою';
  const hasShipping = order.shippingAddress && order.shippingAddress.city;

  const handleRepeatOrder = (e) => {
    e.stopPropagation();
    navigate('/catalog');
  };

  return (
    <div className="flex flex-col items-start p-[8px] w-full lg:w-[619px] mx-auto rounded-[7px] transition-all duration-300 hover:bg-white" onClick={() => setIsOpen(!isOpen)}>
      {/* HEADER CLOSED STATE */}
      <div className="flex flex-row justify-between items-center p-[8px] gap-[27px] w-full min-h-[52px]">
        
        {/* Left Side */}
        <div className="flex flex-col justify-center items-start gap-[4px] flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center w-full gap-x-3 gap-y-1">
            <span className="font-montserrat font-medium min-w-[101px] w-auto whitespace-nowrap text-[12px] leading-[15px] text-choco-light">
              № {order.orderNumber || order._id?.slice(-8).toUpperCase()}
            </span>
            <span className="font-montserrat font-medium min-w-[101px] w-auto whitespace-nowrap text-[12px] leading-[15px] text-choco-light">
              {dateStr}
            </span>
          </div>
          <span className={`font-montserrat w-full font-medium text-[14px] leading-[17px] ${statusObj.color} mt-1`}>
            {statusObj.label}
          </span>
        </div>

        {/* Right Side */}
        <div className="flex flex-row items-center gap-[7px] w-[144px]">
          {!isOpen && (
            <div className="hidden sm:flex flex-row items-center gap-[10px]">
              {previewItems.map((item, index) => (
                <div key={index} className="w-[55px] h-[29px] border-[1px] border-dark-creamy overflow-hidden bg-white">
                  <img 
                    src={item.product?.images?.[0]?.url || '/placeholder.png'} 
                    alt={item.nameAtPurchase} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {extraItemsQty > 0 && (
                <span className="font-montserrat font-medium text-[12px] leading-[15px] text-choco-light w-[20px]">
                  (+{extraItemsQty})
                </span>
              )}
            </div>
          )}
          <div className={`mx-auto transition-transform duration-300 flex items-center justify-center text-choco-light w-[20px] h-[17px] ${isOpen ? 'rotate-180' : ''}`}>
             <ChevronDownIcon strokeWidth="2" className="w-full h-full" />
          </div>
        </div>
      </div>

      {/* EXPANDED CONTENT */}
      {isOpen && (
        <div className="flex flex-col w-full h-full px-[8px] pb-2 mt-2 gap-4">
          
          {/* Items List */}
          <div className="flex flex-col gap-4 w-full">
            {items.map((item, idx) => {
              const itemTotal = item.priceAtPurchase * item.quantity;
              
              return (
                <div key={idx} className="flex flex-col gap-4 w-full">
                  <div className="mx-auto w-full max-w-[474px] h-0 border-[1px] border-choco-light opacity-60"></div>
                  
                  <div className="flex flex-row items-center gap-[24px] w-full min-h-[101px]">
                    <div className="w-[105px] h-[90px] border-[1px] border-dark-creamy flex-shrink-0 bg-white overflow-hidden">
                      <img 
                        src={item.product?.images?.[0]?.url || '/placeholder.png'} 
                        alt={item.nameAtPurchase} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex flex-col items-start gap-[22px] flex-grow max-w-[474px]">
                      <span className="font-montserrat font-medium text-[18px] leading-[22px] text-choco-light w-full line-clamp-2">
                        {item.nameAtPurchase}
                      </span>
                      
                      <div className="flex flex-row items-center w-full min-h-[15px]">
                        <span className="font-montserrat font-medium text-[12px] leading-[15px] w-auto text-choco-light">
                          х{item.quantity} / {itemTotal} грн
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Delivery & Payment Info */}
          <div className="flex flex-col items-start gap-[4px] w-full mt-2 lg:w-[162px] lg:h-[34px]">
            <span className="font-montserrat font-semibold text-[12px] leading-[15px] text-choco-light min-w-[101px] w-auto whitespace-nowrap">
              Оплата: {paymentMethodLabel}
            </span>
            <span className="font-montserrat font-semibold text-[12px] leading-[15px] text-choco-light w-[162px]">
              Доставка: {hasShipping ? 'на адресу' : 'самовивіз'}
            </span>
          </div>

          <div className="mx-auto w-full max-w-[474px] h-0 border-[1px] border-choco-light opacity-60 mt-1"></div>

          {/* Total */}
          <div className="flex flex-row justify-between items-center w-full min-h-[22px] mt-2 mb-2 px-[40px] lg:px-[100px]">
            <span className="font-montserrat font-semibold text-[16px] leading-[20px] text-choco-light min-w-[101px] w-auto whitespace-nowrap">
              Всього:
            </span>
            <div className="flex flex-row items-center gap-[40px]">
              <span className="font-montserrat font-medium text-[18px] leading-[22px] text-choco-light/50 line-through hidden lg:block w-[84px]"></span>
              <span className="font-montserrat font-medium text-[18px] leading-[22px] text-choco-light min-w-[101px] w-auto whitespace-nowrap text-right">
                {order.totalAmount} грн
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-[12px] mt-2 w-full max-w-[474px] mx-auto">
            <button 
              onClick={(e) => { e.stopPropagation(); }}
              className="flex justify-center items-center py-[16px] px-[30px] w-full h-[40px] border border-choco-dark rounded-[31px] transition-colors hover:bg-black/5"
            >
              <span className="font-montserrat font-normal text-[16px] leading-[20px] text-choco-dark">
                Залишити відгук
              </span>
            </button>
            <button 
              onClick={handleRepeatOrder}
              className="flex justify-center items-center py-[16px] px-[30px] w-full h-[40px] bg-wine-red rounded-[31px] transition-opacity hover:opacity-90"
            >
              <span className="font-montserrat font-normal text-[16px] leading-[20px] text-light-gray">
                Повторити
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Orders = () => {
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['my-orders'],
    queryFn: orderAPI.getMyOrders,
    staleTime: 60 * 1000, 
  });

  const { data: recommendedData } = useQuery({
    queryKey: ['best-sellers'],
    queryFn: () => productsAPI.getMany({ sortBy: 'salesCount', sortOrder: 'desc', limit: 6 }),
    staleTime: 5 * 60 * 1000,
  });

  const recommendationsArray = Array.isArray(recommendedData) 
    ? recommendedData 
    : (recommendedData?.products || []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center px-[15px] lg:px-[30px] pt-[20px] sm:pt-5 pb-16 w-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-choco-dark mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return <NoConnection onRetry={() => window.location.reload()} />;
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center px-[15px] lg:px-[30px] pt-[10px] sm:pt-5 pb-2 gap-0 sm:gap-[10px] w-full min-h-[400px] sm:min-h-[607px] rounded-[10px]">
        <img 
          src="/image36.png" 
          alt="Немає замовлень" 
          className="w-[285px] h-[233px] sm:w-[570px] sm:h-[466px] object-contain"
        />
        <div className="flex flex-col items-center justify-center p-0 gap-[15px] sm:gap-[20px] w-full max-w-[638px]">
          <h2 className="font-montserrat font-semibold text-[20px] sm:text-[32px] leading-[26px] sm:leading-[39px] text-choco-light text-center w-full">
            У вас ще немає жодного замовлення
          </h2>
          <p className="font-montserrat font-medium text-[14px] sm:text-[18px] leading-[18px] sm:leading-[22px] text-choco-light text-center w-full">
            Не знаєте, з чого почати? Перегляньте наші бестселери!
          </p>
          <Link 
            to="/catalog"
            className="flex flex-row justify-center items-center px-[30px] py-[16px] gap-[10px] w-[235px] h-[40px] bg-wine-red rounded-[31px] transition-opacity hover:opacity-90 mt-[5px]"
          >
            <span className="font-montserrat font-normal text-[14px] sm:text-[16px] leading-[17px] sm:leading-[20px] text-creamy text-center">
              Перейти до каталогу
            </span>
          </Link>
        </div>
        
        {/* Рекомендації для порожнього стану */}
        {recommendationsArray.length > 0 && (
          <div className="w-full max-w-full">
            <ProductSectionSlider 
              title="Топ продажів"
              products={recommendationsArray}
              linkUrl="/catalog?sortOption=salesCount-desc"
              className="mt-2 md:mt-4"
              compact={true}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full gap-[8px] mx-auto min-h-[600px] pb-2">
      <div className="flex flex-col items-start px-0 w-full lg:w-[619px] gap-[8px] mx-auto">
        {orders.map(order => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>
      
      {/* Рекомендації під списком замовлень */}
      {recommendationsArray.length > 0 && (
        <div className="w-full max-w-full">
          <ProductSectionSlider 
            title="Топ продажів"
            products={recommendationsArray}
            linkUrl="/catalog?sortOption=salesCount-desc"
            className="mt-2 md:mt-4"
            compact={true}
          />
        </div>
      )}
    </div>
  );
};

export default Orders;
