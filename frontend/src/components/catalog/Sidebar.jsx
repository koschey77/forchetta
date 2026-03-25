import { useState } from 'react';

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

const Sidebar = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [priceRange, setPriceRange] = useState([1, 2500]);
  const [selectedWeight, setSelectedWeight] = useState('');

  const ingredients = [
    'З горіхами',
    'Без горіхів', 
    'Без пальмової олії',
    'Без лактози',
    'Без глютену'
  ];

  const handleIngredientChange = (ingredient) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredient)
        ? prev.filter(item => item !== ingredient)
        : [...prev, ingredient]
    );
  };

  const handleClearAll = () => {
    setSelectedCategory('');
    setSelectedIngredients([]);
    setPriceRange([1, 2500]);
    setSelectedWeight('');
  };

  const handleApplyFilters = () => {
    // TODO: Добавить логику применения фильтров
    console.log('Применены фильтры:', {
      category: selectedCategory,
      ingredients: selectedIngredients,
      priceRange,
      weight: selectedWeight
    });
  };

  return (
    <div className="flex flex-col items-start gap-[40px] w-[300px] h-[691px]">
      {/* Категорії */}
      <div className="flex flex-row items-center px-[15px] py-[10px] gap-[10px] w-[300px] h-[59px] bg-creamy border border-choco-light rounded-[10px]">
        <h3 className="text-figma-lg font-montserrat font-light text-choco-light">Категорії</h3>
      </div>

      {/* Склад */}
      <div className="flex flex-col items-start gap-[20px] w-[300px]">
        <h3 className="text-figma-lg font-montserrat font-light text-choco-light">Склад</h3>

        <div className="flex flex-col items-start gap-[15px] w-[300px]">
          {ingredients.map((ingredient) => (
            <Checkbox key={ingredient} checked={selectedIngredients.includes(ingredient)} onChange={() => handleIngredientChange(ingredient)}>
              {ingredient}
            </Checkbox>
          ))}
        </div>
      </div>

      {/* Ціна */}
      <div className="flex flex-col justify-center items-start px-[15px] py-[15px] gap-[20px] w-[300px] h-[140px] border border-choco-light rounded-[5px]">
        <h3 className="text-figma-lg font-montserrat font-light text-choco-light w-[83px] h-[22px]">Ціна, грн</h3>

        <div className="flex flex-col items-start gap-[20px] w-[270px]">
          {/* Поля ввода цены */}
          <div className="flex flex-row justify-between items-center gap-[18px] w-[270px] h-[30px]">
            <div className="flex flex-row justify-between items-center px-[12px] py-[17px] w-[128px] h-[30px] border border-choco-light rounded-[5px]">
              <span className="text-[10px] font-montserrat font-light text-choco-light w-[4px] h-[12px]">{priceRange[0]}</span>
            </div>
            <div className="flex flex-row justify-between items-center px-[12px] py-[17px] w-[128px] h-[30px] border border-choco-light rounded-[5px]">
              <span className="text-[10px] font-montserrat font-light text-choco-light w-[25px] h-[12px]">{priceRange[1]}</span>
            </div>
          </div>

          {/* Слайдер */}
          <div className="relative w-[270px] h-[18px]">
            {/* Основная полоса */}
            <div className="absolute w-[270px] h-[11px] top-[4px] bg-dark-creamy rounded-[5px]"></div>

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
      <div className="flex flex-row items-center px-[15px] py-[10px] gap-[10px] w-[300px] h-[59px] bg-creamy border border-choco-light rounded-[10px]">
        <h3 className="text-figma-lg font-montserrat font-light text-choco-light">Вага</h3>
      </div>

      {/* Кнопки */}
      <div className="flex flex-row items-center gap-[19px] w-[300px] h-[41px]">
        <button
          onClick={handleClearAll}
          className="flex flex-row justify-center items-center px-[30px] py-[10px] gap-[6px] w-[142px] h-[41px] bg-creamy border border-choco-light rounded-[22.5px] text-figma-xs font-montserrat font-light text-choco-light hover:opacity-80 transition-opacity whitespace-nowrap"
        >
          Очистити все
        </button>
        <button
          onClick={handleApplyFilters}
          className="flex flex-row justify-center items-center px-[30px] py-[10px] gap-[6px] w-[140px] h-[41px] bg-choco-light rounded-[22.5px] text-figma-xs font-montserrat font-light text-creamy hover:opacity-90 transition-opacity"
        >
          Пошук
        </button>
      </div>
    </div>
  )
};

export default Sidebar;