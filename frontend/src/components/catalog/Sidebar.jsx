import { useState } from 'react';
import { CatalogFilterIcon, CheckIcon } from '../icons';

// Компонент чекбокса
const Checkbox = ({ checked, onChange, children }) => (
  <div className="flex flex-row items-center gap-[10px] cursor-pointer" onClick={onChange}>
    <div className={`w-[22px] h-[22px] border border-choco-light rounded-[5px] flex items-center justify-center ${
      checked ? 'bg-choco-light' : 'bg-transparent'
    }`}>
      {checked && (
        <svg width="12" height="9" viewBox="0 0 12 9" fill="none" className="text-creamy">
          <path 
            d="M1 4.5L4 7.5L11 1" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
    <span className="text-figma-md font-montserrat font-light text-choco-light whitespace-nowrap">
      {children}
    </span>
  </div>
);

const Sidebar = ({ className, onCategoryChange }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [priceRange, setPriceRange] = useState([1, 2500]);
  const [selectedWeights, setSelectedWeights] = useState([]);
  const [isWeightOpen, setIsWeightOpen] = useState(false);

  // Фиктивный массив категорий
  const categories = [
    { value: "", label: "Всі категорії" },
    { value: "cakes", label: "Торти" },
    { value: "pastries", label: "Тістечка" },
    { value: "sweets", label: "Цукерки" },
    { value: "chocolate", label: "Шоколад" },
    { value: "bars", label: "Подарункові набори" },
  ]

  // Фиктивный массив весов для фильтрации
  const weights = [
    { value: "50-100", label: "50-100 г" },
    { value: "100-200", label: "100-200 г" },
    { value: "200-500", label: "200-500 г" },
    { value: "500-1000", label: "500 г - 1 кг" },
    { value: "1000+", label: "Більше 1 кг" },
  ];

  const ingredients = [
    'З горіхами',
    'Без горіхів', 
    'Без пальмової олії',
    'Без лактози',
    'Без глютену'
  ];

  const handleCategoryChange = (categoryValue) => {
    setSelectedCategory(categoryValue);
    setIsCategoryOpen(false);
    if (onCategoryChange) {
      onCategoryChange(categoryValue);
    }
  };

  const handleWeightChange = (weightValue) => {
    setSelectedWeights(prev => 
      prev.includes(weightValue)
        ? prev.filter(item => item !== weightValue)
        : [...prev, weightValue]
    );
  };

  const handleIngredientChange = (ingredient) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredient)
        ? prev.filter(item => item !== ingredient)
        : [...prev, ingredient]
    );
  };

  const handleClearAll = () => {
    setSelectedCategory('');
    setIsCategoryOpen(false);
    setSelectedIngredients([]);
    setPriceRange([1, 2500]);
    setSelectedWeights([]);
    setIsWeightOpen(false);
    if (onCategoryChange) {
      onCategoryChange('');
    }
  };

  const handleApplyFilters = () => {
    // TODO: Добавить логику применения фильтров
    console.log('Применены фильтры:', {
      category: selectedCategory,
      ingredients: selectedIngredients,
      priceRange,
      weights: selectedWeights
    });
  };

  return (
    <div className={`flex flex-col items-start gap-[40px] w-full sm:w-[300px] h-[691px] ${className || ''}`}>
      {/* Категорії */}
      <div className="relative flex flex-col gap-[20px] w-full">
        <h3 className="text-figma-lg font-montserrat font-light text-choco-light">Категорії</h3>
        
        <div className="relative">
          <button 
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="flex flex-row justify-between items-center px-[15px] py-[10px] gap-[10px] w-full h-[59px] bg-creamy border border-choco-light rounded-[10px] transition-all duration-200 hover:opacity-90"
          >
            <span className="text-figma-base font-montserrat font-light text-choco-light">
              {categories.find(cat => cat.value === selectedCategory)?.label || 'Всі категорії'}
            </span>
            <CatalogFilterIcon width={20} height={20} strokeWidth={2} className="text-choco-light" />
          </button>
          
          {/* Выпадающий список */}
          {isCategoryOpen && (
            <div className="absolute top-[59px] left-0 right-0 z-50 flex flex-col items-start pt-[6px] px-[10px] pb-[15px] gap-[10px] w-full min-h-[200px] bg-creamy border border-choco-light rounded-b-[10px] shadow-lg">
              {categories.map((category) => {
                const isSelected = selectedCategory === category.value;
                return (
                  <div
                    key={category.value}
                    onClick={() => handleCategoryChange(category.value)}
                    className="flex flex-row justify-between items-center gap-[7px] w-full h-[26px] cursor-pointer"
                  >
                    {isSelected ? (
                      <>
                        <div className="flex items-center flex-1 h-[15px]">
                          <span className="text-figma-xs font-montserrat font-light text-choco-light-50">
                            {category.label}
                          </span>
                        </div>
                        <div className="flex items-center justify-center w-[20px] h-[20px]">
                          <CheckIcon width={20} height={20} strokeWidth={1.5} className="text-choco-light" />
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center flex-1 h-[15px]">
                        <span className="text-figma-xs font-montserrat font-light text-choco-dark">
                          {category.label}
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

      {/* Склад */}
      <div className="flex flex-col items-start gap-[20px] w-full">
        <h3 className="text-figma-lg font-montserrat font-light text-choco-light">Склад</h3>

        <div className="flex flex-col items-start gap-[15px] w-full">
          {ingredients.map((ingredient) => (
            <Checkbox key={ingredient} checked={selectedIngredients.includes(ingredient)} onChange={() => handleIngredientChange(ingredient)}>
              {ingredient}
            </Checkbox>
          ))}
        </div>
      </div>

      {/* Ціна */}
      <div className="flex flex-col justify-center items-start px-[15px] py-[15px] gap-[20px] w-full h-[140px] border border-choco-light rounded-[5px]">
        <h3 className="text-figma-lg font-montserrat font-light text-choco-light w-[83px] h-[22px]">Ціна, грн</h3>

        <div className="flex flex-col items-start gap-[20px] w-full">
          {/* Поля ввода цены */}
          <div className="flex flex-row justify-between items-center gap-[18px] w-full h-[30px]">
            <div className="flex flex-row justify-between items-center px-[12px] py-[17px] flex-1 h-[30px] border border-choco-light rounded-[5px]">
              <span className="text-[10px] font-montserrat font-light text-choco-light w-[4px] h-[12px]">{priceRange[0]}</span>
            </div>
            <div className="flex flex-row justify-between items-center px-[12px] py-[17px] flex-1 h-[30px] border border-choco-light rounded-[5px]">
              <span className="text-[10px] font-montserrat font-light text-choco-light w-[25px] h-[12px]">{priceRange[1]}</span>
            </div>
          </div>

          {/* Слайдер */}
          <div className="relative w-full h-[18px]">
            {/* Основная полоса */}
            <div className="absolute w-full h-[11px] top-[4px] bg-dark-creamy rounded-[5px]"></div>

            {/* Активная часть */}
            <div
              className="absolute h-[11px] top-[4px] bg-choco-light rounded-[5px]"
              style={{
                left: `${(priceRange[0] / 2500) * 270}px`,
                width: `48px`,
              }}
            ></div>

            {/* Левый ползунок */}
            <div className="absolute w-[17px] h-[18px] left-0 bg-choco-light rounded-full cursor-pointer"></div>

            {/* Правый ползунок */}
            <div className="absolute w-[17px] h-[18px] bg-choco-light rounded-full cursor-pointer" style={{ left: "214px" }}></div>
          </div>
        </div>
      </div>

      {/* Вага */}
      <div className="relative flex flex-col gap-[20px] w-full">
        <h3 className="text-figma-lg font-montserrat font-light text-choco-light">Вага</h3>
        
        <div className="relative">
          <button 
            onClick={() => setIsWeightOpen(!isWeightOpen)}
            className="flex flex-row justify-between items-center px-[15px] py-[10px] gap-[10px] w-full h-[59px] bg-creamy border border-choco-light rounded-[10px] transition-all duration-200 hover:opacity-90"
          >
            <span className="text-figma-base font-montserrat font-light text-choco-light">
              {selectedWeights.length > 0 
                ? `Вибрано: ${selectedWeights.length}` 
                : 'Виберіть вагу'
              }
            </span>
            <CatalogFilterIcon width={20} height={20} strokeWidth={2} className="text-choco-light" />
          </button>
          
          {/* Выпадающий список */}
          {isWeightOpen && (
            <div className="absolute top-[59px] left-0 right-0 z-50 flex flex-col items-start pt-[6px] px-[10px] pb-[15px] gap-[10px] w-full min-h-[180px] bg-creamy border border-choco-light rounded-b-[10px] shadow-lg">
              {weights.map((weight) => {
                const isSelected = selectedWeights.includes(weight.value);
                return (
                  <div
                    key={weight.value}
                    onClick={() => handleWeightChange(weight.value)}
                    className="flex flex-row justify-between items-center gap-[7px] w-full h-[26px] cursor-pointer"
                  >
                    <div className="flex items-center flex-1 h-[15px]">
                      <span className={`text-figma-xs font-montserrat font-light ${
                        isSelected ? 'text-choco-light-50' : 'text-choco-dark'
                      }`}>
                        {weight.label}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="flex items-center justify-center w-[20px] h-[20px]">
                        <CheckIcon width={20} height={20} strokeWidth={1.5} className="text-choco-light" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Кнопки */}
      <div className="flex flex-row items-center gap-[19px] w-full h-[41px]">
        <button
          onClick={handleClearAll}
          className="flex flex-row justify-center items-center px-[30px] py-[10px] gap-[6px] flex-1 h-[41px] bg-creamy border border-choco-light rounded-[22.5px] text-figma-xs font-montserrat font-light text-choco-light hover:opacity-80 transition-opacity whitespace-nowrap"
        >
          Очистити все
        </button>
        <button
          onClick={handleApplyFilters}
          className="flex flex-row justify-center items-center px-[30px] py-[10px] gap-[6px] flex-1 h-[41px] bg-choco-light rounded-[22.5px] text-figma-xs font-montserrat font-light text-creamy hover:opacity-90 transition-opacity"
        >
          Пошук
        </button>
      </div>
    </div>
  )
};

export default Sidebar;