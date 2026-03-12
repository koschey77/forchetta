import { Resend } from 'resend'

// Инициализация Resend с API ключом
const resend = new Resend(process.env.RESEND_API_KEY)

// Email отправитель с верифицированным доменом
const FROM_EMAIL = process.env.FROM_EMAIL || 'forchetta@romankos.com'

// URL аватара отправителя  
const SENDER_AVATAR = `${process.env.BASE_URL || 'https://forchetta.romankos.com'}/avatar.png`

// Функция генерации случайного 6-значного кода верификации
export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Отправка email с кодом верификации нового пользователю
export const sendVerificationEmail = async (email, verificationCode, name) => {
  try {
    console.log('📧 Отправка verification email через Resend для:', email)
    
    // Отправляем через Resend API
    const result = await resend.emails.send({
      from: `Forchetta Sweet Shop <${FROM_EMAIL}>`,
      to: [email],
      subject: "Підтвердження реєстрації - Forchetta",
      html: `
        <head>
          <style type="text/css">
            @import url('https://fonts.googleapis.com');
          </style>
        </head>
        <body style="font-family: 'Montserrat', Arial, sans-serif; font-style: normal;">
        <div style="max-width: 800px; background-color: #F5EEE0; padding: 0; margin: 0 auto; letter-spacing: 0.5px;">
          <div style="padding: 40px 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
            
            <!-- Логотип -->
            <div style="text-align: center; margin-bottom: 35px;">
              <img src="${process.env.BASE_URL || 'http://localhost:5173'}/forchetta-logo.png" alt="Forchetta" style="height: 120px;">
            </div>
            
            <!-- Заголовок приветствия -->
            <div style="text-align: center; margin-bottom: 25px;">
              <h2 style="color: #6B4423; font-size: 24px; margin: 0; font-family: 'Montserrat';">🎉 Вітаємо, ${name}!</h2>
            </div>
            
            <!-- Основной текст -->
            <div style="margin-bottom: 25px;">
              <p style="color: #705A5A; font-size: 16px; line-height: 1.6; text-align: center; margin: 12px 0;">Дякуємо за реєстрацію в нашому</p>
              <p style="color: #705A5A; font-size: 16px; line-height: 1.6; text-align: center; margin: 12px 0;">магазині солодощів Forchetta!</p>
            </div>
            
            <!-- Текст перед кодом -->
            <div style="text-align: center; margin-bottom: 20px;">
              <p style="color: #705A5A; font-size: 16px; margin: 0; font-weight: 500;">Ваш код підтвердження:</p>
            </div>
            
            <!-- Код подтверждения -->
            <div style="background: #893E3E; font-family: 'Cormorant Garamond', Georgia, serif; padding: 24px; text-align: center; margin: 30px auto; border-radius: 12px; max-width: 280px; box-shadow: 0 4px 12px rgba(122, 63, 42, 0.2);">
              <h1 style="color: #F5EEE0; font-size: 36px; letter-spacing: 8px; margin: 0; font-weight: bold;">${verificationCode}</h1>
            </div>
            
            <!-- Инструкции -->
            <div style="text-align: center; margin: 25px 0;">
              <p style="color: #705A5A; font-size: 14px; line-height: 1.5; margin: 8px 0;">Введіть цей код на сторінці</p>
              <p style="color: #705A5A; font-size: 14px; line-height: 1.5; margin: 8px 0;">підтвердження протягом <strong>3 хвилин</strong>.</p>
            </div>
            
            <div style="text-align: center; margin-bottom: 30px;">
              <p style="color: #705A5A; font-size: 14px; line-height: 1.5; margin: 8px 0;">Якщо ви не реєструвалися в магазині</p>
              <p style="color: #705A5A; font-size: 14px; line-height: 1.5; margin: 8px 0;">Forchetta, просто проігнноруйте цей лист.</p>
            </div>
            
            <!-- Блок с информацией -->
            <div style="background: #E3D6BF; padding: 20px; border-radius: 12px; margin: 25px 0; text-align: center;">
              <p style="color: #6B4423; font-size: 14px; margin: 0; font-weight: 500; line-height: 1.4;">🍭 Після підтвердження</p>
              <p style="color: #6B4423; font-size: 14px; margin: 0; font-weight: 500; line-height: 1.4;">ви отримаєте доступ до</p>
              <p style="color: #6B4423; font-size: 14px; margin: 0; font-weight: 500; line-height: 1.4;"><strong>ексклюзивних солодощів!</strong></p>
            </div>
            
            <!-- Подпись -->
            <div style="text-align: center; margin-top: 35px; padding-top: 20px; border-top: 1px solid #E5DCC9;">
              <p style="color: #A1926B; font-size: 12px; line-height: 1.4; margin: 0;">Це автоматичний лист, не відповідайте на нього.</p>
              <p style="color: #A1926B; font-size: 12px; line-height: 1.4; margin: 0;">© ${new Date().getFullYear()} Forchetta - Магазин солодощів</p>
            </div>
          </div>
        </div>
        </body>
      `,
    })

    if (result.error) {
      console.error('❌ Ошибка отправки verification email:', result.error.message)
      return { 
        success: false, 
        error: result.error.message,
        testMode: false
      }
    }
    
    console.log('✅ Verification email отправлен! ID:', result.data?.id)
    return { 
      success: true, 
      messageId: result.data?.id,
      testMode: false
    }
  } catch (error) {
    console.error('❌ Ошибка отправки verification email:', error)
    return { 
      success: false, 
      error: error.message,
      testMode: false
    }
  }
}

// Отправка приветственного email после успешной верификации нового пользователя
export const sendWelcomeEmail = async (email, name) => {  
  try {
    console.log('📧 Отправка welcome email через Resend для:', email)
    
    // Отправляем через Resend API
    const result = await resend.emails.send({
      from: `Forchetta Sweet Shop <${FROM_EMAIL}>`,
      to: [email],
      subject: "Ласкаво просимо до Forchetta Sweet Shop!",
      html: `
        <head>
          <style type="text/css">
            @import url('https://fonts.googleapis.com');
          </style>
        </head>
        <body>
          <div style="font-family: 'Montserrat', Arial, sans-serif; font-style: normal; max-width: 800px; min-width: 340px; background-color: #F5EEE0; padding: 0; margin: 0 auto; letter-spacing: 0.1px;">
            <div style="padding: 40px 20px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
              
              <!-- Логотип -->
              <div style="text-align: center; margin-bottom: 35px;">
                <img src="${process.env.BASE_URL || "http://localhost:5173"}/forchetta-logo.png" alt="Forchetta" style="height: 120px;">
              </div>
              
              <!-- Заголовок приветствия -->
              <div style="text-align: center; margin-bottom: 25px;">
                <h2 style="color: #6B4423; font-size: 24px; margin: 0; font-family: 'Montserrat';">🎉 Вітаємо, ${name}!</h2>
              </div>
              
              <!-- Статус подтверждения -->
<div style="background: #2B1A12; padding: 20px; border-radius: 12px; margin: 25px 0; text-align: center;">
  <h2 style="color: #F5EEE0; font-size: 18px; font-weight: 600; margin: 0; display: inline-block; vertical-align: middle;">
    ✅ Email успішно підтверджено!
  </h2>
</div>              
              <!-- Основной текст -->
              <div style="margin-bottom: 25px;">
                <p style="color: #705A5A; font-size: 16px; line-height: 1.6; text-align: center; margin: 12px 0;">Тепер ви можете повною мірою</p>
                <p style="color: #705A5A; font-size: 16px; line-height: 1.6; text-align: center; margin: 12px 0;">користуватися нашим магазином солодощів <strong>Forchetta</strong>:</p>
              </div>
              
              <!-- Список возможностей -->
              <div style="background: #E3D6BF; padding: 10px; border-radius: 12px; margin: 25px 0;">
                <ul style="list-style: none; padding: 0; margin: 0 auto; max-width: max-content;">
                  <li style="display: flex; align-items: center; gap: 10px; padding: 8px 0; color: #6B4423; font-size: 14px; font-weight: 500;">
                    <span style="margin-right: 10px; display: flex; align-items: center; justify-content: center; width: 20px;">🍬</span> 
                     Замовляти ексклюзивні цукерки
                  </li>
                  <li style="display: flex; align-items: center; gap: 10px; padding: 8px 0; color: #6B4423; font-size: 14px; font-weight: 500;">
                    <span style="margin-right: 10px; display: flex; align-items: center; justify-content: center; width: 20px;">🍰</span> 
                     Обирати торти на замовлення
                  </li>
                  <li style="display: flex; align-items: center; gap: 10px; padding: 8px 0; color: #6B4423; font-size: 14px; font-weight: 500;">
                    <span style="margin-right: 10px; display: flex; align-items: center; justify-content: center; width: 20px;">🎁</span> 
                     Отримувати спеціальні пропозиції
                  </li>
                  <li style="display: flex; align-items: center; gap: 10px; padding: 8px 0; color: #6B4423; font-size: 14px; font-weight: 500;">
                    <span style="margin-right: 10px; display: flex; align-items: center; justify-content: center; width: 20px;">🚚</span> 
                     Отримувати швидку доставку
                  </li>
                  <li style="display: flex; align-items: center; gap: 10px; padding: 8px 0; color: #6B4423; font-size: 14px; font-weight: 500;">
                    <span style="margin-right: 10px; display: flex; align-items: center; justify-content: center; width: 20px;">⭐</span> 
                     Залишати відгуки та оцінки
                  </li>
                </ul>
              </div>
                                      
              <!-- Подпись -->
              <div style="text-align: center; margin-top: 35px; padding-top: 20px; border-top: 1px solid #E5DCC9;">
                <p style="color: #A1926B; font-size: 12px; line-height: 1.4; margin: 0;">Це автоматичний лист, не відповідайте на нього.</p>
                <p style="color: #A1926B; font-size: 12px; line-height: 1.4; margin: 0;">© ${new Date().getFullYear()} Forchetta - Магазин солодощів</p>
              </div>
            </div>
          </div>
        </body>
      `,
    })

    if (result.error) {
      console.error('❌ Ошибка отправки welcome email:', result.error.message)
      return { 
        success: false, 
        error: result.error.message,
        testMode: false
      }
    }
    
    console.log('✅ Welcome email отправлен! ID:', result.data?.id)
    return { success: true, messageId: result.data?.id }
  } catch (error) {
    console.error('❌ Ошибка отправки welcome email:', error)
    return { success: false, error: error.message }
  }
}

// Отправка email с кодом восстановления пароля
// Отправка email с кодом восстановления пароля
export const sendPasswordResetEmail = async (email, resetCode, name) => {
  try {
    console.log('📧 Отправка password reset email через Resend для:', email)
    
    // Отправляем через Resend API
    const result = await resend.emails.send({
      from: `Forchetta Sweet Shop <${FROM_EMAIL}>`,
      to: [email],
      subject: "Код відновлення пароля - Forchetta",
      html: `
        <head>
          <style type="text/css">
            @import url('https://fonts.googleapis.com');
          </style>
        </head>
        <body style="font-family: 'Montserrat', Arial, sans-serif; font-style: normal;">
        <div style="max-width: 800px; background-color: #F5EEE0; padding: 0; margin: 0 auto; letter-spacing: 0.5px;">
          <div style="padding: 40px 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
            
            <!-- Логотип -->
            <div style="text-align: center; margin-bottom: 35px;">
              <img src="${process.env.BASE_URL || 'http://localhost:5173'}/forchetta-logo.png" alt="Forchetta" style="height: 120px;">
            </div>
            
            <!-- Заголовок -->
            <div style="text-align: center; margin-bottom: 25px;">
              <h2 style="color: #6B4423; font-size: 24px; margin: 0; font-family: 'Montserrat';">🔐 Відновлення пароля</h2>
            </div>
            
            <!-- Основной текст -->
            <div style="margin-bottom: 25px;">
              <p style="color: #705A5A; font-size: 16px; line-height: 1.6; text-align: center; margin: 12px 0;">Привіт, ${name || "шановний клієнт"}!</p>
              <p style="color: #705A5A; font-size: 16px; line-height: 1.6; text-align: center; margin: 12px 0;">Ви запросили відновлення пароля для</p>
              <p style="color: #705A5A; font-size: 16px; line-height: 1.6; text-align: center; margin: 12px 0;">вашого акаунту в <strong>Forchetta</strong>.</p>
            </div>
            
            <!-- Текст перед кодом -->
            <div style="text-align: center; margin-bottom: 20px;">
              <p style="color: #705A5A; font-size: 16px; margin: 0; font-weight: 500;">Ваш код відновлення:</p>
            </div>
            
            <!-- Код восстановления -->
            <div style="background: #893E3E; font-family: 'Cormorant Garamond', Georgia, serif; padding: 24px; text-align: center; margin: 30px auto; border-radius: 12px; max-width: 280px; box-shadow: 0 4px 12px rgba(122, 63, 42, 0.2);">
              <h1 style="color: #F5EEE0; font-size: 36px; letter-spacing: 8px; margin: 0; font-weight: bold;">${resetCode}</h1>
            </div>
            
            <!-- Инструкции -->
            <div style="text-align: center; margin: 25px 0;">
              <p style="color: #705A5A; font-size: 14px; line-height: 1.5; margin: 8px 0;">Введіть цей код на сторінці</p>
              <p style="color: #705A5A; font-size: 14px; line-height: 1.5; margin: 8px 0;">відновлення протягом <strong>15 хвилин</strong>.</p>
            </div>
            
            <div style="text-align: center; margin-bottom: 30px;">
              <p style="color: #705A5A; font-size: 14px; line-height: 1.5; margin: 8px 0;">Якщо ви не запросили відновлення,</p>
              <p style="color: #705A5A; font-size: 14px; line-height: 1.5; margin: 8px 0;">просто проігноруйте цей лист.</p>
            </div>
            
            <!-- Блок безопасности -->
            <div style="background: #E3D6BF; padding: 20px; border-radius: 12px; margin: 25px 0; text-align: center;">
              <p style="color: #6B4423; font-size: 14px; margin: 0; font-weight: 500; line-height: 1.4;">🔒 З міркувань безпеки ніколи не</p>
              <p style="color: #6B4423; font-size: 14px; margin: 0; font-weight: 500; line-height: 1.4;">повідомляйте цей код нікому!</p>
            </div>
            
            <!-- Подпись -->
            <div style="text-align: center; margin-top: 35px; padding-top: 20px; border-top: 1px solid #E5DCC9;">
              <p style="color: #A1926B; font-size: 12px; line-height: 1.4; margin: 0;">Це автоматичний лист, не відповідайте на нього.</p>
              <p style="color: #A1926B; font-size: 12px; line-height: 1.4; margin: 0;">© ${new Date().getFullYear()} Forchetta - Магазин солодощів</p>
            </div>
          </div>
        </div>
        </body>
      `,
    })

    if (result.error) {
      console.error('❌ Ошибка отправки password reset email:', result.error.message)
      return { 
        success: false, 
        error: result.error.message,
        testMode: false
      }
    }
    
    console.log('✅ Password reset email отправлен! ID:', result.data?.id)
    return { 
      success: true, 
      messageId: result.data?.id,
      testMode: false
    }
  } catch (error) {
    console.error('❌ Ошибка отправки password reset email:', error)
    return { 
      success: false, 
      error: error.message,
      testMode: false
    }
  }
}
