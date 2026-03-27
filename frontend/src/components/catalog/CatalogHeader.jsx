import { useState } from 'react';
import { CatalogFilterIcon, CrossIcon, CheckIcon } from '../icons';

const CatalogHeader = ({ isFilterOpen, setIsFilterOpen, onSortChange }) => {
  const [sortOption, setSortOption] = useState('');
  const [isSortOpen, setIsSortOpen] = useState(false);

  const sortOptions = [
    { value: 'price-asc', label: 'Від дешевих' },
    { value: 'price-desc', label: 'Від дорогих' },
    { value: 'new', label: 'Новинки' },
    { value: 'sales', label: 'Акції' },
    // { value: 'bestsellers', label: 'Топ продажів' }, // Пока нет статистики продаж
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:pl-[60px] sm:pr-[60px]">
      <div className="flex flex-row justify-between items-center h-[35px] gap-2 sm:gap-[145px]">
        {/* Кнопка фільтрів */}
        <div className="flex flex-row items-center gap-[10px] flex-1 sm:w-[156px] sm:flex-initial h-[35px]">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="box-border flex flex-row justify-between items-center px-[10px] py-[5px] gap-[19px] w-full sm:w-[156px] h-[35px] bg-choco-light border border-choco-light rounded-[5px] transition-all duration-200 hover:opacity-90"
          >
            {/* Контейнер для иконки и текста */}
            <div className="flex flex-row items-center gap-[5px] flex-1 sm:w-[87px] sm:flex-initial h-[24px] text-creamy">
              <CatalogFilterIcon width={24} height={24} strokeWidth={2} />
              <span className="text-figma-base font-light text-center text-creamy flex-1 sm:w-[58px] sm:flex-initial h-[17px]">
                Фільтри
              </span>
            </div>
            
            {/* Крестик справа при открытии или пустое место */}
            <div className="w-[20px] h-[20px] flex items-center justify-center text-creamy">
              {isFilterOpen && (
                <CrossIcon width={20} height={20} />
              )}
            </div>
          </button>
        </div>

        {/* Кнопка сортування */}
        <div className="relative flex flex-row items-center gap-[10px] flex-1 sm:w-[150px] sm:flex-initial h-[35px]">
          <button 
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="box-border flex flex-row items-center px-[10px] py-[5px] gap-[5px] w-full sm:w-[150px] h-[35px] bg-creamy border border-choco-light rounded-[5px] transition-all duration-200 hover:opacity-90 text-choco-light"
          >
            <CatalogFilterIcon width={24} height={24} strokeWidth={2} />
            <span className="text-figma-base font-montserrat font-light text-center text-choco-light flex-1 sm:w-[86px] sm:flex-initial h-[17px] whitespace-nowrap">
              {sortOptions.find(option => option.value === sortOption)?.label || 'Сортування'}
            </span>
          </button>
          
          {/* Выпадающий список */}
          {isSortOpen && (
            <div className="absolute top-[35px] left-0 right-0 sm:right-auto z-50 flex flex-col items-start pt-[6px] px-[10px] pb-[15px] gap-[10px] w-full sm:w-[156px] min-h-[200px] bg-creamy rounded-b-[10px] shadow-lg">
              {sortOptions.map((option) => {
                const isSelected = sortOption === option.value && sortOption !== '';
                return (
                  <div
                    key={option.value}
                    onClick={() => {
                      setSortOption(option.value);
                      setIsSortOpen(false);
                      if (onSortChange) {
                        onSortChange(option.value);
                      }
                    }}
                    className="flex flex-row justify-between items-center gap-[7px] w-full sm:w-[136px] h-[26px] cursor-pointer"
                  >
                    {isSelected ? (
                      <>
                        <div className="flex items-center flex-1 sm:w-[105px] sm:flex-initial h-[15px]">
                          <span className="text-figma-xs font-montserrat font-light text-choco-light-50">
                            {option.label}
                          </span>
                        </div>
                        <div className="flex items-center justify-center w-[24px] h-[24px]">
                          <CheckIcon width={24} height={24} strokeWidth={1.5} className="text-choco-light" />
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center flex-1 sm:w-[136px] sm:flex-initial h-[15px]">
                        <span className="text-figma-xs font-montserrat font-light text-choco-dark">
                          {option.label}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogHeader;