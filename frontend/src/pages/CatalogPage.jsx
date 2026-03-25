import { useState } from 'react';
import CatalogHeader from '../components/catalog/CatalogHeader';
import Sidebar from '../components/catalog/Sidebar';
import ProductCard from '../components/catalog/ProductCard';
import productImage from '../components/catalog/Frame 316.png';

// Временные данные товаров (потом заменим на данные из стора)
const mockProducts = [
  {
    id: 1,
    title: 'Торт "Малиновий оксамит"',
    price: "150 грн / 150 г",
    tag: { text: "Новинка", type: "dark" },
    image: productImage,
  },
  {
    id: 2,
    title: "Цукерки «Фундуковий Трюфель»",
    price: "135 грн / 150 г.",
    tag: { text: "Топ продажів", type: "light" },
    image: productImage,
  },
  {
    id: 3,
    title: "Тістечко «Червоний Оксамит»",
    price: "120 грн / 155 г",
    tag: { text: "Новинка", type: "dark" },
    image: productImage,
  },
  {
    id: 4,
    title: "Торт «Чорнична Хмаринка»",
    price: "1000 грн / 1 кг",
    tag: { text: "Топ продажів", type: "light" },
    image: productImage,
  },
  {
    id: 5,
    title: 'Торт "Інжирне диво"',
    price: "700 грн / 700 г",
    tag: { text: "Топ продажів", type: "light" },
    image: productImage,
  },
  {
    id: 6,
    title: 'Торт "Класичний"',
    price: "209 грн / 400 г",
    oldPrice: "220 грн",
    tag: { text: "-5%", type: "red" },
    image: productImage,
  },
  {
    id: 7,
    title: "Шоколад «Чумацький Шлях»",
    price: "135 грн / 90 г",
    tag: { text: "Новинка", type: "dark" },
    image: productImage,
  },
  {
    id: 8,
    title: "Тістечко «Крижана Корона»",
    price: "125 грн / 150 г",
    tag: { text: "Новинка", type: "dark" },
    image: productImage,
  },
  {
    id: 9,
    title: 'Торт "Галактика"',
    price: "205 грн / 120 г",
    tag: null,
    image: productImage,
  },
  {
    id: 10,
    title: "Торт «Ріжок Достатку»",
    price: "750 грн / 850 г",
    oldPrice: "1000 грн",
    tag: { text: "-25%", type: "red" },
    image: productImage,
  },
  {
    id: 11,
    title: "Батончик «Горіхова Карамель»",
    price: "50 грн / 1 кг",
    tag: { text: "Новинка", type: "dark" },
    image: productImage,
  },
  {
    id: 12,
    title: "Торт «Ягідна Насолода»",
    price: "1000 грн / 700г",
    tag: { text: "Топ продажів", type: "light" },
    image: productImage,
  },
]

const CatalogPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-creamy py-6">
      <div className="w-full">
        <CatalogHeader 
          isFilterOpen={isFilterOpen} 
          setIsFilterOpen={setIsFilterOpen} 
        />
        
        <div className="max-w-[1440px] mx-auto px-4 sm:px-[60px] mt-6">
          {/* Desktop и Tablet версия - flex layout */}
          <div className="hidden sm:flex items-start gap-6">
            {isFilterOpen && <Sidebar />}
            
            <div className={`grid gap-x-6 gap-y-8 flex-grow transition-all duration-300 ease-in-out ${
              isFilterOpen 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            }`}>
              {mockProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          {/* Mobile версия (<640px) - conditional rendering */}
          <div className="sm:hidden">
            {isFilterOpen ? (
              /* Показываем только фильтры на всю ширину */
              <Sidebar className="w-full" />
            ) : (
              /* Показываем только товары */
              <div className="grid gap-x-4 gap-y-8 grid-cols-2">
                {mockProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;