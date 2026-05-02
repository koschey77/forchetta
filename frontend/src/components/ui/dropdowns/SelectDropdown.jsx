import BaseDropdown from './BaseDropdown';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { DropdownArrowIcon, CheckIcon } from '../../icons';

/**
 * Спеціалізований dropdown для вибору одного значення зі списку
 * Більш простий і компактний ніж MenuDropdown, ідеально для селекторів кількості
 * 
 * @param {Array} options - Масив опцій [{value, label}] або масив примітивів [12, 24, 48]
 * @param {string|number} selected - Обране значення  
 * @param {Function} onChange - Callback для зміни вибору (отримує value)
 * @param {string} placeholder - Текст за замовчуванням коли нічого не вибрано
 * @param {boolean} showCheckmarks - Показувати галочки для обраного елемента
 * @param {string} prefix - Префікс перед значенням (наприклад, "Показати")
 * @param {string} suffix - Суфікс після значення (наприклад, "товарів")
 * @param {boolean} disabled - Вимкнути dropdown
 */
const SelectDropdown = ({
  options = [],
  selected,
  onChange,
  placeholder = 'Виберіть...',
  showCheckmarks = false,
  prefix = '',
  suffix = '',
  disabled = false
}) => {
  // Нормалізуємо опції в єдиний формат {value, label}
  const normalizedOptions = options.map(option => {
    if (typeof option === 'object') {
      return option; // Вже в правильному форматі
    }
    return { value: option, label: option.toString() };
  });

  // Знаходимо обрану опцію для відображення в trigger
  const selectedOption = normalizedOptions.find(option => option.value === selected);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  // Обробник вибору опції
  const handleSelect = (optionValue) => {
    if (onChange && !disabled) {
      onChange(optionValue);
    }
  };

  // Формуємо текст для trigger
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