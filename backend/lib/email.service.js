import { Resend } from 'resend'

// Инициализация Resend с API ключом
const resend = new Resend(process.env.RESEND_API_KEY)

// Email отправитель с верифицированным доменом
const FROM_EMAIL = process.env.FROM_EMAIL || 'forchetta@romankos.com'

// URL аватара отправителя  
const SENDER_AVATAR = `${process.env.BASE_URL || 'https://forchetta.romankos.com'}/avatar.png`

// URL логотипа для email (используем публично доступный URL)
const LOGO_URL = `${process.env.BASE_URL || 'https://forchetta.romankos.com'}/forchetta-logo.png`

// Отладочный вывод для проверки URL
console.log('🖼️ LOGO_URL for emails:', LOGO_URL)

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
              <img src="${LOGO_URL}" alt="Forchetta" style="height: 120px;">
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
    console.log('🖼️ Logo URL в welcome email:', LOGO_URL)
    
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
                <img src="${LOGO_URL}" alt="Forchetta" style="height: 120px;">
              </div>
              
              <!-- Заголовок приветствия -->
              <div style="text-align: center; margin-bottom: 25px;">
                <h2 style="color: #6B4423; font-size: 24px; margin: 0; font-family: 'Montserrat';">🎉 Вітаємо, ${name}!</h2>
              </div>
              
              <!-- Статус подтверждения -->
<div style="background: #2B1A12; padding: 20px; border-radius: 12px; margin: 25px 0; text-align: center;">
  <h2 style="color: #F5EEE0; font-size: 18px; font-weight: 600; margin: 0; display: inline-block; vertical-align: middle;">
    <span style="color: #A1926B; margin-right: 8px;">✔</span> Email успішно підтверджено!
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

// Отправка email об успешном заказе
export const sendOrderConfirmationEmail = async (email, name, order) => {
  try {
    console.log('📧 Отправка order confirmation email через Resend для:', email)
    
    // Формируем список товаров
    const itemsHtml = order.items.map(item => {
      const imageUrl = item.image || 'https://forchetta.romankos.com/placeholder.jpg';
      
      return `
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
          <tr>
            <td width="60" style="padding-right: 15px;">
              <img src="${imageUrl}" alt="${item.nameAtPurchase}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
            </td>
            <td style="color: #705A5A; font-size: 15px;">
              <p style="margin: 0; font-weight: 500;">${item.nameAtPurchase}</p>
              <p style="margin: 4px 0 0 0; font-size: 13px;">${item.quantity} шт x ${item.priceAtPurchase} грн</p>
            </td>
            <td align="right" style="color: #6B4423; font-size: 16px; font-weight: 600;">
              ${item.quantity * item.priceAtPurchase} грн
            </td>
          </tr>
        </table>
      `;
    }).join('');

    // Если есть упаковка
    const packagingHtml = order.packagingPrice > 0 ? `
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
          <tr>
            <td width="60" style="padding-right: 15px;">
              <div style="width: 60px; height: 60px; background-color: #893E3E; border-radius: 8px; display: flex; align-items: center; justify-content: center; text-align:center;">
                <span style="color: #F5EEE0; font-size: 24px; line-height:60px;">🎁</span>
              </div>
            </td>
            <td style="color: #705A5A; font-size: 15px;">
              <p style="margin: 0; font-weight: 500;">Подарункове пакування</p>
            </td>
            <td align="right" style="color: #6B4423; font-size: 16px; font-weight: 600;">
              ${order.packagingPrice} грн
            </td>
          </tr>
        </table>
    ` : '';

    // Подготовка адреса
    const addr = order.shippingAddress;
    const addressString = addr ? `${addr.city || ''}, ${addr.street || ''} ${addr.house || ''}${addr.apartment ? ', кв. ' + addr.apartment : ''}` : 'Самовивіз';
    
    // Оплата
    const paymentStatusString = order.paymentStatus === 'paid' ? '(Сплачено)' : '(Очікує оплати)';
    const paymentMethodString = order.paymentMethod === 'card' ? 'Оплата картою' : 'Готівкою при отриманні';

    // Формируем HTML
    const htmlContent = `
      <head>
        <style type="text/css">
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@600;700&display=swap');
        </style>
      </head>
      <body style="font-family: 'Montserrat', Arial, sans-serif; font-style: normal; margin: 0; padding: 0; background-color: #ECECEC;">
        <div style="max-width: 600px; background-color: #F5EEE0; padding: 0; margin: 20px auto; letter-spacing: 0.5px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          <div style="padding: 40px 30px;">
            <!-- Логотип -->
            <div style="text-align: center; margin-bottom: 35px;">
              <img src="${LOGO_URL}" alt="Forchetta" style="height: 100px;">
            </div>
            
            <!-- Заголовок приветствия -->
            <div style="text-align: center; margin-bottom: 25px;">
              <h2 style="color: #6B4423; font-size: 26px; margin: 0; font-family: 'Cormorant Garamond', serif;">${name ? name.split(" ")[0] : 'Клієнте'}, дякуємо за замовлення!</h2>
              <p style="color: #705A5A; font-size: 16px; margin-top: 10px;">Ваше замовлення успішно оформлено.</p>
            </div>

            <!-- Блок с номером заказа -->
            <div style="background: #E3D6BF; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
              <p style="color: #705A5A; font-size: 14px; margin: 0 0 5px 0;">Номер замовлення:</p>
              <h3 style="color: #893E3E; font-size: 24px; margin: 0; font-family: 'Montserrat', sans-serif;">${order.orderNumber}</h3>
            </div>

            <!-- Детали заказа (товары) -->
            <div style="margin-bottom: 30px;">
              <h4 style="color: #6B4423; font-size: 18px; border-bottom: 1px solid #E5DCC9; padding-bottom: 10px; margin-bottom: 15px;">Деталі замовлення</h4>
              ${itemsHtml}
              ${packagingHtml}
            </div>

            <!-- Итоговая сумма -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border-top: 2px solid #E5DCC9; padding-top: 15px; margin-bottom: 30px;">
              <tr>
                <td style="color: #705A5A; font-size: 16px; padding-bottom: 8px;">Сума замовлення:</td>
                <td align="right" style="color: #705A5A; font-size: 16px; padding-bottom: 8px;">${order.totalPrice + (order.bonusUsed || 0)} грн</td>
              </tr>
              ${order.bonusUsed > 0 ? `
              <tr>
                <td style="color: #705A5A; font-size: 16px; padding-bottom: 8px;">Списані бонуси:</td>
                <td align="right" style="color: #893E3E; font-size: 16px; padding-bottom: 8px;">-${order.bonusUsed} грн</td>
              </tr>
              ` : ''}
              <tr>
                <td style="color: #6B4423; font-size: 18px; font-weight: 700; padding-top: 10px;">До сплати:</td>
                <td align="right" style="color: #6B4423; font-size: 20px; font-weight: 700; padding-top: 10px;">${order.totalPrice} грн</td>
              </tr>
            </table>

            <!-- Информация о доставке/оплате -->
            <div style="background: #fff; padding: 20px; border-radius: 12px; margin-bottom: 30px; border: 1px solid #E5DCC9;">
              <h4 style="color: #6B4423; font-size: 16px; margin: 0 0 15px 0;">Інформація про доставку</h4>
              <p style="color: #705A5A; font-size: 14px; margin: 5px 0;"><strong>Телефон:</strong> ${order.contactPhone || ''}</p>
              <p style="color: #705A5A; font-size: 14px; margin: 5px 0;"><strong>Адреса:</strong> ${addressString}</p>
              <p style="color: #705A5A; font-size: 14px; margin: 15px 0 5px 0; padding-top: 15px; border-top: 1px solid #eee;"><strong>Спосіб оплати:</strong> ${paymentMethodString} ${paymentStatusString}</p>
            </div>
            
            ${order.bonusEarned ? `
            <!-- Бонусы за покупку -->
            <div style="background: #2B1A12; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
              <p style="color: #F5EEE0; font-size: 15px; margin: 0;">
                За це замовлення вам буде нараховано: <br>
                <strong style="color: #E3D6BF; font-size: 18px;">+${order.bonusEarned} бонусів</strong>
              </p>
            </div>
            ` : ''}

            <!-- Подпись -->
            <div style="text-align: center; margin-top: 35px; padding-top: 20px; border-top: 1px solid #E5DCC9;">
              <p style="color: #A1926B; font-size: 12px; line-height: 1.4; margin: 0;">Якщо у вас є питання щодо замовлення, зв'яжіться з нами.</p>
              <p style="color: #A1926B; font-size: 12px; line-height: 1.4; margin: 5px 0;">© ${new Date().getFullYear()} Forchetta - Магазин солодощів</p>
            </div>
          </div>
        </div>
      </body>
    `;

    // Отправляем через Resend API
    const result = await resend.emails.send({
      from: `Forchetta Sweet Shop <${FROM_EMAIL}>`,
      to: [email],
      subject: `Замовлення ${order.orderNumber} успішно оформлено`,
      html: htmlContent,
    });

    if (result.error) {
      console.error('❌ Ошибка отправки order confirmation email:', result.error.message);
      return { success: false, error: result.error.message };
    }
    
    console.log('✅ Order confirmation email отправлен! ID:', result.data?.id);
    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('❌ Ошибка отправки order confirmation email:', error);
    return { success: false, error: error.message };
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
              <img src="${LOGO_URL}" alt="Forchetta" style="height: 120px;">
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
