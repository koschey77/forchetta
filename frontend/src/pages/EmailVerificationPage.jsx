import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useUserStore } from "../stores/useUserStore"
import LoadingSpinner from "../components/LoadingSpinner"

const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [verificationCode, setVerificationCode] = useState("")
  const [timeLeft, setTimeLeft] = useState(120)
  const [errorMessage, setErrorMessage] = useState("")
  const [attemptsExceeded, setAttemptsExceeded] = useState(false)
  const [canResend, setCanResend] = useState(true)
  const { verifyEmail, resendVerificationCode, loading, verificationEmail } = useUserStore()

  // Получаем email из URL параметров или из store
  const email = searchParams.get('email') || verificationEmail
  const isExpired = timeLeft <= 0
  
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
      
      return () => clearInterval(timer)
    }
  }, [timeLeft])

  // Перенаправление если нет email для верификации
  useEffect(() => {
    if (!email) {
      navigate('/signup')
    }
  }, [email, navigate])

  // Обработка отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (verificationCode.length !== 6 || isExpired) {
      return
    }
    try {
      await verifyEmail({ email, verificationCode })
      navigate('/') // Перенаправляем на главную после успешной верификации
    } catch (error) {
      const errorData = error.response?.data
      
      // Сохраняем сообщение об ошибке для отображения
      setErrorMessage(errorData?.message || 'Помилка верификації')
      
      // Обновляем состояние возможности resend
      if (errorData?.canResend !== undefined) {
        setCanResend(errorData.canResend)
      }
      
      if (errorData?.attemptsLeft !== undefined && errorData.attemptsLeft > 0) {
        // Если еще есть попытки, сбрасываем таи́мер на полные 2 минуты
        setTimeLeft(120)
      } else {
        // Если попытки закончились, отмечаем это отдельно
        setAttemptsExceeded(true)
        setTimeLeft(0)
      }
    }
  }

  // Обработка повторной отправки кода
  const handleResend = async () => {
    try {
      await resendVerificationCode(email)
      // Сбрасываем состояния после успешной отправки
      setTimeLeft(120)
      setAttemptsExceeded(false)
      setErrorMessage("")
      setCanResend(false) // Больше resend использовать нельзя
    } catch (error) {
      // Ошибка уже обработана в useUserStore
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
            {/* Title */}
            <h1 className="text-[#8B7355] text-[18px] font-normal mb-8">Перевірте вашу пошту</h1>

            {/* Info Text */}
            <div className="text-center mb-6">
              <p className="text-[#8B7355] text-[12px] font-light">
                Ми відправили 6-значний код на
              </p>
              <p className="text-[#8B7355] text-[12px] font-semibold mt-1">{email}</p>
              
              {/* Таймер */}
              {!isExpired && timeLeft > 0 && (
                <div className="mt-3">
                  <p className="text-[#8B7355] text-[11px] font-light">Час, що залишився:</p>
                  <div className="text-[#705A5A] text-[16px] font-mono font-semibold mt-1">
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </div>
                </div>
              )}
              
              {/* Показываем сообщение об ошибке если есть */}
              {errorMessage && !isExpired && (
                <p className="text-[#DC2626] text-[11px] font-medium mt-2">
                  {errorMessage}
                </p>
              )}
              
              {/* Сообщение об истечении времени или попыток */}
              {isExpired && (
                <div className="mt-3">
                  <p className="text-[#DC2626] text-[12px] font-semibold">
                    {attemptsExceeded ? 'Спроби закінчилися!' : 'Час закінчився!'}
                  </p>
                </div>
              )}
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
                      // Очищаем ошибку при новом вводе только если форма активна
                      if (errorMessage && !isExpired) setErrorMessage("")
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
                  disabled={verificationCode.length !== 6 || loading || isExpired}
                  className={`w-[300px] h-[62px] rounded-full font-light text-[18px] transition-all duration-200 ${
                    verificationCode.length === 6 && !loading && !isExpired
                      ? "bg-[#705A5A] hover:bg-[#705A5A]/90 text-[#F5EEE0] cursor-pointer"
                      : "bg-[#705A5A]/50 text-[#F5EEE0]/70 cursor-not-allowed"
                  }`}
                >
                  {loading ? "Перевірка..." : isExpired ? (attemptsExceeded ? "Спроби закінчилися" : "Час закінчився") : "Підтвердити код"}
                </button>
              </div>
            </form>

            {/* Start Over Section */}
            <div className="text-center mb-6">
              {isExpired ? (
                <div className="space-y-4">
                  {/* Показываем кнопку resend только если она доступна */}
                  {canResend ? (
                    <button
                      onClick={handleResend}
                      disabled={loading}
                      className="px-8 py-3 rounded-full text-[14px] font-medium transition-all duration-200 bg-[#8B7355] hover:bg-[#8B7355]/90 text-[#F5EEE0] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Надсилання..." : "Надіслати код ще раз"}
                    </button>
                  ) : null}
                  
                  {/* Кнопка "начать заново" - всегда доступна */}
                  <button
                    onClick={() => navigate('/signup')}
                    className="px-8 py-3 rounded-full text-[14px] font-medium transition-all duration-200 bg-[#705A5A] hover:bg-[#705A5A]/90 text-[#F5EEE0] cursor-pointer"
                  >
                    Зареєструватися знову
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div className="text-center max-w-[300px]">
              <p className="text-[#8B7355] text-[10px] font-light leading-relaxed">
                <strong>Не знайшли лист?</strong><br />
                Перевірте папку &quot;Спам&quot; або &quot;Небажана пошта&quot;.
              </p>
            </div>

            {/* Back Link */}
            <button
              onClick={() => navigate('/signup')}
              className="mt-6 text-[#8B7355] text-[12px] font-light underline hover:text-[#8B7355]/80 transition-colors"
            >
              Повернутися до реєстрації
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default EmailVerificationPage