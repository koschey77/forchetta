/**
 * Конфигурация Passport.js для Google OAuth 2.0 аутентификации
 * 
 * Этот файл настраивает стратегию для аутентификации через Google.
 * Passport.js - это middleware для аутентификации в Node.js приложениях.
 */

import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.model.js';

// Загружаем переменные окружения в этом модуле
dotenv.config();

/**
 * Настройка Google OAuth 2.0 стратегии
 * 
 * Когда пользователь нажимает "Войти через Google":
 * 1. Перенаправляется на Google для аутентификации
 * 2. Google возвращает профиль пользователя в эту функцию
 * 3. Мы ищем или создаем пользователя в нашей базе данных
 * 4. Возвращаем пользователя для дальнейшей обработки
 */
passport.use(new GoogleStrategy({
  // Данные из Google Cloud Console
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  // URL куда Google перенаправит после аутентификации
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
/**
 * Функция обработки Google OAuth ответа
 * 
 * @param {string} accessToken - Токен доступа к Google API (не используется в нашем случае)
 * @param {string} refreshToken - Токен обновления (не используется в нашем случае) 
 * @param {Object} profile - Профиль пользователя от Google
 * @param {Function} done - Callback функция для завершения процесса
 */
async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('📊 Google OAuth profile received:', {
      id: profile.id,
      email: profile.emails[0]?.value,
      name: profile.displayName
    });

    // Ищем пользователя в нашей базе данных по Google ID
    let user = await User.findOne({ googleId: profile.id });
    
    if (user) {
      // ✅ Пользователь найден - возвращаем его
      console.log('✅ Existing Google user found:', user.email);
      return done(null, user);
    }
    
    // Проверяем, есть ли пользователь с таким же email (зарегистрированный обычным способом)
    const existingEmailUser = await User.findOne({ 
      email: profile.emails[0]?.value 
    });
    
    if (existingEmailUser) {
      // 🔗 Связываем существующий аккаунт с Google ID
      existingEmailUser.googleId = profile.id;
      await existingEmailUser.save();
      console.log('🔗 Linked existing email account with Google:', existingEmailUser.email);
      return done(null, existingEmailUser);
    }
    
    // 🆕 Создаем нового пользователя из Google профиля
    const newUser = new User({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0]?.value,
      // Для Google OAuth пользователей пароль не нужен
      password: null,
      // Google пользователи автоматически верифицированы
      isVerified: true,
      // Сохраняем дополнительную информацию  
      avatar: profile.photos[0]?.value
    });
    
    await newUser.save();
    console.log('🆕 New Google user created:', newUser.email);
    
    return done(null, newUser);
    
  } catch (error) {
    console.error('❌ Google OAuth error:', error);
    return done(error, null);
  }
}));

/**
 * Сериализация пользователя для сессии
 * 
 * Passport вызывает это когда нужно сохранить пользователя в сессию.
 * Мы сохраняем только ID пользователя для экономии памяти.
 * 
 * @param {Object} user - Объект пользователя из базы данных
 * @param {Function} done - Callback функция
 */
passport.serializeUser((user, done) => {
  done(null, user._id);
});

/**
 * Десериализация пользователя из сессии
 * 
 * Passport вызывает это когда нужно восстановить пользователя из сессии.
 * По ID ищем полного пользователя в базе данных.
 * 
 * @param {string} id - ID пользователя из сессии
 * @param {Function} done - Callback функция
 */
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.error('❌ Deserialize error:', error);
    done(error, null);
  }
});

export default passport;