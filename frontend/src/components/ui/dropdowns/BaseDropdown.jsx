import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

/**
 * Базовий компонент випадного меню на основі Radix UI
 * Слугує основою для всіх спеціалізованих dropdown компонентів
 * 
 * @param {ReactNode} trigger - Елемент який відкриває dropdown  
 * @param {ReactNode} children - Вміст dropdown меню
 * @param {string} variant - Варіант стилів: 'default' | 'filter' | 'compact' | 'admin' | 'navigation'
 * @param {string} size - Розмір: 'small' | 'medium' | 'large' | 'auto'
 * @param {string} side - Позиція відносно trigger: 'top' | 'right' | 'bottom' | 'left'
 * @param {string} align - Вирівнювання: 'start' | 'center' | 'end'
 * @param {number} sideOffset - Відступ від trigger в пікселях
 * @param {boolean} modal - Модальна поведінка (блокує взаємодію з іншою сторінкою)
 * @param {boolean} disabled - Вимкнути dropdown
 * @param {Function} onOpenChange - Callback при зміні стану відкриття
 * @param {string} className - Додаткові CSS класи для контенту
 */
const BaseDropdown = ({
  // Core props
  trigger,
  children,
  
  // Styling variants
  variant = 'default',
  size = 'medium',
  
  // Positioning
  side = 'bottom',
  align = 'start',
  sideOffset = 5,
  
  // Behavior
  modal = false,
  disabled = false,
  
  // Events & Customization
  onOpenChange,
  className = ''
}) => {
  // Отримуємо стилі залежно від варіанту
  const getVariantStyles = () => {
    const variants = {
      default: {
        content: 'bg-creamy border border-choco-light shadow-lg',
        borderRadius: 'rounded-md'
      },
      filter: {
        content: 'bg-creamy border border-choco-light shadow-lg',
        borderRadius: 'rounded-[10px]'
      },
      compact: {
        content: 'bg-creamy border border-choco-light shadow-lg',
        borderRadius: 'rounded-md'
      },
      admin: {
        content: 'bg-creamy shadow-md',  
        borderRadius: 'rounded-md'
      },
      navigation: {
        content: 'bg-creamy border border-choco-light/20 shadow-lg',
        borderRadius: 'rounded-xl'
      }
    };
    
    return variants[variant] || variants.default;
  };

  // Отримуємо розміри залежно від size
  const getSizeStyles = () => {
    const sizes = {
      small: 'py-1 min-w-[80px]',
      medium: 'py-2 min-w-[120px]',
      large: 'py-3 min-w-[200px]',
      auto: 'py-1' // Розмір визначається вмістом
    };
    
    return sizes[size] || sizes.medium;
  };

  // Спеціальні розміри для певних варіантів
  const getVariantSizeOverride = () => {
    if (variant === 'filter') {
      return 'pt-[6px] px-[15px] pb-[15px] min-w-[300px] min-h-[180px] gap-[10px]';
    }
    if (variant === 'admin') {
      return 'py-2 px-2 w-full sm:w-[349px]';
    }
    return null;
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getVariantSizeOverride() || getSizeStyles();
  
  const contentClassName = `
    flex flex-col items-start z-50
    ${variantStyles.content}
    ${variantStyles.borderRadius}
    ${sizeStyles}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <DropdownMenu.Root 
      modal={modal} 
      onOpenChange={onOpenChange}
    >
      <DropdownMenu.Trigger asChild disabled={disabled}>
        {trigger}
      </DropdownMenu.Trigger>
      
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={contentClassName}
          side={side}
          align={align}
          sideOffset={sideOffset}
        >
          {children}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default BaseDropdown;