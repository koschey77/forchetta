import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import passport from './config/passport.config.js'

import authRoutes from './routes/auth.route.js'
import {connectDB} from './lib/db.js'

const app = express()
const PORT = process.env.PORT || 5000

// Базовый middleware для парсинга JSON и куки
app.use(express.json())
app.use(cookieParser())

app.use(session({
  // Секретный ключ для подписи сессии (в продакшене должен быть в переменных окружения)
  secret: process.env.SESSION_SECRET || 'fallback-secret-key-change-in-production',
  // Не пересохранять сессию если она не изменилась
  resave: false,
  // Не сохранять неинициализированные сессии  
  saveUninitialized: false,
  cookie: {
    // Время жизни сессии (только для OAuth процесса)
    maxAge: 10 * 60 * 1000, // 10 минут - достаточно для завершения OAuth
    // В продакшене требуется HTTPS
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true
  }
}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
  console.log('Server is running on http://localhost:' + PORT)
  connectDB()
})
