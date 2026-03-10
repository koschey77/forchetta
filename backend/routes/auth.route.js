import express from 'express'
import {login, logout, signup, refreshToken, getProfile, verifyEmail, resendVerificationCode, forgotPassword, resetPassword, googleAuthCallback, googleAuthFailure} from '../controllers/auth.controller.js'
import {protectRoute} from '../middleware/auth.middleware.js'
import passport from '../config/passport.config.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)
router.post('/refresh-token', refreshToken)
router.get('/profile', protectRoute, getProfile)

router.post('/verify-email', verifyEmail)
router.post('/resend-verification-code', resendVerificationCode)

// Роуты для восстановления пароля
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

/**
 * Google OAuth 2.0 роуты
 * 
 * Эти роуты обрабатывают аутентификацию через Google:
 * 1. /auth/google - перенаправляет пользователя на Google для авторизации
 * 2. /auth/google/callback - обрабатывает ответ от Google после авторизации  
 * 3. /auth/google/failure - обрабатывает неуспешную авторизацию
 */

// Инициация Google OAuth процесса
// GET /auth/google - пользователь переходит по этой ссылке для входа через Google
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'] // Запрашиваем доступ к профилю и email
  })
);

// Обработка callback от Google после аутентификации
// GET /auth/google/callback - Google перенаправляет сюда после авторизации
router.get('/google/callback',
  // Passport middleware обрабатывает OAuth ответ
  passport.authenticate('google', { 
    failureRedirect: '/auth/google/failure', // Куда перенаправить при ошибке
    session: false // Не используем сессии, используем JWT токены
  }),
  // Если аутентификация успешна, вызывается наш контроллер
  googleAuthCallback
);

// Роут для обработки неуспешной Google аутентификации
// GET /auth/google/failure - сюда попадаем при ошибке или отмене
router.get('/google/failure', googleAuthFailure);

export default router
