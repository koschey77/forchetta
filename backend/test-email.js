import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

import { sendOrderConfirmationEmail } from './lib/email.service.js';

const mockOrder = {
  _id: '66100abcdef1234567890123',
  items: [
    { nameAtPurchase: 'Торт "Наполеон"', quantity: 2, priceAtPurchase: 450, image: 'https://res.cloudinary.com/demo/image/upload/sample.jpg' },
    { nameAtPurchase: 'Подарункове пакування', quantity: 1, priceAtPurchase: 50 }
  ],
  totalPrice: 900,
  bonusUsed: 50,
  bonusEarned: 45,
  shippingAddress: { city: 'Київ', street: 'Хрещатик', house: '1', apartment: '2' },
  contactPhone: '+380991234567',
  paymentMethod: 'card',
  paymentStatus: 'paid'
};

const run = async () => {
    // Вставьте свою реальную почту для теста
  await sendOrderConfirmationEmail('kjltv1@gmail.com', 'Роман Косолапов', mockOrder);
  console.log("Тестовое письмо запущено!");
};

run();