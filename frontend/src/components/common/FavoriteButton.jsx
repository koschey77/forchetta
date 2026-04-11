import { HeartIcon, HeartSolidIcon } from '../icons/index.jsx';
import { useUserStore } from '../../stores/useUserStore';
import { useToggleFavorite } from '../../hooks/useToggleFavorite';

const FavoriteButton = ({ productId, className = "" }) => {
  const { user, openAuthModal } = useUserStore();
  const { mutate: toggleFavorite } = useToggleFavorite();
  
  // Проверяем, есть ли товар в избранном (user.favorites может быть массивом объектов или строк ID)
  const isFavorite = user?.favorites?.some((fav) => (fav._id || fav) === productId);

  const handleToggle = (e) => {
    e.preventDefault(); // Если кнопка внутри <Link src="...">, предотвращаем переход
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
