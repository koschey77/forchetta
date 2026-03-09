import {redis} from '../lib/redis.js'
import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { generateVerificationCode, sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail } from '../lib/email.service.js'

// Функция генерации access и refresh токенов с использованием JWT
const generateTokens = (userId) => {
  const accessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  })

  const refreshToken = jwt.sign({userId}, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  })

  return {accessToken, refreshToken}
}

// Сохранение refresh токена в Redis с привязкой к userId
//  для последующей проверки при обновлении токенов и при выходе пользователя
const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(`refresh_token:${userId}`, refreshToken, 'EX', 7 * 24 * 60 * 60) // 7days
}

// Установка HTTP-only куки для access и refresh токенов при аутентификации пользователя
const setCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true, // prevent XSS attacks, cross site scripting attack
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict', // prevents CSRF attack, cross-site request forgery attack
    maxAge: 15 * 60 * 1000, // 15 minutes
  })
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true, // prevent XSS attacks, cross site scripting attack
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict', // prevents CSRF attack, cross-site request forgery attack
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  })
}

export const signup = async (req, res) => {
  const {email, password, name} = req.body
  try {
    // Проверяем не существует ли уже пользователь с таким email
    const userExists = await User.findOne({email})
    if (userExists) {
      return res.status(400).json({ message: "Користувач з таким email вже існує." })
    }

    // Проверяем нет ли уже процесса верификации для этого email
    const existingVerification = await redis.get(`verification:${email}`)
    if (existingVerification) {
      return res.status(400).json({message: 'Код верификации уже отправлен. Проверьте почту или запросите новый код'})}

    // Генерируем 6-значный код верификации
    const verificationCode = generateVerificationCode()

    // Хешируем пароль для сохранения в Redis
    const hashedPassword = await bcrypt.hash(password, 10)

    // Создаем минимальные данные для пользователя + код верификации
    const registrationData = JSON.stringify({
      name,
      hashedPassword,
      verificationCode,
      attempts: 0,
      resendUsed: false
    })
    
    // Сохраняем данные пользователя в Redis с TTL 2 минуты
    await redis.setex(`verification:${email}`, 120, registrationData)
    
    // Отправляем код верификации на email через Gmail
    await sendVerificationEmail(email, verificationCode, name)
    
    res.status(200).json({
      message: 'Код подтверждения отправлен на email. У вас 2 минуты и 3 попытки.',
      email: email,
      needsVerification: true
    })
  } catch (error) {
    console.log('Error in signup controller', error.message)
    res.status(500).json({message: error.message})
  }
}

export const login = async (req, res) => {
  try {
    const {email, password} = req.body
    const user = await User.findOne({email})

    if (user && (await user.comparePassword(password))) {
      const {accessToken, refreshToken} = generateTokens(user._id)
      await storeRefreshToken(user._id, refreshToken)
      setCookies(res, accessToken, refreshToken)

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      })
    } else {
      res.status(400).json({message: 'Invalid email or password'})
    }
  } catch (error) {
    console.log('Error in login controller', error.message)
    res.status(500).json({message: error.message})
  }
}

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken
    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
      await redis.del(`refresh_token:${decoded.userId}`)
    }
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    res.json({message: 'Logged out successfully'})
  } catch (error) {
    console.log('Error in logout controller', error.message)
    res.status(500).json({message: 'Server error', error: error.message})
  }
}

// Контроллер для обновления access токена с помощью refresh токена
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
      return res.status(401).json({message: 'No refresh token provided'})
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    const storedToken = await redis.get(`refresh_token:${decoded.userId}`)

    if (storedToken !== refreshToken) {
      return res.status(401).json({message: 'Invalid refresh token'})
    }

    const accessToken = jwt.sign({userId: decoded.userId}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    })

    res.json({message: 'Token refreshed successfully'})
  } catch (error) {
    console.log('Error in refreshToken controller', error.message)
    res.status(500).json({message: 'Server error', error: error.message})
  }
}

export const getProfile = async (req, res) => {
  try {
    res.json(req.user)
  } catch (error) {
    res.status(500).json({message: 'Server error', error: error.message})
  }
}

// Контроллер для подтверждения email кодом
export const verifyEmail = async (req, res) => {
  try {
    const { email, verificationCode } = req.body
    // Извлекаем данные регистрации из Redis
    const registrationDataRaw = await redis.get(`verification:${email}`)
    if (!registrationDataRaw) {
      return res.status(400).json({
        message: 'Код верификации истек. Можете начать регистрацию заново.',
        expired: true,
        canResend: false
      })
    }
    // Парсим минимальные данные регистрации из Redis
    const registrationData = JSON.parse(registrationDataRaw)
    const { name, hashedPassword, verificationCode: savedCode, attempts, resendUsed } = registrationData
    // Защита от брут-форс атак - максимум 3 попытки ввода кода
    if (attempts >= 3) {
      // Если resend уже использован - удаляем данные
      if (resendUsed) {
        await redis.del(`verification:${email}`)
        return res.status(429).json({
          message: 'Попытки закончились. Можете начать регистрацию заново.',
          attemptsExceeded: true,
          canResend: false,
          email: email
        })
      }
      // Если resend еще не использован - НЕ удаляем данные, даем возможность resend
      return res.status(429).json({
        message: 'Попытки закончились. Можете надіслати код ще раз або почати заново.',
        attemptsExceeded: true,
        canResend: true,
        email: email
      })
    }
    // Сравниваем введенный код с сохраненным в Redis
    if (savedCode !== verificationCode) {
      // При неверном коде увеличиваем счетчик попыток
      const newAttempts = attempts + 1
      
      if (newAttempts >= 3) {
        // Последняя неудачная попытка
        // Если resend уже использован - очищаем данные
        if (resendUsed) {
          await redis.del(`verification:${email}`)
          return res.status(400).json({
            message: 'Попытки закончились. Можете начать регистрацию заново.',
            attemptsLeft: 0,
            shouldClear: true,
            canResend: false,
            email: email
          })
        }
        // Если resend еще не использован - сохраняем данные для resend
        const updatedData = JSON.stringify({ 
          ...registrationData, 
          attempts: newAttempts 
        })
        await redis.setex(`verification:${email}`, 120, updatedData)
        
        return res.status(400).json({
          message: 'Попытки закончились. Можете надіслати код ще раз.',
          attemptsLeft: 0,
          shouldClear: true,
          canResend: true,
          email: email
        })
      }
      
      // Еще есть попытки - сохраняем обновленные данные
      const updatedData = JSON.stringify({ 
        ...registrationData, 
        attempts: newAttempts 
      })
      // Сбрасываем TTL на полные 2 минуты при каждом неверном коде
      await redis.setex(`verification:${email}`, 120, updatedData)
      
      return res.status(400).json({
        message: `Невірний код. Залишилось спроб: ${3 - newAttempts}`,
        attemptsLeft: 3 - newAttempts
      })
    }
    // Если код верен, проверяем не существует ли еще пользователь с таким email
    const existingUser = await User.findOne({email})
    if (existingUser) {
      // Удаляем данные верификации и сообщаем об ошибке
      await redis.del(`verification:${email}`)
      return res.status(400).json({
        message: 'Користувач з таким email вже існує.',
        alreadyExists: true
      })
    }
    // Создаем пользователя после успешной верификации кода
    const newUser = new User({
      name,
      email, 
      password: hashedPassword
    })
    await newUser.save()
    // Очищаем данные верификации из Redis
    await redis.del(`verification:${email}`)
    // Отправляем приветственное письмо новому пользователю
    await sendWelcomeEmail(newUser.email, newUser.name)
    // Генерируем JWT токены для автоматического входа после регистрации
    const {accessToken, refreshToken} = generateTokens(newUser._id)
    // Сохраняем refresh токен в Redis для последующих запросов
    await storeRefreshToken(newUser._id, refreshToken)
    // Устанавливаем HTTP-only куки с токенами
    setCookies(res, accessToken, refreshToken)
    // Возвращаем успешный ответ с данными нового пользователя
    res.json({
      message: 'Регистрация успешно завершена!',
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      },
      registrationComplete: true
    })
  } catch (error) {
    console.log('Error in verifyEmail controller', error.message)
    res.status(500).json({message: error.message})
  }
}

// Контроллер для повторной отправки кода верификации
export const resendVerificationCode = async (req, res) => {
  const { email } = req.body
  
  try {
    // Проверяем существуют ли данные верификации
    const registrationDataRaw = await redis.get(`verification:${email}`)
    if (!registrationDataRaw) {
      return res.status(400).json({
        message: 'Сессия верификации истекла. Начните регистрацию заново.',
        expired: true
      })
    }
    
    // Парсим данные
    const registrationData = JSON.parse(registrationDataRaw)
    const { name, hashedPassword, resendUsed } = registrationData
    
    // Проверяем не использовался ли уже resend
    if (resendUsed) {
      return res.status(400).json({
        message: 'Повторная отправка уже использована. Begin registration again.',
        resendAlreadyUsed: true
      })
    }
    
    // Генерируем новый код
    const verificationCode = generateVerificationCode()
    
    // Создаем обновленные данные с новым кодом и отметкой о resend
    const updatedData = JSON.stringify({
      name,
      hashedPassword,
      verificationCode,
      attempts: 0,
      resendUsed: true
    })
    
    // Сохраняем с полным TTL на 2 минуты
    await redis.setex(`verification:${email}`, 120, updatedData)
    
    // Отправляем новый код
    await sendVerificationEmail(email, verificationCode, name)
    
    res.status(200).json({
      message: 'Новий код надіслано на email. Це остання спроба.',
      codeSent: true,
      resendUsed: true
    })
    
  } catch (error) {
    console.log('Error in resendVerificationCode controller', error.message)
    res.status(500).json({message: error.message})
  }
}

// Контроллер для отправки кода восстановления пароля на email
export const forgotPassword = async (req, res) => {
  const { email } = req.body
  
  try {
    // Проверяем существует ли пользователь с таким email
    const user = await User.findOne({ email })
    if (!user) {
      // По соображениям безопасности не раскрываем, существует ли email в системе
      return res.json({
        message: 'Якщо email існує в системі, код відновлення буде відправлено',
        sent: true
      })
    }
    
    // Проверяем не превышен ли лимит запросов - максимум 3 запроса в час
    const resetRequestsKey = `reset_requests:${email}`
    const requestCount = await redis.get(resetRequestsKey) || 0
    
    if (parseInt(requestCount) >= 3) {
      return res.status(429).json({
        message: 'Забагато спроб відновлення пароля. Спробуйте через годину',
        tooManyRequests: true,
        retryAfter: 3600 // 1 час в секундах
      })
    }
    
    // Генерируем 6-значный код восстановления
    const resetCode = generateVerificationCode()
    
    // Сохраняем код восстановления в Redis на 15 минут с дополнительными данными
    const resetData = {
      email,
      resetCode,
      userId: user._id.toString(),
      attempts: 0,
      createdAt: new Date().toISOString()
    }
    
    await redis.setex(`password_reset:${email}`, 15 * 60, JSON.stringify(resetData)) // 15 минут
    
    // Увеличиваем счетчик запросов на восстановление (сбрасывается через час)
    const newRequestCount = parseInt(requestCount) + 1
    await redis.setex(resetRequestsKey, 60 * 60, newRequestCount) // 1 час
    
    // Отправляем код восстановления на email
    await sendPasswordResetEmail(email, resetCode, user.name)
        
    res.json({
      message: 'Код відновлення пароля відправлено на email',
      sent: true,
      expiresInMinutes: 15
    })
    
  } catch (error) {
    console.log('Error in forgotPassword controller', error.message)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Контроллер для сброса пароля по коду восстановления
export const resetPassword = async (req, res) => {
  const { email, resetCode, newPassword } = req.body
  
  try {
    // Валидация входных данных
    if (!email || !resetCode || !newPassword) {
      return res.status(400).json({
        message: 'Всі поля обов\'язкові: email, код відновлення, новий пароль'
      })
    }
    
    // Проверяем существует ли код восстановления в Redis
    const resetDataRaw = await redis.get(`password_reset:${email}`)
    if (!resetDataRaw) {
      return res.status(400).json({
        message: 'Код відновлення паролю минув або не знайден. Запросіть новий код',
        expired: true
      })
    }
    
    // Парсим данные восстановления
    const resetData = JSON.parse(resetDataRaw)
    const { resetCode: savedCode, userId, attempts } = resetData
    
    // Защита от брут-форс атак - максимум 5 попыток ввода кода
    if (attempts >= 5) {
      // Удаляем данные восстановления при превышении лимита
      await redis.del(`password_reset:${email}`)
      return res.status(429).json({
        message: 'Перевищено кількість спроб. Запросіть новий код відновлення',
        attemptsExceeded: true
      })
    }
    
    // Проверяем правильность кода восстановления
    if (savedCode !== resetCode) {
      // При неверном коде увеличиваем счетчик попыток
      const updatedData = JSON.stringify({ 
        ...resetData, 
        attempts: attempts + 1 
      })
      
      // Получаем оставшееся время жизни ключа и сохраняем обновленные данные
      const ttl = await redis.ttl(`password_reset:${email}`)
      await redis.setex(`password_reset:${email}`, ttl, updatedData)
      
      return res.status(400).json({
        message: `Невірний код відновлення. Залишилось спроб: ${4 - attempts}`,
        attemptsLeft: 4 - attempts
      })
    }
    
    // Проверяем существует ли пользователь
    const user = await User.findById(userId)
    if (!user) {
      await redis.del(`password_reset:${email}`)
      return res.status(404).json({
        message: 'Користувач не знайдений'
      })
    }
    
    // Хешируем новый пароль
    const hashedNewPassword = await bcrypt.hash(newPassword, 10)
    
    // Обновляем пароль в базе данных
    await User.findByIdAndUpdate(userId, {
      password: hashedNewPassword,
      lastPasswordChange: new Date()
    })
    
    // Удаляем использованный код восстановления из Redis
    await redis.del(`password_reset:${email}`)
    
    // Сбрасываем счетчик запросов на восстановление
    await redis.del(`reset_requests:${email}`)
    
    // инвалидируем все активные refresh токены пользователя
    await redis.del(`refresh_token:${userId}`)
        
    res.json({
      message: 'Пароль успішно змінено. Увійдіть з новим паролем',
      passwordChanged: true
    })
    
  } catch (error) {
    console.log('Error in resetPassword controller', error.message)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}
