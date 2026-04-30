import React from "react"
import { useUserStore } from '../stores/useUserStore'
import { Navigate, useSearchParams } from 'react-router-dom'
import { ExitIcon, DropdownArrowIcon, CartIcon, HeartIcon, SearchIcon, DataIcon, AddressIcon, SupportIcon, FaqIcon, CoinIcon } from '../components/icons'
import { MenuDropdown } from '../components/ui/dropdowns'
import { GeneralData, Favorites, Addresses, Orders, Bonuses } from './user'

const UserPanel = () => {
  const { user, logout } = useUserStore()
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage = searchParams.get('page') || 'general'
  
  // Маппинг страниц для dropdown меню
  const pageMapping = {
    general: { name: "Загальні дані", icon: DataIcon },
    history: { name: "Історія замовлень", icon: CartIcon },
    favorites: { name: "Обране", icon: HeartIcon },
    viewed: { name: "Переглянуті товари", icon: SearchIcon },
    addresses: { name: "Адреси доставки", icon: AddressIcon },
    bonus: { name: "Бонуси", icon: CoinIcon },
    support: { name: "Допомога", icon: SupportIcon },
    faq: { name: "FAQs", icon: FaqIcon },
  }

  // Опции для MenuDropdown
  const pageOptions = Object.entries(pageMapping).map(([key, page]) => ({
    value: key,
    label: page.name,
    icon: page.icon
  }))

  // Проверка прав (должен быть авторизизован)
  if (!user) {
    return <Navigate to='/login' replace />
  }

  const handlePageSelect = (pageKey) => {
    setSearchParams({ page: pageKey })
  }

  const renderContent = () => {    
    switch(currentPage) {
      case 'general':
        return <GeneralData />
      case 'history':
        return <Orders />
      case 'favorites':
        return <Favorites />
      case 'addresses':
        return <Addresses />
      case 'bonus':
        return <Bonuses />
      default:
        // Временная заглушка для страниц профиля
        return (
          <div className="text-center py-12 bg-white rounded-[30px] shadow-sm border border-[#E3D6BF]">
            <h3 className="text-xl font-montserrat font-bold text-choco-dark mb-2">
              {pageMapping[currentPage]?.name}
            </h3>
            <p className="text-choco-light font-montserrat">Скоро тут буде контент</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-creamy relative z-0 pb-16">
      {/* Header Profile */}
      <div className="w-full max-w-[1440px] flex flex-col gap-4 px-[15px] sm:px-[30px] lg:px-[60px] py-[12px] bg-creamy mx-auto">
        <div className="w-full flex items-start justify-between min-h-[42px] pt-1">
          <div className="flex items-center mt-1">
            <h1 className="font-montserrat font-light text-lg sm:text-2xl leading-[20px] md:leading-[29px] text-choco-dark">Мій акаунт</h1>
          </div>
          <div className="flex items-start gap-5">
            <div className="flex flex-col flex-1 text-right gap-[10px] justify-center items-end sm:items-start sm:text-left w-full max-w-[200px] sm:max-w-none">
              <div className="flex flex-col gap-[5px] items-end sm:items-start w-full">
                <span className="font-montserrat font-medium text-base leading-5 text-choco-light truncate w-full">{user?.name}</span>
                <span className="font-montserrat font-medium text-sm leading-[17px] text-choco-light opacity-50 truncate w-[150px] sm:w-auto">
                  {user?.email}
                </span>
              </div>
              <div className="flex flex-row justify-center items-center py-[10px] px-[30px] gap-[10px] w-[190px] h-[39px] bg-choco-light rounded-[27px]">
                <div className="flex flex-row items-center gap-[10px] w-full">
                  <CoinIcon className="w-[24px] h-[24px] shrink-0" stroke="#F5EEE0" />
                  <span className="font-montserrat font-semibold text-[18px] leading-[22px] text-creamy whitespace-nowrap">
                    {user?.bonusPoints || 0} балів
                  </span>
                </div>
              </div>
            </div>
            <button onClick={() => logout()} className="cursor-pointer hover:opacity-75 transition-opacity mt-1" title="Вийти">
              <ExitIcon className="w-5 h-5 transform scale-x-[-1] text-choco-light" stroke="currentColor" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Dropdown */}
      <div className="w-full max-w-[1440px] mx-auto px-[15px] sm:px-[30px] lg:px-[60px] py-4 relative z-10">
        <MenuDropdown
          variant="admin" // Используем стиль админки для единообразия
          options={pageOptions}
          selected={currentPage}
          onChange={handlePageSelect}
          showCheckmarks={false}
          customTrigger={
            <button className="flex flex-row justify-between items-center px-[15px] gap-[10px] w-full sm:w-[349px] h-[44px] bg-dark-creamy rounded-[30px] transition-colors hover:opacity-90">
              <div className="flex flex-row items-center gap-[10px] min-w-[200px] h-[24px]">
                {React.createElement(pageMapping[currentPage].icon, {
                  className: "w-[24px] h-[24px] flex-shrink-0 text-[#705A5A]",
                  strokeWidth: 2,
                })}
                <span className="font-montserrat font-semibold text-[18px] leading-[22px] text-choco-light whitespace-nowrap overflow-hidden text-ellipsis text-left">
                  {pageMapping[currentPage].name}
                </span>
              </div>
              <DropdownArrowIcon className="w-[19px] h-[16px] flex-shrink-0" stroke="#705A5A" strokeWidth={2} />
            </button>
          }
        />
      </div>

      {/* Main Content */}
      <div className="w-full max-w-[1440px] mx-auto px-[15px] sm:px-[30px] lg:px-[60px] relative z-0">{renderContent()}</div>
    </div>
  )
}

export default UserPanel