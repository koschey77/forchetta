import BaseDropdown from './BaseDropdown';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { DropdownArrowIcon, CheckIcon } from '../../icons';

/**
 * Специализированный dropdown для выбора одного значения из списка
 * Более простой и компактный чем MenuDropdown, идеально для селекторов количества
 * 
 * @param {Array} options - Массив опций [{value, label}] или массив примитивов [12, 24, 48]
 * @param {string|number} selected - Выбранное значение  
 * @param {Function} onChange - Callback для изменения выбора (получает value)
 * @param {string} placeholder - Текст по умолчанию когда ничего не выбрано
 * @param {boolean} showCheckmarks - Показывать галочки для выбранного элемента
 * @param {string} prefix - Префикс перед значением (например, "Показати")
 * @param {string} suffix - Суффикс после значения (например, "товарів")
 * @param {boolean} disabled - Отключить dropdown
 */
const SelectDropdown = ({
  options = [],
  selected,
  onChange,
  placeholder = 'Выберите...',
  showCheckmarks = false,
  prefix = '',
  suffix = '',
  disabled = false
}) => {
  // Нормализуем опции в единый формат {value, label}
  const normalizedOptions = options.map(option => {
    if (typeof option === 'object') {
      return option; // Уже в правильном формате
    }
    return { value: option, label: option.toString() };
  });

  // Находим выбранную опцию для отображения в trigger
  const selectedOption = normalizedOptions.find(option => option.value === selected);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  // Обработчик выбора опции
  const handleSelect = (optionValue) => {
    if (onChange && !disabled) {
      onChange(optionValue);
    }
  };

  // Формируем текст для trigger
  const triggerText = `${prefix}${prefix ? ' ' : ''}${displayText}${suffix ? ' ' : ''}${suffix}`;

  return (
    <BaseDropdown
      variant="default"
      trigger={
        <button 
          className={`flex items-center gap-2 px-3 py-2 bg-creamy border border-choco-light text-choco-light rounded text-sm transition-colors ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-dark-creamy'
          }`}
          disabled={disabled}
        >
          <span>{triggerText}</span>
          <DropdownArrowIcon className="w-4 h-4" stroke="currentColor" strokeWidth={2} />
        </button>
      }
      modal={false}
      size="auto"
      className="min-w-[80px]"
    >
      {normalizedOptions.map((option) => {
        const isSelected = selected === option.value;
        return (
          <DropdownMenu.Item
            key={option.value}
            className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer outline-none rounded transition-colors ${
              isSelected ? 'bg-choco-light text-creamy' : 'text-choco-light hover:bg-dark-creamy'
            }`}
            onSelect={() => handleSelect(option.value)}
          >
            <span>{option.label}</span>
            {showCheckmarks && isSelected && (
              <CheckIcon 
                width={16} 
                height={16}
                strokeWidth={1.5} 
                className="text-current ml-2" 
              />
            )}
          </DropdownMenu.Item>
        );
      })}
    </BaseDropdown>
  );
};

export default SelectDropdown;