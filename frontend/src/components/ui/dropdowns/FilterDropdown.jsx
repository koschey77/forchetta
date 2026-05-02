import BaseDropdown from './BaseDropdown';
import { CatalogFilterIcon, CheckIcon } from '../../icons';

/**
 * Спеціалізований dropdown для фільтрів каталогу
 * Побудований на базі BaseDropdown з попередньо встановленою поведінкою для фільтрів
 * 
 * @param {string} title - Заголовок фільтра
 * @param {Array} options - Масив опцій [{value, label}]
 * @param {Array} selected - Масив обраних значень
 * @param {Function} onChange - Callback для зміни вибору (отримує value!)
 * @param {boolean} isLoading - Стан завантаження
 */
const FilterDropdown = ({ 
  title, 
  options = [], 
  selected = [], 
  onChange, 
  isLoading = false 
}) => {
  // Обробник вибору опції - сумісність з існуючим API
  const handleToggleOption = (option) => {
    if (onChange) {
      onChange(option.value); // Передаємо саме value, як у старій версії
    }
  };

  // Кількість обраних елементів для бейджа
  const selectedCount = selected.length;

  // Trigger button з такими ж стилями як в оригіналі + бейдж
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
                e.preventDefault(); // Запобігаємо закриттю dropdown
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