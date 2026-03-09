import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useUserStore } from "../stores/useUserStore"
import { getEmailError, getPasswordError, isFormValid } from "../lib/validation"

import { EyeIcon, EyeSlashIcon } from "../components/icons"

const SignUpPage = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({name: "",email: "",password: "",})
  const [errors, setErrors] = useState({email: "", password: ""})
  const [touched, setTouched] = useState({email: false, password: false})
  const { signup, loading } = useUserStore()

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
    // Обновляем данные формы с новым значением
    setFormData({ ...formData, [field]: value })
    
    // Показываем ошибку валидации только если пользователь уже взаимодействовал с полем
    // Это предотвращает показ ошибок до того, как пользователь начал вводить данные
    if (touched[field]) {
      setErrors({ ...errors, [field]: validateField(field, value) })
    }
  }

  // Обработчик события потери фокуса (blur) для input полей
  // Помечает поле как "затронутое" и запускает валидацию
  const handleBlur = (field) => {
    // Помечаем поле как затронутое пользователем
    setTouched({ ...touched, [field]: true })
    // Запускаем валидацию и показываем ошибку если она есть
    setErrors({ ...errors, [field]: validateField(field, formData[field]) })
  }

  // Проверяет что все обязательные поля заполнены и валидны (name, email, password)
  const isSubmitEnabled = isFormValid(formData.email, formData.password, formData.name)

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Проверяем валидность всех полей перед отправкой данных на сервер
    if (!isSubmitEnabled) return
    
    try {
      // Отправляем данные регистрации на backend через useUserStore
      // formData содержит: { name, email, password }
      const result = await signup(formData)
      
      // Проверяем ответ от сервера - нужна ли верификация email
      if (result?.needsVerification) {
        // Перенаправляем на страницу верификации, передавая email
        const params = new URLSearchParams({
          email: formData.email
        })
        navigate(`/verify-email?${params.toString()}`)
      }
    } catch {
      // Все ошибки (network, validation, server errors) уже обработаны в useUserStore
      // Toast уведомления показываются автоматически, здесь только перехватываем исключение
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

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
          <h1 className="text-[#8B7355] text-[18px] font-normal mb-8">Реєстрація</h1>

          {/* Register Form */}
          <form onSubmit={handleSubmit}>
            <div className="w-full flex flex-col fade-in mt-1">
              {/* Name Input */}
              <div className="relative mb-4">
                <input
                  id="name"
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-[315px] h-[54px] border border-[#8B7355] rounded-[6px] px-4 text-[12px] text-[#8B7355] focus:outline-none focus:border-[#8B7355] transition-colors bg-[#F5EEE0]"
                />
                {!formData.name && (
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B7355]/60 pointer-events-none text-[12px] font-light">
                    Ім&apos;я
                    <span className="text-red-500 ml-0.5">*</span>
                  </div>
                )}
              </div>

              {/* Email Input */}
              <div className="relative mb-4">
                <input
                  id="email"
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className={`w-[315px] h-[54px] border rounded-[6px] px-4 text-[12px] text-[#8B7355] focus:outline-none transition-colors bg-[#F5EEE0] 
                    ${errors.email ? "border-red-500 focus:border-red-500" : "border-[#8B7355] focus:border-[#8B7355]"}`}
                />
                {!formData.email && (
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B7355]/60 pointer-events-none text-[12px] font-light">
                    Електронна пошта
                    <span className="text-red-500 ml-0.5">*</span>
                  </div>
                )}
                {errors.email && <div className="text-red-500 text-[13px] mt-1 ml-1">{errors.email}</div>}
              </div>

              {/* Password Input */}
              <div className="relative mb-5">
                <input
                  id="password"
                  required
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  onBlur={() => handleBlur("password")}
                  className={`w-[315px] h-[54px] border rounded-[6px] px-4 pr-12 text-[12px] text-[#8B7355] focus:outline-none transition-colors bg-[#F5EEE0] ${
                    errors.password ? "border-red-500 focus:border-red-500" : "border-[#8B7355] focus:border-[#8B7355]"
                  }`}
                />
                {!formData.password && (
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B7355]/60 pointer-events-none text-[12px] font-light">
                    Придумайте пароль
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
                {errors.password && <div className="text-red-500 text-[13px] mt-1 ml-1">{errors.password}</div>}
              </div>

              <p className="mt-1 text-center text-[14px] font-light">
                <Link to="/login" className="text-[#8B7355] underline hover:text-[#8B7355]/80 transition-colors">
                  Вже є акаунт?
                </Link>
              </p>

              <button
                type="submit"
                disabled={loading || !isSubmitEnabled}
                className={`w-[315px] h-[62px] rounded-full font-light text-[18px] mt-2 transition-all duration-200 ${
                  isSubmitEnabled && !loading
                    ? "bg-[#705A5A] hover:bg-[#705A5A]/90 text-[#F5EEE0] cursor-pointer"
                    : "bg-[#705A5A]/50 text-[#F5EEE0]/70 cursor-not-allowed"
                }`}
              >
                {loading ? "Реєстрація..." : "Продовжити"}
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
    </>
  )
}

export default SignUpPage
