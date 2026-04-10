import { useQuery } from '@tanstack/react-query';
import { adminUserAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const UserList = ({ onEditUser }) => {
  // Запрашиваем всех пользователей через TanStack Query
  const { data: users, isLoading, isError, error } = useQuery({
    queryKey: ['admin_users'],
    queryFn: adminUserAPI.getAll
  });

  if (isLoading) return <LoadingSpinner />;
  
  if (isError) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-md">
        Помилка завантаження користувачів: {error.message}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-[30px] shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[24px] font-montserrat font-bold text-choco-dark">
          Список користувачів
        </h2>
        {/* Кнопка на будущее, когда сделаем редактор */}
        <button 
          className="bg-choco-dark text-white px-6 py-2 rounded-2xl hover:bg-choco-light transition-colors"
          onClick={() => onEditUser && onEditUser(null)}
        >
          + Створити
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y border border-creamy rounded-lg">
          <thead className="bg-creamy">
            <tr>
              <th className="px-4 py-3 text-left font-montserrat font-semibold text-choco-dark">Ім&apos;я</th>
              <th className="px-4 py-3 text-left font-montserrat font-semibold text-choco-dark">Email</th>
              <th className="px-4 py-3 text-left font-montserrat font-semibold text-choco-dark">Телефон</th>
              <th className="px-4 py-3 text-left font-montserrat font-semibold text-choco-dark">Реєстрація</th>
              <th className="px-4 py-3 text-left font-montserrat font-semibold text-choco-dark">Роль</th>
              <th className="px-4 py-3 text-left font-montserrat font-semibold text-choco-dark">Статус</th>
              <th className="px-4 py-3 text-left font-montserrat font-semibold text-choco-dark">Бонуси</th>
              <th className="px-4 py-3 text-left font-montserrat font-semibold text-choco-dark">Реєстрація</th>
            </tr>
          </thead>
          <tbody className="divide-y font-montserrat text-choco-dark">
            {users?.map(user => (
              <tr key={user._id} className="hover:bg-creamy/30 transition-colors">
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.phone || '-'}</td>
                <td className="px-4 py-3">
                  {user.googleId ? (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold select-none flex items-center w-max gap-1">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      Google
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold select-none">
                      Email
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {user.isActive ? (
                    <span className="text-green-600">Активний</span>
                  ) : (
                    <span className="text-red-500 font-bold">Заблокований</span>
                  )}
                </td>
                <td className="px-4 py-3">{user.bonusPoints}</td>
                <td className="px-4 py-3">{new Date(user.createdAt).toLocaleDateString('uk-UA')}</td>
              </tr>
            ))}
            
            {(!users || users.length === 0) && (
              <tr>
                <td colSpan="8" className="px-4 py-8 text-center text-choco-light">
                  Користувачів не знайдено
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;