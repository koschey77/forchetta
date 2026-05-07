import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productsAPI, articlesAPI } from '../../services/api';

const Breadcrumbs = () => {
  const location = useLocation();

  const paths = location.pathname.split('/').filter(Boolean);

  // Для продукту
  const isProductPage = paths[0] === 'product' && paths[1];
  const productId = isProductPage ? paths[1] : null;

  const { data: product } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productsAPI.getById(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  });

  // Для журналу
  const isJournalPage = paths[0] === 'journal' && paths[1];
  const articleId = isJournalPage ? paths[1] : null;

  const { data: article } = useQuery({
    queryKey: ['article', articleId],
    queryFn: () => articlesAPI.getById(articleId),
    enabled: !!articleId,
    staleTime: 5 * 60 * 1000,
  });

  // Маршрути, де не треба показувати хлібні крихти
  const blacklist = [
    '/',
    '/login',
    '/signup',
    '/verify-email',
    '/forgot-password',
    '/reset-password',
    '/success'
  ];

  // Якщо шлях у блеклісті — ховаємо
  if (blacklist.includes(location.pathname)) {
    return null;
  }

  // Словник перекладів для статичних роутів
  const routeNames = {
    'catalog': 'Каталог',
    'cart': 'Мій кошик',
    'checkout': 'Оформлення замовлення',
    'user-panel': 'Особистий кабінет',
    'admin': 'Панель адміністратора',
    'faq': 'Допомога',
    'shops': 'Магазини',
    'journal': 'Журнал Forchetta',
    'about': 'Про нас'
  };

  const getBreadcrumbName = (path, index) => {
    // 1. Спочатку шукаємо у словнику
    if (routeNames[path]) {
      return routeNames[path];
    }
    
    // 2. Якщо це продукт (динамічний URL типу /product/:id)
    if (paths[index - 1] === 'product') {
      // Підставляємо ім'я з кешу/запиту
      return product?.name || 'Перегляд товару';
    }

    // 2.5. Якщо це стаття в журналі (динамічний URL типу /journal/:id)
    if (paths[index - 1] === 'journal') {
      return article?.title || 'Стаття';
    }
    
    // 3. Фолбек (Product як папка)
    if (path === 'product') {
      return 'Товар';
    }

    // 4. Останній варіант - оригінальний текст з великої літери
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto h-[40px] flex items-center px-[16px] xl:px-[60px] gap-[10px] my-[8px] font-montserrat font-light text-[12px] leading-[15px] text-choco-dark transition-all">
      <Link to="/" className="hover:opacity-80">Головна</Link>
      
      {paths.map((path, index) => {
        // Генеруємо URL для конкретного кроку
        const routeTo = `/${paths.slice(0, index + 1).join('/')}`;
        const isLast = index === paths.length - 1;
        const name = getBreadcrumbName(path, index);

        // Якщо це просто "product" (не сам Id), краще зробити його некликабельним або посилатися на каталог
        if (path === 'product' && !isLast) {
          return (
            <div key={name} className="flex items-center gap-[10px]">
              <span className="text-choco-light">/</span>
              <Link to="/catalog" className="text-choco-light hover:opacity-80">Каталог</Link>
            </div>
          );
        }

        return (
          <div key={name} className="flex items-center gap-[10px]">
            <span className="text-choco-light">/</span>
            {isLast ? (
              <span className="text-choco-light">{name}</span>
            ) : (
              <Link to={routeTo} className="text-choco-light hover:opacity-80">
                {name}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;