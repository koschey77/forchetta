import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useUserStore } from "../stores/useUserStore"
import { getEmailError, getPasswordError, isFormValid } from "../lib/validation"
import { toast } from "react-hot-toast"

import { EyeIcon, EyeSlashIcon } from "../components/icons"

const LoginPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({email: "", password: ""})
  const [touched, setTouched] = useState({email: false, password: false})

  const { login, loading } = useUserStore()

  /**
   * Обработка результатов Google OAuth аутентификации
   * 
   * После OAuth Google перенаправляет пользователя обратно на frontend
   * с URL параметрами, указывающими на результат аутентификации:
   * - ?auth=success - успешная аутентификация
   * - ?auth=error&message=... - ошибка аутентификации  
   * - ?auth=cancelled - пользователь отменил OAuth
   */
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const authStatus = urlParams.get('auth')
    const message = urlParams.get('message')

    if (authStatus) {
      // Очищаем URL от параметров OAuth
      navigate('/login', { replace: true })
      
      if (authStatus === 'success') {
        toast.success('Успішний вхід через Google!')
        // Проверяем состояние пользователя - возможно он уже авторизован
        // Если да, перенаправляем на главную страницу  
        setTimeout(() => {
          window.location.href = '/' // Обновляем всю страницу для корректной загрузки состояния
        }, 1000)
        
      } else if (authStatus === 'error') {
        const errorMessage = message ? decodeURIComponent(message) : 'Помилка входу через Google'
        toast.error(errorMessage)
        
      } else if (authStatus === 'cancelled') {
        const cancelMessage = message ? decodeURIComponent(message) : 'Вхід через Google скасовано'
        toast.error(cancelMessage)
      }
    }
  }, [location.search, navigate])

  const validateField = (field, value) => {
    if (field === 'email') {
      return getEmailError(value)
    }
    if (field === 'password') {
      return getPasswordError(value)
    }
    return ''
  }

  const handleInputChange = (field, value) => {
    if (field === 'email') setEmail(value)
    if (field === 'password') setPassword(value)
    
    if (touched[field]) {
      setErrors({ ...errors, [field]: validateField(field, value) })
    }
  }

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true })
    const value = field === 'email' ? email : password
    setErrors({ ...errors, [field]: validateField(field, value) })
  }

  const isSubmitEnabled = isFormValid(email, password)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Проверяем валидность формы перед отправкой
    if (!isSubmitEnabled) return
    login(email, password)
  }

  const togglePasswordVisibility = () => {setShowPassword(!showPassword)}

  return (
    <>
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px #F5EEE0 inset !important;
          -webkit-text-fill-color: #8B7355 !important;
          background-color: #F5EEE0 !important;
        }
      `}</style>
      <div className="min-h-screen flex items-center justify-center p-0 sm:p-4 bg-[#F5EEE0]">
        <div className="bg-[#F5EEE0] w-full sm:w-[840px] h-screen sm:h-[550px] sm:rounded-[16px] shadow-none sm:shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex overflow-hidden relative">
          {/* Left Panel - Image - Hidden on mobile */}
          <div className="hidden md:block w-[60%] h-full relative">
            <img src="./sweet_61 1.png" alt="Pink marshmallows on sticks" className="w-full h-full object-fill" />
          </div>

          {/* Right Panel - Form */}
          <div className="w-full md:w-[56%] h-full relative pt-12 sm:pt-10 px-6 sm:px-12 flex flex-col items-center bg-[#F5EEE0] overflow-y-auto">
            {/* Title */}
            <h1 className="text-[#8B7355] text-[18px] font-normal mb-8">Вхід</h1>

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <div className="w-full flex flex-col fade-in mt-1">
                {/* Email Input */}
                <div className="mb-4">
                  <div className="relative">
                    <input
                      id="email"
                      required
                      type="email"
                      value={email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      onBlur={() => handleBlur("email")}
                      className={`w-[300px] h-[54px] border rounded-[6px] px-4 text-[12px] text-[#8B7355] focus:outline-none transition-colors bg-[#F5EEE0] ${
                        errors.email ? "border-red-500 focus:border-red-500" : "border-[#8B7355] focus:border-[#8B7355]"
                      }`}
                    />
                    {!email && (
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B7355]/60 pointer-events-none text-[12px] font-light">
                        Електронна пошта
                        <span className="text-red-500 ml-0.5">*</span>
                      </div>
                    )}
                  </div>
                  {/* Резервируемое место для ошибки */}
                  <div className="text-red-500 text-[13px] mt-1 ml-1 h-[20px] flex items-start">
                    {errors.email || ""}
                  </div>
                </div>

                {/* Password Input */}
                <div className="mb-5">
                  <div className="relative">
                    <input
                      id="password"
                      required
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      onBlur={() => handleBlur("password")}
                      className={`w-[300px] h-[54px] border rounded-[6px] px-4 pr-12 text-[12px] text-[#8B7355] focus:outline-none transition-colors bg-[#F5EEE0] ${
                        errors.password ? "border-red-500 focus:border-red-500" : "border-[#8B7355] focus:border-[#8B7355]"
                      }`}
                    />
                    {!password && (
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B7355]/60 pointer-events-none text-[12px] font-light">
                        Пароль
                        <span className="text-red-500 ml-0.5">*</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B7355]/70 hover:text-[#8B7355] transition-colors"
                    >
                      {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {/* Резервируемое место для ошибки */}
                  <div className="text-red-500 text-[13px] mt-1 ml-1 h-[20px] flex items-start">
                    {errors.password || ""}
                  </div>
                </div>

                {/* Links */}
                <div className="flex justify-between items-center w-[300px] mb-5">
                  <Link to="/signup" className="text-[#705A5A] text-[12px] font-light underline hover:text-[#705A5A]/80 transition-colors">
                    Немає акаунта?
                  </Link>
                  <Link to="/forgot-password" className="text-[#705A5A] text-[12px] font-light underline hover:text-[#705A5A]/80 transition-colors">
                    Забули пароль?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading || !isSubmitEnabled}
                  className={`w-[300px] h-[62px] rounded-full font-light text-[18px] mt-2 transition-all duration-200 ${
                    isSubmitEnabled && !loading
                      ? "bg-[#705A5A] hover:bg-[#705A5A]/90 text-[#F5EEE0] cursor-pointer"
                      : "bg-[#705A5A]/50 text-[#F5EEE0]/70 cursor-not-allowed"
                  }`}
                >
                  {loading ? "Вхід..." : "Продовжити"}
                </button>

                {/* Google OAuth Icon */}
                <div className="flex justify-center mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      // Динамический URL: localhost для разработки, текущий домен для продакшена
                      const baseUrl = window.location.hostname === 'localhost' 
                        ? 'http://localhost:5000' 
                        : window.location.origin;
                      window.location.href = `${baseUrl}/api/auth/google`;
                    }}
                    disabled={loading}
                    className={`w-[48px] h-[48px] rounded-full border border-[#8B7355] transition-all duration-200 flex items-center justify-center ${
                      !loading
                        ? "bg-[#F5EEE0] hover:bg-[#F5EEE0]/80 cursor-pointer hover:shadow-md"
                        : "bg-[#F5EEE0]/50 cursor-not-allowed"
                    }`}
                  >
                    {/* Google Icon SVG */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginPage