import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { setServers } from 'node:dns/promises';

// Подключаем модели
import Product from '../models/product.model.js';
import User from '../models/user.model.js';

// DNS настройка для корректного подключения к Atlas
setServers(['1.1.1.1', '8.8.8.8']);

// Загружаем .env из корня проекта (скрипт предполагает запуск из корня)
dotenv.config({ path: '.env' });

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

const migrateDB = async () => {
  if (!MONGODB_URI) {
    console.error('❌ ОШИБКА: Не найдена MONGO_URI или MONGODB_URI в файле .env');
    process.exit(1);
  }

  try {
    console.log('⏳ Подключение к базе данных...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Подключено к MongoDB');

    // 1. Миграция товаров: добавляем salesCount всем, у кого его нет
    console.log('🔄 Обновление коллекции Products...');
    const productsResult = await Product.updateMany(
      { salesCount: { $exists: false } }, 
      { $set: { salesCount: 0 } }
    );
    console.log(`✅ Товаров обновлено: ${productsResult.modifiedCount}`);

    // 2. Миграция пользователей: добавляем isActive, bonusPoints и массивы
    console.log('🔄 Обновление коллекции Users...');
    const usersResult = await User.updateMany(
      { isActive: { $exists: false } }, 
      { $set: { 
          isActive: true, 
          bonusPoints: 0, 
          favorites: [], 
          addresses: [], 
          orders: [] 
        } 
      }
    );
    console.log(`✅ Пользователей обновлено: ${usersResult.modifiedCount}`);

    console.log('🎉 Миграция успешно завершена!');
  } catch (error) {
    console.error('❌ Ошибка миграции:', error.message);
    process.exit(1);
  } finally {
    // ВАЖНО: Закрываем соединение после выполнения
    await mongoose.connection.close();
    console.log('🔌 Соединение с MongoDB закрыто');
  }
};

migrateDB();
