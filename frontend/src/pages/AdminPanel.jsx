import React, { useState } from "react"
import { useUserStore } from '../stores/useUserStore'
import { Navigate } from 'react-router-dom'
import { ExitIcon, DropdownArrowIcon, DashboardIcon, ReviewsIcon, OrdersIcon, CartIcon, DotsIcon, ProfileIcon } from '../components/icons'
import { ProductCreate, ProductList, ProductEdit, CategoryList, CategoryCreate, CategoryEdit } from './admin'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

const AdminPanel = () => {
  const { user } = useUserStore()
    const [adminState, setAdminState] = useState({
    currentPage: 'products', // products | categories | dashboard | orders | users | reviews
    editingId: null,         // ID редактируемого элемента (универсально для всех типов)
    mode: 'list'            // list | edit | create
  })
  
  // Маппинг страниц для dropdown меню
  const pageMapping = {
    dashboard: { name: 'Dashboard', icon: DashboardIcon },
    categories: { name: 'Категорії', icon: DotsIcon },
    products: { name: 'Товари', icon: CartIcon },
    orders: { name: 'Замовлення', icon: OrdersIcon },
    users: { name: 'Користувачи', icon: ProfileIcon },
    reviews: { name: 'Відгуки', icon: ReviewsIcon }
  }

  // Проверка прав админа
  if (!user || user.role !== 'admin') {
    return <Navigate to='/login' replace />
  }

  const handleEdit = (pageType, id) => {
    setAdminState({
      currentPage: pageType, // 'products' или 'categories'
      editingId: id,
      mode: 'edit'
    })
  }

  const handleCancelEdit = () => {
    setAdminState(prev => ({
      ...prev,
      editingId: null,
      mode: 'list'
    }))
  }
  
  const handlePageSelect = (pageKey) => {
    setAdminState({
      currentPage: pageKey,
      editingId: null,  // Сбрасываем редактирование при смене страницы
      mode: 'list'
    })
  }

  const renderContent = () => {
    const { currentPage, editingId, mode } = adminState
    
    switch (currentPage) {
      case 'categories':
        return mode === 'edit' && editingId ? (
          <CategoryEdit 
            categoryId={editingId} 
            onCancel={handleCancelEdit}
            onSuccess={handleCancelEdit}
          />
        ) : <CategoryList onEditCategory={(id) => handleEdit('categories', id)} />
        
      case 'products':
        return mode === 'edit' && editingId ? (
          <ProductEdit 
            productId={editingId} 
            onCancel={handleCancelEdit}
            onSuccess={handleCancelEdit}
          />
        ) : <ProductList onEditProduct={(id) => handleEdit('products', id)} />
        
      case 'dashboard':
      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-xl text-choco-dark mb-2">Dashboard</h3>
            <p className="text-choco-light">Скоро тут буде статистика</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-creamy">
      {/* Header */}
      <div className="w-full max-w-[1440px] h-[53px] flex items-center justify-between px-[15px] sm:px-[30px] lg:px-[60px] py-[12px] bg-creamy mx-auto">
        <div className="flex items-center">
          <h1 className="font-montserrat font-light text-2xl leading-[29px] text-choco-dark">Сторінка адміна</h1>
        </div>
        <div className="flex items-center gap-5 h-[42px]">
          <div className="flex flex-col gap-[5px] h-[42px]">
            <span className="font-montserrat font-medium text-base leading-5 text-choco-light">{user?.name}</span>
            <span className="font-montserrat font-medium text-sm leading-[17px] text-choco-light opacity-50">{user?.email}</span>
          </div>
          <ExitIcon className="w-5 h-5 transform scale-x-[-1] text-choco-light" stroke="currentColor" strokeWidth={2} />
        </div>
      </div>

      {/* Navigation Dropdown */}
      <div className="w-full max-w-[1440px] mx-auto px-[15px] sm:px-[30px] lg:px-[60px] py-4">
        <DropdownMenu.Root modal={false}>
          <DropdownMenu.Trigger asChild>
            <button className="flex flex-row justify-between items-center px-[15px] gap-[10px] w-[349px] h-[44px] bg-dark-creamy rounded-[30px] transition-colors hover:opacity-90">
              <div className="flex flex-row items-center gap-[10px] w-[143px] h-[24px]">
                {React.createElement(pageMapping[adminState.currentPage].icon, { 
                  className: "w-[24px] h-[24px]", 
                  fill: "#705A5A",
                  ...(pageMapping[adminState.currentPage].icon === CartIcon || pageMapping[adminState.currentPage].icon === ProfileIcon ? { strokeWidth: 2 } : {})
                })}
                <span className="font-montserrat font-semibold text-[18px] leading-[22px] text-choco-light">{pageMapping[adminState.currentPage].name}</span>
              </div>
              <DropdownArrowIcon className="w-[19px] h-[16px]" stroke="#705A5A" strokeWidth={2} />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="bg-creamy rounded-md py-2 px-2 w-[349px] z-50"
              sideOffset={5}
              align="start"
            >
              {Object.entries(pageMapping).map(([key, page]) => {
                const Icon = page.icon;
                const isActive = adminState.currentPage === key;
                return (
                  <DropdownMenu.Item 
                    key={key}
                    className={`flex flex-row items-center pl-[15px] gap-[10px] w-[223px] h-[35px] rounded-[31px] transition duration-300 cursor-pointer outline-none ${
                      isActive ? 'bg-dark-creamy' : 'hover:bg-dark-creamy/50'
                    }`}
                    onSelect={() => handlePageSelect(key)}
                  >
                    <Icon className="w-[24px] h-[24px]" fill="#705A5A" {...(Icon === CartIcon || Icon === ProfileIcon ? { strokeWidth: 2 } : {})} />
                    <span className="font-montserrat font-medium text-[14px] leading-[17px] text-choco-light">{page.name}</span>
                  </DropdownMenu.Item>
                )
              })}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-[1440px] mx-auto px-[15px] sm:px-[30px] lg:px-[60px] pb-6">
        <div className="bg-white rounded-lg shadow-lg p-6">{renderContent()}</div>
      </div>
    </div>
  )
}

export default AdminPanel