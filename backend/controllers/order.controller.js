import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";

// @desc Create a new order
// @route POST /api/orders
// @access Private
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, contactPhone, paymentMethod, appliedBonuses, userNotes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Немає товарів у замовленні" });
    }

    // Унікальний номер ORD-20260410X01
    const timestamp = Date.now().toString().slice(-6);
    const randomStr = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const orderNumber = `ORD-${timestamp}${randomStr}`;

    let subtotal = 0;
    const validatedItems = [];

    // Розраховуємо суму та знімаємо snapshot'и для товарів
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Товар з ID ${item.product} не знайдено` });
      }
      
      const priceAtPurchase = product.price;
      const nameAtPurchase = product.name;
      const itemSubtotal = priceAtPurchase * item.quantity;
      subtotal += itemSubtotal;

      validatedItems.push({
        product: product._id,
        quantity: item.quantity,
        priceAtPurchase,
        nameAtPurchase
      });

      // Одразу оновлюємо кількість продажів (для "найпопулярніших")
      product.salesCount += item.quantity;
      await product.save();
    }

    // Розрахунок бонусів
    // Якщо адмін створює замовлення для когось, він може передати userId
    let userId = req.user._id;
    if (req.user.role === 'admin' && req.body.userId) {
      userId = req.body.userId;
    }
    
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    let actualAppliedBonuses = 0;
    
    if (appliedBonuses > 0 && user.bonusPoints >= appliedBonuses) {
      actualAppliedBonuses = appliedBonuses;
      subtotal -= actualAppliedBonuses;
      if (subtotal < 0) subtotal = 0; 
      user.bonusPoints -= actualAppliedBonuses;
    } else if (appliedBonuses > 0) {
      return res.status(400).json({ message: "Недостатньо бонусів" });
    }

    // Mock policy: Даємо бонуси відразу за купівлю (5% від загальної суми) 
    const earnedBonuses = Math.floor(subtotal * 0.05);

    // Створюємо заказ
    const order = new Order({
      orderNumber,
      user: user._id,
      items: validatedItems,
      shippingAddress,
      contactPhone,
      totalAmount: subtotal,
      appliedBonuses: actualAppliedBonuses,
      earnedBonuses,
      paymentMethod,
      userNotes
    });

    const createdOrder = await order.save();

    // Зараховуємо зароблені бонуси
    user.bonusPoints += earnedBonuses;
    if (!user.orders) user.orders = [];
    user.orders.push(createdOrder._id);
    await user.save();

    return res.status(201).json(createdOrder);

  } catch (error) {
    console.error("Error in createOrder controller:", error.message);
    return res.status(500).json({ message: "Помилка сервера при створенні замовлення", error: error.message });
  }
};

// @desc Get user's orders
// @route GET /api/orders/my-orders
// @access Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'image name price')
      .sort({ createdAt: -1 });
    
    return res.json(orders);
  } catch (error) {
    console.error("Error in getMyOrders controller:", error.message);
    return res.status(500).json({ message: "Помилка сервера при отриманні замовлень" });
  }
};

// @desc Get order by ID
// @route GET /api/orders/:id
// @access Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'image');

    if (!order) {
      return res.status(404).json({ message: "Замовлення не знайдено" });
    }

    // Адмін або власник
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Доступ заборонено (Це не ваше замовлення)" });
    }

    return res.json(order);
  } catch (error) {
    console.error("Error in getOrderById controller:", error.message);
    return res.status(500).json({ message: "Помилка сервера при отриманні замовлення" });
  }
};

// @desc Get all orders
// @route GET /api/orders
// @access Admin Only
export const getAllOrders = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 12;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    // Пошук по orderNumber для адміна
    const filter = search ? { orderNumber: { $regex: search, $options: 'i' } } : {};

    const orders = await Order.find(filter)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Order.countDocuments(filter);

    return res.json({
      orders,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error("Error in getAllOrders controller:", error.message);
    return res.status(500).json({ message: "Помилка сервера при отриманні всіх замовлень" });
  }
};

// @desc Update order (Full edit by Admin)
// @route PUT /api/orders/:id
// @access Admin Only
export const updateOrder = async (req, res) => {
  try {
    const { 
      shippingAddress, 
      contactPhone, 
      userNotes, 
      status, 
      paymentStatus, 
      paymentMethod 
    } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Замовлення не знайдено" });
    }

    // Обновляем только разрешенные поля (без перерасчета товаров, так как это сломает статистику и бонусы)
    if (shippingAddress) order.shippingAddress = shippingAddress;
    if (contactPhone) order.contactPhone = contactPhone;
    if (userNotes !== undefined) order.userNotes = userNotes;
    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (paymentMethod) order.paymentMethod = paymentMethod;

    const updatedOrder = await order.save();

    return res.json(updatedOrder);
  } catch (error) {
    console.error("Error in updateOrder controller:", error.message);
    return res.status(500).json({ message: "Помилка оновлення замовлення (Адмін)" });
  }
};

// @desc Update order status
// @route PUT /api/orders/:id/status
// @access Admin Only
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Замовлення не знайдено" });
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    const updatedOrder = await order.save();

    return res.json(updatedOrder);
  } catch (error) {
    console.error("Error in updateOrderStatus controller:", error.message);
    return res.status(500).json({ message: "Помилка оновлення статусу" });
  }
};

// @desc Delete an order
// @route DELETE /api/orders/:id
// @access Admin Only
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Замовлення не знайдено" });
    }

    await order.deleteOne();
    
    // Очищуємо orders arr у юзера
    await User.updateOne(
      { _id: order.user },
      { $pull: { orders: order._id } }
    );

    return res.json({ message: "Замовлення видалено" });
  } catch (error) {
    console.error("Error in deleteOrder controller:", error.message);
    return res.status(500).json({ message: "Помилка видалення замовлення" });
  }
};