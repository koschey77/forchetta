import * as Slider from '@radix-ui/react-slider';
import useFilterStore from '../../../stores/useFilterStore';
import usePriceRange from '../../../hooks/usePriceRange';
import PriceInput from './PriceInput';

// Компонент фільтра за ціною з подвійним слайдером та input полями

const PriceFilter = () => {
  const { appliedFilters, updateFilter } = useFilterStore();
  
  // Використовуємо custom hook для керування станом цінового діапазону
  const {
    localRange,
    handleSliderChange,
    handleCommit,
    handleMinChange,
    handleMaxChange,
    handleMinCommit,
    handleMaxCommit
  } = usePriceRange(
    appliedFilters.priceRange,
    (newRange) => updateFilter('priceRange', newRange)
  );

  return (
    <div className="flex flex-col justify-center items-start px-[15px] py-[15px] gap-[20px] w-full min-h-[140px] border border-choco-light rounded-[10px]">
      <h3 className="text-figma-lg font-montserrat font-light text-choco-light w-[83px] h-[22px]">
        Ціна, грн
      </h3>

      <div className="flex flex-col items-start gap-[20px] w-full">
        {/* Input поля для ввода цены */}
        <div className="flex flex-row justify-between items-center gap-[18px] w-full h-[30px]">
          <PriceInput 
            value={localRange[0]}
            onChange={handleMinChange}
            onBlur={handleMinCommit}
            placeholder="От"
            min={1}
            max={2500}
          />
          <PriceInput 
            value={localRange[1]}
            onChange={handleMaxChange}
            onBlur={handleMaxCommit}
            placeholder="До"
            min={1}
            max={2500}
          />
        </div>

        {/* Radix UI Slider */}
        <div className="w-full px-1">
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            value={localRange}
            min={1}
            max={2500}
            step={1}
            minStepsBetweenThumbs={1}
            onValueChange={handleSliderChange} // Только локальное обновление
            onValueCommit={handleCommit} // Обновление глобального состояния при отпускании
          >
            {/* Полоска (трек) */}
            <Slider.Track className="bg-dark-creamy relative grow rounded-full h-[2px]">
              {/* Активная часть между ползунками */}
              <Slider.Range className="absolute bg-choco-light rounded-full h-full" />
            </Slider.Track>

            {/* Левый ползунок */}
            <Slider.Thumb
              className="block w-5 h-5 bg-choco-light border-2 border-choco-light shadow-sm rounded-full hover:bg-choco-dark focus:outline-none focus:ring-2 focus:ring-choco-light/30 transition-colors cursor-pointer"
              aria-label="Минимальная цена"
            />

            {/* Правый ползунок */}
            <Slider.Thumb
              className="block w-5 h-5 bg-choco-light border-2 border-choco-light shadow-sm rounded-full hover:bg-choco-dark focus:outline-none focus:ring-2 focus:ring-choco-light/30 transition-colors cursor-pointer"
              aria-label="Максимальная цена"
            />
          </Slider.Root>
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;