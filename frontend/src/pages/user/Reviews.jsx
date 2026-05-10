import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Error404 from '../../components/errors/Error404';
import LoadingSpinner from '../../components/LoadingSpinner';
import ReviewModal from '../../components/common/ReviewModal';
import { EditIcon, BasketIcon } from '../../components/icons/index.jsx';

const EmptyReviewsState = () => (

  <div className="flex flex-col items-center justify-center py-[40px] px-[20px] text-center w-full max-w-[500px] mx-auto min-h-[50vh]">
    <img 
      src="https://res.cloudinary.com/dmdlogqqf/image/upload/v1778392105/reviews_hccgff.png" 
      alt="Немає відгуків" 
      className="w-full max-w-[300px] h-auto object-contain mb-[30px]"
    />
    <h3 className="font-montserrat font-semibold text-[20px] sm:text-[32px] leading-[26px] sm:leading-[39px] text-choco-light text-center w-full mb-[15px]">
      У вас ще немає жодного замовлення
    </h3>
    <p className="font-montserrat font-medium text-[14px] sm:text-[18px] leading-[18px] sm:leading-[22px] text-choco-light text-center w-full mb-[30px]">
      Не знаєте, з чого почати? Перегляньте наші бестселери!
    </p>
    <Link 
      to="/catalog"
      className="flex flex-row justify-center items-center px-[30px] py-[16px] gap-[10px] w-auto sm:w-[235px] h-[40px] bg-wine-red rounded-[31px] transition-opacity hover:opacity-90 mt-[5px]"
    >
      <span className="font-montserrat font-normal text-[14px] sm:text-[16px] leading-[17px] sm:leading-[20px] text-creamy text-center">
        Перейти до каталогу
      </span>
    </Link>
  </div>
);

const ReviewAccordion = ({ review, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col box-border border border-[#705A5A] bg-[#F5EEE0] rounded-[10px] w-full transition-all duration-300 overflow-hidden">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-row justify-between items-center w-full p-[20px_15px] md:p-[38px_70px_37px_40px] cursor-pointer bg-[#F5EEE0] shrink-0"
      >
        <div className="flex flex-row items-center gap-[30px]">
          {review.product?.images?.[0]?.url ? (
            <img 
              src={review.product.images[0].url} 
              alt={review.product.name} 
              className="w-[80px] h-[80px] md:w-[150px] md:h-[150px] object-cover rounded-[10px] shrink-0"
            />
          ) : (
            <div className="w-[80px] h-[80px] md:w-[150px] md:h-[150px] bg-dark-creamy rounded-[10px] shrink-0"></div>
          )}
          <h4 className="w-[171px] md:w-[302px] font-montserrat font-semibold text-[18px] leading-[22px] text-choco-light break-words line-clamp-3 md:line-clamp-none">
            {review.product?.name}
          </h4>
        </div>
        
        <div className="shrink-0 flex items-center gap-[15px]">
          <div className="hidden md:flex items-center gap-[10px] mr-[20px]" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => onEdit(review)} className="p-[8px] hover:bg-white/50 rounded-full transition-colors" title="Редагувати">
              <EditIcon className="w-[18px] h-[18px]" />
            </button>
            <button onClick={() => onDelete(review._id)} className="p-[8px] hover:bg-white/50 rounded-full transition-colors text-wine-red" title="Видалити">
              <BasketIcon className="w-[18px] h-[18px]" />
            </button>
          </div>
          <svg 
            className={`w-[30px] h-[25px] md:w-[40px] md:h-[35px] text-choco-light transition-transform duration-300 ${isOpen ? 'rotate-0' : 'rotate-180'}`} 
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="6 15 12 9 18 15"></polyline>
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="p-[0_15px_20px_15px] md:p-[0_70px_37px_40px] flex flex-col gap-[15px] animate-fade-in bg-[#F5EEE0]">
          <div className="w-full h-[1px] bg-[#d2c5b3] mb-[5px] md:mb-[10px]"></div>
          
          <div className="flex flex-row justify-between items-start">
            <div className="flex items-center gap-[2px]">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-[20px] h-[20px] md:w-[24px] md:h-[24px] ${i < review.rating ? 'text-[#DCA92A]' : 'text-[#E3D6BF]'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            
            <div className="flex flex-col items-end gap-[5px]">
              <div className="flex md:hidden items-center gap-[10px] mb-[5px]" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => onEdit(review)} className="p-[5px] hover:bg-white/50 rounded-full transition-colors" title="Редагувати">
                  <EditIcon className="w-[14px] h-[14px]" />
                </button>
                <button onClick={() => onDelete(review._id)} className="p-[5px] hover:bg-white/50 rounded-full transition-colors text-wine-red" title="Видалити">
                  <BasketIcon className="w-[14px] h-[14px]" />
                </button>
              </div>
              <span className="text-[12px] md:text-[14px] text-choco-light font-montserrat">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
              <span className={`text-[12px] px-[10px] py-[3px] rounded-full font-montserrat ${
                review.status === 'published' ? 'bg-green-100 text-green-700' :
                review.status === 'rejected' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {review.status === 'published' ? 'Опубліковано' : review.status === 'rejected' ? 'Відхилено' : 'На модерації'}
              </span>
            </div>
          </div>

          <p className="font-montserrat text-choco-dark text-[14px] md:text-[16px] leading-[1.5] whitespace-pre-wrap">
            {review.text}
          </p>

          {review.adminReply && (
            <div className="flex flex-col mt-[10px]">
              <span className="font-montserrat text-[12px] font-bold text-wine-red uppercase mb-[5px] block">Forchetta:</span>
              <p className="font-montserrat text-choco-dark text-[14px] leading-[1.5] italic">
                {review.adminReply}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Reviews = () => {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' або 'my-reviews'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  
  const queryClient = useQueryClient();

  const { data: pendingProducts, isLoading: pendingLoading, error: pendingError } = useQuery({
    queryKey: ['pending_reviews'],
    queryFn: api.reviews.getPending,
  });

  const { data: myReviews, isLoading: myReviewsLoading, error: myReviewsError } = useQuery({
    queryKey: ['my_reviews'],
    queryFn: api.reviews.getMyReviews,
  });

  const createReviewMutation = useMutation({
    mutationFn: api.reviews.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['pending_reviews']);
      queryClient.invalidateQueries(['my_reviews']);
      setIsModalOpen(false);
      setSelectedProduct(null);
      setSelectedReview(null);
    }
  });

  const updateReviewMutation = useMutation({
    mutationFn: ({ id, data }) => api.reviews.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['my_reviews']);
      setIsModalOpen(false);
      setSelectedProduct(null);
      setSelectedReview(null);
    }
  });

  const deleteReviewMutation = useMutation({
    mutationFn: api.reviews.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['my_reviews']);
    }
  });

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setSelectedReview(null);
    setIsModalOpen(true);
  };

  const handleEdit = (review) => {
    setSelectedReview(review);
    setSelectedProduct(review.product);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Ви дійсно хочете видалити цей відгук?")) {
      deleteReviewMutation.mutate(id);
    }
  };

  const handleSubmitReview = (data) => {
    if (selectedReview) {
      updateReviewMutation.mutate({ id: selectedReview._id, data: { rating: data.rating, text: data.text } });
    } else {
      createReviewMutation.mutate(data);
    }
  };

  const isLoading = activeTab === 'pending' ? pendingLoading : myReviewsLoading;

  const error = activeTab === 'pending' ? pendingError : myReviewsError;

  if (isLoading) return (
    <div className="w-full flex justify-center py-20">
      <LoadingSpinner className="w-10 h-10 text-wine-red" />
    </div>
  );

  if (error) return <Error404 />;

  // Якщо нічого не очікує на оцінку і немає жодного відгуку - показуємо загальний порожній стан
  if (activeTab === 'pending' && (!pendingProducts || pendingProducts.length === 0)) {
    return <EmptyReviewsState />;
  }

  return (
    <div className="w-full animate-fade-in">
      <h2 className="font-cormorant font-medium text-[32px] lg:text-[40px] text-choco-dark leading-[1.2] mb-[20px] lg:mb-[30px]">
        Мої відгуки
      </h2>

      {/* Tabs */}
      <div className="flex border-b border-dark-creamy mb-[30px]">
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-[15px] px-[5px] mr-[30px] font-montserrat text-[16px] transition-all relative ${
            activeTab === 'pending'
              ? 'text-choco-dark font-medium'
              : 'text-choco-light hover:text-choco-dark'
          }`}
        >
          Очікують на оцінку
          {activeTab === 'pending' && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-wine-red" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('my-reviews')}
          className={`pb-[15px] px-[5px] font-montserrat text-[16px] transition-all relative ${
            activeTab === 'my-reviews'
              ? 'text-choco-dark font-medium'
              : 'text-choco-light hover:text-choco-dark'
          }`}
        >
          Мої відгуки
          {activeTab === 'my-reviews' && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-wine-red" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="w-full">
        {activeTab === 'pending' ? (
          <div className="flex flex-col gap-[20px]">
            {pendingProducts?.map(product => (
              <div key={product._id} className="flex flex-col md:flex-row justify-center md:justify-between items-start md:items-center p-[20px_15px] md:p-[20px_70px_20px_40px] gap-[20px] md:gap-0 w-full h-[190px] border border-choco-light rounded-[10px] transition-all hover:shadow-md">
                <div className="flex flex-row items-center gap-[30px] w-full md:w-auto">
                  {product.images?.[0]?.url ? (
                    <img 
                      src={product.images[0].url} 
                      alt={product.name} 
                      className="w-[80px] h-[80px] md:w-[150px] md:h-[150px] object-cover rounded-[10px] shrink-0" 
                    />
                  ) : (
                    <div className="w-[80px] h-[80px] md:w-[150px] md:h-[150px] bg-dark-creamy rounded-[10px] shrink-0"></div>
                  )}
                  <h4 className="font-montserrat font-normal md:font-semibold text-[16px] md:text-[18px] leading-[20px] md:leading-[22px] text-choco-light w-full max-w-[231px] md:max-w-[319px]">
                    {product.name}
                  </h4>
                </div>
                <button 
                  onClick={() => handleOpenModal(product)}
                  className="flex items-center justify-center p-[10px_100px] md:p-[20px_50px] w-full md:w-[230px] h-[40px] md:h-[60px] bg-choco-light text-creamy rounded-[8px] font-montserrat font-normal md:font-medium text-[16px] leading-[20px] transition-colors hover:bg-choco-dark shrink-0"
                >
                  Залишити відгук
                </button>
              </div>
            ))}
          </div>

        ) : (
          <div className="flex flex-col gap-[20px]">
            {(!myReviews || myReviews.length === 0) ? (
              <p className="text-choco-light font-montserrat mt-[20px]">Ви ще не залишили жодного відгуку.</p>
            ) : (
              myReviews.map(review => (
                <ReviewAccordion key={review._id} review={review} onEdit={handleEdit} onDelete={handleDelete} />
              ))
            )}
          </div>
        )}
      </div>

      <ReviewModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onSubmit={handleSubmitReview}
        initialReview={selectedReview}
      />
    </div>
  );
};

export default Reviews;

