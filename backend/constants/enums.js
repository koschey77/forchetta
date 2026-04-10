//  BACKEND константы enum значений  
// ВАЖНО: Синхронизировать с frontend/src/constants/enums.js

export const PRODUCT_ENUMS = {
  // Сроки хранения (обязательное поле)
  shelfLife: ["36 годин", "2 доби", "3 доби", "4 доби", "5 діб", "14 діб", "21 доба", "1 місяць", "6 місяців"],

  // Условия хранения (обязательное поле)
  storageConditions: ["від +2°C до +6°C", "до +20°C"],
}

export const ORDER_ENUMS = {
  status: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
  paymentMethod: ['card', 'cash'],
  paymentStatus: ['pending', 'paid', 'failed']
}

export default PRODUCT_ENUMS