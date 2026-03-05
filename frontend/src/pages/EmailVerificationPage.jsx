import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useUserStore } from "../stores/useUserStore"
import { CloseIcon } from "../components/icons"
import LoadingSpinner from "../components/LoadingSpinner"

const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [verificationCode, setVerificationCode] = useState("")
  const [timeLeft, setTimeLeft] = useState(15 * 60)
  const { 
    verifyEmail, 
    resendVerificationCode, 
    verificationLoading, 
    verificationEmail 
  } = useUserStore()

  // Получаем email из URL параметров или из store
  const email = searchParams.get('email') || verificationEmail

  // Таймер обратного отсчета
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  // Перенаправление если нет email для верификации
  useEffect(() => {
    if (!email) {
      navigate('/signup')
    }
  }, [email, navigate])

  // Форматирование времени
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Обработка отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (verificationCode.length !== 6) {
      return
    }
    try {
      await verifyEmail({ email, verificationCode })
      navigate('/') // Перенаправляем на главную после успешной верификации
    } catch {
      // Ошибка обработана в store
    }
  }

  // Повторная отправка кода
  const handleResendCode = async () => {
    try {
      await resendVerificationCode(email)
      setTimeLeft(15 * 60) // Сбрасываем таймер
      setVerificationCode('') // Очищаем поле ввода
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
      `}
      </style>
      <div className="min-h-screen flex items-center justify-center p-0 sm:p-4 bg-[#F5EEE0]">
        <div className="bg-[#F5EEE0] w-full sm:w-[840px] h-screen sm:h-[550px] sm:rounded-[16px] shadow-none sm:shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex overflow-hidden relative">
          {/* Left Panel - Image - Hidden on mobile */}
          <div className="hidden md:block w-[60%] h-full relative">
            <img src="./sweet_61 1.png" alt="Pink marshmallows on sticks" className="w-full h-full object-fill" />
          </div>

          {/* Right Panel - Form */}
          <div className="w-full md:w-[56%] h-full relative pt-12 sm:pt-10 px-6 sm:px-12 flex flex-col items-center bg-[#F5EEE0] overflow-y-auto">
            {/* Close Button */}
            <button 
              onClick={() => navigate('/signup')}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-[#8B7355] hover:text-[#8B7355]/70 transition-colors"
            >
              <CloseIcon />
            </button>

            {/* Title */}
            <h1 className="text-[#8B7355] text-[18px] font-normal mb-8">Перевірте вашу пошту</h1>

            {/* Info Text */}
            <div className="text-center mb-6">
              <p className="text-[#8B7355] text-[12px] font-light">
                Ми відправили 6-значний код на
              </p>
              <p className="text-[#8B7355] text-[12px] font-light mt-1">{email}</p>
            </div>

            {/* Verification Form */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
              <div className="w-full flex flex-col items-center mb-6">
                {/* Code Input */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                      setVerificationCode(value)
                    }}
                    placeholder="123456"
                    className="w-[300px] h-[54px] border border-[#8B7355] rounded-[6px] px-4 text-[12px] text-[#8B7355] focus:outline-none focus:border-[#8B7355] transition-colors bg-[#F5EEE0] text-center font-mono tracking-widest"
                    maxLength={6}
                    autoComplete="off"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={verificationCode.length !== 6 || verificationLoading}
                  className={`w-[300px] h-[62px] rounded-full font-light text-[18px] transition-all duration-200 ${
                    verificationCode.length === 6 && !verificationLoading
                      ? "bg-[#705A5A] hover:bg-[#705A5A]/90 text-[#F5EEE0] cursor-pointer"
                      : "bg-[#705A5A]/50 text-[#F5EEE0]/70 cursor-not-allowed"
                  }`}
                >
                  {verificationLoading ? "Перевірка..." : "Підтвердити код"}
                </button>
              </div>
            </form>

            {/* Timer and Resend */}
            <div className="text-center mb-6">
              {timeLeft > 0 ? (
                <p className="text-[#8B7355] text-[12px] font-light">
                  Новий код можна буде запросити через{' '}
                  <span className="font-mono text-[#705A5A]">
                    {formatTime(timeLeft)}
                  </span>
                </p>
              ) : (
                <div className="space-y-4">
                  <p className="text-[#8B7355] text-[12px] font-light">Не отримали код?</p>
                  <button
                    onClick={handleResendCode}
                    disabled={verificationLoading}
                    className="text-[#705A5A] text-[12px] font-light underline hover:text-[#705A5A]/80 transition-colors"
                  >
                    Відправити знову
                  </button>
                </div>
              )}
            </div>

            {/* Back Link */}
            <button
              onClick={() => navigate('/signup')}
              className="text-[#8B7355] text-[12px] font-light underline hover:text-[#8B7355]/80 transition-colors"
            >
              Повернутися до реєстрації
            </button>

            {/* Additional Info */}
            <div className="mt-6 text-center max-w-[300px]">
              <p className="text-[#8B7355] text-[10px] font-light leading-relaxed">
                <strong>Не знайшли лист?</strong><br />
                Перевірте папку &quot;Спам&quot; або &quot;Небажана пошта&quot;. Код дійсний протягом 15 хвилин.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default EmailVerificationPage