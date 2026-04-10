import { useUserStore } from '../../stores/useUserStore'

const GeneralData = () => {
  const { user } = useUserStore()

  return (
    <div className="bg-white rounded-[30px] shadow-sm border border-[#E3D6BF] p-6 lg:p-[40px] flex flex-col gap-6 w-full">
      <div className="flex items-center gap-6">
        {(user?.avatar || user?.picture) && (
          <img 
            src={user.avatar || user.picture} 
            alt={user.name} 
            className="w-[70px] h-[70px] sm:w-[90px] sm:h-[90px] rounded-full object-cover border-2 border-[#E3D6BF] shrink-0"
            referrerPolicy="no-referrer"
          />
        )}
        <h2 className="font-montserrat font-bold text-2xl md:text-3xl text-choco-dark">
          Загальні дані
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-[800px]">
        {/* Name */}
        <div className="flex flex-col gap-1">
          <label className="font-montserrat font-medium text-[13px] leading-[16px] text-choco-light opacity-50">
            Ім&apos;я
          </label>
          <div className="w-full h-[53px] rounded-[10px] border border-[#E3D6BF] bg-white px-5 flex items-center">
            <span className="font-montserrat text-base text-choco-dark truncate">
              {user?.name}
            </span>
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="font-montserrat font-medium text-[13px] leading-[16px] text-choco-light opacity-50">
            Пошта
          </label>
          <div className="w-full h-[53px] rounded-[10px] border border-[#E3D6BF] bg-white px-5 flex items-center">
            <span className="font-montserrat text-base text-choco-dark truncate outline-none w-full">
              {user?.email}
            </span>
          </div>
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1">
          <label className="font-montserrat font-medium text-[13px] leading-[16px] text-choco-light opacity-50">
            Мобільний телефон
          </label>
          <div className="w-full h-[53px] rounded-[10px] border border-[#E3D6BF] bg-[#F9F6F0] px-5 flex items-center">
            <span className="font-montserrat text-base text-choco-light opacity-50 truncate outline-none w-full">
              {user?.phone || 'Не вказано'}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-[15px]">
        <button className="flex items-center justify-center w-full sm:w-[220px] h-[53px] bg-choco-dark rounded-[30px] font-montserrat font-medium text-base text-creamy transition-opacity hover:opacity-90">
          Редагувати дані
        </button>
        <button className="flex items-center justify-center w-full sm:w-[220px] h-[53px] border border-choco-dark rounded-[30px] font-montserrat font-medium text-base text-choco-dark transition-colors hover:bg-dark-creamy">
          Змінити пароль
        </button>
      </div>
    </div>
  )
}

export default GeneralData
