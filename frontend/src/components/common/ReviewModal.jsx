import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { 
  CloseIcon, 
  ClockIcon, 
  PickupIcon, 
  TemperatureIcon, 
  SupportIcon, 
  WeightIcon,
  StarIcon,
  ContactLocationIcon,
  SmileIcon,
  SadIcon
} from '../icons/index.jsx';

const IMPRESSIONS = [
  { id: 'as_pictured', label: 'Як на фото', Icon: SmileIcon },
  { id: 'on_time', label: 'Без затримок', Icon: ClockIcon },
  { id: 'convenient_pickup', label: 'Зручний самовивіз', Icon: ContactLocationIcon },
  { id: 'good_packaging', label: 'Гарне пакування', Icon: PickupIcon },
  { id: 'arrived_cold', label: 'Приїхало охолодженим', Icon: TemperatureIcon },
  { id: 'not_fresh', label: 'Не свіже', Icon: SadIcon },
  { id: 'late', label: 'Невчасно', Icon: SadIcon },
  { id: 'fast_confirmation', label: 'Швидке підтвердження', Icon: SupportIcon },
  { id: 'undamaged', label: 'Все ціле', Icon: WeightIcon },
];

const ReviewModal = ({ isOpen, onClose, product, onSubmit, initialReview = null }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedImpressions, setSelectedImpressions] = useState([]);
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialReview) {
        setRating(initialReview.rating || 0);
        
        let initialText = initialReview.text || '';
        let extractedImpressions = [];
        let extractedComment = initialText;

        // Try to parse "Враження: ... \n\n Коментар"
        if (initialText.startsWith('Враження:')) {
          const parts = initialText.split('\n\n');
          const impressionsPart = parts[0].replace('Враження:', '').trim();
          const impressionLabels = impressionsPart.split(',').map(s => s.trim());
          
          extractedImpressions = IMPRESSIONS.filter(imp => impressionLabels.includes(imp.label)).map(imp => imp.id);
          
          if (parts.length > 1) {
            extractedComment = parts.slice(1).join('\n\n');
          } else {
            extractedComment = '';
          }
        }

        setSelectedImpressions(extractedImpressions);
        setComment(extractedComment);
        setIsOtherSelected(extractedComment.length > 0);
      } else {
        setRating(0);
        setSelectedImpressions([]);
        setIsOtherSelected(false);
        setComment('');
      }
      setHoveredRating(0);
    }
  }, [isOpen, initialReview]);

  const toggleImpression = (id) => {
    setSelectedImpressions(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (rating === 0) return; // Prevent submission without rating
    
    const impressionTexts = selectedImpressions.map(id => 
      IMPRESSIONS.find(i => i.id === id)?.label
    ).filter(Boolean);

    let finalComment = comment;
    if (impressionTexts.length > 0) {
      finalComment = `Враження: ${impressionTexts.join(', ')}\n\n${comment}`.trim();
    }

    onSubmit({
      productId: product?._id,
      rating,
      text: finalComment
    });
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

          <div className="flex flex-col md:flex-row items-center justify-between mb-[30px]">
            <div>
              <Dialog.Title className="font-montserrat font-semibold text-[24px] leading-[29px] text-choco-dark mb-[15px]">
                Оцініть товар
              </Dialog.Title>
              <div className="flex gap-[10px]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none text-[#FFD700] hover:scale-110 transition-transform"
                  >
                    <StarIcon fill={star <= (hoveredRating || rating) ? "currentColor" : "none"} className="w-[30px] h-[30px] md:w-[35px] md:h-[35px]" />
                  </button>
                ))}
              </div>
            </div>
            
            {product && (
              <div className="mt-[20px] md:mt-0 flex flex-col items-center gap-[10px]">
                {product.images?.[0]?.url ? (
                  <img src={product.images[0].url} alt={product.name} className="w-[90px] h-[90px] md:w-[110px] md:h-[110px] object-cover rounded-[10px]" />
                ) : (
                  <div className="w-[90px] h-[90px] md:w-[110px] md:h-[110px] bg-dark-creamy rounded-[10px]"></div>
                )}
                <span className="font-montserrat text-[14px] text-choco-light text-center">{product.name}</span>
              </div>
            )}
          </div>

          <h3 className="font-montserrat font-semibold text-[24px] leading-[29px] text-choco-dark mb-[20px]">
            Залиште відгук
          </h3>

          <div className="mb-[30px]">
            <p className="font-montserrat text-[14px] text-choco-light mb-[15px]">Враження від замовлення</p>
            <div className="flex flex-wrap gap-[15px] mb-[15px]">
              {IMPRESSIONS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleImpression(id)}
                  className={`flex items-center gap-[8px] font-montserrat text-[14px] transition-colors ${selectedImpressions.includes(id) ? 'text-wine-red' : 'text-choco-light hover:text-choco-dark'}`}
                >
                  <Icon className="w-[18px] h-[18px]" />
                  {label}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-[10px] cursor-pointer w-fit">
              <div className={`w-[24px] h-[24px] rounded-[5px] border flex items-center justify-center transition-colors ${isOtherSelected ? 'bg-wine-red border-wine-red' : 'border-[#d2c5b3]'}`} onClick={() => setIsOtherSelected(!isOtherSelected)}>
                {isOtherSelected && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
              </div>
              <span className="font-montserrat text-[14px] text-choco-light" onClick={() => setIsOtherSelected(!isOtherSelected)}>Інше</span>
            </label>
          </div>

          {isOtherSelected && (
            <div className="flex flex-col gap-[10px] mb-[30px] animate-fade-in">
              <label className="font-montserrat text-[14px] text-choco-light">Коментар</label>
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                autoFocus
                className="w-full h-[150px] border border-[#d2c5b3] rounded-[15px] p-[20px] font-montserrat text-[16px] text-choco-dark bg-transparent outline-none focus:border-choco-light resize-none"
              />
            </div>
          )}

          <button 
            onClick={handleSubmit}
            disabled={rating === 0}
            className="w-full h-[40px] bg-[#893E3E] hover:bg-[#6a2a2a] disabled:opacity-50 disabled:cursor-not-allowed border border-[#705A5A] text-[#F5F7F8] rounded-[31px] font-montserrat font-normal text-[16px] leading-[20px] transition-colors flex items-center justify-center p-[12px_20px]"
          >
            Залишити відгук
          </button>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ReviewModal;
