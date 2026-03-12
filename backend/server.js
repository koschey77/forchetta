import dotenv from 'dotenv'
dotenv.config()
import path from "path"

import express from 'express'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import { RedisStore } from 'connect-redis'
import passport from './config/passport.config.js'
import { redis } from './lib/redis.js'

import authRoutes from './routes/auth.route.js'
import {connectDB} from './lib/db.js'

const app = express()
const PORT = process.env.PORT || 5000

const __dirname = path.resolve()

// Базовый middleware для парсинга JSON и куки 
app.use(express.json({ limit: '10mb' }))
app.use(cookieParser())

// CORS настройки для продакшена
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1) // Trust Railway proxy
}

app.use(session({
  // Используем Redis для хранения сессий в продакшене
  store: process.env.NODE_ENV === 'production' ? new RedisStore({
    client: redis,
    prefix: "forchetta:sess:",
    ttl: 600, // 10 минут в секундах
  }) : undefined,
  // Секретный ключ для подписи сессии (в продакшене должен быть в переменных окружения)
  secret: process.env.SESSION_SECRET || 'fallback-secret-key-change-in-production',
  // Не пересохранять сессию если она не изменилась
  resave: false,
  // Не сохранять неинициализированные сессии  
  saveUninitialized: false,
  name: 'forchetta.sid', // Уникальное имя для Railway
  cookie: {
    // Время жизни сессии (только для OAuth процесса)
    maxAge: 10 * 60 * 1000, // 10 минут - достаточно для завершения OAuth
    // В продакшене требуется HTTPS
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'none'
  }
}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/api/auth', authRoutes)

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
  })
}

app.listen(PORT, () => {
  const url = process.env.NODE_ENV === 'production' 
    ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN || 'your-app.railway.app'}` 
    : `http://localhost:${PORT}`;
  console.log(`🚀 Server is running on ${url}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  connectDB()
})
