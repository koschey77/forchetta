import useFilterStore from '../../stores/useFilterStore';

const Pagination = () => {
  const { 
    currentPage, 
    totalPages, 
    totalItems,
    itemsPerPage,
    setCurrentPage, 
    setItemsPerPage 
  } = useFilterStore();

  // Показываем компонент всегда, если есть товары
  if (totalItems === 0) return null;

  // Генерируем номера страниц для отображения
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Максимум показываем 5 номеров страниц
    
    if (totalPages <= maxVisiblePages) {
      // Если общее количество страниц меньше максимума, показываем все
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Умная пагинация с ... для больших списков
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);
      
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push('...');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handlePageClick = (page) => {
    if (typeof page === 'number' && page !== currentPage) {
      setCurrentPage(page);
      // Прокручиваем к началу каталога
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-choco-light/20">
      {/* Информация о товарах */}
      <div className="text-sm text-choco-light">
        Показано {Math.min(itemsPerPage, totalItems)} из {totalItems} товарів
      </div>

      {/* Переключатель количества товаров на страницу */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-choco-light">Показывать по:</span>
        <div className="flex gap-1">
          {[12, 24, 48].map((size) => (
            <button
              key={size}
              onClick={() => handleItemsPerPageChange(size)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                itemsPerPage === size
                  ? 'bg-choco-light text-creamy'
                  : 'bg-creamy border border-choco-light text-choco-light hover:bg-dark-creamy'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Навигация по страницам - показываем только если страниц больше 1 */}
      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          {/* Кнопка "Предыдущая" */}
          <button
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded text-sm transition-colors ${
              currentPage === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-creamy border border-choco-light text-choco-light hover:bg-dark-creamy'
            }`}
          >
            ‹ Попередня
          </button>

          {/* Номера страниц */}
          <div className="flex gap-1">
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => handlePageClick(page)}
                disabled={page === '...'}
                className={`px-3 py-2 min-w-[40px] text-sm rounded transition-colors ${
                  page === currentPage
                    ? 'bg-choco-light text-creamy'
                    : page === '...'
                    ? 'cursor-default text-choco-light'
                    : 'bg-creamy border border-choco-light text-choco-light hover:bg-dark-creamy'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Кнопка "Следующая" */}
          <button
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded text-sm transition-colors ${
              currentPage === totalPages
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-creamy border border-choco-light text-choco-light hover:bg-dark-creamy'
            }`}
          >
            Наступна ›
          </button>
        </div>
      )}
    </div>
  );
};

export default Pagination;