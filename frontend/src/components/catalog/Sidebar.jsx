import { useState, useEffect } from 'react';
import * as Slider from '@radix-ui/react-slider';
import { CatalogFilterIcon, CheckIcon, CheckboxIcon } from '../icons';
import useCategoryStore from '../../stores/useCategoryStore';

// Компонент чекбокса
const Checkbox = ({ checked, onChange, children }) => (
  <div className="flex flex-row items-center gap-[10px] cursor-pointer" onClick={onChange}>
    <div className={`w-[22px] h-[22px] border border-choco-light rounded-[5px] flex items-center justify-center ${
      checked ? 'bg-choco-light' : 'bg-transparent'
    }`}>
      {checked && (
        <CheckboxIcon className="text-creamy" />
      )}
    </div>
    <span className="text-figma-md font-montserrat font-light text-choco-light whitespace-nowrap">
      {children}
    </span>
  </div>
);

const Sidebar = ({ className, onApplyFilters, products = [] }) => {
  const { categories, loading, fetchAllCategories } = useCategoryStore();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [priceRange, setPriceRange] = useState([1, 2500]);
  const [selectedWeights, setSelectedWeights] = useState([]);
  const [isWeightOpen, setIsWeightOpen] = useState(false);

  // Загружаем категории при монтировании компонента
  useEffect(() => {
    fetchAllCategories();
  }, [fetchAllCategories]);



  // Преобразуем категории из backend формата в frontend формат без количества товаров
  const categoryOptions = categories.map(category => ({
    value: category._id,
    label: category.name
  }));

  // Получаем уникальные значения веса из товаров
  const getUniqueWeights = () => {
    if (!products || products.length === 0) return [];
    
    const weights = products
      .map(product => product.weight)
      .filter(weight => weight != null)
      .sort((a, b) => a - b); // сортируем по возрастанию
    
    // Удаляем дубликаты
    const uniqueWeights = [...new Set(weights)];
    
    return uniqueWeights.map(weight => ({
      value: weight.toString(),
      label: weight >= 1000 ? `${weight / 1000} кг` : `${weight} г`
    }));
  };
  
  const weights = getUniqueWeights();

  const ingredients = [
    'З горіхами',
    'Без горіхів', 
    'Без пальмової олії',
    'Без лактози',
    'Без глютену'
  ];

  const handleCategoryChange = (categoryValue) => {
    setSelectedCategories(prev => 
      prev.includes(categoryValue)
        ? prev.filter(item => item !== categoryValue)
        : [...prev, categoryValue]
    );
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
    setSelectedCategories([]);
    setIsCategoryOpen(false);
    setSelectedIngredients([]);
    setPriceRange([1, 2500]);
    setSelectedWeights([]);
    setIsWeightOpen(false);
    
    // Применяем пустые фильтры
    if (onApplyFilters) {
      onApplyFilters({
        categories: [],
        ingredients: [],
        priceRange: [1, 2500],
        weights: []
      });
    }
  };

  const handleApplyFilters = () => {
    const filters = {
      categories: selectedCategories,
      ingredients: selectedIngredients,
      priceRange,
      weights: selectedWeights
    };
    
    console.log('Применены фильтры:', filters);
    
    // Передаем фильтры в родительский компонент
    if (onApplyFilters) {
      onApplyFilters(filters);
    }
  };

  return (
    <div className={`flex flex-col items-start gap-[40px] w-full sm:w-[300px] h-[691px] relative z-10 ${className || ''}`}>
      {/* Категорії */}
      <div className="relative flex flex-col gap-[20px] w-full">
        <h3 className="text-figma-lg font-montserrat font-light text-choco-light">Категорії</h3>
        
        <div className="relative">
          <button 
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="flex flex-row justify-between items-center px-[15px] py-[10px] gap-[10px] w-full h-[59px] bg-creamy border border-choco-light rounded-[10px] transition-all duration-200 hover:opacity-90"
          >
            <span className="text-figma-base font-montserrat font-light text-choco-light">
              {loading ? 'Завантаження...' : 'Виберіть категорію'}
            </span>
            <CatalogFilterIcon width={20} height={20} strokeWidth={2} className="text-choco-light" />
          </button>
          
          {/* Выпадающий список */}
          {isCategoryOpen && (
            <div className="absolute top-[59px] left-0 right-0 z-50 flex flex-col items-start pt-[6px] px-[10px] pb-[15px] gap-[10px] w-full min-h-[200px] bg-creamy border border-choco-light rounded-b-[10px] shadow-lg">
              {categoryOptions.map((category) => {
                const isSelected = selectedCategories.includes(category.value);
                return (
                  <div
                    key={category.value}
                    onClick={() => handleCategoryChange(category.value)}
                    className="flex flex-row justify-between items-center gap-[7px] w-full h-[26px] cursor-pointer"
                  >
                    <div className="flex items-center flex-1 h-[15px]">
                      <span className={`text-figma-xs font-montserrat font-light ${
                        isSelected ? 'text-choco-light-50' : 'text-choco-dark'
                      }`}>
                        {category.label}
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
      <div className="flex flex-col justify-center items-start px-[15px] py-[15px] gap-[20px] w-full min-h-[140px] border border-choco-light rounded-[10px]">
        <h3 className="text-figma-lg font-montserrat font-light text-choco-light w-[83px] h-[22px]">Ціна, грн</h3>

        <div className="flex flex-col items-start gap-[20px] w-full">
          <div className="flex flex-row justify-between items-center gap-[18px] w-full h-[30px]">
            <div className="flex flex-row justify-center items-center px-[8px] py-[4px] flex-1 h-[30px] border border-choco-light rounded-[5px] bg-creamy">
              <input 
                type="number" 
                min="1" 
                max="2500"
                value={priceRange[0]} 
                onChange={(e) => {
                  const value = parseInt(e.target.value) || priceRange[0];
                  setPriceRange([value, priceRange[1]]);
                }}
                onBlur={(e) => {
                  const value = parseInt(e.target.value) || 1;
                  const correctedValue = Math.min(Math.max(value, 1), priceRange[1] - 1);
                  setPriceRange([correctedValue, priceRange[1]]);
                }}
                className="w-full text-[10px] font-montserrat font-light text-choco-light bg-transparent outline-none text-center"
                placeholder="От"
              />
            </div>
            <div className="flex flex-row justify-center items-center px-[8px] py-[4px] flex-1 h-[30px] border border-choco-light rounded-[5px] bg-creamy">
              <input 
                type="number" 
                min="1" 
                max="2500"
                value={priceRange[1]} 
                onChange={(e) => {
                  const value = parseInt(e.target.value) || priceRange[1];
                  setPriceRange([priceRange[0], value]);
                }}
                onBlur={(e) => {
                  const value = parseInt(e.target.value) || 2500;
                  const correctedValue = Math.max(priceRange[0] + 1, Math.min(value, 2500));
                  setPriceRange([priceRange[0], correctedValue]);
                }}
                className="w-full text-[10px] font-montserrat font-light text-choco-light bg-transparent outline-none text-center"
                placeholder="До"
              />
            </div>
          </div>

          {/* Radix UI Slider */}
          <div className="w-full px-1">
            <Slider.Root
              className="relative flex items-center select-none touch-none w-full h-5"
              value={priceRange}
              min={1}
              max={2500}
              step={1}
              minStepsBetweenThumbs={1}
              onValueChange={(value) => setPriceRange(value)}
            >
              {/* Полоска (трек) */}
              <Slider.Track className="bg-dark-creamy relative grow rounded-full h-[2px]">
                {/* Активная часть между ползунками */}
                <Slider.Range className="absolute bg-choco-light rounded-full h-full" />
              </Slider.Track>

              {/* Левый ползунок */}
              <Slider.Thumb 
                className="block w-5 h-5 bg-creamy border-2 border-choco-light shadow-sm rounded-full hover:bg-white focus:outline-none focus:ring-2 focus:ring-choco-light/30 transition-colors cursor-pointer" 
                aria-label="Минимальная цена"
              />
              
              {/* Правый ползунок */}
              <Slider.Thumb 
                className="block w-5 h-5 bg-creamy border-2 border-choco-light shadow-sm rounded-full hover:bg-white focus:outline-none focus:ring-2 focus:ring-choco-light/30 transition-colors cursor-pointer" 
                aria-label="Максимальная цена"
              />
            </Slider.Root>
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
                ? `Вибрано: ${selectedWeights.map(w => {
                    const weight = parseInt(w);
                    return weight >= 1000 ? `${weight / 1000}кг` : `${weight}г`;
                  }).join(', ')}` 
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
          Скинути фільтр
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