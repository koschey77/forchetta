import { useState } from "react"
import { Link } from "react-router-dom"
import { useUserStore } from "../stores/useUserStore";
import { getEmailError, getPasswordError, isFormValid } from "../lib/validation"

import { EyeIcon, EyeSlashIcon, CloseIcon } from "../components/icons"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({email: "", password: ""})
  const [touched, setTouched] = useState({email: false, password: false})

  const { login, loading } = useUserStore()

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
            {/* Close Button */}
            <button className="absolute top-4 right-4 sm:top-6 sm:right-6 text-[#8B7355] hover:text-[#8B7355]/70 transition-colors">
              <CloseIcon />
            </button>

            {/* Title */}
            <h1 className="text-[#8B7355] text-[18px] font-normal mb-8">Вхід</h1>

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <div className="w-full flex flex-col fade-in mt-1">
                {/* Email Input */}
                <div className="relative mb-4">
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
                  {errors.email && <div className="text-red-500 text-[13px] mt-1 ml-1">{errors.email}</div>}
                </div>

                {/* Password Input */}
                <div className="relative mb-5">
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
                  {errors.password && <div className="text-red-500 text-[13px] mt-1 ml-1">{errors.password}</div>}
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
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginPage