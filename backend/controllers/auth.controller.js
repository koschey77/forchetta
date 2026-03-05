import {redis} from '../lib/redis.js'
import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { generateVerificationCode, sendVerificationEmail, sendWelcomeEmail } from '../lib/email.service.js'

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
      return res.status(400).json({message: 'Пользователь с таким email уже зарегистрирован'})
    }
    // Проверяем нет ли уже процесса верификации для этого email
    const existingVerification = await redis.get(`verification:${email}`)
    if (existingVerification) {
      return res.status(400).json({
        message: 'Код верификации уже отправлен. Проверьте почту или запросите новый код',
        canResendAfter: 15 * 60 * 1000 // 15 минут до возможности повторной отправки
      })
    }
    // Генерируем 6-значный код верификации
    const verificationCode = generateVerificationCode()
    // Хешируем пароль для сохранения в Redis
    const hashedPassword = await bcrypt.hash(password, 10)
    // Сохраняем в Redis данные для создания пользователя + код верификации
    const registrationData = JSON.stringify({
      name,
      email, 
      hashedPassword,
      verificationCode,
      attempts: 0, // Счетчик попыток ввода кода
      createdAt: new Date().toISOString() // Для отслеживания времени создания
    })
    // Сохраняем данные регистрации в Redis с TTL 15 минут
    await redis.setex(`verification:${email}`, 15 * 60, registrationData)
    
    // Отправляем код верификации на email через Gmail
    await sendVerificationEmail(email, verificationCode, name)
    
    res.status(200).json({
      message: 'Код подтверждения отправлен на email. Подтвердите email для завершения регистрации',
      email: email,
      needsVerification: true,
      expiresInMinutes: 15
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

// Контроллер для подтверждения email кодом (создание пользователя в MongoDB)
export const verifyEmail = async (req, res) => {
  try {
    const { email, verificationCode } = req.body
    // Извлекаем данные регистрации из Redis
    const registrationDataRaw = await redis.get(`verification:${email}`)
    if (!registrationDataRaw) {
      return res.status(400).json({
        message: 'Код верификации истек или не найден. Попробуйте зарегистрироваться заново',
        expired: true
      })
    }
    // Парсим данные регистрации из Redis
    const registrationData = JSON.parse(registrationDataRaw)
    const { name, hashedPassword, verificationCode: savedCode, attempts } = registrationData
    // Защита от брут-форс атак - максимум 5 попыток ввода кода
    if (attempts >= 5) {
      // Удаляем данные регистрации при превышении лимита
      await redis.del(`verification:${email}`)
      return res.status(429).json({
        message: 'Превышено количество попыток. Попробуйте зарегистрироваться заново',
        attemptsExceeded: true
      })
    }
    // Сравниваем введенный код с сохраненным в Redis
    if (savedCode !== verificationCode) {
      // При неверном коде увеличиваем счетчик попыток
      const updatedData = JSON.stringify({ 
        ...registrationData, 
        attempts: attempts + 1 
      })
      // Получаем оставшееся время жизни ключа и сохраняем обновленные данные
      const ttl = await redis.ttl(`verification:${email}`)
      await redis.setex(`verification:${email}`, ttl, updatedData)
      
      return res.status(400).json({
        message: `Неверный код подтверждения. Осталось попыток: ${4 - attempts}`,
        attemptsLeft: 4 - attempts
      })
    }
    // Если код верен, проверяем не существует ли еще пользователь с таким email
    const existingUser = await User.findOne({email})
    if (existingUser) {
      // Удаляем данные верификации и сообщаем об ошибке
      await redis.del(`verification:${email}`)
      return res.status(400).json({
        message: 'Пользователь с таким email уже существует',
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
// Контроллер для повторной отправки кода верификации (для незавершенных регистраций)
export const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body
    // Проверяем нет ли уже полностью зарегистрированного пользователя с таким email
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        message: 'Пользователь с таким email уже зарегистрирован. Используйте вход в систему.',
        shouldLogin: true
      })
    }
    // Проверяем есть ли незавершенная регистрация в Redis
    const existingRegistration = await redis.get(`verification:${email}`)
    if (!existingRegistration) {
      return res.status(404).json({
        message: 'Не найдено незавершенной регистрации. Попробуйте зарегистрироваться заново.',
        shouldSignup: true
      })
    }
    // Парсим существующие данные регистрации
    const registrationData = JSON.parse(existingRegistration)
    const { name, hashedPassword } = registrationData
    // Генерируем новый 6-значный код верификации
    const newVerificationCode = generateVerificationCode()
    // Обновляем данные регистрации с новым кодом
    // Важно: сбрасываем счетчик попыток к нулю при повторной отправке
    const updatedRegistrationData = JSON.stringify({
      name,
      email, 
      hashedPassword, // ✅ Используем уже захешированный пароль
      verificationCode: newVerificationCode,
      attempts: 0, // Обнуляем количество попыток при новом коде
      createdAt: new Date().toISOString()
    })
    // Перезаписываем данные в Redis с новым кодом и обновленным TTL (15 минут)
    await redis.setex(`verification:${email}`, 15 * 60, updatedRegistrationData)
    
    // Отправляем новый код верификации на email через Gmail
    await sendVerificationEmail(email, newVerificationCode, name)
    
    // Возвращаем подтверждение успешной отправки
    res.json({
      message: 'Новый код верификации отправлен на email',
      expiresInMinutes: 15
    })
  } catch (error) {
    console.log('Error in resendVerificationCode controller', error.message)
    res.status(500).json({message: error.message})
  }
}
