import { useState } from 'react'
import { useUserStore } from '../stores/useUserStore'
import { Navigate } from 'react-router-dom'
import { ProductCreate, ProductList, ProductEdit, CategoryList, CategoryCreate, CategoryEdit } from './admin'

const AdminPanel = () => {
  const { user, checkingAuth } = useUserStore()
  const [activeTab, setActiveTab] = useState('products')
  const [editingProductId, setEditingProductId] = useState(null)
  const [editingCategoryId, setEditingCategoryId] = useState(null)

  // Показываем загрузку во время refresh токена
  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Перевірка доступу...</div>
      </div>
    )
  }

  // Проверка прав админа - только после завершения проверки аутентификации
  if (!user || user.role !== 'admin') {
    return <Navigate to='/login' replace />
  }

  const tabs = [
    { id: 'products', name: 'Товари' },
    { id: 'create', name: 'Додати товар' },
    { id: 'edit', name: 'Редагувати товар', hidden: !editingProductId },
    { id: 'categories', name: 'Категорії' },
    { id: 'create-category', name: 'Додати категорію' },
    { id: 'edit-category', name: 'Редагувати категорію', hidden: !editingCategoryId }
  ]

  const handleEditProduct = (productId) => {
    setEditingProductId(productId)
    setActiveTab('edit')
  }

  const handleCancelEdit = () => {
    setEditingProductId(null)
    setActiveTab('products')
  }

  const handleEditCategory = (categoryId) => {
    setEditingCategoryId(categoryId)
    setActiveTab('edit-category')
  }

  const handleCancelCategoryEdit = () => {
    setEditingCategoryId(null)
    setActiveTab('categories')
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return <ProductList onEditProduct={handleEditProduct} />
      case 'create':
        return <ProductCreate onSuccess={() => setActiveTab('products')} />
      case 'edit':
        return editingProductId ? (
          <ProductEdit 
            productId={editingProductId} 
            onCancel={handleCancelEdit}
            onSuccess={handleCancelEdit}
          />
        ) : <ProductList onEditProduct={handleEditProduct} />
      case 'categories':
        return <CategoryList onEditCategory={handleEditCategory} />
      case 'create-category':
        return <CategoryCreate onSuccess={() => setActiveTab('categories')} />
      case 'edit-category':
        return editingCategoryId ? (
          <CategoryEdit 
            categoryId={editingCategoryId} 
            onCancel={handleCancelCategoryEdit}
            onSuccess={handleCancelCategoryEdit}
          />
        ) : <CategoryList onEditCategory={handleEditCategory} />
      default:
        return <ProductList onEditProduct={handleEditProduct} />
    }
  }

  return (
    <div className="min-h-screen bg-creamy">
      {/* Header */}
      <div className="bg-choco-dark text-creamy px-6 py-4">
        <h1 className="text-2xl font-cormorant font-bold">Панель Адміністратора</h1>
        <p className="text-sm opacity-75">Ласкаво просимо, {user?.name}!</p>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <nav className="p-4">
            {tabs.filter(tab => !tab.hidden).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-center px-4 py-3 rounded-lg mb-2 transition-colors ${
                  activeTab === tab.id
                    ? 'bg-dark-creamy text-choco-dark'
                    : 'text-choco-light hover:bg-creamy'
                }`}
              >
                <span className="font-montserrat">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel