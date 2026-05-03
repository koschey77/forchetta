import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { adminUserAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const UserList = () => {
  const queryClient = useQueryClient();

  // Настройка сортировки: по умолчанию показываем самых новых пользователей
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

  // Запрашиваем пользователей
  const { data: fetchUsers, isLoading, isError } = useQuery({
    queryKey: ['admin_users'],
    queryFn: adminUserAPI.getAll
  });

  // Мутація для блокування/розблокування користувача
  const toggleStatusMutation = useMutation({
    mutationFn: (id) => adminUserAPI.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_users'] });
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Помилка при зміні статусу');
    }
  });

  // Мутація для зміни ролі користувача
  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }) => adminUserAPI.updateRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_users'] });
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Помилка при зміні ролі');
    }
  });

  // Мемоизированный массив для быстрого рендера (пересортировывается только если кликнули на сортировку)
  const sortedUsers = useMemo(() => {
    let sortableItems = [...(fetchUsers || [])];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key] ?? '';
        const bValue = b[sortConfig.key] ?? '';
        
        // Сортировка для строк (алфавитная)
        if (typeof aValue === 'string') {
          return sortConfig.direction === 'asc' 
            ? aValue.localeCompare(String(bValue)) 
            : String(bValue).localeCompare(aValue);
        }

        // Сортировка для чисел (Обіг, Замовлення, Бонуси)
        return sortConfig.direction === 'asc' 
          ? (aValue > bValue ? 1 : -1) 
          : (aValue < bValue ? 1 : -1);
      });
    }
    return sortableItems;
  }, [fetchUsers, sortConfig]);

  // Обработчик клика по заголовку
  const handleSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  if (isLoading) return <LoadingSpinner />;
  
  if (isError) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-md">
        Помилка завантаження користувачів
      </div>
    );
  }

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    if (isNaN(date)) return '---';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    // Обертка с overflow-x-auto, чтобы на планшетах / мобилках появлялся скролл
    // min-w-[900px] устанавливает минимальную ширину контента, заставляя его растягиваться и скроллиться на мелких экранах
    <div className="w-full overflow-x-auto pb-4">
      <div className="flex flex-col gap-6 min-w-[900px]">
        {/* Заголовок Таблиці (Грід) */}
        <div className="grid grid-cols-[250px_1fr_1fr_1fr_1fr_1fr_60px] gap-4 w-full px-6 py-4 items-center">
          <div onClick={() => handleSort('name')} className="font-montserrat font-semibold text-[18px] text-choco-light flex items-center cursor-pointer hover:opacity-70 transition-opacity select-none">
            Покупець 
            <span className={`inline-block w-4 text-[16px] text-center ml-1 transition-opacity ${sortConfig.key === 'name' ? 'opacity-100' : 'opacity-30'}`}>
              {sortConfig.key === 'name' && sortConfig.direction === 'asc' ? '↑' : '↓'}
            </span>
          </div>
          <div onClick={() => handleSort('ordersCount')} className="font-montserrat font-semibold text-[18px] text-choco-light flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity select-none">
            Замовлень 
            <span className={`inline-block w-4 text-[16px] text-center transition-opacity ${sortConfig.key === 'ordersCount' ? 'opacity-100' : 'opacity-30'}`}>
              {sortConfig.key === 'ordersCount' && sortConfig.direction === 'asc' ? '↑' : '↓'}
            </span>
          </div>
          <div onClick={() => handleSort('totalSpent')} className="font-montserrat font-semibold text-[18px] text-choco-light flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity select-none">
            Обіг 
            <span className={`inline-block w-4 text-[16px] text-center transition-opacity ${sortConfig.key === 'totalSpent' ? 'opacity-100' : 'opacity-30'}`}>
              {sortConfig.key === 'totalSpent' && sortConfig.direction === 'asc' ? '↑' : '↓'}
            </span>
          </div>
          <div onClick={() => handleSort('bonusPoints')} className="font-montserrat font-semibold text-[18px] text-choco-light flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity select-none">
            Бонуси 
            <span className={`inline-block w-4 text-[16px] text-center transition-opacity ${sortConfig.key === 'bonusPoints' ? 'opacity-100' : 'opacity-30'}`}>
              {sortConfig.key === 'bonusPoints' && sortConfig.direction === 'asc' ? '↑' : '↓'}
            </span>
          </div>
          <div className="font-montserrat font-semibold text-[18px] text-choco-light flex items-center justify-center">Статус</div>
          <div className="font-montserrat font-semibold text-[18px] text-choco-light flex items-center justify-center">Роль</div>
          <div className="font-montserrat font-semibold text-[18px] text-choco-light flex items-center justify-center">Дії</div>
        </div>

        {/* Тіло Таблиці */}
        <div className="flex flex-col gap-2 w-full">
        {sortedUsers.map((user) => (
          <div key={user._id} className="grid grid-cols-[250px_1fr_1fr_1fr_1fr_1fr_60px] gap-4 w-full px-6 py-4 items-center relative hover:bg-light-creamy/30 transition-colors rounded-xl">
            
            {/* Покупець (Ім'я, Email, Телефон, Дата) */}
            <div className="flex flex-col">
              <span className="font-montserrat font-medium text-[14px] text-choco-light block">
                {user.name}
              </span>
              <span className="font-montserrat font-medium text-[14px] text-choco-light block">
                {user.email}
              </span>
              <span className="font-montserrat font-medium text-[14px] text-choco-light opacity-80 block mt-1">
                {user.phone || 'Немає номеру'}
              </span>
              <span className="font-montserrat font-medium text-[12px] text-choco-light opacity-60 block mt-1">
                {formatDate(user.createdAt)}
              </span>
            </div>

            {/* Замовлень / Товарів */}
            <div className="font-montserrat font-medium text-[14px] text-choco-light text-center">
              {user.ordersCount || 0} / {user.totalItemsBought || 0}
            </div>

            {/* Обіг */}
            <div className="font-montserrat font-medium text-[14px] text-choco-light text-center whitespace-nowrap">
              {user.totalSpent?.toLocaleString('uk-UA') || 0} ₴
            </div>

            {/* Бонуси */}
            <div className="font-montserrat font-medium text-[14px] text-choco-light text-center">
               {user.bonusPoints || 0}
            </div>

            {/* Статус (Активний/Заблокований зі стилем як "Мітки") */}
            <div className="flex justify-center">
              <div className="w-[23px] h-[23px] rounded-full border border-choco-light/50 bg-light-creamy flex items-center justify-center shadow-sm cursor-help title-tooltip" title={user.isActive ? 'Активний' : 'Заблокований'}>
                {user.isActive ? (
                   <span className="w-[12px] h-[12px] bg-choco-light rounded-full"></span>
                ) : (
                   <span className="w-[12px] h-[12px] bg-wine-red rounded-sm rotate-45"></span>
                )}
              </div>
            </div>

            {/* Роль */}
            <div className="font-montserrat font-medium text-[14px] text-choco-light text-center">
              {user.role === 'admin' ? 'Адмін' : 'Клієнт'}
            </div>

            {/* Дії (Блокування та Роль - дві кнопки як на макеті) */}
            <div className="flex flex-col gap-[3px] items-center justify-center">
              {/* Кнопка "Змінити Роль" (іконка щита/коронки) */}
              <button 
                title="Змінити роль"
                onClick={() => updateRoleMutation.mutate({ id: user._id, role: user.role === 'admin' ? 'customer' : 'admin' })}
                disabled={updateRoleMutation.isPending}
                className="w-[31px] h-[31px] rounded-[30px] bg-light-creamy flex items-center justify-center text-wine-red hover:bg-creamy transition-colors shadow-sm disabled:opacity-50"
              >
                <svg width="14" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </button>

              {/* Кнопка "Заблокувати/Розблокувати" (іконка замка) */}
              <button 
                title={user.isActive ? "Заблокувати" : "Розблокувати"}
                onClick={() => toggleStatusMutation.mutate(user._id)}
                disabled={toggleStatusMutation.isPending}
                className="w-[31px] h-[31px] rounded-[30px] bg-light-creamy flex items-center justify-center text-wine-red hover:bg-creamy transition-colors shadow-sm disabled:opacity-50"
              >
                {user.isActive ? (
                  <svg width="14" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                ) : (
                  <svg width="14" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
                  </svg>
                )}
              </button>
            </div>
            
          </div>
        ))}

        {(!fetchUsers || fetchUsers.length === 0) && (
          <div className="w-full text-center py-10 font-montserrat text-choco-light">
            Немає результатів
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default UserList;