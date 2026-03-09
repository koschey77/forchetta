import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useUserStore } from "../stores/useUserStore"
import { getPasswordError } from "../lib/validation"
import { EyeIcon, EyeSlashIcon } from "../components/icons"
import LoadingSpinner from "../components/LoadingSpinner"

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [resetCode, setResetCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [errors, setErrors] = useState({ newPassword: "" })
  const [touched, setTouched] = useState({ newPassword: false })

  const { resetPassword, forgotPassword, loading } = useUserStore()

  // Получаем email из URL параметров
  const email = searchParams.get('email')

  // Таймер обратного отсчета
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  // Перенаправление если нет email
  useEffect(() => {
    if (!email) {
      navigate('/forgot-password')
    }
  }, [email, navigate])

  // Форматирование времени
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Валидация полей
  const validateField = (field, value) => {
    if (field === 'newPassword') {
      return getPasswordError(value)
    }
    return ''
  }

  const handleInputChange = (field, value) => {
    if (field === 'newPassword') setNewPassword(value)
    
    if (touched[field]) {
      setErrors({ ...errors, [field]: validateField(field, value) })
    }
  }

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true })
    const value = field === 'newPassword' ? newPassword : ''
    setErrors({ ...errors, [field]: validateField(field, value) })
  }

  // Проверка готовности формы
  const isSubmitEnabled = resetCode.length === 6 && newPassword && !errors.newPassword

  // Обработка отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isSubmitEnabled) return

    try {
      await resetPassword({ email, resetCode, newPassword })
      navigate('/login')
    } catch {
      // Ошибка обработана в store
    }
  }

  // Повторная отправка кода
  const handleResendCode = async () => {
    try {
      await forgotPassword(email)
      setTimeLeft(60) // 1 минута до следующей попытки (защита от спама)
      setResetCode('') // Очищаем поле ввода
    } catch {
      // Ошибка обработана в store
    }
  }

  if (!email) {
    return <LoadingSpinner />
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
        <div className="bg-[#F5EEE0] w-full sm:w-[840px] h-screen sm:h-[600px] sm:rounded-[16px] shadow-none sm:shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex overflow-hidden relative">
          {/* Left Panel - Image - Hidden on mobile */}
          <div className="hidden md:block w-[60%] h-full relative">
            <img src="./sweet_61 1.png" alt="Pink marshmallows on sticks" className="w-full h-full object-fill" />
          </div>

          {/* Right Panel - Form */}
          <div className="w-full md:w-[56%] h-full relative pt-8 sm:pt-6 px-6 sm:px-12 flex flex-col items-center bg-[#F5EEE0] overflow-y-auto">
            {/* Title */}
            <h1 className="text-[#8B7355] text-[18px] font-normal mb-2">Новий пароль</h1>
            <p className="text-[#8B7355]/80 text-[12px] font-light text-center mb-6 w-[300px] leading-relaxed">
              Введіть код з email та новий пароль
            </p>

            {/* Reset Password Form */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
              {/* Reset Code Input */}
              <div className="relative mb-4">
                <input
                  type="text"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  className="w-[300px] h-[54px] border border-[#8B7355] rounded-[6px] px-4 text-center text-[20px] text-[#8B7355] tracking-[8px] focus:outline-none focus:border-[#8B7355] bg-[#F5EEE0]"
                />
                {!resetCode && (
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#8B7355]/60 pointer-events-none text-[12px] font-light">
                    Код з email *
                  </div>
                )}
              </div>

              {/* Timer and Resend */}
              <div className="mb-4 text-center">
                {timeLeft > 0 ? (
                  <p className="text-[#8B7355]/70 text-[12px]">
                    Повторна відправка через: <span className="font-medium text-[#705A5A]">{formatTime(timeLeft)}</span>
                  </p>
                ) : (
                  <p className="text-[#8B7355]/70 text-[12px] mb-2">Не отримали код? Відправте новий</p>
                )}
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={loading || timeLeft > 0}
                  className={`text-[12px] underline transition-colors ${
                    timeLeft > 0 
                      ? 'text-[#8B7355]/40 cursor-not-allowed' 
                      : 'text-[#705A5A] hover:text-[#705A5A]/80 cursor-pointer'
                  }`}
                >
                  Відправити новий код
                </button>
              </div>

              {/* New Password Input */}
              <div className="relative mb-4">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => handleInputChange("newPassword", e.target.value)}
                  onBlur={() => handleBlur("newPassword")}
                  className={`w-[300px] h-[54px] border rounded-[6px] px-4 pr-12 text-[12px] text-[#8B7355] focus:outline-none transition-colors bg-[#F5EEE0] ${
                    errors.newPassword ? "border-red-500 focus:border-red-500" : "border-[#8B7355] focus:border-[#8B7355]"
                  }`}
                />
                {!newPassword && (
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B7355]/60 pointer-events-none text-[12px] font-light">
                    Новий пароль
                    <span className="text-red-500 ml-0.5">*</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B7355]/70 hover:text-[#8B7355] transition-colors"
                >
                  {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
                {errors.newPassword && <div className="text-red-500 text-[13px] mt-1 ml-1">{errors.newPassword}</div>}
              </div>

              <button
                type="submit"
                disabled={loading || !isSubmitEnabled}
                className={`w-[300px] h-[62px] rounded-full font-light text-[18px] mb-4 mt-6 transition-all duration-200 ${
                  isSubmitEnabled && !loading
                    ? "bg-[#705A5A] hover:bg-[#705A5A]/90 text-[#F5EEE0] cursor-pointer"
                    : "bg-[#705A5A]/50 text-[#F5EEE0]/70 cursor-not-allowed"
                }`}
              >
                {loading ? "Зміна пароля..." : "Змінити пароль"}
              </button>

              {/* Back to Login Link */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-[#705A5A] text-[12px] font-light underline hover:text-[#705A5A]/80 transition-colors"
                >
                  Назад до входу
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default ResetPasswordPage