import React, { useState } from "react"
import { useUserStore } from '../stores/useUserStore'
import { Navigate, useSearchParams } from 'react-router-dom'
import { ExitIcon, DropdownArrowIcon, DashboardIcon, ReviewsIcon, OrdersIcon, CartIcon, DotsIcon, ProfileIcon, BookIcon } from '../components/icons'
import { ProductList, CategoryList, CategoryEditor, ProductEditor, UserList } from './admin'
import { MenuDropdown } from '../components/ui/dropdowns'

const AdminPanel = () => {
  const { user, logout } = useUserStore()
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage = searchParams.get('page') || 'dashboard'
  
  const [adminState, setAdminState] = useState({
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
    reviews: { name: 'Відгуки', icon: ReviewsIcon },
    journal: { name: 'Журнал', icon: BookIcon }
  }

  // Опции для MenuDropdown
  const pageOptions = Object.entries(pageMapping).map(([key, page]) => ({
    value: key,
    label: page.name,
    icon: page.icon
  }))

  // Проверка прав админа
  if (!user || user.role !== 'admin') {
    return <Navigate to='/login' replace />
  }

  const handleEdit = (pageType, id) => {
    setSearchParams({ page: pageType })
    setAdminState({
      editingId: id,
      mode: id === null ? 'create' : 'edit' // Если id === null, то создание новой записи
    })
  }

  const handleCancelEdit = () => {
    setAdminState(prev => ({
      ...prev,
      editingId: null,
      mode: 'list'
      // currentPage сохраняется без изменений
    }))
  }

  const handleSuccessEdit = () => {
    // После успешного создания/редактирования остаемся на той же странице в режиме списка
    setAdminState(prev => ({
      ...prev,
      editingId: null,
      mode: 'list'
      // currentPage сохраняется без изменений
    }))
  }
  
  const handlePageSelect = (pageKey) => {
    setSearchParams({ page: pageKey })
    setAdminState({
      editingId: null,  // Сбрасываем редактирование при смене страницы
      mode: 'list'
    })
  }

  const renderContent = () => {
    const { editingId, mode } = adminState
    
    // Только для страниц с реальной функциональностью
    if (currentPage === 'categories') {
      if (mode === 'edit' && editingId) {
        return <CategoryEditor categoryId={editingId} onCancel={handleCancelEdit} onSuccess={handleSuccessEdit} />
      } else if (mode === 'create') {
        return <CategoryEditor categoryId={null} onCancel={handleCancelEdit} onSuccess={handleSuccessEdit} />
      } else {
        return <CategoryList onEditCategory={(id) => handleEdit('categories', id)} />
      }
    }
    
    if (currentPage === 'products') {
      if (mode === 'edit' && editingId) {
        return <ProductEditor productId={editingId} onCancel={handleCancelEdit} onSuccess={handleSuccessEdit} />
      } else if (mode === 'create') {
        return <ProductEditor productId={null} onCancel={handleCancelEdit} onSuccess={handleSuccessEdit} />
      } else {
        return <ProductList onEditProduct={(id) => handleEdit('products', id)} />
      }
    }
    
    if (currentPage === 'users') {
      // Пока что редактора нет, просто выводим список (таблицу)
      return <UserList onEditUser={(id) => handleEdit('users', id)} />
    }
    
    // Заглушка для остальных страниц
    return (
      <div className="text-center py-12">
        <h3 className="text-xl text-choco-dark mb-2">{pageMapping[currentPage]?.name || 'Dashboard'}</h3>
        <p className="text-choco-light">Скоро тут буде контент</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-creamy">
      {/* Header */}
      <div className="w-full max-w-[1440px] h-[53px] flex items-center justify-between px-[15px] sm:px-[30px] lg:px-[60px] py-[12px] bg-creamy mx-auto">
        <div className="flex items-center">
          <h1 className="font-montserrat font-light text-lg sm:text-2xl leading-[20px] md:leading-[29px] text-choco-dark">Сторінка адміна</h1>
        </div>
        <div className="flex items-center gap-5 h-[42px]">
          <div className="flex flex-col gap-[5px] h-[42px]">
            <span className="font-montserrat font-medium text-base leading-5 text-choco-light">{user?.name}</span>
            <span className="font-montserrat font-medium text-sm leading-[17px] text-choco-light opacity-50">{user?.email}</span>
          </div>
          <button onClick={() => logout()} className="cursor-pointer hover:opacity-75 transition-opacity">
            <ExitIcon className="w-5 h-5 transform scale-x-[-1] text-choco-light" stroke="currentColor" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Navigation Dropdown */}
      <div className="w-full max-w-[1440px] mx-auto px-[15px] sm:px-[30px] lg:px-[60px] py-4">
        <MenuDropdown
          variant="admin"
          options={pageOptions}
          selected={currentPage}
          onChange={handlePageSelect}
          showCheckmarks={false}
          customTrigger={
            <button className="flex flex-row justify-between items-center px-[15px] gap-[10px] w-full sm:w-[349px] h-[44px] bg-dark-creamy rounded-[30px] transition-colors hover:opacity-90">
              <div className="flex flex-row items-center gap-[10px] min-w-[200px] h-[24px]">
                {React.createElement(pageMapping[currentPage].icon, {
                  className: "w-[24px] h-[24px] flex-shrink-0 text-choco-light strokeWidth={2}",
                })}
                <span className="font-montserrat font-semibold text-[18px] leading-[22px] text-choco-light whitespace-nowrap">
                  {pageMapping[currentPage].name}
                </span>
              </div>
              <DropdownArrowIcon className="w-[19px] h-[16px]" stroke="#705A5A" strokeWidth={2} />
            </button>
          }
        />
      </div>

      {/* Main Content */}
      <div className="w-full max-w-[1440px] mx-auto px-[15px] sm:px-[30px] lg:px-[60px] pb-6">{renderContent()}</div>
    </div>
  )
}

export default AdminPanel