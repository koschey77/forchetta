import useFilterStore from '../../../stores/useFilterStore';
import Checkbox from './Checkbox';

const IngredientsFilter = () => {
  const { appliedFilters, updateFilter } = useFilterStore();
  const selectedIngredients = appliedFilters.ingredients;

  // Список доступних інгредієнтів
  const ingredients = [
    'З горіхами',
    'Без горіхів', 
    'Без пальмової олії',
    'Без лактози',
    'Без глютену'
  ];

  const handleIngredientChange = (ingredient) => {
    // Спеціальна логіка для горіхів - якщо вибирається протилежний, прибираємо поточний
    if (ingredient === 'З горіхами' && selectedIngredients.includes('Без горіхів')) {
      const newIngredients = selectedIngredients.filter(item => item !== 'Без горіхів');
      newIngredients.push(ingredient);
      updateFilter('ingredients', newIngredients);
      return;
    }
    
    if (ingredient === 'Без горіхів' && selectedIngredients.includes('З горіхами')) {
      const newIngredients = selectedIngredients.filter(item => item !== 'З горіхами');
      newIngredients.push(ingredient);
      updateFilter('ingredients', newIngredients);
      return;
    }

    // Стандартна логіка для всіх інших інгредієнтів
    const newIngredients = selectedIngredients.includes(ingredient)
      ? selectedIngredients.filter(item => item !== ingredient)
      : [...selectedIngredients, ingredient];
    
    updateFilter('ingredients', newIngredients);
  };

  return (
    <div className="flex flex-col items-start gap-[20px] w-full">
      <h3 className="text-figma-lg font-montserrat font-light text-choco-light">
        Склад
      </h3>

      <div className="flex flex-col items-start gap-[15px] w-full">
        {ingredients.map((ingredient) => (
          <Checkbox 
            key={ingredient} 
            checked={selectedIngredients.includes(ingredient)} 
            onChange={() => handleIngredientChange(ingredient)}
          >
            {ingredient}
          </Checkbox>
        ))}
      </div>
    </div>
  );
};

export default IngredientsFilter;