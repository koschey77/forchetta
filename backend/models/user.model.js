import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      // Пароль необязателен для Google OAuth пользователей
      required: function() {
        return !this.googleId; // Требуется только если нет Google ID
      },
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    // Google OAuth ID для связи с аккаунтом Google
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Позволяет null/undefined значения быть уникальными
    },
    // Ссылка на аватар пользователя (из Google или загруженный)
    avatar: {
      type: String,
      default: null,
    },
    // Статус верификации email (Google пользователи автоматически верифицированы)
    isVerified: {
      type: Boolean,
      default: false,
    },
    // Флаг отправки welcome email для Google OAuth пользователей
    googleWelcomeEmailSent: {
      type: Boolean,
      default: false,
    },
    cartItems: [
      {
        quantity: {
          type: Number,
          default: 1,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
      },
    ],
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
  },
  {
    timestamps: true,
  },
)

// Pre-save хук для хеширования пароля перед сохранением в базу данных
// Умный хук: проверяет не захеширован ли уже пароль, чтобы избежать двойного хеширования
// Для Google OAuth пользователей пароль может отсутствовать
userSchema.pre('save', async function (next) {
  // Если пароль не изменился или отсутствует (Google OAuth), пропускаем хеширование
  if (!this.isModified('password') || !this.password) return next()

  // Проверяем не захеширован ли уже пароль (bcrypt хеши начинаются с $2a$, $2b$ или $2y$)
  if (this.password.startsWith('$2')) {
    console.log('Password already hashed, skipping hash step for user:', this.email)
    return next() // Если пароль уже захеширован, пропускаем хеширование
  }

  try {
    console.log('Hashing password for user:', this.email)
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Функция проверки вводимого пароля с хэшированным паролем из БД при входе пользователя
// Для Google OAuth пользователей (без пароля) всегда возвращает false
userSchema.methods.comparePassword = async function (password) {
  // Если у пользователя нет пароля (Google OAuth), сравнение невозможно
  if (!this.password) {
    return false;
  }
  return bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', userSchema)

export default User
