import { useState } from 'react';
import { CatalogFilterIcon, CrossIcon, CheckIcon } from '../icons';

const CatalogHeader = ({ isFilterOpen, setIsFilterOpen }) => {
  const [sortOption, setSortOption] = useState('popular');
  const [isSortOpen, setIsSortOpen] = useState(false);

  const sortOptions = [
    { value: 'popular', label: 'За популярністю' },
    { value: 'price-asc', label: 'Від дешевих' },
    { value: 'price-desc', label: 'Від дорогих' },
    { value: 'new', label: 'Новинки' },
    { value: 'sales', label: 'Акції' },
    { value: 'bestsellers', label: 'Топ продажів' },
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto pl-[60px] pr-[60px]">
      <div className="flex flex-row justify-between items-center h-[35px] gap-[145px]">
        {/* Кнопка фільтрів */}
        <div className="flex flex-row items-center gap-[10px] w-[156px] h-[35px]">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="box-border flex flex-row justify-between items-center px-[10px] py-[5px] gap-[19px] w-[156px] h-[35px] bg-choco-light border border-choco-light rounded-[5px] transition-all duration-200 hover:opacity-90"
          >
            {/* Контейнер для иконки и текста */}
            <div className="flex flex-row items-center gap-[5px] w-[87px] h-[24px] text-creamy">
              <CatalogFilterIcon width={24} height={24} strokeWidth={2} />
              <span className="text-figma-base font-light text-center text-creamy w-[58px] h-[17px]">
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
        <div className="relative flex flex-row items-center gap-[10px] w-[150px] h-[35px]">
          <button 
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="box-border flex flex-row items-center px-[10px] py-[5px] gap-[5px] w-[150px] h-[35px] bg-creamy border border-choco-light rounded-[5px] transition-all duration-200 hover:opacity-90 text-choco-light"
          >
            <CatalogFilterIcon width={24} height={24} strokeWidth={2} />
            <span className="text-figma-base font-montserrat font-light text-center text-choco-light w-[86px] h-[17px]">
              Сортування
            </span>
          </button>
          
          {/* Выпадающий список */}
          {isSortOpen && (
            <div className="absolute top-[35px] left-0 z-50 flex flex-col items-start pt-[6px] px-[10px] pb-[15px] gap-[10px] w-[156px] min-h-[200px] bg-creamy rounded-b-[10px] shadow-lg">
              {sortOptions.map((option, index) => {
                const isSelected = sortOption === option.value;
                return (
                  <div
                    key={option.value}
                    onClick={() => {
                      setSortOption(option.value);
                      setIsSortOpen(false);
                    }}
                    className="flex flex-row justify-between items-center gap-[7px] w-[136px] h-[26px] cursor-pointer"
                  >
                    {isSelected ? (
                      <>
                        <div className="flex items-center w-[105px] h-[15px]">
                          <span className="text-figma-xs font-montserrat font-light text-choco-light-50">
                            {option.label}
                          </span>
                        </div>
                        <div className="flex items-center justify-center w-[24px] h-[24px]">
                          <CheckIcon width={24} height={24} strokeWidth={1.5} className="text-choco-light" />
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center w-[136px] h-[15px]">
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