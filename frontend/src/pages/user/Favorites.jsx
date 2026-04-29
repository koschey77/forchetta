import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '../../stores/useUserStore';
import useCartStore from '../../stores/useCartStore';
import ProductCard from '../../components/catalog/ProductCard';
import { userAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Favorites = () => {
  const { user } = useUserStore();
  const { addToCart } = useCartStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: userAPI.getProfile,
    staleTime: 5 * 60 * 1000,
  });

  const { mutate: clearAllFavorites, isPending: isClearing } = useMutation({
    mutationFn: async (itemsToClear) => {
      for (const item of itemsToClear) {
        await userAPI.toggleFavorite(item.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      useUserStore.setState((state) => ({ user: { ...state.user, favorites: [] } }));
      toast.success('Список бажань очищено');
    },
    onError: () => {
      toast.error('Помилка при очищенні списку бажань');
    }
  });

  const storeHasObjects = user?.favorites?.some(f => typeof f === 'object' && f.name);

  const rawFavorites = (storeHasObjects ? user?.favorites : profile?.favorites) || user?.favorites || [];
  
  const favorites = rawFavorites.filter(fav => typeof fav === 'object' && fav.name);

  if (isLoading && favorites.length === 0) {
    return (
      <div className="flex flex-col gap-6 w-full pb-16 min-h-[580px] justify-center items-center">
        <div className="w-10 h-10 border-4 border-choco-light border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center px-[15px] sm:px-5 pt-[30px] sm:pt-5 pb-16 gap-[35px] w-full min-h-[321px] sm:min-h-[580px] rounded-[10px]">
        <div className="flex flex-col items-center gap-[35px] w-full max-w-[447px]">
          
          <div className="flex flex-col items-center gap-0 sm:gap-[2px] w-[205px] sm:w-full">
            <img 
              src="/image34.png" 
              alt="Порожній список бажань" 
              className="w-[205px] h-[202px] sm:w-[395px] sm:h-[390px] object-contain"
            />
            <h2 className="font-montserrat font-light sm:font-semibold text-[18px] sm:text-[24px] leading-[22px] sm:leading-[29px] text-choco-light text-center w-[205px] sm:w-auto">
              Упс! Ваш список бажань порожній
            </h2>
          </div>
          
          <Link 
            to="/catalog"
            className="flex flex-row justify-center items-center px-[30px] py-[16px] gap-[10px] w-[235px] sm:w-[310px] h-[40px] bg-wine-red rounded-[30px] transition-opacity hover:opacity-90"
          >
            <span className="font-montserrat font-medium sm:font-normal text-[14px] sm:text-[16px] leading-[17px] sm:leading-[20px] text-creamy text-center">
              Перейти до каталогу
            </span>
          </Link>
          
        </div>
      </div>
    );
  }

  const favoritesList = favorites.map(backendProduct => {
    let tag = null;
    if (backendProduct.discountPrice && backendProduct.discountPrice > 0) {
      const discount = Math.round((1 - backendProduct.discountPrice / backendProduct.price) * 100);
      tag = { text: `-${discount}%`, type: "red" };
    }
    
    return {
      ...backendProduct, 
      id: backendProduct._id,
      title: backendProduct.name,
      price: `${backendProduct.discountPrice || backendProduct.price} грн / ${backendProduct.weight} г`,
      oldPrice: backendProduct.discountPrice ? `${backendProduct.price} грн` : null,
      images: backendProduct.images, 
      tag,
    };
  });

  const handleBuyAll = async () => {
    try {
      for (const item of favoritesList) {
        await addToCart(item, 1);
      }
      toast.success('Всі товари додано до кошика!');
      navigate('/cart');
    } catch (error) {
      console.error(error);
      toast.error('Помилка при додаванні товарів до кошика');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-16">
      <div className="flex w-full py-2">
        <div className="flex flex-row items-center gap-[10px] w-full sm:w-auto">
          <button 
            className="flex flex-1 sm:flex-none justify-center items-center sm:w-[130px] h-[40px] bg-wine-red rounded-[31px] transition-opacity hover:opacity-90 disabled:opacity-50"
            onClick={handleBuyAll}
          >
            <span className="font-montserrat font-normal text-[16px] leading-[20px] text-creamy whitespace-nowrap">
              Купити все
            </span>
          </button>
          
          <button 
            className="flex flex-1 sm:flex-none justify-center items-center sm:w-[130px] h-[40px] border border-choco-light rounded-[72px] transition-colors hover:bg-dark-creamy/30 disabled:opacity-50"
            onClick={() => clearAllFavorites(favoritesList)}
            disabled={isClearing}
          >
            <span className="font-montserrat font-normal text-[16px] leading-[20px] text-choco-light whitespace-nowrap">
              Очистити все
            </span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-7 sm:gap-x-5 sm:gap-y-10 mt-2">
        {favoritesList.map((product) => (
          <ProductCard key={product._id || product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Favorites;
