import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useUserStore } from "../stores/useUserStore";
import { getEmailError } from "../lib/validation"

const ForgotPasswordPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState({email: ""})
  const [touched, setTouched] = useState({email: false})
  const { forgotPassword, loading } = useUserStore()

  const validateField = (field, value) => {
    if (field === 'email') {
      return getEmailError(value)
    }
    return ''
  }

  const handleInputChange = (field, value) => {
    if (field === 'email') setEmail(value)
    
    if (touched[field]) {
      setErrors({ ...errors, [field]: validateField(field, value) })
    }
  }

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true })
    const value = field === 'email' ? email : ''
    setErrors({ ...errors, [field]: validateField(field, value) })
  }

  const isSubmitEnabled = email.trim() && !errors.email

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Проверяем валидность формы перед отправкой
    if (!isSubmitEnabled) return
    
    try {
      await forgotPassword(email)
      // Сразу перенаправляем на страницу ввода кода  
      navigate(`/reset-password?email=${encodeURIComponent(email)}`)
    } catch {
      // Ошибка обработана в store
    }
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
            <h1 className="text-[#8B7355] text-[18px] font-normal mb-4">Відновлення пароля</h1>
            <p className="text-[#8B7355]/80 text-[12px] font-light text-center mb-8 w-[300px] leading-relaxed">
              Введіть свою електронну пошту і ми відправимо код для відновлення пароля
            </p>

            {/* Forgot Password Form */}
            <form onSubmit={handleSubmit}>
              <div className="w-full flex flex-col fade-in mt-1">
                {/* Email Input */}
                <div className="relative mb-8">
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

                <button
                  type="submit"
                  disabled={loading || !isSubmitEnabled}
                  className={`w-[300px] h-[62px] rounded-full font-light text-[18px] mb-6 transition-all duration-200 ${
                    isSubmitEnabled && !loading
                      ? "bg-[#705A5A] hover:bg-[#705A5A]/90 text-[#F5EEE0] cursor-pointer"
                      : "bg-[#705A5A]/50 text-[#F5EEE0]/70 cursor-not-allowed"
                  }`}
                >
                  {loading ? "Відправка..." : "Відправити код"}
                </button>

                {/* Back to Login Link */}
                <div className="text-center">
                  <Link to="/login" className="text-[#705A5A] text-[12px] font-light underline hover:text-[#705A5A]/80 transition-colors">
                    Назад до входу
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default ForgotPasswordPage