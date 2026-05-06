import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Stripe from "stripe";
import { sendOrderConfirmationEmail, sendOrderStatusEmail } from "../lib/email.service.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc Create a new order
// @route POST /api/orders
// @access Private
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, contactPhone, paymentMethod, appliedBonuses, userNotes, packagingPrice = 0 } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Немає товарів у замовленні" });
    }

    // Унікальний номер ORD-20260410X01
    const timestamp = Date.now().toString().slice(-6);
    const randomStr = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const orderNumber = `ORD-${timestamp}${randomStr}`;

    let subtotal = 0;
    const validatedItems = [];
    const emailItems = []; // Массив для красивого письма

    // Розраховуємо суму та знімаємо snapshot'и для товарів
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Товар з ID ${item.product} не знайдено` });
      }
      
      const priceAtPurchase = product.discountPrice ? product.discountPrice : product.price;
      const nameAtPurchase = product.name;
      const itemSubtotal = priceAtPurchase * item.quantity;
      subtotal += itemSubtotal;

      validatedItems.push({
        product: product._id,
        quantity: item.quantity,
        priceAtPurchase,
        nameAtPurchase
      });

      emailItems.push({
        quantity: item.quantity,
        priceAtPurchase,
        nameAtPurchase,
        image: product.images?.length > 0 ? product.images[0].url : null
      });

      // Одразу оновлюємо кількість продажів (для "найпопулярніших")
      product.salesCount += item.quantity;
      await product.save();
    }

    // Додаємо вартість пакування до загальної суми
    subtotal += Number(packagingPrice);

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

    // Динамічна система кешбеку:
    // від 1500 грн - 15%
    // від 1000 грн - 10%
    // від 500 грн - 5%
    // менше 500 грн - 0%
    let cashbackPercent = 0;
    if (subtotal >= 1500) {
      cashbackPercent = 0.15;
    } else if (subtotal >= 1000) {
      cashbackPercent = 0.10;
    } else if (subtotal >= 500) {
      cashbackPercent = 0.05;
    }
    
    const earnedBonuses = Math.floor(subtotal * cashbackPercent);

    // Створюємо заказ (поки що зі статусом pending / несплачено)
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
      paymentStatus: paymentMethod === 'card' ? 'pending' : 'pending', // Для "cash" теж буде pending поки не доставлять (можна змінити)
      userNotes
    });

    const createdOrder = await order.save();

    // Зараховуємо зароблені бонуси (Навіть без оплати вони зберігаються - можна змінити логіку в майбутньому)
    user.bonusPoints += earnedBonuses;
    if (!user.orders) user.orders = [];
    user.orders.push(createdOrder._id);

    // Зберігаємо адресу доставки, якщо її ще немає в профілі
    if (shippingAddress && shippingAddress.city && shippingAddress.street) {
      if (!user.addresses) user.addresses = [];
      
      const addressExists = user.addresses.some(addr => 
        addr.city === shippingAddress.city && 
        addr.street === shippingAddress.street &&
        addr.house === shippingAddress.house
      );
      
      if (!addressExists) {
        user.addresses.push({
          firstName: req.user?.name || user.name,
          phone: contactPhone,
          region: shippingAddress.region,
          city: shippingAddress.city,
          street: shippingAddress.street,
          house: shippingAddress.house,
          apartment: shippingAddress.apartment,
          postalCode: shippingAddress.postalCode,
          isDefault: user.addresses.length === 0 // робимо основною, якщо це перша адреса
        });
      }
    }

    await user.save();

    // Якщо це оплата карткою -> створюємо Stripe Checkout Session
    if (paymentMethod === 'card') {
      const lineItems = validatedItems.map(item => ({
        price_data: {
          currency: 'uah',
          product_data: {
            name: item.nameAtPurchase,
          },
          unit_amount: item.priceAtPurchase * 100, // Stripe рахує в копійках
        },
        quantity: item.quantity,
      }));

      // Якщо була доставка або упаковка або знижка/бонуси, треба скорегувати
      // Найпростіший спосіб: якщо сума не співпадає з lineItems, додати "Коригування / Пакування / Знижка"
      const currentItemsTotal = validatedItems.reduce((acc, i) => acc + (i.priceAtPurchase * i.quantity), 0);
      const diff = subtotal - currentItemsTotal;
      
      if (diff !== 0) {
        lineItems.push({
          price_data: {
            currency: 'uah',
            product_data: {
              name: diff > 0 ? "Пакування / Доставка" : "Знижка (Бонуси)",
            },
            unit_amount: Math.abs(diff) * 100, // Завжди додатна величина
          },
          quantity: 1, // Якщо знижка, ми не можемо напряму передати мінусове значення в Stripe, але якщо totalAmount коректний, треба обіграти
        });
      }

      // Stripe хоче, щоб ціни були додатними
      // Більш правильний підхід - створити один загальний "Item", або coupon_id.
      // Але для простоти зробимо єдиний товар "Замовлення №...", якщо є складнощі з бонусами (мінусом).
      
      const safeLineItems = [
        {
          price_data: {
            currency: 'uah',
            product_data: {
              name: `Замовлення ${orderNumber}`,
              description: `Оплата за замовлення у кондитерській Forchetta (Враховуючи бонуси та пакування)`,
            },
            unit_amount: subtotal * 100,
          },
          quantity: 1,
        }
      ];

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: safeLineItems,
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}/success?orderId=${createdOrder._id}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/cart`,
        client_reference_id: createdOrder._id.toString(),
      });

      // Отправляем письмо только если оплата наличными! Для Stripe письмо будет отправлено после успеха на SuccessPage
      // sendOrderConfirmationEmail мы убрали отсюда для карт

      return res.status(201).json({ order: createdOrder, url: session.url });
    }

    // Якщо це наличні
    sendOrderConfirmationEmail(user.email, user.name, {
      _id: createdOrder._id,
      orderNumber: orderNumber,
      items: emailItems,
      packagingPrice: Number(packagingPrice) || 0,
      totalPrice: subtotal,
      bonusUsed: actualAppliedBonuses,
      bonusEarned: earnedBonuses,
      shippingAddress,
      contactPhone,
      paymentMethod,
      paymentStatus: 'pending' // наличними завжди pending поки кур'єр не віддасть 
    }).catch(err => console.error('Email error:', err));

    return res.status(201).json({ order: createdOrder });

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
      .populate('items.product', 'images name price')
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
      .populate('items.product', 'images');

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

    // Пошук по orderNumber та contactPhone
    const filter = search ? { 
      $or: [
        { orderNumber: { $regex: search, $options: 'i' } },
        { contactPhone: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const orders = await Order.find(filter)
      .populate('user', 'name email phone')
      .populate('items.product', 'images')
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

    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: "Замовлення не знайдено" });
    }

    const oldStatus = order.status;

    // Обновляем только разрешенные поля (без перерасчета товаров, так как это сломает статистику и бонусы)
    if (shippingAddress) order.shippingAddress = shippingAddress;
    if (contactPhone) order.contactPhone = contactPhone;
    if (userNotes !== undefined) order.userNotes = userNotes;
    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (paymentMethod) order.paymentMethod = paymentMethod;

    const updatedOrder = await order.save();

    // Если статус изменился и это не pending, отправляем письмо
    if (status && status !== oldStatus && status !== 'pending') {
      sendOrderStatusEmail(order.user.email, order.user.name, order.orderNumber, status)
        .catch(err => console.error('Status email error:', err));
    }

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
    
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: "Замовлення не знайдено" });
    }

    const oldStatus = order.status;

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    const updatedOrder = await order.save();

    // Если статус изменился и это не pending, отправляем письмо
    if (status && status !== oldStatus && status !== 'pending') {
      sendOrderStatusEmail(order.user.email, order.user.name, order.orderNumber, status)
        .catch(err => console.error('Status email error:', err));
    }

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

// @desc Confirm Stripe payment success
// @route POST /api/orders/:id/confirm-payment
// @access Private
export const confirmOrderPayment = async (req, res) => {
  try {
    // В React 18 в Strict Mode useEffect может сработать дважды
    // Чтобы письмо не отправилось два раза, мы используем findOneAndUpdate с флагом pending,
    // это гарантирует, что только ПЕРВЫЙ запрос изменит статус и пошлет письмо.
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, paymentStatus: 'pending' },
      { paymentStatus: 'paid' },
      { new: true }
    ).populate('items.product', 'images');

    // Если заказ не найден по этому фильтру, значит он либо не существует, либо УЖЕ 'paid' (второй дубль)
    if (!order) {
      const existingOrder = await Order.findById(req.params.id).populate('items.product', 'images');
      if (!existingOrder) return res.status(404).json({ message: "Замовлення не знайдено" });
      
      // Возвращаем просто его текущее состояние (без повторной отправки письма)
      return res.json(existingOrder);
    }

    if (order.user.toString() !== req.user._id.toString()) {
      // И на всякий случай откатываем, если это была попытка чужого юзера
      order.paymentStatus = 'pending';
      await order.save();
      return res.status(403).json({ message: "Відмовлено в доступі" });
    }

    // Формируем email элементы с картинками
    const emailItems = order.items.map(item => ({
      quantity: item.quantity,
      priceAtPurchase: item.priceAtPurchase,
      nameAtPurchase: item.nameAtPurchase,
      image: item.product && item.product.images?.length > 0 ? item.product.images[0].url : null
    }));

    let packagingPrice = 0;
    // Оцениваем была ли упаковка (если нужно)
    // В текущей схеме packagingPrice явно не хранится как поле. Мы вычисляем его из subtotal и total
    const currentItemsTotal = order.items.reduce((acc, i) => acc + (i.priceAtPurchase * i.quantity), 0);
    const diff = order.totalAmount - (currentItemsTotal - order.appliedBonuses);
    if (diff > 0) {
      packagingPrice = diff;
    }

    sendOrderConfirmationEmail(req.user.email, req.user.name, {
      _id: order._id,
      orderNumber: order.orderNumber,
      items: emailItems,
      packagingPrice: packagingPrice,
      totalPrice: order.totalAmount,
      bonusUsed: order.appliedBonuses,
      bonusEarned: order.earnedBonuses,
      shippingAddress: order.shippingAddress,
      contactPhone: order.contactPhone,
      paymentMethod: order.paymentMethod,
      paymentStatus: 'paid'
    }).catch(err => console.error('Email error:', err));

    return res.json(order);
  } catch (error) {
    console.error("Error in confirmOrderPayment:", error.message);
    return res.status(500).json({ message: "Помилка підтвердження оплати" });
  }
};