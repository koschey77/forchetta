import { useNavigate } from "react-router-dom"
import { useUserStore } from "../stores/useUserStore"

const ProfilePage = () => {
  const navigate = useNavigate()
  const { user, logout } = useUserStore()

  // Если пользователя нет, перенаправляем на логин
  if (!user) {
    navigate('/login')
    return null
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-main-gradient py-8">
      <div className="mx-auto max-w-2xl px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Заголовок */}
          <h1 className="font-cormorant text-4xl font-bold text-choco-dark mb-8 text-center">
            Мій профіль
          </h1>

          {/* Аватар пользователя */}
          <div className="flex justify-center mb-8">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt="Аватар профиля" 
                className="w-24 h-24 rounded-full object-cover border-4 border-dark-creamy"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-dark-creamy flex items-center justify-center">
                <span className="text-choco-light text-3xl font-montserrat font-medium">
                  {user.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Информация о пользователе */}
          <div className="space-y-6 mb-8">
            <div className="border-b border-gray-200 pb-4">
              <label className="block font-montserrat text-sm font-medium text-choco-light mb-2">
                Ім&apos;я
              </label>
              <p className="font-montserrat text-lg text-choco-dark">
                {user.name}
              </p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <label className="block font-montserrat text-sm font-medium text-choco-light mb-2">
                Email
              </label>
              <p className="font-montserrat text-lg text-choco-dark">
                {user.email}
              </p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <label className="block font-montserrat text-sm font-medium text-choco-light mb-2">
                Статус верифікації
              </label>
              <p className="font-montserrat text-sm font-medium text-green-600">
                ✓ Верифікований
              </p>
            </div>

            {user.googleId && (
              <div className="border-b border-gray-200 pb-4">
                <label className="block font-montserrat text-sm font-medium text-choco-light mb-2">
                  Тип акаунта
                </label>
                <p className="font-montserrat text-sm text-choco-dark flex items-center gap-2">
                  <span className="text-blue-600">Google</span>
                  <span className="text-green-600">✓</span>
                </p>
              </div>
            )}
          </div>

          {/* Кнопки */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-dark-creamy text-choco-dark rounded-xl font-montserrat font-medium hover:bg-choco-light hover:text-creamy transition duration-300"
            >
              На головну
            </button>
            
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-wine-red text-white rounded-xl font-montserrat font-medium hover:opacity-90 transition duration-300"
            >
              Вийти з акаунта
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage