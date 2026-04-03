import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { CatalogFilterIcon, CheckIcon } from '../../icons';

/**
 * Универсальный компонент выпадающего меню для фильтров
 * @param {string} title - Заголовок фильтра
 * @param {Array} options - Массив опций [{value, label}]
 * @param {Array} selected - Массив выбранных значений
 * @param {Function} onChange - Callback для изменения выбора
 * @param {boolean} isLoading - Состояние загрузки
 */
const FilterDropdown = ({ title, options = [],  selected = [], onChange, isLoading = false }) => {
  const handleToggleOption = (option) => {
    if (onChange) {
      onChange(option.value);
    }
  };

  return (
    <div className="flex flex-col gap-[20px] w-full">
      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger asChild>
          <button className="flex flex-row justify-between items-center px-[15px] py-[8px] gap-[10px] w-full h-[40px] bg-creamy border border-choco-light rounded-[10px] transition-all duration-200 hover:opacity-90">
            <span className="text-figma-base font-montserrat font-light text-choco-light">
              {isLoading ? "Завантаження..." : title}
            </span>
            <CatalogFilterIcon width={20} height={20} strokeWidth={2} className="text-choco-light" />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="flex flex-col items-start pt-[6px] px-[15px] pb-[15px] gap-[10px] w-[300px] min-h-[180px] bg-creamy border border-choco-light rounded-[10px] shadow-lg z-50"
            sideOffset={5}
          >
            {options.map((option) => {
              const isSelected = selected.includes(option.value);
              return (
                <DropdownMenu.Item
                  key={option.value}
                  className="flex flex-row justify-between items-center gap-[7px] w-full h-[26px] cursor-pointer hover:bg-dark-creamy outline-none rounded px-2"
                  onSelect={(e) => {
                    e.preventDefault(); // Предотвращаем закрытие дропдауна
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
                </DropdownMenu.Item>
              );
            })}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};

export default FilterDropdown;