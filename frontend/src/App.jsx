import {Route, Routes} from 'react-router-dom'
import { useEffect } from "react"
import { Navigate } from "react-router-dom"
import { useUserStore } from "./stores/useUserStore"
import { Toaster } from "react-hot-toast"

import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import EmailVerificationPage from './pages/EmailVerificationPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import CartPage from './pages/CartPage'

import Navbar from './components/Navbar'
import LoadingSpinner from './components/LoadingSpinner'


function App() {
  const { user, checkAuth, checkingAuth } = useUserStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (checkingAuth) return <LoadingSpinner />
  
  return (
    <div className="min-h-screen bg-orange-50 text-black relative overflow-hidden">
      <div className="relative z-50 pt-20">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/verify-email" element={!user ? <EmailVerificationPage /> : <Navigate to="/" />} />
          <Route path="/forgot-password" element={!user ? <ForgotPasswordPage /> : <Navigate to="/" />} />
          <Route path="/reset-password" element={!user ? <ResetPasswordPage /> : <Navigate to="/" />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  )
}

export default App
