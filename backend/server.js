import dotenv from 'dotenv'
dotenv.config()
import path from "path"

import express from 'express'
import cookieParser from 'cookie-parser'
import session from 'express-session'
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
  // Используем MemoryStore для OAuth процесса (10 минут)
  store: undefined,
  secret: process.env.SESSION_SECRET || 'fallback-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  name: 'forchetta.sid',
  cookie: {
    maxAge: 10 * 60 * 1000, // 10 минут для OAuth
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
