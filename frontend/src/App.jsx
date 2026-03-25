import {Route, Routes} from 'react-router-dom'
import { Navigate, useLocation } from "react-router-dom"
import { useUserStore } from "./stores/useUserStore"
import { Toaster } from "react-hot-toast"

import HomePage from './pages/HomePage'
import CartPage from './pages/CartPage'
import CatalogPage from './pages/CatalogPage'
import AdminPanel from './pages/AdminPanel'
import {
  SignUpPage,
  LoginPage,
  EmailVerificationPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  ProfilePage
} from './pages/auth'

import LoadingSpinner from './components/LoadingSpinner'
import Header from './components/Header'
import Footer from './components/Footer'


function App() {
  const { user, checkingAuth } = useUserStore()
  const location = useLocation()
  const isAdminPage = location.pathname.startsWith('/admin')

  if (checkingAuth) return <LoadingSpinner />
  
  return (
    <div className="min-h-screen bg-orange-50 text-black flex flex-col">
      {/* Fixed Header for all pages except admin */}
      {!isAdminPage && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <Header />
        </div>
      )}
      
      {/* Main content with conditional padding */}
      <div className={`flex-grow ${!isAdminPage ? 'pt-[87px]' : ''}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/verify-email" element={!user ? <EmailVerificationPage /> : <Navigate to="/" />} />
          <Route path="/forgot-password" element={!user ? <ForgotPasswordPage /> : <Navigate to="/" />} />
          <Route path="/reset-password" element={!user ? <ResetPasswordPage /> : <Navigate to="/" />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
      
      {/* Footer only for non-admin pages */}
      {!isAdminPage && <Footer />}
      
      <Toaster />
    </div>
  )
}

export default App
