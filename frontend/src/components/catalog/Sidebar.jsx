// Імпорти тільки для нової композиційної архітектури
import FilterControls from './filters/FilterControls';
import SearchFilter from './filters/SearchFilter';
import CategoryFilter from './filters/CategoryFilter';
import IngredientsFilter from './filters/IngredientsFilter';
import PriceFilter from './filters/PriceFilter';
import WeightFilter from './filters/WeightFilter';

const Sidebar = ({ className }) => {
  return (
    <div className={`flex flex-col items-start gap-[20px] w-full sm:w-[300px] h-[691px] relative z-10 ${className || ""}`}>
      <FilterControls />
      <SearchFilter />
      <CategoryFilter />
      <IngredientsFilter />
      <PriceFilter />
      <WeightFilter />
    </div>
  );
};

export default Sidebar;