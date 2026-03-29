/**
 * Миграция: Очистка модели Product от лишних полей
 * Удаляет: likes, likesCount, salesCount
 * 
 * Запуск: node migrations/cleanup-products.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {setServers} from 'node:dns/promises';

// DNS настройка для корректного подключения к Atlas
setServers(['1.1.1.1', '8.8.8.8']);

// Загружаем .env из корня проекта
dotenv.config({ path: '.env' });

// Получаем строку подключения из .env
const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ ОШИБКА: Не найдена MONGO_URI или MONGODB_URI в файле .env');
  console.error('👉 Создайте файл .env и добавьте строку подключения к Atlas');
  process.exit(1);
}

async function cleanupProducts() {
  try {
    // Подключаемся к BD
    console.log('🔄 Подключение к MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Подключение успешно');

    // Получаем коллекцию products
    const db = mongoose.connection.db;
    const collection = db.collection('products');

    // Проверяем сколько документов с лишними полями
    const documentsWithExtraFields = await collection.countDocuments({
      $or: [
        { likes: { $exists: true } },
        { likesCount: { $exists: true } },
        { salesCount: { $exists: true } }
      ]
    });

    console.log(`📊 Найдено ${documentsWithExtraFields} документов с лишними полями`);

    if (documentsWithExtraFields === 0) {
      console.log('✅ Все продукты уже очищены!');
      return;
    }

    // Удаляем лишние поля из всех продуктов
    console.log('🧹 Удаление лишних полей...');
    
    const result = await collection.updateMany(
      {}, // Все документы
      { 
        $unset: { 
          likes: "",
          likesCount: "",
          salesCount: ""
        } 
      }
    );

    console.log(`✅ Обновлено документов: ${result.modifiedCount}`);
    console.log(`📋 Совпадений найдено: ${result.matchedCount}`);

    // Проверяем результат
    const remainingDirtyDocs = await collection.countDocuments({
      $or: [
        { likes: { $exists: true } },
        { likesCount: { $exists: true } },
        { salesCount: { $exists: true } }
      ]
    });

    if (remainingDirtyDocs === 0) {
      console.log('🎉 Миграция завершена успешно! Все лишние поля удалены.');
    } else {
      console.log(`⚠️ Остались документы с лишними полями: ${remainingDirtyDocs}`);
    }

  } catch (error) {
    console.error('❌ Ошибка миграции:', error);
  } finally {
    // Закрываем соединение
    await mongoose.connection.close();
    console.log('🔌 Соединение с MongoDB закрыто');
  }
}

// Запускаем миграцию
cleanupProducts();