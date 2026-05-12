import React from "react"
import { useUserStore } from '../stores/useUserStore'
import { Navigate, useSearchParams } from 'react-router-dom'
import { ExitIcon, DropdownArrowIcon, CartIcon, HeartIcon, SearchIcon, DataIcon, AddressIcon, FaqIcon, BonusIcon, MessageIcon } from '../components/icons'
import { MenuDropdown } from '../components/ui/dropdowns'
import { GeneralData, Favorites, Addresses, Orders, Bonuses, ViewedProducts, Reviews, Faqs } from './user'

const UserPanel = () => {
  const { user, logout } = useUserStore()
  const [searchParams, setSearchParams] = useSearchParams()
  const rawPage = searchParams.get('page') || 'general'
  
  // Мапінг сторінок для dropdown меню
  const pageMapping = {
    general: { name: "Загальні дані", icon: DataIcon },
    history: { name: "Історія замовлень", icon: CartIcon },
    favorites: { name: "Обране", icon: HeartIcon },
    viewed: { name: "Переглянуті товари", icon: SearchIcon },
    reviews: { name: "Відгуки", icon: MessageIcon },
    addresses: { name: "Адреси доставки", icon: AddressIcon },
    bonus: { name: "Бонуси", icon: BonusIcon },
    faq: { name: "FAQs", icon: FaqIcon },
  }

  // Перевіряємо чи існує сторінка, інакше скидаємо на general
  const currentPage = pageMapping[rawPage] ? rawPage : 'general'

  // Опції для MenuDropdown
  const pageOptions = Object.entries(pageMapping).map(([key, page]) => ({
    value: key,
    label: page.name,
    icon: page.icon
  }))

  // Перевірка прав (повинен бути авторизований)
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
      case 'viewed':
        return <ViewedProducts />
      case 'reviews':
        return <Reviews />
      case 'addresses':
        return <Addresses />
      case 'bonus':
        return <Bonuses />
      case 'faq':
        return <Faqs />
      default:
        // Тимчасова заглушка для сторінок профілю
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
            </div>
            <button onClick={() => logout()} className="cursor-pointer hover:opacity-75 transition-opacity mt-1" title="Вийти">
              <ExitIcon className="w-5 h-5 transform scale-x-[-1] text-choco-light" stroke="currentColor" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Dropdown and Bonus */}
      <div className="w-full max-w-[1440px] mx-auto px-[15px] sm:px-[30px] lg:px-[60px] py-4 relative z-10 flex flex-row justify-between items-center gap-[10px] sm:gap-[15px]">
        <div className="flex-1 w-1/2 sm:w-[349px] sm:flex-none">
          <MenuDropdown
            variant="admin" // Используем стиль админки для единообразия
            options={pageOptions}
            selected={currentPage}
            onChange={handlePageSelect}
            showCheckmarks={false}
            customTrigger={
              <button className="flex flex-row justify-between items-center px-[15px] gap-[5px] sm:gap-[10px] w-full h-[44px] bg-dark-creamy rounded-[30px] transition-colors hover:opacity-90 min-w-0">
                <div className="flex flex-row items-center gap-[5px] sm:gap-[10px] min-w-0 h-[24px] overflow-hidden">
                  {React.createElement(pageMapping[currentPage].icon, {
                    className: "w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] flex-shrink-0 text-[#705A5A]",
                    strokeWidth: 2,
                  })}
                  <span className="font-montserrat font-semibold text-[14px] sm:text-[18px] leading-[18px] sm:leading-[22px] text-choco-light truncate text-left">
                    {pageMapping[currentPage].name}
                  </span>
                </div>
                <DropdownArrowIcon className="w-[16px] h-[16px] sm:w-[19px] sm:h-[16px] flex-shrink-0" stroke="#705A5A" strokeWidth={2} />
              </button>
            }
          />
        </div>
        <button 
          onClick={() => handlePageSelect('bonus')}
          className="flex flex-row justify-center items-center py-[10px] px-[10px] sm:px-[30px] gap-[5px] sm:gap-[10px] flex-1 w-1/2 sm:w-[220px] sm:flex-none h-[44px] bg-[#E3D6BF] rounded-[30px] hover:bg-[#d6c5a8] transition-colors cursor-pointer shrink-0 min-w-0"
        >
          <div className="flex flex-row items-center justify-center gap-[5px] sm:gap-[10px] w-full overflow-hidden">
            <BonusIcon className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] shrink-0" fill="#705A5A" />
            <span className="font-montserrat font-semibold text-[14px] sm:text-[18px] leading-[18px] sm:leading-[22px] text-[#705A5A]">
              {user?.bonusPoints || 0}
              <span className="sm:inline"> балів</span>
            </span>
          </div>
        </button>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-[1440px] mx-auto px-[15px] sm:px-[30px] lg:px-[60px] relative z-0">{renderContent()}</div>
    </div>
  )
}

export default UserPanel