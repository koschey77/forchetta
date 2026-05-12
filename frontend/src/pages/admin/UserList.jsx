import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useUserStore } from '../../stores/useUserStore';
import { adminUserAPI } from '../../services/api';
import TopPaginationControls from '../../components/common/pagination/TopPaginationControls';
import BottomPaginationControls from '../../components/common/pagination/BottomPaginationControls';
import useFilterDebounce from '../../hooks/useFilterDebounce';
import { SearchIcon } from '../../components/icons';

const AdminUserSkeleton = () => (
  <div className="grid grid-cols-[250px_1fr_1fr_1fr_1fr_1fr_60px] gap-4 w-full px-6 py-4 items-center bg-transparent border-b border-dark-creamy/30 last:border-b-0 animate-pulse">
    {/* Покупець */}
    <div className="flex flex-col gap-2">
      <div className="h-4 bg-choco-light/10 rounded w-32"></div>
      <div className="h-4 bg-choco-light/10 rounded w-40"></div>
      <div className="h-3 bg-choco-light/10 rounded w-24 mt-1"></div>
      <div className="h-3 bg-choco-light/10 rounded w-20 mt-1"></div>
    </div>
    
    {/* Замовлень */}
    <div className="flex flex-col items-center gap-2">
      <div className="h-4 bg-choco-light/10 rounded w-8"></div>
      <div className="h-3 bg-choco-light/10 rounded w-12"></div>
    </div>
    
    {/* Обіг */}
    <div className="flex flex-col items-center gap-2">
      <div className="h-4 bg-choco-light/10 rounded w-16"></div>
      <div className="h-3 bg-choco-light/10 rounded w-12"></div>
    </div>
    
    {/* Бонуси */}
    <div className="flex justify-center">
      <div className="h-4 bg-choco-light/10 rounded w-12"></div>
    </div>

    {/* Статус */}
    <div className="flex justify-center">
      <div className="h-6 bg-choco-light/10 rounded-full w-20"></div>
    </div>

    {/* Роль */}
    <div className="flex justify-center">
      <div className="h-8 bg-choco-light/10 rounded w-24"></div>
    </div>

    {/* Дії */}
    <div className="flex justify-center">
      <div className="h-6 w-6 bg-choco-light/10 rounded-md mt-6"></div>
    </div>
  </div>
);

const UserList = () => {
  const queryClient = useQueryClient();
  const { user: currentUser } = useUserStore();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [searchQuery, setSearchQuery] = useState('');
  
  const debouncedSearch = useFilterDebounce(searchQuery, 500, 2);

  // Настройка сортировки: по умолчанию показываем самых новых пользователей
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [userToToggleStatus, setUserToToggleStatus] = useState(null);
  const [userToUpdateRole, setUserToUpdateRole] = useState(null);

  // Запрашиваем пользователей
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ['admin_users', page, limit, debouncedSearch, sortConfig.key, sortConfig.direction],
    queryFn: () => adminUserAPI.getAll({ 
      page, 
      limit, 
      search: debouncedSearch,
      sortBy: sortConfig.key,
      sortOrder: sortConfig.direction
    }),
    keepPreviousData: true,
  });

  const isDataLoading = isLoading || isFetching;
  const currentUsers = data?.users || [];
  const totalUsers = data?.total || 0;
  const totalPages = data?.pages || 0;

  // Мутація для блокування/розблокування користувача
  const toggleStatusMutation = useMutation({
    mutationFn: (id) => adminUserAPI.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_users'] });
      setUserToToggleStatus(null);
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Помилка при зміні статусу');
      setUserToToggleStatus(null);
    }
  });

  // Мутація для зміни ролі користувача
  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }) => adminUserAPI.updateRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_users'] });
      setUserToUpdateRole(null);
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Помилка при зміні ролі');
      setUserToUpdateRole(null);
    }
  });



  // Обработчик клика по заголовку
  const handleSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
    setPage(1); // Скинути пагінацію на початок при зміні сортування
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

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
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${hours}:${minutes} ${day}.${month}.${year}`;
  };

  return (
    // Обертка с overflow-x-auto, чтобы на планшетах / мобилках появлялся скролл
    // min-w-[900px] устанавливает минимальную ширину контента, заставляя его растягиваться и скроллиться на мелких экранах
    <div className="w-full flex flex-col gap-6">
      
      {/* Header & Controls */}
      <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-y-4 py-2 border-b border-light-creamy">
         
         {/* Сводка количества користувачів */}
         <div className="flex items-center order-1 w-auto">
            <span className="font-montserrat font-bold text-[15px] xl:text-[18px] text-choco-dark whitespace-nowrap">
              Всього користувачів: <span className="text-wine-red ml-1">{totalUsers}</span>
            </span>
         </div>
         
         {/* Search Input */}
         <div className="relative w-full sm:w-[400px] order-3 sm:order-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="w-[18px] h-[18px] text-choco-light opacity-50" strokeWidth="2" />
            </div>
            <input
              type="text"
              placeholder="Пошук (Ім'я, Email, Телефон)..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-choco-light/30 focus:border-wine-red focus:outline-none bg-transparent font-montserrat text-[14px] text-choco-dark placeholder-choco-light/50 transition-colors"
            />
         </div>

         {/* Перемикач лімітів */}
         <div className="flex items-center order-2 sm:order-3 w-auto justify-end">
            <TopPaginationControls 
               itemsPerPage={limit}
               onItemsPerPageChange={handleLimitChange}
            />
         </div>
      </div>

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
          <div onClick={() => handleSort('ordersCount')} className="font-montserrat font-semibold text-[18px] text-choco-light flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity select-none text-center">
            Замовлень<br />/ Товарів
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
          {isDataLoading ? (
            Array.from({ length: limit }).map((_, i) => <AdminUserSkeleton key={i} />)
          ) : currentUsers.length > 0 ? (
            currentUsers.map((user) => (
              <div key={user._id} className="grid grid-cols-[250px_1fr_1fr_1fr_1fr_1fr_60px] gap-4 w-full px-6 py-4 items-center relative hover:bg-light-creamy/30 transition-colors rounded-xl">
            
            {/* Покупець (Ім'я, Email, Телефон, Дата) */}
            <div className="flex flex-col">
              <span className="font-montserrat font-medium text-[14px] text-choco-light block">
                {user.name}
              </span>
              <span className="font-montserrat font-medium text-[14px] text-choco-light block">
                {user.email?.startsWith('deleted') ? user.email.split('@')[0] : user.email}
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
              {user.isSuperadmin ? (
                <span className="text-wine-red font-bold">Суперадмін</span>
              ) : user.role === 'admin' ? 'Адмін' : 'Клієнт'}
            </div>

            {/* Дії (Блокування та Роль - дві кнопки як на макеті) */}
            <div className="flex flex-col gap-[3px] items-center justify-center">
              {/* Кнопка "Змінити Роль" (іконка щита/коронки) */}
              <button 
                title={!currentUser?.isSuperadmin ? "Тільки для Головного адміністратора" : "Змінити роль"}
                onClick={() => setUserToUpdateRole(user)}
                disabled={updateRoleMutation.isPending || !currentUser?.isSuperadmin}
                className={`w-[31px] h-[31px] rounded-[30px] bg-light-creamy flex items-center justify-center text-wine-red transition-colors shadow-sm disabled:opacity-50 ${!currentUser?.isSuperadmin ? 'cursor-not-allowed' : 'hover:bg-creamy'}`}
              >
                <svg width="14" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </button>

              {/* Кнопка "Заблокувати/Розблокувати" (іконка замка) */}
              <button 
                title={!currentUser?.isSuperadmin ? "Тільки для Головного адміністратора" : user.isActive ? "Заблокувати" : "Розблокувати"}
                onClick={() => setUserToToggleStatus(user)}
                disabled={toggleStatusMutation.isPending || !currentUser?.isSuperadmin}
                className={`w-[31px] h-[31px] rounded-[30px] bg-light-creamy flex items-center justify-center text-wine-red transition-colors shadow-sm disabled:opacity-50 ${!currentUser?.isSuperadmin ? 'cursor-not-allowed' : 'hover:bg-creamy'}`}
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
        ))
        ) : (
          <div className="w-full text-center py-10 font-montserrat text-choco-light">
            Немає результатів
          </div>
        )}
      </div>
      </div>

      {/* Нижня пагінація */}
      {totalPages > 1 && (
        <div className="mt-2 mb-8 flex justify-center w-full">
          <BottomPaginationControls 
            currentPage={page} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        </div>
      )}
      
      {/* Модалка изменения статуса */}
      {userToToggleStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-choco-light/60 backdrop-blur-sm">
          <div className="bg-creamy rounded-xl p-8 max-w-sm w-full mx-auto shadow-xl text-center space-y-6">
            <h3 className="font-cormorant text-2xl font-bold text-choco-light">
              Змінити статус?
            </h3>
            <p className="font-montserrat text-choco-light opacity-80 text-sm">
              Ви впевнені, що хочете <b>{userToToggleStatus.isActive ? 'заблокувати' : 'розблокувати'}</b> користувача <b>{userToToggleStatus.email?.startsWith('deleted') ? userToToggleStatus.email.split('@')[0] : userToToggleStatus.email}</b>?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full justify-center">
              <button
                onClick={() => setUserToToggleStatus(null)}
                className="flex-1 py-3 px-6 rounded-[30px] border border-wine-red text-wine-red font-montserrat font-medium text-[14px] hover:bg-wine-red/5 transition-colors"
                disabled={toggleStatusMutation.isPending}
              >
                Скасувати
              </button>
              <button
                onClick={() => toggleStatusMutation.mutate(userToToggleStatus._id)}
                className={`flex-1 py-3 px-6 rounded-[30px] text-light-creamy font-montserrat font-medium text-[14px] transition-colors ${userToToggleStatus.isActive ? 'bg-wine-red hover:bg-[#5a1b24]' : 'bg-choco-light hover:bg-[#5a4848]'}`}
                disabled={toggleStatusMutation.isPending}
              >
                {toggleStatusMutation.isPending ? 'Обробка...' : 'Підтвердити'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модалка изменения роли */}
      {userToUpdateRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-choco-light/60 backdrop-blur-sm">
          <div className="bg-creamy rounded-xl p-8 max-w-sm w-full mx-auto shadow-xl text-center space-y-6">
            <h3 className="font-cormorant text-2xl font-bold text-choco-light">
              Змінити роль?
            </h3>
            <p className="font-montserrat text-choco-light opacity-80 text-sm">
              Ви впевнені, що хочете надати роль <b>{userToUpdateRole.role === 'admin' ? 'Клієнт' : 'Адміністратор'}</b> користувачу <b>{userToUpdateRole.email?.startsWith('deleted') ? userToUpdateRole.email.split('@')[0] : userToUpdateRole.email}</b>?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full justify-center">
              <button
                onClick={() => setUserToUpdateRole(null)}
                className="flex-1 py-3 px-6 rounded-[30px] border border-wine-red text-wine-red font-montserrat font-medium text-[14px] hover:bg-wine-red/5 transition-colors"
                disabled={updateRoleMutation.isPending}
              >
                Скасувати
              </button>
              <button
                onClick={() => updateRoleMutation.mutate({ id: userToUpdateRole._id, role: userToUpdateRole.role === 'admin' ? 'customer' : 'admin' })}
                className="flex-1 py-3 px-6 rounded-[30px] bg-wine-red text-light-creamy font-montserrat font-medium text-[14px] hover:bg-[#5a1b24] transition-colors"
                disabled={updateRoleMutation.isPending}
              >
                {updateRoleMutation.isPending ? 'Обробка...' : 'Підтвердити'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
    </div>
  );
};

export default UserList;