import { useState, useEffect } from 'react';
import { SearchIcon } from '../../icons';
import useFilterStore from '../../../stores/useFilterStore';
import useFilterDebounce from '../../../hooks/useFilterDebounce';

// Компонент пошуку товарів з debouncing

const SearchFilter = () => {
  const { appliedFilters, setSearchFilter } = useFilterStore();
  const [searchQuery, setSearchQuery] = useState(appliedFilters.search || '');
  
  // Використовуємо debounce hook: 500мс затримка, мінімум 4 символи (або 0 для скидання)
  const debouncedQuery = useFilterDebounce(searchQuery, 500, 4);

  // Синхронізуємо локальний стан з глобальним
  useEffect(() => {
    setSearchQuery(appliedFilters.search || '');
  }, [appliedFilters.search]);

  // Застосовуємо debounced пошуковий запит
  useEffect(() => {
    setSearchFilter(debouncedQuery);
  }, [debouncedQuery, setSearchFilter]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  return (
    <div className="flex flex-col gap-[10px] w-full">
      <div className="relative w-full">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <SearchIcon className="w-[20px] h-[20px] text-choco-light" />
        </div>
        <input
          type="text"
          placeholder="Пошук товарів..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full h-[40px] pl-[45px] pr-[15px] py-[8px] bg-creamy border border-choco-light rounded-[10px] text-figma-md font-montserrat font-light text-choco-dark placeholder-choco-light/60 focus:outline-none focus:border-choco-dark focus:ring-1 focus:ring-choco-light/20 transition-colors"
        />
      </div>
    </div>
  );
};

export default SearchFilter;