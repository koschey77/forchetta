import Review from "../models/review.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import { redis } from "../lib/redis.js";

// Helper: перерахунок рейтингу товару
const recalcProductRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: productId, status: 'published' } },
    {
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      averageRating: Math.round(stats[0].avgRating * 10) / 10, // Округлення до десятих
      reviewsCount: stats[0].count,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      averageRating: 0,
      reviewsCount: 0,
    });
  }
};

// ==========================================
// 1. КЛІЄНТСЬКА ЧАСТИНА (User)
// ==========================================

// Отримати товари, які чекають на відгук
export const getPendingReviewProducts = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Знайти всі унікальні ID товарів з успішних замовлень юзера
    const deliveredOrders = await Order.find({ 
      user: userId, 
      status: 'delivered' 
    }).select('items.product');

    if (!deliveredOrders.length) {
      return res.status(200).json([]);
    }

    const purchasedProductIds = new Set();
    deliveredOrders.forEach(order => {
      order.items.forEach(item => {
        if (item.product) {
          purchasedProductIds.add(item.product.toString());
        }
      });
    });

    // 2. Знайти товари, на які юзер вже залишив відгук
    const userReviews = await Review.find({ user: userId }).select('product');
    const reviewedProductIds = new Set(userReviews.map(r => r.product.toString()));

    // 3. Відняти від куплених ті, що вже з відгуком
    const pendingProductIds = [...purchasedProductIds].filter(id => !reviewedProductIds.has(id));

    if (!pendingProductIds.length) {
      return res.status(200).json([]);
    }

    // 4. Отримати дані цих товарів
    const pendingProducts = await Product.find({ _id: { $in: pendingProductIds } })
      .select('name images price discountPrice averageRating');

    res.status(200).json(pendingProducts);
  } catch (error) {
    console.error("Error in getPendingReviewProducts:", error);
    res.status(500).json({ message: "Помилка сервера при отриманні товарів для відгуку" });
  }
};

// Отримати свої відгуки
export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate('product', 'name images')
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error in getMyReviews:", error);
    res.status(500).json({ message: "Помилка при отриманні ваших відгуків" });
  }
};

// Створити новий відгук
export const createReview = async (req, res) => {
  try {
    const { productId, rating, text } = req.body;
    const userId = req.user._id;

    // Перевірка чи купив юзер цей товар
    const hasPurchased = await Order.exists({
      user: userId,
      status: 'delivered',
      'items.product': productId
    });

    if (!hasPurchased) {
      return res.status(403).json({ message: "Ви можете залишити відгук лише на придбаний і доставлений товар" });
    }

    // Перевірка чи не залишав вже відгук
    const existingReview = await Review.findOne({ user: userId, product: productId });
    if (existingReview) {
      return res.status(400).json({ message: "Ви вже залишили відгук на цей товар" });
    }

    const review = await Review.create({
      user: userId,
      product: productId,
      rating,
      text,
      status: 'pending' // потребує модерації
    });

    res.status(201).json({ message: "Відгук успішно відправлено на модерацію", review });
  } catch (error) {
    console.error("Error in createReview:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Відгук вже існує" });
    }
    res.status(500).json({ message: "Помилка при створенні відгуку" });
  }
};

// Редагувати свій відгук
export const updateMyReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, text } = req.body;

    const review = await Review.findOne({ _id: id, user: req.user._id });

    if (!review) {
      return res.status(404).json({ message: "Відгук не знайдено" });
    }

    const oldStatus = review.status;

    // При редагуванні статус залишаємо або змінюємо на pending?
    // Логічніше відправити знову на модерацію:
    review.rating = rating;
    review.text = text;
    review.status = 'pending';
    review.adminReply = undefined; // очищаємо відповідь адміна при зміні тексту

    await review.save();

    // Якщо відгук був опублікований раніше, перераховуємо рейтинг (бо тепер він pending і не враховується)
    if (oldStatus === 'published') {
      await recalcProductRating(review.product);
    }

    res.json({ message: "Відгук оновлено та відправлено на модерацію", review });
  } catch (error) {
    console.error("Error in updateMyReview:", error);
    res.status(500).json({ message: "Помилка при оновленні відгуку" });
  }
};

// Видалити свій відгук
export const deleteMyReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findOne({ _id: id, user: req.user._id });

    if (!review) {
      return res.status(404).json({ message: "Відгук не знайдено" });
    }

    await review.deleteOne();

    // Якщо відгук був опублікований - перераховуємо середній рейтинг товару
    if (review.status === 'published') {
      await recalcProductRating(review.product);
    }

    res.status(200).json({ message: "Відгук успішно видалено" });
  } catch (error) {
    console.error("Error in deleteMyReview:", error);
    res.status(500).json({ message: "Помилка при видаленні відгуку" });
  }
};

// ==========================================
// 2. ПУБЛІЧНА ЧАСТИНА 
// ==========================================

// Відгуки конкретного товару (тільки approved)
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 5 } = req.query;

    const skip = (page - 1) * limit;

    const reviews = await Review.find({ product: productId, status: 'published' })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ product: productId, status: 'published' });

    res.status(200).json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalReviews: total
    });
  } catch (error) {
    console.error("Error in getProductReviews:", error);
    res.status(500).json({ message: "Помилка при отриманні відгуків" });
  }
};

// ==========================================
// 3. АДМІНІСТРАТИВНА ЧАСТИНА
// ==========================================

// Отримати всі відгуки для таблиці адмінки
export const getAllReviewsAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const status = req.query.status || '';

    // Step 1: Match by status if provided
    const matchStage = {};
    if (status) {
      matchStage['status'] = status;
    }

    const pipeline = [
      { $match: matchStage },
      // Lookup user
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } },
      // Lookup product
      {
        $lookup: {
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: { path: '$productDetails', preserveNullAndEmptyArrays: true } },
    ];

    // Step 2: Match by search query after lookups (since we search populated fields)
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { 'userDetails.name': { $regex: search, $options: 'i' } },
            { 'userDetails.email': { $regex: search, $options: 'i' } },
            { 'userDetails.phone': { $regex: search, $options: 'i' } },
            { 'productDetails.name': { $regex: search, $options: 'i' } },
          ]
        }
      });
    }

    // Step 3: Sort & Pagination
    pipeline.push(
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [
            { $skip: skip }, 
            { $limit: limit },
            {
              $project: {
                _id: 1,
                rating: 1,
                text: 1,
                status: 1,
                adminReply: 1,
                createdAt: 1,
                user: {
                  _id: '$userDetails._id',
                  name: '$userDetails.name',
                  email: '$userDetails.email',
                  phone: '$userDetails.phone'
                },
                product: {
                  _id: '$productDetails._id',
                  name: '$productDetails.name',
                  images: '$productDetails.images'
                }
              }
            }
          ]
        }
      }
    );

    const result = await Review.aggregate(pipeline);
    
    const reviews = result[0].data;
    const total = result[0].metadata[0] ? result[0].metadata[0].total : 0;
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      reviews,
      totalPages,
      currentPage: page,
      total
    });
  } catch (error) {
    console.error("Error in getAllReviewsAdmin:", error);
    res.status(500).json({ message: "Помилка при отриманні списку відгуків" });
  }
};

// Змінити статус відгуку (модерація)
export const updateReviewStatusAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['pending', 'published', 'rejected'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Невалідний статус" });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Відгук не знайдено" });
    }

    const oldStatus = review.status;
    review.status = status;
    await review.save();

    // Якщо статус змінився на published, або навпаки був published а став іншим - перераховуємо рейтинг
    if (oldStatus !== status && (oldStatus === 'published' || status === 'published')) {
      await recalcProductRating(review.product);
    }

    res.status(200).json({ message: "Статус відгуку оновлено", review });
  } catch (error) {
    console.error("Error in updateReviewStatusAdmin:", error);
    res.status(500).json({ message: "Помилка при оновленні статусу" });
  }
};

// Відповісти на відгук від імені магазину
export const replyToReviewAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminReply } = req.body;

    const review = await Review.findByIdAndUpdate(
      id,
      { adminReply },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: "Відгук не знайдено" });
    }

    // TODO: Окремо можна викликати sendEmail notification тут, що адміністратор відповів.

    res.status(200).json({ message: "Відповідь успішно збережено", review });
  } catch (error) {
    console.error("Error in replyToReviewAdmin:", error);
    res.status(500).json({ message: "Помилка при збереженні відповіді на відгук" });
  }
};

// Видалити відгук адміністратором
export const deleteReviewAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: "Відгук не знайдено" });
    }

    await review.deleteOne();

    if (review.status === 'published') {
      await recalcProductRating(review.product);
    }

    res.status(200).json({ message: "Відгук успішно видалено адміністратором" });
  } catch (error) {
    console.error("Error in deleteReviewAdmin:", error);
    res.status(500).json({ message: "Помилка при видаленні відгуку" });
  }
};
