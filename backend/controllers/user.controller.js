import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import { uploadImages, deleteImage } from "../lib/imageService.js";
import { redis } from "../lib/redis.js";

// @route   GET /api/user/profile
// @desc    Получить профиль пользователя
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("favorites", "name price discountPrice weight oldPrice images") // Подгружаем избранные товары
      .select("-password");

    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    res.json(user);
  } catch (error) {
    console.error("Помилка в getProfile:", error.message);
    res.status(500).json({ message: "Помилка сервера", error: error.message });
  }
};

// @route   PUT /api/user/profile
// @desc    Оновить профиль пользователя (имя, телефон, аватар)
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    // Если есть новый аватар формата base64, загружаем на Cloudinary в папку forchetta/avatars
    if (avatar && avatar.startsWith("data:image")) {
      // Можно опционально удалять старый аватар из клаудинари, если он не из гугла и содержит public_id,
      // но пока просто загрузим новый и сохраним secure_url
      const uploadedImages = await uploadImages([avatar], "forchetta/avatars");
      if (uploadedImages && uploadedImages.length > 0) {
        user.avatar = uploadedImages[0].url; // Сохраняем URL
      }
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone; // Позволяет очистить телефон передав пустую строку

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
    });
  } catch (error) {
    console.error("Помилка в updateProfile:", error.message);
    res.status(500).json({ message: "Помилка сервера", error: error.message });
  }
};

// @route   DELETE /api/user/profile
// @desc    Мягкое удаление профиля (анонимизация) або фізичне видалення (якщо немає замовлень)
// @access  Private
export const deleteProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    // Очищаем куки
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    
    // Удаляем сессию (refresh token) и корзину пользователя из Redis
    await redis.del(`refresh_token:${user._id}`);
    await redis.del(`cart:${user._id}`);

    // Перевіряємо, чи є у користувача замовлення
    const hasOrders = user.orders && user.orders.length > 0;

    if (!hasOrders) {
      // Якщо замовлень немає - фізично видаляємо з бази даних
      await User.findByIdAndDelete(user._id);
      return res.json({ message: "Акаунт успішно видалено повністю" });
    }

    // Якщо замовлення є - робимо м'яке видалення (щоб не зламати статистику)
    // Форматируем дату в DDMMYYYY для понятного префикса (напр. 12042026)
    const date = new Date();
    const formattedDate = ('0' + date.getDate()).slice(-2) + ('0' + (date.getMonth() + 1)).slice(-2) + date.getFullYear();
    const timestamp = Date.now(); // Додаємо timestamp для гарантованої унікальності

    // Мягкое удаление и анонимизация (освобождаем email для повторной регистрации)
    user.isActive = false;
    user.email = `deleted_${formattedDate}_${timestamp}_${user.email}`;
    user.name = "Видалений користувач";
    user.phone = "";
    user.avatar = "";
    user.addresses = [];
    user.favorites = [];
    
    // ВАЖЛИВО! Відв'язуємо акаунт від Google, щоб користувач міг знову зареєструватися 
    if (user.googleId) {
      user.googleId = undefined;
      // Якщо це був користувач ТІЛЬКИ через Google (без пароля), треба додати фейковий пароль, 
      // інакше Mongoose-модель видасть помилку валідації "Password is required"
      if (!user.password) {
        user.password = `DELETED_${timestamp}_NO_PASSWORD`;
      }
    }
    
    await user.save();

    res.json({ message: "Акаунт успішно видалено (анонімізовано)" });
  } catch (error) {
    console.error("Помилка в deleteProfile:", error.message);
    res.status(500).json({ message: "Помилка сервера", error: error.message });
  }
};

// @route   POST /api/user/addresses
// @desc    Добавить новый адрес
// @access  Private
export const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    const newAddress = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      region: req.body.region,
      city: req.body.city,
      street: req.body.street,
      house: req.body.house,
      apartment: req.body.apartment,
      postalCode: req.body.postalCode,
      isDefault: req.body.isDefault || false,
    };

    // Если новый адрес помечен как по умолчанию, убираем этот флаг у остальных
    if (newAddress.isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    // Если это первый адрес, делаем его по умолчанию
    if (user.addresses.length === 0) {
      newAddress.isDefault = true;
    }

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json(user.addresses);
  } catch (error) {
    console.error("Помилка в addAddress:", error.message);
    res.status(500).json({ message: "Помилка сервера", error: error.message });
  }
};

// @route   DELETE /api/user/addresses/:id
// @desc    Удалить адрес
// @access  Private
export const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    const addressIndex = user.addresses.findIndex(
      (addr) => addr._id.toString() === req.params.id
    );

    if (addressIndex === -1) {
      return res.status(404).json({ message: "Адресу не знайдено" });
    }

    const isDeletedAddressDefault = user.addresses[addressIndex].isDefault;

    user.addresses.splice(addressIndex, 1);

    // Если удалили адрес по умолчанию и остались еще адреса, делаем первый адрес по умолчанию
    if (isDeletedAddressDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.json(user.addresses);
  } catch (error) {
    console.error("Помилка в deleteAddress:", error.message);
    res.status(500).json({ message: "Помилка сервера", error: error.message });
  }
};

// @route   PUT /api/user/addresses/:id
// @desc    Обновить адрес
// @access  Private
export const updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    const addressIndex = user.addresses.findIndex(
      (addr) => addr._id.toString() === req.params.id
    );

    if (addressIndex === -1) {
      return res.status(404).json({ message: "Адресу не знайдено" });
    }

    if (req.body.isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    user.addresses[addressIndex] = {
      ...user.addresses[addressIndex].toObject(),
      ...req.body,
      _id: user.addresses[addressIndex]._id
    };

    await user.save();
    res.json(user.addresses);
  } catch (error) {
    console.error("Помилка в updateAddress:", error.message);
    res.status(500).json({ message: "Помилка сервера", error: error.message });
  }
};

// @route   PUT /api/user/addresses/:id/default
// @desc    Сделать адрес основным
// @access  Private
export const setDefaultAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    const addressIndex = user.addresses.findIndex(
      (addr) => addr._id.toString() === req.params.id
    );

    if (addressIndex === -1) {
      return res.status(404).json({ message: "Адресу не знайдено" });
    }

    user.addresses.forEach((addr) => {
      addr.isDefault = false;
    });

    user.addresses[addressIndex].isDefault = true;

    await user.save();
    res.json(user.addresses);
  } catch (error) {
    console.error("Помилка в setDefaultAddress:", error.message);
    res.status(500).json({ message: "Помилка сервера", error: error.message });
  }
};

// @route   POST /api/user/favorites/:productId
// @desc    Добавить/удалить товар из избранного (тоггл)
// @access  Private
export const toggleFavorite = async (req, res) => {
  try {
    const { productId } = req.params;

    const authUser = await User.findById(req.user._id);

    if (!authUser) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Товар не знайдено" });
    }

    const isFavorite = authUser.favorites.includes(productId);

    if (isFavorite) {
      // Удаляем из избранного
      authUser.favorites = authUser.favorites.filter(
        (id) => id.toString() !== productId
      );
    } else {
      // Добавляем в избранное
      authUser.favorites.push(productId);
    }

    await authUser.save();

    // Возвращаем обновленный список избранных
    const updatedUser = await User.findById(req.user._id).populate(
      "favorites",
      "name price discountPrice weight oldPrice images"
    );

    res.json(updatedUser.favorites);
  } catch (error) {
    console.error("Помилка в toggleFavorite:", error.message);
    res.status(500).json({ message: "Помилка сервера", error: error.message });
  }
};

// ==============================================================
//                    АДМІНСЬКІ КОНТРОЛЕРИ
// ==============================================================

// @route   GET /api/users
// @desc    Отримати всіх користувачів (для адмін-панелі)
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    let matchStage = {};
    if (search) {
      matchStage = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const sortStage = {};
    if (sortBy === 'name') sortStage['name'] = sortOrder;
    else if (sortBy === 'ordersCount') sortStage['ordersCount'] = sortOrder;
    else if (sortBy === 'totalSpent') sortStage['totalSpent'] = sortOrder;
    else if (sortBy === 'bonusPoints') sortStage['bonusPoints'] = sortOrder;
    else sortStage['createdAt'] = sortOrder;

    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'user',
          as: 'orderDocs'
        }
      },
      {
        $addFields: {
          totalSpent: { $sum: '$orderDocs.totalAmount' },
          ordersCount: { $size: '$orderDocs' },
          totalItemsBought: {
            $sum: {
              $map: {
                input: '$orderDocs',
                as: 'order',
                in: { $sum: '$$order.items.quantity' }
              }
            }
          }
        }
      },
      {
        $project: {
          password: 0,
          __v: 0,
          orderDocs: 0 
        }
      },
      { $sort: sortStage },
      {
        $facet: {
          metadata: [{ $count: 'total' }, { $addFields: { page } }],
          data: [{ $skip: skip }, { $limit: limit }]
        }
      }
    ];

    const result = await User.aggregate(pipeline);
    
    const users = result[0].data;
    const total = result[0].metadata[0] ? result[0].metadata[0].total : 0;
    const totalPages = Math.ceil(total / limit);

    res.json({
      users,
      total,
      pages: totalPages,
      currentPage: page
    });
  } catch (error) {
    console.error("Помилка в getAllUsers:", error.message);
    res.status(500).json({ message: "Помилка сервера", error: error.message });
  }
};

// @route   GET /api/users/:id
// @desc    Отримати користувача за ID
// @access  Private/Admin
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("favorites", "name price images");

    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    res.json(user);
  } catch (error) {
    console.error("Помилка в getUserById:", error.message);
    res.status(500).json({ message: "Помилка сервера", error: error.message });
  }
};

// @route   POST /api/users
// @desc    Створити нового користувача (через адмінку)
// @access  Private/Admin
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, isActive } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Користувач з таким email вже існує" });
    }

    const user = await User.create({
      name,
      email,
      password, // Mongoose middleware automatically hashes it
      role: role || "customer",
      phone: phone || "",
      isActive: isActive !== undefined ? isActive : true
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive
      });
    } else {
      res.status(400).json({ message: "Неправильні дані для користувача" });
    }
  } catch (error) {
    console.error("Помилка в createUser:", error.message);
    res.status(500).json({ message: "Помилка сервера", error: error.message });
  }
};

// @route   PUT /api/users/:id
// @desc    Оновити користувача (для адміна - повне редагування)
// @access  Private/Admin
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.role = req.body.role || user.role;
    user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;
    
    // Админ также может управлять бонусами
    if (req.body.bonusPoints !== undefined) {
      user.bonusPoints = req.body.bonusPoints;
    }

    if (req.body.password) {
      // Это сработает, потому что у нас есть pre-save middleware
      user.password = req.body.password;
    }

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      bonusPoints: user.bonusPoints,
      isActive: user.isActive
    });
  } catch (error) {
    console.error("Помилка в updateUser:", error.message);
    res.status(500).json({ message: "Помилка сервера", error: error.message });
  }
};

// @route   PATCH /api/users/:id/role
// @desc    Змінити роль користувача
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
  try {
    if (!req.user.isSuperadmin) {
      return res.status(403).json({ message: "Доступ заборонено. Тільки для Головного адміністратора." });
    }

    const { role } = req.body;
    
    // Захист від зняття прав з самого себе
    if (req.user._id.toString() === req.params.id && role !== "admin") {
      return res.status(400).json({ message: "Ви не можете забрати права адміністратора у самого себе" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    user.role = role || user.role;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
  } catch (error) {
    console.error("Помилка в updateUserRole:", error.message);
    res.status(500).json({ message: "Помилка сервера", error: error.message });
  }
};

// @route   PATCH /api/users/:id/status
// @desc    Заблокувати/розблокувати користувача (soft delete)
// @access  Private/Admin
export const toggleUserStatus = async (req, res) => {
  try {
    if (!req.user.isSuperadmin) {
      return res.status(403).json({ message: "Доступ заборонено. Тільки для Головного адміністратора." });
    }

    const user = await User.findById(req.params.id);

    // Захист від самоблокування
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: "Ви не можете заблокувати власний обліковий запис" });
    }

    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      message: user.isActive ? "Користувача розблоковано" : "Користувача заблоковано"
    });
  } catch (error) {
    console.error("Помилка в toggleUserStatus:", error.message);
    res.status(500).json({ message: "Помилка сервера", error: error.message });
  }
};
