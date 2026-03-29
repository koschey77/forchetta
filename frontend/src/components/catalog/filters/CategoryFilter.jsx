import { useQuery } from '@tanstack/react-query';
import { categoriesAPI } from '../../../services/api';
import useFilterStore from '../../../stores/useFilterStore';
import FilterDropdown from './FilterDropdown';

const CategoryFilter = () => {
  const { appliedFilters, updateFilter } = useFilterStore();
  const selectedCategories = appliedFilters.categories;

  // Загружаем категории через TanStack Query
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesAPI.getAll,
    staleTime: 10 * 60 * 1000, // 10 минут кэш категорий
  });

  // Преобразуем категории из backend формата в frontend формат
  const categoryOptions = categories.map(category => ({
    value: category._id,
    label: category.name
  }));

  const handleCategoryChange = (categoryValue) => {
    const newCategories = selectedCategories.includes(categoryValue)
      ? selectedCategories.filter(item => item !== categoryValue)
      : [...selectedCategories, categoryValue];
    
    updateFilter('categories', newCategories);
  };

  return (
    <FilterDropdown 
      title="Категорії"
      options={categoryOptions}
      selected={selectedCategories}
      onChange={handleCategoryChange}
      isLoading={isLoading}
    />
  );
};

export default CategoryFilter;