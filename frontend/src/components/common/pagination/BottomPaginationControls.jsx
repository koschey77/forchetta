import { PaginationLeftArrow, PaginationRightArrow } from '../../icons';

/**
 * Нижній контейнер пагінації - кнопки навігації по сторінках
 * Перевикористовуваний компонент для різних типів сутностей
 * 
 * @param {number} currentPage - Поточна сторінка
 * @param {number} totalPages - Загальна кількість сторінок
 * @param {Function} onPageChange - Callback для зміни сторінки
 * @param {string} className - Додаткові CSS класи
 * @param {boolean} scrollToTop - Чи прокручувати до початку при зміні сторінки
 */
const BottomPaginationControls = ({
  currentPage,
  totalPages = 0,
  onPageChange,
  className = '',
  scrollToTop = true
}) => {
  // Не показуємо, якщо тільки одна сторінка або менше
  if (totalPages <= 1) return null;

  // Генеруємо номери сторінок для відображення
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 3; // Максимум показуємо 3 номери сторінок для компактності
    
    if (totalPages <= maxVisiblePages) {
      // Якщо загальна кількість сторінок менша за максимум, показуємо всі
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Показуємо поточну і сусідні сторінки
      const startPage = Math.max(1, currentPage - 1);
      const endPage = Math.min(totalPages, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Додаємо три крапки якщо потрібно
      if (startPage > 1) {
        pages.unshift('...');
        pages.unshift(1);
      }
      if (endPage < totalPages) {
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handlePageClick = (page) => {
    if (typeof page === 'number' && page !== currentPage) {
      onPageChange(page);
      
      // Прокручуємо до початку каталогу якщо увімкнено
      if (scrollToTop) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className="flex flex-row items-center gap-[30px] w-[195px] h-[40px]">
        {/* Кнопка "Назад" */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex justify-center items-center w-[40px] h-[40px] rounded-[20px] transition-all duration-200 ${
            currentPage === 1
              ? 'bg-[#E3D6BF] cursor-not-allowed opacity-50'
              : 'bg-[#705A5A] hover:opacity-90'
          }`}
        >
          <PaginationLeftArrow />
        </button>

        {/* Номери сторінок */}
        <div className="flex items-center gap-[12px]">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => handlePageClick(page)}
              disabled={page === '...'}
              className={`font-montserrat font-light text-[24px] leading-[29px] transition-colors duration-200 ${
                page === currentPage
                  ? 'text-[#705A5A]'
                  : page === '...'
                  ? 'text-[rgba(112,90,90,0.5)] cursor-default'
                  : 'text-[rgba(112,90,90,0.5)] hover:text-[#705A5A]'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Кнопка "Вперед" */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex justify-center items-center w-[40px] h-[40px] rounded-[20px] transition-all duration-200 ${
            currentPage === totalPages
              ? 'bg-[#E3D6BF] cursor-not-allowed opacity-50'
              : 'bg-[#705A5A] hover:opacity-90'
          }`}
        >
          <PaginationRightArrow />
        </button>
      </div>
    </div>
  );
};

export default BottomPaginationControls;