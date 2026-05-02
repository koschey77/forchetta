import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '../../../services/api';
import useFilterStore from '../../../stores/useFilterStore';
import { FilterDropdown } from '../../ui/dropdowns';

// Компонент фільтра за вагою товарів

const WeightFilter = () => {
  const { appliedFilters, updateFilter } = useFilterStore();
  const selectedWeights = appliedFilters.weights;

  // Завантажуємо доступні ваги через TanStack Query (незалежно від фільтрів)
  const { data: availableWeights = [], isLoading } = useQuery({
    queryKey: ['available-weights'],
    queryFn: productsAPI.getAvailableWeights,
    staleTime: 10 * 60 * 1000, // 10 хвилин кеш ваги (дані рідко змінюються)
  });

  // Перетворюємо дані backend в формат для FilterDropdown
  const weightOptions = availableWeights.map(weight => ({
    value: weight.toString(),
    label: weight >= 1000 ? `${weight / 1000} кг` : `${weight} г`
  }));

  const handleWeightChange = (weightValue) => {
    const newWeights = selectedWeights.includes(weightValue)
      ? selectedWeights.filter(item => item !== weightValue)
      : [...selectedWeights, weightValue];
    
    updateFilter('weights', newWeights);
  };

  return (
    <FilterDropdown 
      title="Вага"
      options={weightOptions}
      selected={selectedWeights}
      onChange={handleWeightChange}
      isLoading={isLoading}
    />
  );
};

export default WeightFilter;