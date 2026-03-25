import { useState, useEffect } from 'react';
import CatalogHeader from '../components/catalog/CatalogHeader';
import Sidebar from '../components/catalog/Sidebar';
import ProductCard from '../components/catalog/ProductCard';
import productImage from '../components/catalog/Frame 316.png';
import useCategoryStore from '../stores/useCategoryStore';
import { useProductStore } from '../stores/useProductStore';

const CatalogPage = () => {
  const { categories, fetchAllCategories } = useCategoryStore();
  const { products, loading: productsLoading, fetchAllProducts, fetchProductsByCategory } = useProductStore();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({
    category: '',
    ingredients: [],
    priceRange: [1, 2500],
    weights: []
  });

  // Загружаем категории и все товары при монтировании
  useEffect(() => {
    fetchAllCategories();
    fetchAllProducts();
  }, [fetchAllCategories, fetchAllProducts]);

  // Функция адаптации backend данных в frontend формат
  const adaptProductData = (backendProduct) => {
    // Определяем тег на основе скидости
    let tag = null;
    if (backendProduct.discountPrice && backendProduct.discountPrice > 0) {
      const discount = Math.round((1 - backendProduct.discountPrice / backendProduct.price) * 100);
      tag = { text: `-${discount}%`, type: "red" };
    }
    
    return {
      id: backendProduct._id,
      title: backendProduct.name,
      price: `${backendProduct.discountPrice || backendProduct.price} грн / ${backendProduct.weight} г`,
      oldPrice: backendProduct.discountPrice ? `${backendProduct.price} грн` : null,
      image: backendProduct.images && backendProduct.images.length > 0 
        ? backendProduct.images[0].url 
        : productImage,
      tag,
      // Добавляем оригинальные данные для фильтрации
      originalProduct: backendProduct
    };
  };

  // Логика фильтрации товаров
  const filterProducts = (adaptedProducts, filters) => {
    return adaptedProducts.filter(product => {
      const originalProduct = product.originalProduct;
      
      // Фильтр по ингредиентам состава
      if (filters.ingredients && filters.ingredients.length > 0) {
        const hasMatchingIngredient = filters.ingredients.some(ingredient => {
          switch (ingredient) {
            case 'З горіхами':
              return originalProduct.contains?.nuts === true;
            case 'Без горіхів':
              return originalProduct.contains?.nuts === false;
            case 'Без пальмової олії':
              return originalProduct.contains?.palmOil === false;
            case 'Без лактози':
              return originalProduct.contains?.lactose === false;
            case 'Без глютену':
              return originalProduct.contains?.gluten === false;
            default:
              return false;
          }
        });
        if (!hasMatchingIngredient) return false;
      }
      
      // Фильтр по цене
      if (filters.priceRange) {
        const productPrice = originalProduct.discountPrice || originalProduct.price;
        if (productPrice < filters.priceRange[0] || productPrice > filters.priceRange[1]) {
          return false;
        }
      }
      
      // Фильтр по весу
      if (filters.weights && filters.weights.length > 0) {
        const productWeight = originalProduct.weight;
        const hasMatchingWeight = filters.weights.some(weightValue => {
          return productWeight === parseInt(weightValue);
        });
        if (!hasMatchingWeight) return false;
      }
      
      return true;
    });
  };

  // Адаптированные товары с применением фильтров
  const adaptedProducts = products.map(adaptProductData);
  const displayProducts = filterProducts(adaptedProducts, appliedFilters);

  // Получаем название выбранной категории
  const getCategoryName = (categoryId) => {
    if (!categoryId) return 'Всі категорії';
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.name : 'Всі категорії';
  };

  const handleCategoryChange = (category) => {
    // Избегаем повторных запросов если категория не изменилась
    if (category === selectedCategory) return;
    
    setSelectedCategory(category);
    
    // Обновляем примененные фильтры
    setAppliedFilters(prev => ({ ...prev, category }));
    
    // Загружаем товары по категории
    if (category && category !== '') {
      fetchProductsByCategory(category);
    } else {
      fetchAllProducts();
    }
  };

  const handleApplyFilters = (filters) => {
    console.log('🔎 Применяем фильтры:', filters);
    setAppliedFilters(filters);
    
    // Закрываем сайдбар только на мобильной версии (< 640px) после применения фильтров
    if (window.innerWidth < 640) {
      setIsFilterOpen(false);
    }
    
    // Если категория изменилась, обновляем selectedCategory
    if (filters.category !== selectedCategory) {
      setSelectedCategory(filters.category);
      if (filters.category && filters.category !== '') {
        fetchProductsByCategory(filters.category);
      } else {
        fetchAllProducts();
      }
    }
  };

  return (
    <div className="min-h-screen bg-creamy py-6">
      <div className="w-full">
        {/* Название выбранной категории */}
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-[60px] mb-4">
          <div className="text-center">
            <h2 className="text-2xl font-montserrat font-semibold leading-[29px] text-choco-light">
              {getCategoryName(selectedCategory)}
            </h2>
            {!productsLoading && (
              <p className="text-sm font-montserrat font-light text-choco-light mt-2">
                Знайдено: {displayProducts.length} товарів
                {appliedFilters.ingredients.length > 0 || appliedFilters.weights.length > 0 || 
                 (appliedFilters.priceRange[0] > 1 || appliedFilters.priceRange[1] < 2500) ? 
                 ` (застосовано фільтри)` : ''}
              </p>
            )}
          </div>
        </div>
        
        <CatalogHeader 
          isFilterOpen={isFilterOpen} 
          setIsFilterOpen={setIsFilterOpen} 
        />
        
        {/* Основной контент с минимальной высотой для предотвращения перекрытия Footer */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-[60px] mt-6 pb-16 min-h-[600px]">
          {/* Desktop и Tablet версия - flex layout */}
          <div className="hidden sm:flex items-start gap-6">
            {isFilterOpen && <Sidebar onCategoryChange={handleCategoryChange} onApplyFilters={handleApplyFilters} products={products} />}
            
            <div className={`grid gap-x-6 gap-y-8 flex-grow transition-all duration-300 ease-in-out ${
              isFilterOpen 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            }`}>
              {productsLoading ? (
                <div className="col-span-full flex justify-center items-center py-20">
                  <div className="text-choco-light text-xl">Завантаження товарів...</div>
                </div>
              ) : displayProducts.length > 0 ? (
                displayProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full flex flex-col justify-center items-center py-20">
                  <div className="text-choco-light text-xl mb-2">
                    {appliedFilters.ingredients.length > 0 || appliedFilters.weights.length > 0 || 
                     (appliedFilters.priceRange[0] > 1 || appliedFilters.priceRange[1] < 2500) ?
                     'Товари за заданими фільтрами не знайдені' :
                     selectedCategory ? 'Товари в цій категорії не знайдені' : 'Товари не знайдені'
                    }
                  </div>
                  <div className="text-choco-light text-sm">
                    {appliedFilters.ingredients.length > 0 || appliedFilters.weights.length > 0 || 
                     (appliedFilters.priceRange[0] > 1 || appliedFilters.priceRange[1] < 2500) ?
                     'Спробуйте скинути фільтри або вибрати інші параметри' :
                     'Спробуйте вибрати іншу категорію'
                    }
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile версия (<640px) */}
          <div className="sm:hidden relative z-10">
            {isFilterOpen ? (
              /* Показываем только фильтры на всю ширину */
              <Sidebar className="w-full" onCategoryChange={handleCategoryChange} onApplyFilters={handleApplyFilters} products={products} />
            ) : (
              /* Показываем только товары */
              <div className="grid gap-x-4 gap-y-8 grid-cols-2">
                {productsLoading ? (
                  <div className="col-span-2 flex justify-center items-center py-20">
                    <div className="text-choco-light text-lg">Завантаження...</div>
                  </div>
                ) : displayProducts.length > 0 ? (
                  displayProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <div className="col-span-2 flex flex-col justify-center items-center py-20">
                    <div className="text-choco-light text-lg mb-2">
                      {appliedFilters.ingredients.length > 0 || appliedFilters.weights.length > 0 || 
                       (appliedFilters.priceRange[0] > 1 || appliedFilters.priceRange[1] < 2500) ?
                       'Товари за заданими фільтрами не знайдені' :
                       selectedCategory ? 'Товари в цій категорії не знайдені' : 'Товари не знайдені'
                      }
                    </div>
                    <div className="text-choco-light text-sm text-center">
                      {appliedFilters.ingredients.length > 0 || appliedFilters.weights.length > 0 || 
                       (appliedFilters.priceRange[0] > 1 || appliedFilters.priceRange[1] < 2500) ?
                       'Спробуйте скинути фільтри або вибрати інші параметри' :
                       'Спробуйте вибрати іншу категорію'
                      }
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;