import useFilterStore from '../../../stores/useFilterStore';
import FilterDropdown from './FilterDropdown';

// Компонент фильтра по весу товаров

const WeightFilter = ({ products = [] }) => {
  const { appliedFilters, updateFilter } = useFilterStore();
  const selectedWeights = appliedFilters.weights;

  // Получаем уникальные значения веса из товаров
  const getUniqueWeights = () => {
    if (!products || products.length === 0) return [];
    
    const weights = products
      .map(product => product.weight)
      .filter(weight => weight != null)
      .sort((a, b) => a - b); // сортируем по возрастанию
    
    // Удаляем дубликаты
    const uniqueWeights = [...new Set(weights)];
    
    return uniqueWeights.map(weight => ({
      value: weight.toString(),
      label: weight >= 1000 ? `${weight / 1000} кг` : `${weight} г`
    }));
  };
  
  const weightOptions = getUniqueWeights();

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
      isLoading={false}
    />
  );
};

export default WeightFilter;