import { SelectDropdown } from '../../ui/dropdowns';

/**
 * Селектор количества элементов на странице
 * Переиспользуемый компонент для разных типов сущностей
 * 
 * @param {number} itemsPerPage - Текущее количество элементов на странице
 * @param {Function} onItemsPerPageChange - Callback для изменения количества элементов
 * @param {Array} pageSizeOptions - Опции для количества элементов [12, 24, 48]
 * @param {string} className - Дополнительные CSS классы
 */
const TopPaginationControls = ({
  itemsPerPage,
  onItemsPerPageChange,
  pageSizeOptions = [12, 24, 48],
  className = ''
}) => {
  return (
    <div className={className}>
      <SelectDropdown
        options={pageSizeOptions}
        selected={itemsPerPage}
        onChange={onItemsPerPageChange}
        prefix="Показати"
      />
    </div>
  );
};

export default TopPaginationControls;