import Redis from 'ioredis'
import dotenv from 'dotenv'

dotenv.config()

// Создаем Redis клиент для хранения refresh токенов
export const redis = new Redis(process.env.UPSTASH_REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: 3,
  retryDelayOnFault: 100,
  enableAutoPipelining: false
})
