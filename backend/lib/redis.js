import Redis from 'ioredis'
import dotenv from 'dotenv'

dotenv.config()

// Создаем Redis клиент с дополнительными опциями для connect-redis v9
export const redis = new Redis(process.env.UPSTASH_REDIS_URL, {
  // Опции для совместимости с connect-redis v9
  lazyConnect: true,
  maxRetriesPerRequest: 3,
  retryDelayOnFault: 100,
  // Отключаем автоматический select database для connect-redis
  enableAutoPipelining: false
})

// Обработка ошибок Redis для диагностики
redis.on('error', (err) => {
  console.error('❌ Redis connection error:', err.message)
})

redis.on('connect', () => {
  console.log('✅ Redis connected successfully')
})

redis.on('ready', () => {
  console.log('✅ Redis ready for commands')
})
