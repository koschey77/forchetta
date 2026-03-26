import { useState, useEffect } from 'react';
import CatalogHeader from '../components/catalog/CatalogHeader';
import Sidebar from '../components/catalog/Sidebar';
import ProductCard from '../components/catalog/ProductCard';
import useCategoryStore from '../stores/useCategoryStore';
import { useProductStore } from '../stores/useProductStore';

const CatalogPage = () => {
  const { categories, fetchAllCategories } = useCategoryStore();
  const { products, allProducts, loading: productsLoading, fetchAllProducts } = useProductStore();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState('popular');
  const [appliedFilters, setAppliedFilters] = useState({
    categories: [],
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
      image: backendProduct.images[0].url,
      tag,
      // Добавляем оригинальные данные для фильтрации
      originalProduct: backendProduct
    };
  };

  // Логика фильтрации товаров
  const filterProducts = (adaptedProducts, filters) => {
    return adaptedProducts.filter(product => {
      const originalProduct = product.originalProduct;
      
      // Фильтр по категориям
      if (filters.categories && filters.categories.length > 0) {
        const hasMatchingCategory = filters.categories.some(categoryId => 
          originalProduct.category && originalProduct.category._id === categoryId
        );
        if (!hasMatchingCategory) return false;
      }
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

  // Функция сортировки товаров
  const sortProducts = (products, sortType) => {
    const sortedProducts = [...products];
    
    switch (sortType) {
      case 'price-asc':
        return sortedProducts.sort((a, b) => {
          const priceA = a.originalProduct.discountPrice || a.originalProduct.price;
          const priceB = b.originalProduct.discountPrice || b.originalProduct.price;
          return priceA - priceB;
        });
      
      case 'price-desc':
        return sortedProducts.sort((a, b) => {
          const priceA = a.originalProduct.discountPrice || a.originalProduct.price;
          const priceB = b.originalProduct.discountPrice || b.originalProduct.price;
          return priceB - priceA;
        });
      
      case 'new':
        return sortedProducts.sort((a, b) => {
          const dateA = new Date(a.originalProduct.createdAt || 0);
          const dateB = new Date(b.originalProduct.createdAt || 0);
          return dateB - dateA;
        });
      
      case 'sales':
        return sortedProducts.sort((a, b) => {
          const hasDiscountA = a.originalProduct.discountPrice ? 1 : 0;
          const hasDiscountB = b.originalProduct.discountPrice ? 1 : 0;
          if (hasDiscountA !== hasDiscountB) {
            return hasDiscountB - hasDiscountA;
          }
          // Если у обоих есть скидки, сортируем по размеру скидки
          if (hasDiscountA && hasDiscountB) {
            const discountA = (1 - a.originalProduct.discountPrice / a.originalProduct.price) * 100;
            const discountB = (1 - b.originalProduct.discountPrice / b.originalProduct.price) * 100;
            return discountB - discountA;
          }
          return 0;
        });
      
      case 'popular':
      default:
        // По умолчанию или по популярности - оставляем исходный порядок
        // В будущем можно добавить поле popularity в модель товара
        return sortedProducts;
    }
  };

  // Адаптированные товары с применением фильтров и сортировки
  const displayProducts = (() => {
    const adaptedProducts = products.map(adaptProductData);
    const filteredProducts = filterProducts(adaptedProducts, appliedFilters);
    return sortProducts(filteredProducts, sortOption);
  })();

  // Проверяем применены ли фильтры
  const hasAppliedFilters = appliedFilters.categories.length > 0 ||
    appliedFilters.ingredients.length > 0 || 
    appliedFilters.weights.length > 0 || 
    appliedFilters.priceRange[0] > 1 || 
    appliedFilters.priceRange[1] < 2500;

  // Компонент "товары не найдены"
  const NoProductsMessage = ({ isMobile = false }) => (
    <div className={`${isMobile ? 'col-span-2' : 'col-span-full'} flex flex-col justify-center items-center py-20`}>
      <div className={`text-choco-light ${isMobile ? 'text-lg' : 'text-xl'} mb-2`}>
        {hasAppliedFilters
          ? 'Товари за заданими фільтрами не знайдені'
          : appliedFilters.categories.length > 0 
            ? 'Товари в цих категоріях не знайдені' 
            : 'Товари не знайдені'
        }
      </div>
      <div className={`text-choco-light text-sm ${isMobile ? 'text-center' : ''}`}>
        {hasAppliedFilters
          ? 'Спробуйте скинути фільтри або вибрати інші параметри'
          : 'Спробуйте вибрати іншу категорію'
        }
      </div>
    </div>
  );

  // Получаем название выбранных категорий
  const getCategoriesName = (categoryIds) => {
    if (!categoryIds || categoryIds.length === 0) return 'Всі категорії';
    if (categoryIds.length === 1) {
      const category = categories.find(cat => cat._id === categoryIds[0]);
      return category ? category.name : 'Всі категорії';
    }
    const categoryNames = categoryIds.map(categoryId => {
      const category = categories.find(cat => cat._id === categoryId);
      return category ? category.name : '';
    }).filter(name => name);
    return categoryNames.length > 0 ? categoryNames.join(', ') : 'Всі категорії';
  };

  const handleApplyFilters = (filters) => {
    console.log('🔎 Применяем фильтры:', filters);
    setAppliedFilters(filters);
    
    // Закрываем сайдбар только на мобильной версии (< 640px) после применения фильтров
    if (window.innerWidth < 640) {
      setIsFilterOpen(false);
    }
    
    // Загружаем все товары для фильтрации
    fetchAllProducts();
  };

  const handleSortChange = (newSortOption) => {
    console.log('🔄 Изменяем сортировку на:', newSortOption);
    setSortOption(newSortOption);
  };

  return (
    <div className="min-h-screen bg-creamy py-6">
      <div className="w-full">
        {/* Название выбранной категории */}
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-[60px] mb-4">
          <div className="text-center">
            <h2 className="text-2xl font-montserrat font-semibold leading-[29px] text-choco-light">
              {getCategoriesName(appliedFilters.categories)}
            </h2>
          </div>
        </div>
        
        <CatalogHeader 
          isFilterOpen={isFilterOpen} 
          setIsFilterOpen={setIsFilterOpen}
          onSortChange={handleSortChange}
        />
        
        {/* Основной контент с минимальной высотой для предотвращения перекрытия Footer */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-[60px] mt-6 pb-16 min-h-[600px]">
          {/* Desktop и Tablet версия - flex layout */}
          <div className="hidden sm:flex items-start gap-6">
            {isFilterOpen && <Sidebar onApplyFilters={handleApplyFilters} products={allProducts} />}
            
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
                <NoProductsMessage />
              )}
            </div>
          </div>

          {/* Mobile версия (<640px) */}
          <div className="sm:hidden relative z-10">
            {isFilterOpen ? (
              /* Показываем только фильтры на всю ширину */
              <Sidebar className="w-full" onApplyFilters={handleApplyFilters} products={allProducts} />
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
                  <NoProductsMessage isMobile={true} />
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