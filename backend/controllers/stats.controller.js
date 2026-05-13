import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Review from "../models/review.model.js";
import { ORDER_ENUMS } from "../constants/enums.js";

// @desc    Get dashboard statistics
// @route   GET /api/stats/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    // 1. Счетчики KPI (Всього покупців, Всього замовлень, Всього доходу, Усього товарів)
    const [totalUsers, totalOrders, totalProducts] = await Promise.all([
      User.countDocuments({ role: "customer" }),
      Order.countDocuments(),
      Product.countDocuments()
    ]);

    // Подсчет общего дохода из выполненных заказов (status: delivered)
    const incomeAggregation = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, totalIncome: { $sum: "$totalAmount" } } }
    ]);
    const totalIncome = incomeAggregation.length > 0 ? incomeAggregation[0].totalIncome : 0;

    // 2. Статусы заказов (Круговая диаграмма)
    const orderStatusAggregation = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Карта для трансформации статусов БД -> Статусы UI
    const statusMap = {
      'delivered': { name: "Виконано", color: "#66BC91" },
      'pending': { name: "В обробці", color: "#FFD874" },
      'cancelled': { name: "Скасовано", color: "#FF6C6C" },
      'processing': { name: "Готується", color: "#4A90E2" },
      'shipped': { name: "Відправлено", color: "#9B51E0" },
    };

    // Оставляем только те статусы, которые есть в дизайне
    const orderStatusData = orderStatusAggregation
      .filter((item) => statusMap[item._id])
      .map((item) => ({
        name: statusMap[item._id].name,
        value: item.count,
        color: statusMap[item._id].color
      }));

    // 3. Доход по дням (График за последние 7 дней)
    // Строим массив дат строго в UTC, чтобы не было рассинхрона между Node.js и MongoDB
    const last7Days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setUTCHours(0, 0, 0, 0);
      d.setUTCDate(d.getUTCDate() - i);
      last7Days.push(d);
    }
    
    // Получаем последнюю неделю
    const startDate = last7Days[0];
    const salesAggregation = await Order.aggregate([
      {
        $match: {
          status: 'delivered',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          dailyTotal: { $sum: "$totalAmount" }
        }
      }
    ]);

    // Преобразуем агрегацию в формат для Recharts
    const daysOfWeekUk = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    
    const salesData = last7Days.map(date => {
      const dateString = date.toISOString().split('T')[0];
      const match = salesAggregation.find(s => s._id === dateString);
      
      return {
        name: daysOfWeekUk[date.getUTCDay()],
        value: match ? match.dailyTotal : 0
      };
    });

    // 4. Customer Reviews Stats
    const reviewAggregation = await Review.aggregate([
      { $match: { status: 'published' } },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 }
        }
      }
    ]);
    
    const totalReviewsCount = reviewAggregation.reduce((acc, curr) => acc + curr.count, 0);

    const reviewMap = {
      5: { label: 'Чудово (5★)', bg: '#E8F9F0', fill: 'rgba(23, 191, 107, 0.68)' },
      4: { label: 'Добре (4★)', bg: '#E8F9F0', fill: 'rgba(65, 217, 141, 0.57)' },
      3: { label: 'Нормально (3★)', bg: '#FFF4E5', fill: 'rgba(255, 171, 0, 0.68)' },
      2: { label: 'Погано (2★)', bg: '#FFEBEB', fill: 'rgba(255, 86, 48, 0.57)' },
      1: { label: 'Дуже погано (1★)', bg: '#FFEBEB', fill: 'rgba(255, 86, 48, 0.8)' },
    };

    const reviewStatsData = [5, 4, 3, 2, 1].map(rating => {
      const match = reviewAggregation.find(r => r._id === rating);
      const count = match ? match.count : 0;
      const percent = totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : 0;
      return {
        ...reviewMap[rating],
        percent,
        count
      };
    });

    // 5. Распределение продаж по категориям (за все время)
    const categoryDistributionData = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $unwind: "$items" },
      { $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productDoc'
      }},
      { $unwind: { path: "$productDoc", preserveNullAndEmptyArrays: true } },
      { $lookup: {
          from: 'categories',
          localField: 'productDoc.category',
          foreignField: '_id',
          as: 'categoryDoc'
      }},
      { $unwind: { path: "$categoryDoc", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: { $ifNull: ["$categoryDoc.name", "Інше"] },
          value: { $sum: { $multiply: ["$items.quantity", "$items.priceAtPurchase"] } }
        }
      },
      {
        $project: {
          name: "$_id",
          value: { $round: ["$value", 0] },
          _id: 0
        }
      }
    ]);

    res.status(200).json({
      kpi: {
        totalUsers,
        totalOrders,
        totalIncome,
        totalProducts
      },
      orderStatusData,
      salesData,
      reviewStatsData,
      totalReviewsCount,
      categoryDistributionData
    });
  } catch (error) {
    console.error("Помилка при отриманні статистики:", error.message);
    res.status(500).json({ message: "Помилка сервера. Неможливо отримати статистику." });
  }
};

// @desc    Get dynamic registration statistics
// @route   GET /api/stats/registrations
// @access  Private/Admin
export const getRegistrationStats = async (req, res) => {
  try {
    const period = parseInt(req.query.period) || 30; // 7, 14, 30
    let registrationData = [];
    
    // Групировка по дням
    const startOfPeriod = new Date();
    startOfPeriod.setUTCHours(0, 0, 0, 0);
    startOfPeriod.setUTCDate(startOfPeriod.getUTCDate() - period + 1);
    
    const userAgg = await User.aggregate([
      { $match: { role: 'customer', createdAt: { $gte: startOfPeriod } } },
      { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
      }}
    ]);

    for (let i = period - 1; i >= 0; i--) {
      const d = new Date();
      d.setUTCDate(d.getUTCDate() - i);
      const yyyymmdd = d.toISOString().split('T')[0];
      const match = userAgg.find(u => u._id === yyyymmdd);
      registrationData.push({
        name: `${String(d.getUTCDate()).padStart(2,'0')}.${String(d.getUTCMonth()+1).padStart(2,'0')}`,
        value: match ? match.count : 0
      });
    }

    res.status(200).json(registrationData);
  } catch (error) {
    console.error("Помилка при отриманні статистики реєстрацій:", error.message);
    res.status(500).json({ message: "Помилка сервера. Неможливо отримати статистику." });
  }
};
