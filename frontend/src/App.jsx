import {Route, Routes} from 'react-router-dom'
import { Navigate } from "react-router-dom"
import { useUserStore } from "./stores/useUserStore"
import { Toaster } from "react-hot-toast"

import HomePage from './pages/HomePage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import CatalogPage from './pages/CatalogPage'
import ProductPage from './pages/ProductPage'
import AdminPanel from './pages/AdminPanel'
import UserPanel from './pages/UserPanel'
import {
  SignUpPage,
  LoginPage,
  EmailVerificationPage,
  ForgotPasswordPage,
  ResetPasswordPage,
} from './pages/auth'

import LoadingSpinner from './components/LoadingSpinner'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Error404 from './components/errors/Error404'
import AuthRequiredModal from './components/common/AuthRequiredModal'

function App() {
  const { user, checkingAuth } = useUserStore()

  if (checkingAuth) return <LoadingSpinner />
  
  return (
    <div className="min-h-screen bg-orange-50 text-black flex flex-col">
      <ScrollToTop />
      <div className="sticky top-0 z-50">
        <Header />
      </div>
      
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/verify-email" element={!user ? <EmailVerificationPage /> : <Navigate to="/" />} />
          <Route path="/forgot-password" element={!user ? <ForgotPasswordPage /> : <Navigate to="/" />} />
          <Route path="/reset-password" element={!user ? <ResetPasswordPage /> : <Navigate to="/" />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/profile" element={user ? <Navigate to="/user-panel" replace /> : <Navigate to="/login" />} />
          <Route path="/user-panel" element={user ? <UserPanel /> : <Navigate to="/login" />} />
          <Route path="/admin" element={<AdminPanel />} />
          
          {/* Catch-all маршрут 404 */}
          <Route path="*" element={<Error404 />} />
        </Routes>
      </div>
      <Footer />

      <Toaster />
      <AuthRequiredModal />
    </div>
  )
}

export default App
