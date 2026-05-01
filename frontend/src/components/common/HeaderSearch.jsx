import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '../../services/api';
import useFilterDebounce from '../../hooks/useFilterDebounce';
import useFilterStore from '../../stores/useFilterStore';
import { SearchIcon, CrossIcon } from '../icons';

const HeaderSearch = ({ isMobile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedTerm = useFilterDebounce(searchTerm, 400, 2);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const setSearchFilter = useFilterStore(state => state.setSearchFilter);

  // Fetch products
  const { data, isLoading } = useQuery({
    queryKey: ['live-search', debouncedTerm],
    queryFn: () => productsAPI.getMany({ search: debouncedTerm, limit: 5 }),
    enabled: debouncedTerm.length >= 2,
    staleTime: 60 * 1000 * 5, // 5 min
  });

  const searchResults = data?.products || [];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (searchTerm.trim().length > 0) {
      setSearchFilter(searchTerm.trim());
      navigate(`/catalog?search=${encodeURIComponent(searchTerm.trim())}`);
      handleClose();
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    handleClose();
  };

  // IconButton component matches the one in Header.jsx
  const IconButton = ({ icon: Icon, onClick, strokeWidth = 2 }) => (
    <button 
      type="button"
      aria-label="Поиск"
      onClick={onClick}
      className={`relative rounded-full p-1 transition duration-300 hover:bg-dark-creamy/60 shrink-0`}
    >
      <Icon className="text-choco-light" strokeWidth={strokeWidth} />
    </button>
  );

  return (
    <div ref={containerRef} className={`relative flex items-center ${isOpen ? 'z-50' : 'z-auto'}`}>
      {!isOpen ? (
        <IconButton icon={SearchIcon} onClick={handleOpen} strokeWidth={isMobile ? 2 : 2.5} />
      ) : (
        <>
          {/* Для мобильных: полноэкранный overlay на высоту хедера, для десктопа: расширяющийся инпут */}
          <div className={`
            ${isMobile 
              ? 'fixed inset-y-0 left-0 right-0 h-[87px] bg-creamy px-[15px] flex items-center justify-between shadow-md' 
              : 'absolute right-0 flex items-center bg-light-creamy border border-choco-light/30 rounded-full w-[300px] shadow-lg transition-all duration-300'
            }
          `}>
            <form onSubmit={handleSubmit} className="flex-1 flex items-center w-full h-[40px] px-3 relative">
              <SearchIcon className="text-choco-light/50 shrink-0 mr-2 w-5 h-5" strokeWidth={2} />
              
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Пошук тортів та десертів..."
                className="w-full bg-transparent outline-none text-figma-sm text-choco-dark placeholder-choco-light/50"
                autoComplete="off"
              />
              
              {searchTerm && (
                <button 
                  type="button" 
                  onClick={() => setSearchTerm('')} 
                  className="p-1 hover:bg-dark-creamy/40 rounded-full transition-colors"
                >
                  <CrossIcon className="w-4 h-4 text-choco-light shrink-0" strokeWidth={2} />
                </button>
              )}
            </form>
            
            {isMobile && (
              <button 
                type="button" 
                onClick={handleClose}
                className="ml-3 text-choco-light text-figma-sm font-medium whitespace-nowrap"
              >
                Скасувати
              </button>
            )}
          </div>

          {/* Выпадающий список (Dropdown) с результатами */}
          {isOpen && searchTerm.length >= 2 && (
            <div className={`
              bg-creamy border border-choco-light/10 shadow-xl overflow-hidden flex flex-col z-[100]
              ${isMobile 
                ? 'fixed top-[87px] left-0 w-full rounded-b-2xl border-x-0 border-t-0' 
                : 'absolute rounded-2xl top-[48px] right-0 w-[350px]'
              }
            `}>
              {/* Показываем скелетон или результаты */}
              {isLoading ? (
                <div className="p-4 flex justify-center text-choco-light/70 text-figma-sm">
                  Шукаємо...
                </div>
              ) : searchResults.length > 0 ? (
                <div>
                  <div className="max-h-[450px] overflow-y-auto overflow-x-hidden scrollbar-none">
                    {searchResults.map((product) => (
                      <button
                        key={product._id}
                        onClick={() => handleProductClick(product._id)}
                        className="w-full flex items-center gap-3 p-3 border-b border-choco-light/10 hover:bg-light-creamy transition-colors text-left"
                      >
                        {/* Миниатюра */}
                        <div className="w-[40px] h-[40px] rounded-lg overflow-hidden shrink-0 bg-dark-creamy">
                          {product.images && product.images[0] ? (
                            <img 
                              src={product.images[0].url} 
                              alt={product.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-choco-light text-[10px]">
                              Без фото
                            </div>
                          )}
                        </div>
                        
                        {/* Инфо */}
                        <div className="flex-1 overflow-hidden">
                          <h4 className="text-figma-sm font-medium text-choco-dark truncate">{product.name}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            {product.discountPrice > 0 ? (
                              <>
                                <span className="text-figma-xs font-bold text-wine-red">{product.discountPrice} ₴</span>
                                <span className="text-[10px] line-through text-choco-light/60">{product.price} ₴</span>
                              </>
                            ) : (
                              <span className="text-figma-xs font-bold text-choco-dark">{product.price} ₴</span>
                            )}
                            <span className="text-[10px] text-choco-light/70">• {product.weight} г</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Кнопка "Смотреть все" */}
                  <button 
                    onClick={handleSubmit}
                    className="w-full p-3 text-center text-figma-sm font-semibold text-choco-light bg-creamy border-t border-choco-light/10 hover:bg-dark-creamy/50 transition-colors"
                  >
                    Всі результати ({data?.pagination?.total || 0})
                  </button>
                </div>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-figma-sm text-choco-light/70">
                    За вашим запитом «{searchTerm}» нічого не знайдено.
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HeaderSearch;