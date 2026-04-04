import BaseDropdown from './BaseDropdown';
import { CatalogFilterIcon, CheckIcon } from '../../icons';

/**
 * Специализированный dropdown для фильтров каталога
 * Построен на базе BaseDropdown с предустановленным поведением для фильтров
 * 
 * @param {string} title - Заголовок фильтра
 * @param {Array} options - Массив опций [{value, label}]
 * @param {Array} selected - Массив выбранных значений
 * @param {Function} onChange - Callback для изменения выбора (получает value!)
 * @param {boolean} isLoading - Состояние загрузки
 */
const FilterDropdown = ({ 
  title, 
  options = [], 
  selected = [], 
  onChange, 
  isLoading = false 
}) => {
  // Обработчик выбора опции - совместимость с существующим API
  const handleToggleOption = (option) => {
    if (onChange) {
      onChange(option.value); // Передаем именно value, как в старой версии
    }
  };

  // Количество выбранных элементов для бейджа
  const selectedCount = selected.length;

  // Trigger button с такими же стилями как в оригинале + бейдж
  const trigger = (
    <button className="flex flex-row justify-between items-center px-[15px] py-[8px] gap-[10px] w-full h-[40px] bg-creamy border border-choco-light rounded-[10px] transition-all duration-200 hover:opacity-90">
      <span className="text-figma-base font-montserrat font-light text-choco-light">
        {isLoading ? "Завантаження..." : title}
      </span>
      <div className="flex items-center gap-2">
        {selectedCount > 0 && (
          <div className="flex items-center justify-center w-5 h-5 bg-choco-light rounded-full">
            <span className="text-xs font-montserrat font-medium text-dark-creamy">
              {selectedCount}
            </span>
          </div>
        )}
        <CatalogFilterIcon width={20} height={20} strokeWidth={2} className="text-choco-light" />
      </div>
    </button>
  );

  return (
    <div className="flex flex-col gap-[20px] w-full">
      <BaseDropdown
        variant="filter"
        trigger={trigger}
        modal={false}
      >
        {options.map((option) => {
          const isSelected = selected.includes(option.value);
          return (
            <div
              key={option.value}
              className="flex flex-row justify-between items-center gap-[7px] w-full h-[26px] cursor-pointer hover:bg-dark-creamy outline-none rounded px-2"
              onClick={(e) => {
                e.preventDefault(); // Предотвращаем закрытие dropdown
                handleToggleOption(option);
              }}
            >
              <span className={`text-figma-xs font-montserrat font-light ${
                isSelected ? "text-choco-light-50" : "text-choco-dark"
              }`}>
                {option.label}
              </span>
              {isSelected && (
                <CheckIcon width={20} height={20} strokeWidth={1.5} className="text-choco-light" />
              )}
            </div>
          );
        })}
      </BaseDropdown>
    </div>
  );
};

export default FilterDropdown;