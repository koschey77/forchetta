import BaseDropdown from './BaseDropdown';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { CatalogFilterIcon, CheckIcon } from '../../icons';

/**
 * Специализированный dropdown для меню и single-select опций
 * Подходит для сортировки, навигации, выбора одного значения из списка
 * 
 * @param {Array} options - Массив опций [{value, label, icon}] (icon опционально)
 * @param {string|number} selected - Выбранное значение  
 * @param {Function} onChange - Callback для изменения выбора (получает value)
 * @param {string} placeholder - Текст по умолчанию когда ничего не выбрано
 * @param {boolean} showCheckmarks - Показывать галочки для выбранного элемента
 * @param {string} variant - Стиль: 'catalog' | 'navigation' | 'admin' | 'default'
 * @param {Component} triggerIcon - Иконка в trigger
 * @param {string} triggerClassName - Дополнительные классы для trigger
 * @param {string} contentClassName - Дополнительные классы для content
 * @param {React.ReactNode} customTrigger - Кастомный trigger элемент (опционально)
 */
const MenuDropdown = ({
  options = [],
  selected,
  onChange,
  placeholder = 'Выберите...',
  showCheckmarks = true,
  variant = 'default',
  triggerIcon: TriggerIcon = CatalogFilterIcon,
  triggerClassName = '',
  contentClassName = '',
  customTrigger // Новый проп для кастомного trigger
}) => {
  // Находим выбранную опцию для отображения в trigger
  const selectedOption = options.find(option => option.value === selected);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  // Обработчик выбора опции - single select
  const handleSelect = (optionValue) => {
    if (onChange) {
      onChange(optionValue);
    }
  };

  // Получаем стили в зависимости от варианта
  const getVariantStyles = () => {
    switch (variant) {
      case 'catalog':
        return {
          trigger: `box-border flex flex-row items-center px-[15px] py-[5px] gap-[5px] w-full sm:w-[150px] h-[35px] bg-creamy border border-choco-light rounded-[5px] transition-all duration-200 hover:opacity-90 text-choco-light ${triggerClassName}`,
          content: `w-[300px] sm:w-[156px] min-h-[200px] ${contentClassName}`,
          text: 'text-figma-base font-montserrat font-light text-center text-choco-light flex-1 sm:w-[86px] sm:flex-initial h-[17px] whitespace-nowrap',
          itemText: 'text-figma-xs font-montserrat font-light',
          icon: { width: 24, height: 24 }
        };
      case 'navigation':
        return {
          trigger: `flex items-center gap-2 px-3 py-2 bg-creamy border border-choco-light rounded-md hover:bg-dark-creamy transition-colors ${triggerClassName}`,
          content: `min-w-[200px] ${contentClassName}`,
          text: 'text-sm text-choco-light',
          itemText: 'text-sm font-montserrat font-light',
          icon: { width: 16, height: 16 }
        };
      case 'admin':
        return {
          trigger: `flex items-center gap-2 px-3 py-2 bg-creamy border border-choco-light rounded-md hover:bg-dark-creamy transition-colors ${triggerClassName}`,
          content: `w-full sm:w-[349px] ${contentClassName}`,
          text: 'text-sm text-choco-light',
          itemText: 'font-montserrat font-medium text-[14px] leading-[17px] text-choco-light',
          icon: { width: 20, height: 20 }
        };
      default:
        return {
          trigger: `flex items-center justify-between gap-2 px-3 py-2 bg-creamy border border-choco-light rounded-md hover:bg-dark-creamy transition-colors ${triggerClassName}`,
          content: `min-w-[150px] ${contentClassName}`,
          text: 'text-sm text-choco-light',
          itemText: 'text-sm font-montserrat font-light',
          icon: { width: 20, height: 20 }
        };
    }
  };

  const styles = getVariantStyles();

  // Trigger button - используем кастомный если передан, иначе стандартный
  const triggerElement = customTrigger || (
    <button className={styles.trigger}>
      <TriggerIcon 
        width={styles.icon.width} 
        height={styles.icon.height} 
        strokeWidth={2} 
        className="text-choco-light" 
      />
      <span className={styles.text}>
        {displayText}
      </span>
    </button>
  );

  return (
    <BaseDropdown
      variant={variant === 'catalog' ? 'filter' : variant === 'navigation' ? 'navigation' : variant === 'admin' ? 'admin' : 'default'}
      trigger={triggerElement}
      modal={false}
      className={styles.content}
      sideOffset={variant === 'catalog' ? 0 : 5}
      align="start"
    >
      {options.map((option) => {
        const isSelected = selected === option.value && selected !== '' && selected != null;
        return (
          <DropdownMenu.Item
            key={option.value}
            className={`flex flex-row items-center gap-[10px] w-full cursor-pointer outline-none rounded px-2 transition duration-300 ${
              variant === 'admin' 
                ? `pl-[15px] h-[35px] rounded-[31px] ${isSelected ? 'bg-dark-creamy' : 'hover:bg-dark-creamy/50'}`
                : `justify-between gap-[7px] h-[26px] hover:bg-dark-creamy`
            }`}
            onSelect={() => handleSelect(option.value)}
          >
            {/* Иконка для admin варианта */}
            {variant === 'admin' && option.icon && (
              <option.icon className="w-[24px] h-[24px] text-[#705A5A]" />
            )}
            
            <span className={`${styles.itemText} ${
              isSelected ? "text-choco-light-50" : "text-choco-dark"
            } ${variant === 'admin' ? '' : 'flex-1'}`}>
              {option.label}
            </span>
            
            {/* Галочки для обычных вариантов */}
            {showCheckmarks && isSelected && variant !== 'admin' && (
              <CheckIcon 
                width={variant === 'catalog' ? 24 : 20} 
                height={variant === 'catalog' ? 24 : 20}
                strokeWidth={1.5} 
                className="text-choco-light" 
              />
            )}
          </DropdownMenu.Item>
        );
      })}
    </BaseDropdown>
  );
};

export default MenuDropdown;