import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderAPI } from '../../services/api';
import TopPaginationControls from '../../components/common/pagination/TopPaginationControls';
import BottomPaginationControls from '../../components/common/pagination/BottomPaginationControls';
import { SelectDropdown } from '../../components/ui/dropdowns';
import { ORDER_ENUMS } from '../../constants/enums';
import NoConnection from '../../components/errors/NoConnection';
import useFilterDebounce from '../../hooks/useFilterDebounce';
import { SearchIcon } from '../../components/icons';

const ChevronDownIcon = ({ className = '', strokeWidth = '2' }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const statusLabels = {
  pending: 'В обробці',
  processing: 'Готується',
  shipped: 'Відправлено',
  delivered: 'Доставлено',
  cancelled: 'Скасовано'
};

const statusColors = {
  pending: 'bg-[#FFD874]',
  processing: 'bg-[#4A90E2]',
  shipped: 'bg-[#9B51E0]',
  delivered: 'bg-[#66BC91]',
  cancelled: 'bg-[#FF6C6C]'
};

const statusTextColors = {
  pending: 'text-[#B58500]',
  processing: 'text-[#4A90E2]',
  shipped: 'text-[#9B51E0]',
  delivered: 'text-[#66BC91]',
  cancelled: 'text-[#FF6C6C]'
};

const StatusLabelWithDot = ({ status }) => (
  <div className="flex items-center gap-2">
    <div className={`w-[8px] h-[8px] rounded-full ${statusColors[status]}`}></div>
    <span className="whitespace-nowrap">{statusLabels[status]}</span>
  </div>
);

const statusOptions = ORDER_ENUMS.status.map(s => ({ value: s, label: <StatusLabelWithDot status={s} /> }));

const AdminOrderSkeleton = () => (
  <div className="flex flex-col items-start py-4 w-full mx-auto transition-all duration-300 bg-transparent border-b border-dark-creamy/30 last:border-b-0 animate-pulse">
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center w-full min-h-[52px] gap-4">
      <div className="flex flex-row justify-between lg:justify-start items-center gap-4 sm:gap-8 w-full lg:w-auto lg:flex-grow">
        <div className="flex flex-col justify-center items-start gap-2 min-w-[120px]">
          <div className="h-4 bg-choco-light/10 rounded w-24"></div>
          <div className="h-3 bg-choco-light/10 rounded w-16"></div>
        </div>
        <div className="flex flex-col justify-center items-end lg:items-start gap-2 flex-grow">
          <div className="h-4 bg-choco-light/10 rounded w-32"></div>
          <div className="h-3 bg-choco-light/10 rounded w-24"></div>
        </div>
      </div>
      <div className="flex flex-row justify-between lg:justify-end items-center gap-4 sm:gap-8 w-full lg:w-auto">
        <div className="flex flex-col justify-center items-start gap-2 min-w-[100px]">
          <div className="h-5 bg-choco-light/10 rounded w-16"></div>
          <div className="h-3 bg-choco-light/10 rounded w-10"></div>
        </div>
        <div className="flex flex-row items-center gap-[15px] justify-end">
          <div className="w-[140px] h-10 bg-choco-light/10 rounded-[7px]"></div>
          <div className="w-5 h-5 bg-choco-light/10 rounded-full"></div>
        </div>
      </div>
    </div>
  </div>
);

const AdminOrderCard = ({ order }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [statusToConfirm, setStatusToConfirm] = useState(null);
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => orderAPI.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_orders'] });
    }
  });

  const handleStatusChange = (newStatus) => {
    if (newStatus !== order.status) {
      setStatusToConfirm(newStatus);
    }
  };

  const confirmStatusChange = (e) => {
    e.stopPropagation();
    if (statusToConfirm) {
      updateStatusMutation.mutate({ id: order._id, status: statusToConfirm });
      setStatusToConfirm(null);
    }
  };

  const cancelStatusChange = (e) => {
    e.stopPropagation();
    setStatusToConfirm(null);
  };

  const dateObj = new Date(order.createdAt);
  const timeStr = dateObj.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
  const dateStr = dateObj.toLocaleDateString('uk-UA');
  const dateTimeStr = `${timeStr} ${dateStr}`;

  const items = order.items || [];
  
  const paymentMethodLabel = order.paymentMethod === 'card' ? 'карткою' : 'готівкою';
  const hasShipping = order.shippingAddress && order.shippingAddress.city;

  const phoneToDisplay = order.shippingAddress?.phone || order.user?.phone || order.contactPhone || 'Немає номеру';
  const nameToDisplay = order.user?.name || 'Гість';
  const emailToDisplay = order.user?.email || order.shippingAddress?.email || 'Немає email';

  return (
    <div className="flex flex-col items-start py-4 w-full mx-auto transition-all duration-300 bg-transparent border-b border-dark-creamy/30 last:border-b-0 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
      {/* HEADER CLOSED STATE */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center w-full min-h-[52px] gap-4">
        
        {/* Left Side: Row on mobile (Order Info + Customer) */}
        <div className="flex flex-row justify-between lg:justify-start items-center gap-4 sm:gap-8 w-full lg:w-auto lg:flex-grow">
          
          {/* Order Info */}
          <div className="flex flex-col justify-center items-start gap-[4px] min-w-[120px]">
            <div className="flex flex-row items-center gap-[10px]">
              <span className="font-montserrat font-bold text-[14px] leading-[17px] text-choco-light">
                № {order.orderNumber || order._id?.slice(-8).toUpperCase()}
              </span>
            </div>
            <span className="font-montserrat font-medium text-[12px] leading-[15px] text-choco-light opacity-70">
              {dateTimeStr}
            </span>
          </div>

          {/* Center: Customer Info */}
          <div className="flex flex-col justify-center items-end lg:items-start gap-[4px] flex-grow">
            <span className="font-montserrat font-medium text-[14px] leading-[17px] text-choco-dark text-right lg:text-left">
              {nameToDisplay}
            </span>
            <span className="font-montserrat font-medium text-[12px] leading-[15px] text-choco-light opacity-80 text-right lg:text-left">
              {phoneToDisplay}
            </span>
            {emailToDisplay !== 'Немає email' && (
              <span className="font-montserrat font-medium text-[12px] leading-[15px] text-choco-light opacity-60 text-right lg:text-left">
                {emailToDisplay}
              </span>
            )}
          </div>

        </div>

        {/* Right Side: Row on mobile (Price + Status & Arrow) */}
        <div className="flex flex-row justify-between lg:justify-end items-center gap-4 sm:gap-8 w-full lg:w-auto">
          
          {/* Total Price */}
          <div className="flex flex-col justify-center items-start gap-[4px] min-w-[100px]">
            <span className="font-montserrat font-bold text-[16px] leading-[20px] text-wine-red">
              {order.totalAmount?.toLocaleString('uk-UA')} ₴
            </span>
            <span className="font-montserrat font-medium text-[12px] leading-[15px] text-choco-light opacity-70">
              {items.length} поз.
            </span>
          </div>

          {/* Right Side: Status Dropdown & Arrow */}
          <div className="flex flex-row items-center gap-[15px] justify-end" onClick={(e) => e.stopPropagation()}>
            <div className="w-[140px]">
               <SelectDropdown
                  options={statusOptions}
                  selected={order.status}
                  onChange={handleStatusChange}
                  disabled={updateStatusMutation.isPending}
               />
            </div>
            <div className={`transition-transform duration-300 flex items-center justify-center text-choco-light w-[20px] h-[17px] cursor-pointer ${isOpen ? 'rotate-180' : ''}`} onClick={() => setIsOpen(!isOpen)}>
               <ChevronDownIcon strokeWidth="2" className="w-full h-full" />
            </div>
          </div>

        </div>

      </div>

      {/* EXPANDED CONTENT */}
      {isOpen && (
        <div className="flex flex-col w-full px-[8px] pb-4 mt-4 gap-6 cursor-default" onClick={(e) => e.stopPropagation()}>
          
          <div className="w-full h-[1px] bg-choco-light opacity-20"></div>

          <div className="flex flex-col md:flex-row gap-8 w-full justify-between items-start">
             {/* Order Meta Data */}
             <div className="flex flex-col gap-4 w-full md:w-[40%]">
                <div className="flex flex-col gap-1 w-full">
                   <h4 className="font-montserrat font-semibold text-[14px] text-choco-dark">Доставка та Оплата</h4>
                   <span className="font-montserrat text-[13px] text-choco-light">Метод оплати: <b>{paymentMethodLabel}</b> (Статус: {order.paymentStatus === 'paid' ? 'Сплачено' : 'Очікується'})</span>
                   <span className="font-montserrat text-[13px] text-choco-light">Метод доставки: <b>{hasShipping ? 'Кур\'єр/Пошта' : 'Самовивіз'}</b></span>
                   {hasShipping && order.shippingAddress && (
                     <div className="flex flex-col mt-1 w-full overflow-hidden">
                        <span className="font-montserrat text-[12px] text-choco-dark whitespace-normal break-words sm:break-all leading-tight">{order.shippingAddress.region}, м. {order.shippingAddress.city}</span>
                        <span className="font-montserrat text-[12px] text-choco-dark whitespace-normal break-words sm:break-all leading-tight mt-1">Вул. {order.shippingAddress.street}, Буд. {order.shippingAddress.house}{order.shippingAddress.apartment ? `, Кв. ${order.shippingAddress.apartment}` : ''}</span>
                     </div>
                   )}
                </div>

                {order.userNotes && (
                  <div className="flex flex-col gap-1 mt-2 w-full overflow-hidden">
                    <h4 className="font-montserrat font-semibold text-[14px] text-choco-dark">Коментар клієнта</h4>
                    <p className="font-montserrat text-[13px] text-choco-light italic break-words sm:break-all whitespace-normal">
                       {order.userNotes}
                    </p>
                  </div>
                )}
             </div>

             {/* Items List (Horizontal Flexbox) */}
             <div className="flex flex-col gap-2 w-full md:w-[60%] min-w-0">
                <h4 className="font-montserrat font-semibold text-[14px] text-choco-dark mb-2">Склад замовлення</h4>
                <div className="flex flex-row overflow-x-auto gap-4 pb-4 snap-x custom-scrollbar">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-2 min-w-[120px] max-w-[120px] snap-start">
                       <div className="w-[120px] h-[100px] border border-dark-creamy overflow-hidden rounded-md flex-shrink-0">
                         <img 
                           src={item.product?.images?.[0]?.url || item.images?.[0]?.url || '/placeholder.png'} 
                           alt={item.nameAtPurchase} 
                           className="w-full h-full object-cover"
                           loading="lazy"
                         />
                       </div>
                       <div className="flex flex-col gap-[2px]">
                          <span className="font-montserrat font-medium text-[12px] leading-tight text-choco-dark line-clamp-2" title={item.nameAtPurchase}>
                            {item.nameAtPurchase}
                          </span>
                          <span className="font-montserrat text-[11px] text-choco-light">
                            {item.quantity} шт. x {item.priceAtPurchase} ₴
                          </span>
                          <span className="font-montserrat font-semibold text-[13px] text-wine-red mt-1">
                            {item.quantity * item.priceAtPurchase} ₴
                          </span>
                       </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
          
        </div>
      )}

      {/* Confirmation Modal */}
      {statusToConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-choco-dark/40 backdrop-blur-sm px-[15px]" onClick={(e) => e.stopPropagation()}>
          <div className="bg-creamy rounded-[15px] border border-wine-red/20 shadow-lg p-[30px] max-w-[400px] flex flex-col gap-[20px] items-center text-center w-full">
            <h3 className="font-cormorant font-semibold text-[24px] text-choco-dark">Зміна статусу</h3>
            <p className="font-montserrat text-[16px] text-choco-light font-light leading-[22px]">
              Змінюємо статус цього замовлення на <br/><span className={`font-semibold ${statusTextColors[statusToConfirm]}`}>{statusLabels[statusToConfirm]}</span>?
            </p>
            <div className="flex flex-row justify-between w-full h-[46px] mt-2 gap-[10px]">
              <button 
                onClick={cancelStatusChange}
                className="w-1/2 rounded-[44px] bg-transparent border border-choco-light text-choco-light hover:bg-choco-light/10 transition-colors font-montserrat text-[14px]"
              >
                Скасувати
              </button>
              <button 
                onClick={confirmStatusChange}
                className="w-1/2 rounded-[44px] bg-wine-red text-creamy hover:bg-wine-red/90 transition-colors font-montserrat text-[14px]"
              >
                Підтвердити
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const OrderList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [searchQuery, setSearchQuery] = useState('');
  
  const debouncedSearch = useFilterDebounce(searchQuery, 500, 2); // 500ms delay, minimum 2 characters

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ['admin_orders', page, limit, debouncedSearch],
    queryFn: () => orderAPI.getAll({ page, limit, search: debouncedSearch }),
    keepPreviousData: true,
  });

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const isDataLoading = isLoading || isFetching;

  if (error) {
    return <NoConnection onRetry={() => window.location.reload()} />;
  }

  const orders = data?.orders || [];
  const totalPages = data?.pages || 0;

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-2 border-b border-light-creamy">
         
         {/* Сводка количества замовлень */}
         <div className="flex items-center w-full sm:w-auto p-2">
            <span className="font-montserrat font-bold text-[18px] text-choco-dark whitespace-nowrap">
              Всього замовлень: <span className="text-wine-red ml-1">{data?.total || 0}</span>
            </span>
         </div>
         
         {/* Search Input */}
         <div className="relative w-full sm:w-[400px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="w-[18px] h-[18px] text-choco-light opacity-50" strokeWidth="2" />
            </div>
            <input
              type="text"
              placeholder="Пошук (Ім'я, Номер або телефон)..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-choco-light/30 focus:border-wine-red focus:outline-none bg-transparent font-montserrat text-[14px] text-choco-dark placeholder-choco-light/50 transition-colors"
            />
         </div>

         <div className="flex items-center gap-4 ml-auto w-full sm:w-auto justify-end">
            <TopPaginationControls 
               itemsPerPage={limit}
               onItemsPerPageChange={handleLimitChange}
            />
         </div>
      </div>

      {/* Orders List */}
      <div className="flex flex-col gap-[4px] w-full min-h-[500px]">
        {isDataLoading ? (
          Array.from({ length: 6 }).map((_, i) => <AdminOrderSkeleton key={i} />)
        ) : orders.length > 0 ? (
          orders.map((order) => (
            <AdminOrderCard key={order._id} order={order} />
          ))
        ) : (
          <div className="flex justify-center items-center h-[300px] w-full text-choco-light font-montserrat">
            Немає замовлень
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center w-full mt-4 mb-8">
         <BottomPaginationControls 
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
         />
      </div>

      {/* CSS custom scrollbar for horizontal images list */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #F5EEE0;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E3D6BF;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #705A5A;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #E3D6BF #F5EEE0;
        }
      `}} />
    </div>
  );
};

export default OrderList;