import { CheckboxIcon } from '../../icons';

/**
 * Переиспользуемый компонент чекбокса с кастомным стилем
 * @param {boolean} checked - Состояние (выбран/не выбран)
 * @param {Function} onChange - Callback при изменении состояния
 * @param {React.ReactNode} children - Содержимое (текст/элементы)
 */
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

export default Checkbox;