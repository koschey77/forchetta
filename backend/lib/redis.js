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
