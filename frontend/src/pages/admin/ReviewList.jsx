import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Dialog from '@radix-ui/react-dialog';
import api from '../../services/api';
import TopPaginationControls from '../../components/common/pagination/TopPaginationControls';
import BottomPaginationControls from '../../components/common/pagination/BottomPaginationControls';
import { SelectDropdown } from '../../components/ui/dropdowns';
import NoConnection from '../../components/errors/NoConnection';
import useFilterDebounce from '../../hooks/useFilterDebounce';
import { SearchIcon, TrashIcon, ReplyIcon, CloseIcon, ChevronDownIcon } from '../../components/icons';

const REVIEW_STATUS_LABELS = {
  pending: 'На модерації',
  published: 'Опубліковано',
  rejected: 'Відхилено'
};

const statusColors = {
  pending: 'bg-[#FFD874]',
  published: 'bg-[#66BC91]',
  rejected: 'bg-[#FF6C6C]'
};

const statusTextColors = {
  pending: 'text-[#B58500]',
  published: 'text-[#66BC91]',
  rejected: 'text-[#FF6C6C]'
};

const StatusLabelWithDot = ({ status }) => (
  <div className="flex items-center gap-2">
    <div className={`w-[8px] h-[8px] rounded-full ${statusColors[status]}`}></div>
    <span className="whitespace-nowrap">{REVIEW_STATUS_LABELS[status]}</span>
  </div>
);

const statusOptions = Object.keys(REVIEW_STATUS_LABELS).map(s => ({ value: s, label: <StatusLabelWithDot status={s} /> }));

const AdminReplyModal = ({ isOpen, onClose, review, onSubmit }) => {
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    if (isOpen) {
      setReplyText(review?.adminReply || '');
    }
  }, [isOpen, review]);

  const handleSubmit = () => {
    if (!replyText.trim()) return;
    onSubmit(review._id, replyText.trim());
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-[100] transition-opacity duration-200" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] md:w-[600px] max-h-[90vh] overflow-y-auto bg-creamy p-[20px] md:p-[40px] rounded-[20px] shadow-[-7px_6px_8.8px_rgba(0,0,0,0.25)] z-[100] flex flex-col focus:outline-none">
          
          <div className="flex justify-end mb-[10px]">
            <Dialog.Close asChild>
              <button className="text-choco-light hover:text-choco-dark transition-colors focus:outline-none">
                <CloseIcon className="w-[30px] h-[30px]" />
              </button>
            </Dialog.Close>
          </div>

          <h3 className="font-montserrat font-semibold text-[24px] leading-[29px] text-choco-dark mb-[20px]">
            Відповідь магазину
          </h3>

          <div className="flex flex-col gap-2 mb-6 p-4 bg-white/50 rounded-[10px] border border-dark-creamy/50">
            <span className="font-montserrat text-[12px] font-bold text-choco-light flex items-center justify-between">
              <span>Відгук покупця: {review?.user?.name || 'Невідомий'}</span>
              <span>Товар: <span className="font-semibold text-choco-dark">{review?.product?.name}</span></span>
            </span>
            <p className="font-montserrat text-[14px] text-choco-dark italic leading-[1.5]">
              {review?.text || 'Без тексту'}
            </p>
          </div>

          <div className="flex flex-col gap-[10px]">
            <label className="font-montserrat font-semibold text-[14px] text-choco-dark uppercase px-[15px]">Ваша відповідь:</label>
            <textarea 
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Напишіть відповідь, яку побачить покупець..."
              className="w-full min-h-[150px] bg-white border border-[#E3D6BF] rounded-[20px] p-[20px] font-montserrat text-[14px] text-[#705A5A] resize-none focus:outline-none focus:border-[#705A5A] transition-colors"
            />
          </div>

          <button 
            onClick={handleSubmit}
            disabled={!replyText.trim()}
            className="w-full h-[50px] bg-wine-red text-creamy font-montserrat font-medium text-[16px] rounded-[31px] mt-[30px] flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            Зберегти відповідь
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const AdminReviewSkeleton = () => (
  <div className="flex flex-col items-start py-4 w-full mx-auto transition-all duration-300 bg-transparent border-b border-dark-creamy/30 last:border-b-0 animate-pulse">
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center w-full min-h-[52px] gap-4">
      {/* User Info Skeleton */}
      <div className="flex flex-col gap-2 min-w-[120px] max-w-[200px] flex-1">
        <div className="h-4 bg-choco-light/10 rounded w-32"></div>
        <div className="h-3 bg-choco-light/10 rounded w-24"></div>
      </div>
      {/* Contact Info Skeleton */}
      <div className="flex flex-col gap-2 min-w-[150px] flex-1">
        <div className="h-4 bg-choco-light/10 rounded w-24"></div>
        <div className="h-3 bg-choco-light/10 rounded w-32"></div>
      </div>
      {/* Product Skeleton */}
      <div className="flex flex-col gap-2 min-w-[150px] flex-1">
        <div className="h-4 bg-choco-light/10 rounded w-32"></div>
        <div className="h-3 bg-choco-light/10 rounded w-20"></div>
      </div>
      {/* Status & Actions Skeleton */}
      <div className="flex flex-row items-center gap-[15px] justify-end">
        <div className="w-[140px] h-10 bg-choco-light/10 rounded-[7px]"></div>
        <div className="w-[20px] h-[17px] bg-choco-light/10 rounded"></div>
      </div>
    </div>
  </div>
);

const AdminReviewCard = ({ review }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [statusToConfirm, setStatusToConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: (newStatus) => api.reviews.updateStatus(review._id, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_reviews'] });
    }
  });

  const replyMutation = useMutation({
    mutationFn: ({ id, text }) => api.reviews.reply(id, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_reviews'] });
      setIsReplyModalOpen(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.reviews.deleteAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_reviews'] });
      setIsDeleting(false);
    }
  });

  const handleReplySubmit = (id, text) => {
    replyMutation.mutate({ id, text });
  };

  const handleStatusChange = (newStatus) => {
    if (newStatus !== review.status) {
      setStatusToConfirm(newStatus);
    }
  };

  const confirmStatusChange = () => {
    if (statusToConfirm) {
      updateStatusMutation.mutate(statusToConfirm);
      setStatusToConfirm(null);
    }
  };

  const cancelStatusChange = (e) => {
    e.stopPropagation();
    setStatusToConfirm(null);
  };

  const dateObj = new Date(review.createdAt);
  const timeStr = dateObj.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
  const dateStr = dateObj.toLocaleDateString('uk-UA');
  const dateTimeStr = `${timeStr} ${dateStr}`;

  const userName = review.user?.name || 'Невідомий';
  const userPhone = review.user?.phone || 'Немає номеру';
  const userEmail = review.user?.email || 'Немає email';

  // Star Rating Renderer
  const renderStars = (rating) => (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`text-[16px] leading-[1] ${i < rating ? 'text-[#DCA92A]' : 'text-gray-300'}`}>★</span>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col items-start py-3 w-full mx-auto transition-all duration-300 bg-transparent border-b border-dark-creamy/50 last:border-b-0 cursor-pointer px-1" onClick={() => setIsOpen(!isOpen)}>
      {/* HEADER CLOSED STATE */}
      <div className="grid grid-cols-2 md:grid-cols-[1fr_1fr_max-content] lg:flex lg:flex-row justify-between lg:items-center w-full min-h-[60px] gap-4 lg:gap-0">
        
        {/* Left Side (Покупець) */}
        <div className="flex flex-col justify-center items-start gap-[2px] lg:w-[22%] w-full pr-2 col-start-1 row-start-1 md:col-start-1 md:row-start-1 lg:order-1">
          <span className="font-montserrat font-bold text-[14px] leading-[17px] text-choco-dark truncate w-full" title={userName}>
            {userName}
          </span>
          <span className="font-montserrat font-medium text-[13px] leading-[16px] text-choco-light mt-1 truncate w-full" title={userEmail}>
             {userEmail}
          </span>
          <span className="font-montserrat font-medium text-[12px] leading-[15px] text-choco-light opacity-80 truncate w-full">
             {userPhone}
          </span>
          <span className="font-montserrat font-medium text-[12px] leading-[15px] text-choco-light mt-1 text-wine-red/80">
            {dateTimeStr}
          </span>
        </div>

        {/* Текст */}
        <div className="flex flex-col items-start lg:w-[25%] w-full pr-2 lg:pr-4 col-start-1 row-start-2 row-span-2 md:row-span-1 md:col-start-1 md:row-start-2 lg:order-2">
          <span className="font-montserrat font-medium text-[13px] text-choco-dark leading-[18px] line-clamp-4 italic max-w-[20ch]">
            {review.text ? `“${review.text}”` : <span className="opacity-50">Без тексту</span>}
          </span>
        </div>

        {/* Товар */}
        <div className="flex flex-row items-center gap-3 lg:w-[23%] w-full pl-0 lg:pl-2 col-start-2 row-start-1 md:col-start-2 md:row-start-1 lg:order-3">
          {review.product?.images?.[0]?.url && (
            <div className="w-[60px] h-[50px] shrink-0 border border-dark-creamy rounded-[5px] overflow-hidden bg-white">
              <img 
                src={review.product.images[0].url} 
                alt={review.product.name} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex flex-col gap-1 items-start flex-1 min-w-0">
             <span className="font-montserrat font-medium text-[13px] leading-[16px] text-choco-dark break-words whitespace-normal" title={review.product?.name}>
               {review.product?.name || 'Товар видалено'}
             </span>
             <div className="flex items-center gap-2">
                {renderStars(review.rating)}
             </div>
          </div>
        </div>

        {/* Статус */}
        <div className="flex flex-col items-start lg:w-[18%] w-full lg:pr-2 col-start-2 row-start-2 md:col-start-2 md:row-start-2 lg:order-4" onClick={(e) => e.stopPropagation()}>
           <SelectDropdown
              options={statusOptions}
              selected={review.status}
              onChange={handleStatusChange}
              disabled={updateStatusMutation.isPending}
           />
        </div>

        {/* Дії */}
        <div className="flex flex-row md:flex-col lg:flex-row items-center justify-start md:justify-end lg:w-[12%] w-full gap-3 col-start-2 row-start-3 md:col-start-3 md:row-start-1 md:row-span-2 lg:order-5 h-full py-1" onClick={(e) => e.stopPropagation()}>
           <div className="flex flex-row md:flex-col gap-2 lg:gap-2 justify-around md:h-full lg:h-auto">
             <button 
               onClick={() => setIsReplyModalOpen(true)}
               className="w-[32px] h-[32px] rounded-full bg-creamy border-choco-light/20 border text-choco-dark flex items-center justify-center hover:bg-choco-light/10 transition-colors"
               title="Відповісти"
             >
               <ReplyIcon className="w-[16px] h-[16px]" strokeWidth="2" />
             </button>
             <button 
               onClick={() => setIsDeleting(true)}
               className="w-[32px] h-[32px] rounded-full bg-[#FFEAE5] text-[#A63A3A] flex items-center justify-center hover:bg-[#FFD1D1] transition-colors"
               title="Видалити"
             >
               <TrashIcon className="w-[16px] h-[16px]" strokeWidth="2" />
             </button>
           </div>
           <div className={`transition-transform duration-300 flex items-center justify-center text-choco-light w-[30px] h-[30px] cursor-pointer ml-auto md:ml-0 md:mt-2 lg:mt-0 ${isOpen ? 'rotate-180' : ''}`} onClick={() => setIsOpen(!isOpen)}>
             <ChevronDownIcon strokeWidth="2" className="w-[24px] h-[24px]" />
          </div>
        </div>

      </div>

      {/* EXPANDED CONTENT */}
      {isOpen && (
        <div className="flex flex-col w-full px-[8px] pb-4 mt-4 gap-6 cursor-default" onClick={(e) => e.stopPropagation()}>
          
          <div className="w-full h-[1px] bg-choco-light opacity-20"></div>

          <div className="flex flex-col md:flex-row gap-8 w-full justify-between items-start">
             
             {/* Text Content */}
             <div className="flex flex-col gap-4 w-full md:w-[60%]">
                <div className="flex flex-col">
                  <span className="font-montserrat text-[12px] font-bold text-choco-light uppercase mb-1">Текст відгуку:</span>
                  <p className="font-montserrat text-[14px] text-choco-dark leading-[1.5] whitespace-pre-wrap">
                    {review.text || <span className="opacity-50 italic">Без коментаря</span>}
                  </p>
                </div>
                {review.adminReply && (
                  <div className="flex flex-col mt-2">
                    <span className="font-montserrat text-[12px] font-bold text-wine-red uppercase mb-1">Forchetta:</span>
                    <p className="font-montserrat text-[14px] text-choco-dark leading-[1.5] italic">
                      {review.adminReply}
                    </p>
                  </div>
                )}
             </div>

             {/* Product Image */}
             <div className="flex flex-col w-full md:w-[35%] gap-2 items-start md:items-end">
               {review.product?.images?.[0]?.url && (
                 <div className="w-[100px] h-[100px] border border-dark-creamy rounded-[10px] overflow-hidden bg-white">
                   <img 
                     src={review.product.images[0].url} 
                     alt={review.product.name} 
                     className="w-full h-full object-cover"
                   />
                 </div>
               )}
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
              Змінюємо статус цього відгуку на <br/><span className={`font-semibold ${statusTextColors[statusToConfirm]}`}>{REVIEW_STATUS_LABELS[statusToConfirm]}</span>?
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

      {/* Delete Confirmation Modal */}
      {isDeleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-choco-dark/40 backdrop-blur-sm px-[15px]" onClick={(e) => e.stopPropagation()}>
          <div className="bg-creamy rounded-[15px] border border-wine-red/20 shadow-lg p-[30px] max-w-[400px] flex flex-col gap-[20px] items-center text-center w-full">
            <h3 className="font-cormorant font-semibold text-[24px] text-[#A63A3A]">Видалення відгуку</h3>
            <p className="font-montserrat text-[16px] text-choco-light font-light leading-[22px]">
              Ви впевнені, що хочете видалити цей відгук назавжди? Ця дія незворотна.
            </p>
            <div className="flex flex-row justify-between w-full h-[46px] mt-2 gap-[10px]">
              <button 
                onClick={() => setIsDeleting(false)}
                className="w-1/2 rounded-[44px] bg-transparent border border-choco-light text-choco-light hover:bg-choco-light/10 transition-colors font-montserrat text-[14px]"
              >
                Скасувати
              </button>
              <button 
                onClick={() => deleteMutation.mutate(review._id)}
                className="w-1/2 rounded-[44px] bg-[#A63A3A] text-white hover:bg-[#8A2B2B] transition-colors font-montserrat text-[14px]"
              >
                Видалити
              </button>
            </div>
          </div>
        </div>
      )}

      <AdminReplyModal 
        isOpen={isReplyModalOpen} 
        onClose={() => setIsReplyModalOpen(false)} 
        review={review}
        onSubmit={handleReplySubmit}
      />
    </div>
  );
};

const ReviewList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [searchQuery, setSearchQuery] = useState('');
  
  const debouncedSearch = useFilterDebounce(searchQuery, 500, 2);

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ['admin_reviews', page, limit, debouncedSearch],
    queryFn: () => api.reviews.getAdminAll({ page, limit, search: debouncedSearch }),
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

  const reviews = data?.reviews || [];
  const totalPages = data?.totalPages || 0;

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Header & Controls */}
      <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-y-4 py-2 border-b border-light-creamy">
         
         {/* Total Summary */}
         <div className="flex items-center order-1 w-auto p-2">
            <span className="font-montserrat font-bold text-[15px] xl:text-[18px] text-choco-dark whitespace-nowrap">
              Всього відгуків: <span className="text-wine-red ml-1">{data?.total || 0}</span>
            </span>
         </div>
         
         {/* Search Input */}
         <div className="relative w-full sm:w-[500px] order-3 sm:order-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="w-[18px] h-[18px] text-choco-light opacity-50" strokeWidth="2" />
            </div>
            <input
              type="text"
              placeholder="Пошук (Ім'я, Email, Телефон, Назва товару)..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-choco-light/30 focus:border-wine-red focus:outline-none bg-transparent font-montserrat text-[14px] text-choco-dark placeholder-choco-light/50 transition-colors"
            />
         </div>

         <div className="flex items-center order-2 sm:order-3 w-auto justify-end">
            <TopPaginationControls 
               itemsPerPage={limit}
               onItemsPerPageChange={handleLimitChange}
            />
         </div>
      </div>

      {/* Table Headers */}
      <div className="hidden lg:flex w-full items-center py-4 bg-transparent border-b border-choco-light/20 pb-2 px-1">
        <div className="lg:w-[22%] font-montserrat font-bold text-[14px] text-choco-dark text-left">Покупець</div>
        <div className="lg:w-[25%] font-montserrat font-bold text-[14px] text-choco-dark text-left pl-2">Текст</div>
        <div className="lg:w-[23%] font-montserrat font-bold text-[14px] text-choco-dark text-left">Товар</div>
        <div className="lg:w-[18%] font-montserrat font-bold text-[14px] text-choco-dark text-left">Статус</div>
        <div className="lg:w-[12%] font-montserrat font-bold text-[14px] text-choco-dark text-center">Дії</div>
      </div>

      {/* Reviews List */}
      <div className="flex flex-col gap-[4px] w-full min-h-[500px]">
        {isDataLoading ? (
          Array.from({ length: 6 }).map((_, i) => <AdminReviewSkeleton key={i} />)
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <AdminReviewCard key={review._id} review={review} />
          ))
        ) : (
          <div className="flex justify-center items-center h-[300px] w-full text-choco-light font-montserrat">
            Немає відгуків
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
    </div>
  );
};

export default ReviewList;