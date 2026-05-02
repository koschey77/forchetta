import { HeartIcon, HeartSolidIcon } from '../icons/index.jsx';
import { useUserStore } from '../../stores/useUserStore';
import { useToggleFavorite } from '../../hooks/useToggleFavorite';

const FavoriteButton = ({ productId, className = "" }) => {
  const { user, openAuthModal } = useUserStore();
  const { mutate: toggleFavorite } = useToggleFavorite();
  
  // Перевіряємо, чи є товар в обраному (user.favorites може бути масивом об'єктів або рядків ID)
  const isFavorite = user?.favorites?.some((fav) => (fav._id || fav) === productId);

  const handleToggle = (e) => {
    e.preventDefault(); // Якщо кнопка всередині <Link src="...">, запобігаємо переходу
    e.stopPropagation();
    
    if (!user) {
      openAuthModal();
      return;
    }
    
    toggleFavorite(productId);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isFavorite ? "Видалити з улюбленого" : "Додати в улюблене"}
      className={`flex items-center justify-center transition-transform hover:scale-110 outline-none focus:outline-none ${className}`}
    >
      {isFavorite ? (
        <HeartSolidIcon className="w-[30px] h-[30px] text-creamy transition-colors" />
      ) : (
        <HeartIcon className="w-[30px] h-[30px] text-creamy hover:text-creamy/70 transition-colors" strokeWidth={1} />
      )}
    </button>
  );
};

export default FavoriteButton;
