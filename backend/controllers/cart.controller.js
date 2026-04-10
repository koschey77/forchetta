import { redis } from "../lib/redis.js";
import Product from "../models/product.model.js";

const CART_TTL = 30 * 24 * 60 * 60; // 30 дней в секундах

export const getCart = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const cartStr = await redis.get(`cart:${userId}`);
    const cartItems = cartStr ? JSON.parse(cartStr) : [];

    if (cartItems.length === 0) {
      return res.json([]);
    }

    // Получаем полные данные о товарах из базы (чтобы цены были всегда актуальными)
    const productIds = cartItems.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    // Формируем корзину с актуальными данными
    const cartData = cartItems
      .map((item) => {
        const product = products.find((p) => p._id.toString() === item.productId);
        if (!product) return null;
        return {
          product,
          quantity: item.quantity, // Берем количество из редиса, а все остальное из базы
        };
      })
      .filter((item) => item !== null);

    res.json(cartData);
  } catch (error) {
    console.error("Error in getCart controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user._id.toString();

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Товар не знайдено" });
    }

    const cartStr = await redis.get(`cart:${userId}`);
    let cartItems = cartStr ? JSON.parse(cartStr) : [];

    const existingItem = cartItems.find((item) => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cartItems.push({ productId, quantity });
    }

    // Сохраняем в Redis с обновлением времени жизни (30 дней)
    await redis.set(`cart:${userId}`, JSON.stringify(cartItems), "EX", CART_TTL);

    // Я возвращаю просто массив { productId, quantity }, 
    // подробные данные фронтенд либо сам догрузит, либо сделает refetch getUserCart
    res.json(cartItems);
  } catch (error) {
    console.error("Error in addToCart controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { id: productId } = req.params;
    const userId = req.user._id.toString();

    const cartStr = await redis.get(`cart:${userId}`);
    let cartItems = cartStr ? JSON.parse(cartStr) : [];

    if (quantity === 0) {
      cartItems = cartItems.filter((item) => item.productId !== productId);
    } else {
      const existingItem = cartItems.find((item) => item.productId === productId);
      if (existingItem) {
        existingItem.quantity = quantity;
      }
    }

    await redis.set(`cart:${userId}`, JSON.stringify(cartItems), "EX", CART_TTL);
    
    res.json(cartItems);
  } catch (error) {
    console.error("Error in updateQuantity controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const userId = req.user._id.toString();

    const cartStr = await redis.get(`cart:${userId}`);
    let cartItems = cartStr ? JSON.parse(cartStr) : [];

    cartItems = cartItems.filter((item) => item.productId !== productId);

    await redis.set(`cart:${userId}`, JSON.stringify(cartItems), "EX", CART_TTL);

    res.json(cartItems);
  } catch (error) {
    console.error("Error in removeFromCart controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    await redis.del(`cart:${userId}`);
    
    res.json({ message: "Корзина очищена", cart: [] });
  } catch (error) {
    console.error("Error in removeAllFromCart controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const syncCart = async (req, res) => {
  try {
    const { cartItems: localCartItems } = req.body; // Ожидаем массив [{ productId, quantity }] из LocalStorage
    const userId = req.user._id.toString();

    const cartStr = await redis.get(`cart:${userId}`);
    let redisCartItems = cartStr ? JSON.parse(cartStr) : [];

    if (localCartItems && localCartItems.length > 0) {
      localCartItems.forEach((localItem) => {
        const existing = redisCartItems.find((item) => item.productId === localItem.productId);
        if (existing) {
          existing.quantity += localItem.quantity;
        } else {
          redisCartItems.push(localItem);
        }
      });
      
      await redis.set(`cart:${userId}`, JSON.stringify(redisCartItems), "EX", CART_TTL);
    }

    // Возвращаем результат синхронизации для фронтенда 
    // (он очистит свой LocalStorage и запишет то, что вернул сервер)
    res.json(redisCartItems);
  } catch (error) {
    console.error("Error in syncCart controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
