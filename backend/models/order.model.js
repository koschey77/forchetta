import mongoose from "mongoose"
import { ORDER_ENUMS } from "../constants/enums.js"

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { 
      type: String, 
      required: true, 
      unique: true 
    }, // Уникальный красивый номер ORD-10042
    
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    
    status: { 
      type: String, 
      enum: ORDER_ENUMS.status, 
      default: 'pending' 
    },
    
    // Снапшот товаров: чтобы изменения прайса в будущем не ломали старые заказы
    items: [
      {
        product: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'Product', 
          required: true 
        },
        quantity: { 
          type: Number, 
          required: true, 
          min: 1 
        },
        priceAtPurchase: { 
          type: Number, 
          required: true 
        },
        nameAtPurchase: { 
          type: String,
          required: true
        }
      }
    ],
    
    totalAmount: { 
      type: Number, 
      required: true 
    }, // Итоговая сумма
    
    appliedBonuses: { 
      type: Number, 
      default: 0 
    }, // Списанные бонусы
    
    earnedBonuses: { 
      type: Number, 
      default: 0 
    }, // Начисленные бонусы по завершению
    
    paymentMethod: { 
      type: String, 
      enum: ORDER_ENUMS.paymentMethod, 
      default: 'cash' 
    },
    
    paymentStatus: { 
      type: String, 
      enum: ORDER_ENUMS.paymentStatus, 
      default: 'pending' 
    },
    
    // Снапшот адреса
    shippingAddress: {
      region: { type: String, required: true },
      city: { type: String, required: true },
      street: { type: String, required: true },
      postalCode: { type: String, required: true },
      apartment: { type: String },
    },
    
    contactPhone: { 
      type: String, 
      required: true 
    },
    
    userNotes: { 
      type: String,
      trim: true
    } // Заметки пользователя к заказу
  },
  { 
    timestamps: true 
  }
)

const Order = mongoose.model("Order", orderSchema)

export default Order