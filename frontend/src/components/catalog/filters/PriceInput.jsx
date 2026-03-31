/**
 * Переиспользуемый компонент input для полей цены
 * @param {number} value - Текущее значение
 * @param {Function} onChange - Callback для изменения значения
 * @param {Function} onBlur - Callback при потере фокуса
 * @param {string} placeholder - Текст placeholder
 * @param {number} min - Минимальное значение
 * @param {number} max - Максимальное значение
 */
const PriceInput = ({ 
  value, 
  onChange, 
  onBlur, 
  placeholder = "", 
  min = 1, 
  max = 2500 
}) => {
  const handleChange = (e) => {
    const newValue = parseInt(e.target.value) || value;
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleBlur = (e) => {
    let newValue = parseInt(e.target.value) || min;
    
    // Коррекция значений в пределах min-max
    if (placeholder === "От") {
      newValue = Math.min(Math.max(newValue, min), max - 1);
    } else if (placeholder === "До") {  
      newValue = Math.max(Math.min(newValue, max), min + 1);
    } else {
      newValue = Math.min(Math.max(newValue, min), max);
    }
    
    if (onBlur) {
      onBlur(newValue);
    }
  };

  return (
    <div className="flex flex-row justify-center items-center px-[15px] py-[4px] flex-1 h-[30px] border border-choco-light rounded-[5px] bg-creamy">
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className="w-full text-[10px] font-montserrat font-light text-choco-light bg-transparent outline-none text-center"
        placeholder={placeholder}
      />
    </div>
  );
};

export default PriceInput;