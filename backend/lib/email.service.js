import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'

// Настройка транспорта NodeMailer для Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })
}

// Функция генерации случайного 6-значного кода верификации
export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Отправка email с кодом верификации новото пользователю
export const sendVerificationEmail = async (email, verificationCode, name) => {
  try {
    // Создаем транспортер для Gmail
    const transporter = createTransporter()
    // Настройки письма
    const mailOptions = {
      from: {
        name: 'Forchetta',
        address: process.env.GMAIL_USER
      },
      to: email,
      subject: 'Підтвердження реєстрації в Forchetta',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px;">
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            
            <!-- Логотип -->
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="cid:forchetta-logo" alt="Forchetta" style="height: 150px;">
            </div>
            
            <h2 style="color: #333; text-align: center; margin-bottom: 20px;">🎉 Вітаємо, ${name}!</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">Дякуємо за реєстрацію в нашому магазині солодощів <strong>Forchetta</strong>!</p>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">Ваш код підтвердження:</p>
            
            <div style="background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%); padding: 25px; text-align: center; margin: 25px 0; border-radius: 8px;">
              <h1 style="color: white; font-size: 36px; letter-spacing: 8px; margin: 0; font-family: monospace;">${verificationCode}</h1>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.5;">Введіть цей код на сторінці підтвердження протягом <strong>15 хвилин</strong>.</p>
            <p style="color: #666; font-size: 14px; line-height: 1.5;">Якщо ви не реєструвалися в магазині Forchetta, просто проігноруйте цей лист.</p>
            
            <div style="background: #FFF8DC; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #D2691E;">
              <p style="color: #8B4513; font-size: 14px; margin: 0; font-weight: bold;">🍭 Після підтвердження ви отримаете доступ до ексклюзивних солодощів!</p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
              Це автоматичний лист, не відповідайте на нього.<br>
              © ${new Date().getFullYear()} Forchetta - Магазин солодощів
            </p>
          </div>
        </div>
      `,
      attachments: [{
        filename: 'forchetta-logo.png',
        path: path.join(process.cwd(), 'frontend', 'public', 'forchetta-logo.png'),
        cid: 'forchetta-logo'
      }]
    }

    // Отправляем письмо
    const result = await transporter.sendMail(mailOptions)
    
    console.log('✅ Email успешно отправлен!')
    console.log('📬 Message ID:', result.messageId)
    
    // Возвращаем успешный результат
    return { 
      success: true, 
      messageId: result.messageId,
      testMode: false
    }
  } catch (error) {
    console.error('❌ Ошибка отправки email:', error)
    throw new Error(`Не удалось отправить email: ${error.message}`)
  }
}

/**
 * Отправка приветственного письма пользователю после успешной верификации email
 * Отправляется автоматически после подтверждения верификационного кода
 * @param {string} email - Email адрес пользователя
 * @param {string} name - Имя пользователя для персонализации
 * @returns {Promise<Object>} - Объект с результатом отправки (не прерывает процесс при ошибке)
 */
export const sendWelcomeEmail = async (email, name) => {
  console.log('📧 Отправка приветственного письма через Gmail SMTP...')
  console.log('📮 Email получателя:', email)
  
  try {
    // Создаем транспортер для Gmail
    const transporter = createTransporter()
    
    // Настройки письма
    const mailOptions = {
      from: {
        name: 'Forchetta',
        address: process.env.GMAIL_USER
      },
      to: email,
      subject: '🎉 Ласкаво просимо до Forchetta!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px;">
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            
            <!-- Логотип -->
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="cid:forchetta-logo" alt="Forchetta" style="height: 150px;">
            </div>
            
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; margin: 0; font-size: 28px;">🎉 Вітаємо, ${name}!</h1>
            </div>
            
            <div style="background: linear-gradient(135deg, #228B22 0%, #32CD32 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <h2 style="margin: 0; font-size: 24px;">✅ Email успішно підтверджено!</h2>
            </div>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">Тепер ви можете повною мірою користуватися нашим магазином солодощів <strong>Forchetta</strong>:</p>
            
            <div style="background: #FFF8DC; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="padding: 8px 0; color: #333;">🍬 Замовляти ексклюзивні цукерки</li>
                <li style="padding: 8px 0; color: #333;">🍰 Обирати торти на замовлення</li>
                <li style="padding: 8px 0; color: #333;">🎁 Отримувати спеціальні пропозиції</li>
                <li style="padding: 8px 0; color: #333;">🚚 Отримувати швидку доставку</li>
                <li style="padding: 8px 0; color: #333;">⭐ Залишати відгуки та оцінки</li>
              </ul>
            </div>
            
            <div style="background: linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 100%); padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <p style="color: #8B4513; font-size: 16px; margin: 0; font-weight: bold;">🍭 Спеціальна пропозиція: знижка 10% на перше замовлення!</p>
              <p style="color: #8B4513; font-size: 14px; margin: 5px 0 0 0;">Використовуйте код: WELCOME10</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #333; font-size: 18px; font-weight: bold;">Ласкаво просимо до родини Forchetta!</p>
              <p style="color: #666; font-size: 16px;">Насолоджуйтесь найсмачнішими солодощами! 🍯</p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
              Це автоматичний лист, не відповідайте на нього.<br>
              © ${new Date().getFullYear()} Forchetta - Магазин солодощів
            </p>
          </div>
        </div>
      `,
      attachments: [{
        filename: 'forchetta-logo.png',
        path: path.join(process.cwd(), 'frontend', 'public', 'forchetta-logo.png'),
        cid: 'forchetta-logo'
      }]
    }

    // Отправляем письмо
    const result = await transporter.sendMail(mailOptions)
    
    console.log('✅ Приветственное письмо отправлено!')
    console.log('📬 Message ID:', result.messageId)
    
    // Возвращаем результат
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('❌ Ошибка отправки приветственного письма:', error)
    // Не прерываем процесс верификации, если welcome email не отправился
    return { success: false, error: error.message }
  }
}