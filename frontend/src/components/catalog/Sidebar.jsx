import { useEffect, useRef } from 'react';
import * as Slider from '@radix-ui/react-slider';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { CatalogFilterIcon, CheckIcon, CheckboxIcon } from '../icons';
import useCategoryStore from '../../stores/useCategoryStore';
import useFilterStore from '../../stores/useFilterStore';

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
  
  // Получаем фильтры из централизованного стора
  const { 
    appliedFilters,
    updateFilter,
    applyFilters,
    resetAll
  } = useFilterStore();
  
  // Локальные ссылки для удобства
  const selectedCategories = appliedFilters.categories;
  const selectedIngredients = appliedFilters.ingredients;
  const priceRange = appliedFilters.priceRange;
  const selectedWeights = appliedFilters.weights;
  
  const isSliderChange = useRef(false);

  // Загружаем категории при монтировании компонента
  useEffect(() => {
    fetchAllCategories();
  }, [fetchAllCategories]);

  // Функция применения фильтров через стор
  const handleApplyFilters = () => {
    // Вызываем метод стора, который автоматически закроет на мобильных
    applyFilters(appliedFilters);
    
    // Также передаем родительскому компоненту для совместимости
    if (onApplyFilters) {
      onApplyFilters(appliedFilters);
    }
  };

  // Real-time применение фильтров для кнопок и чекбоксов (мгновенно)
  useEffect(() => {
    handleApplyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategories, selectedIngredients, selectedWeights]);

  // Debounced применение для полей ввода цены (1 секунда)
  useEffect(() => {
    // Пропускаем debounce для слайдера
    if (isSliderChange.current) {
      isSliderChange.current = false;
      return;
    }
    
    const timeoutId = setTimeout(() => {
      handleApplyFilters();
    }, 1000);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceRange]);

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
    const newCategories = selectedCategories.includes(categoryValue)
      ? selectedCategories.filter(item => item !== categoryValue)
      : [...selectedCategories, categoryValue];
    updateFilter('categories', newCategories);
  };

  const handleWeightChange = (weightValue) => {
    const newWeights = selectedWeights.includes(weightValue)
      ? selectedWeights.filter(item => item !== weightValue)
      : [...selectedWeights, weightValue];
    updateFilter('weights', newWeights);
  };

  const handleIngredientChange = (ingredient) => {
    const newIngredients = selectedIngredients.includes(ingredient)
      ? selectedIngredients.filter(item => item !== ingredient)
      : [...selectedIngredients, ingredient];
    updateFilter('ingredients', newIngredients);
  };

  const handlePriceChange = (newPriceRange) => {
    updateFilter('priceRange', newPriceRange);
  };

  const handleClearAll = () => {
    // Используем метод resetAll из стора
    resetAll();
  };

  return (
    <div className={`flex flex-col items-start gap-[40px] w-full sm:w-[300px] h-[691px] relative z-10 ${className || ""}`}>
      {/* Кнопка очистки с подтверждением */}
      <div className="flex flex-row items-center justify-center w-full h-[41px]">
        <AlertDialog.Root>
          <AlertDialog.Trigger asChild>
            <button className="flex flex-row justify-center items-center px-[30px] py-[10px] gap-[6px] w-full h-[41px] bg-creamy border border-choco-light rounded-[22.5px] text-figma-xs font-montserrat font-light text-choco-light hover:opacity-80 transition-opacity whitespace-nowrap">
              Очистити фільтри
            </button>
          </AlertDialog.Trigger>

          <AlertDialog.Portal>
            <AlertDialog.Overlay className="bg-black/50 fixed inset-0 z-50" />
            <AlertDialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-creamy border border-choco-light rounded-[15px] p-6 w-[90vw] max-w-[400px] z-50 shadow-xl">
              <AlertDialog.Title className="text-figma-lg font-montserrat font-medium text-choco-light mb-3">Підтвердити скидання</AlertDialog.Title>
              <AlertDialog.Description className="text-figma-md font-montserrat font-light text-choco-light mb-6">
                Ви впевнені, що хочете очистити всі фільтри?
              </AlertDialog.Description>

              <div className="flex justify-end gap-3">
                <AlertDialog.Cancel asChild>
                  <button className="px-4 py-2 bg-transparent border border-choco-light text-choco-light rounded-[10px] text-figma-sm font-montserrat font-light hover:bg-dark-creamy transition-colors">
                    Ні
                  </button>
                </AlertDialog.Cancel>

                <AlertDialog.Action asChild>
                  <button
                    onClick={handleClearAll}
                    className="px-4 py-2 bg-choco-light text-creamy rounded-[10px] text-figma-sm font-montserrat font-medium hover:bg-choco-dark transition-colors"
                  >
                    Так, очистити
                  </button>
                </AlertDialog.Action>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      </div>

      {/* Категорії */}
      <div className="flex flex-col gap-[20px] w-full">
        <DropdownMenu.Root modal={false}>
          <DropdownMenu.Trigger asChild>
            <button className="flex flex-row justify-between items-center px-[15px] py-[10px] gap-[10px] w-full h-[59px] bg-creamy border border-choco-light rounded-[10px] transition-all duration-200 hover:opacity-90">
              <span className="text-figma-base font-montserrat font-light text-choco-light">{loading ? "Завантаження..." : "Категорії"}</span>
              <CatalogFilterIcon width={20} height={20} strokeWidth={2} className="text-choco-light" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="flex flex-col items-start pt-[6px] px-[10px] pb-[15px] gap-[10px] w-[300px] min-h-[200px] bg-creamy border border-choco-light rounded-[10px] shadow-lg z-50"
              sideOffset={5}
            >
              {categoryOptions.map((category) => {
                const isSelected = selectedCategories.includes(category.value)
                return (
                  <DropdownMenu.Item
                    key={category.value}
                    className="flex flex-row justify-between items-center gap-[7px] w-full h-[26px] cursor-pointer hover:bg-dark-creamy outline-none rounded px-2"
                    onSelect={(e) => {
                      e.preventDefault() // Предотвращаем закрытие дропдауна
                      handleCategoryChange(category.value)
                    }}
                  >
                    <span className={`text-figma-xs font-montserrat font-light ${isSelected ? "text-choco-light-50" : "text-choco-dark"}`}>
                      {category.label}
                    </span>
                    {isSelected && <CheckIcon width={20} height={20} strokeWidth={1.5} className="text-choco-light" />}
                  </DropdownMenu.Item>
                )
              })}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
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
                  handlePriceChange([value, priceRange[1]]);
                }}
                onBlur={(e) => {
                  const value = parseInt(e.target.value) || 1;
                  const correctedValue = Math.min(Math.max(value, 1), priceRange[1] - 1);
                  handlePriceChange([correctedValue, priceRange[1]]);
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
                  handlePriceChange([priceRange[0], value]);
                }}
                onBlur={(e) => {
                  const value = parseInt(e.target.value) || 2500;
                  const correctedValue = Math.max(priceRange[0] + 1, Math.min(value, 2500));
                  handlePriceChange([priceRange[0], correctedValue]);
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
              onValueChange={(value) => {
                isSliderChange.current = true; // Помечаем что изменение от слайдера
                handlePriceChange(value);
              }}
              onValueCommit={(value) => {
                handlePriceChange(value);
                handleApplyFilters(); // Мгновенное применение при "потере фокуса" слайдера
              }}
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
      <div className="flex flex-col gap-[20px] w-full">
        <DropdownMenu.Root modal={false}>
          <DropdownMenu.Trigger asChild>
            <button className="flex flex-row justify-between items-center px-[15px] py-[10px] gap-[10px] w-full h-[59px] bg-creamy border border-choco-light rounded-[10px] transition-all duration-200 hover:opacity-90">
              <span className="text-figma-base font-montserrat font-light text-choco-light">Вага</span>
              <CatalogFilterIcon width={20} height={20} strokeWidth={2} className="text-choco-light" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="flex flex-col items-start pt-[6px] px-[10px] pb-[15px] gap-[10px] w-[300px] min-h-[180px] bg-creamy border border-choco-light rounded-[10px] shadow-lg z-50"
              sideOffset={5}
            >
              {weights.map((weight) => {
                const isSelected = selectedWeights.includes(weight.value)
                return (
                  <DropdownMenu.Item
                    key={weight.value}
                    className="flex flex-row justify-between items-center gap-[7px] w-full h-[26px] cursor-pointer hover:bg-dark-creamy outline-none rounded px-2"
                    onSelect={(e) => {
                      e.preventDefault() // Предотвращаем закрытие дропдауна
                      handleWeightChange(weight.value)
                    }}
                  >
                    <span className={`text-figma-xs font-montserrat font-light ${isSelected ? "text-choco-light-50" : "text-choco-dark"}`}>
                      {weight.label}
                    </span>
                    {isSelected && <CheckIcon width={20} height={20} strokeWidth={1.5} className="text-choco-light" />}
                  </DropdownMenu.Item>
                )
              })}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  )
};

export default Sidebar;