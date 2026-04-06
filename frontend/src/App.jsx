import {Route, Routes} from 'react-router-dom'
import { Navigate } from "react-router-dom"
import { useUserStore } from "./stores/useUserStore"
import { Toaster } from "react-hot-toast"

import HomePage from './pages/HomePage'
import CartPage from './pages/CartPage'
import CatalogPage from './pages/CatalogPage'
import ProductPage from './pages/ProductPage'
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

  if (checkingAuth) return <LoadingSpinner />
  
  return (
    <div className="min-h-screen bg-orange-50 text-black flex flex-col">
      <div className="relative z-50">
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
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
      <Footer />

      <Toaster />
    </div>
  )
}

export default App
