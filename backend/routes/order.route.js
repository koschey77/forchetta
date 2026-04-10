import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrder,
  updateOrderStatus,
  deleteOrder
} from '../controllers/order.controller.js';
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// User Routes
router.post('/', protectRoute, createOrder);
router.get('/my-orders', protectRoute, getMyOrders);
router.get('/my-orders/:id', protectRoute, getOrderById);

// Admin Routes
router.get('/', protectRoute, adminRoute, getAllOrders);
router.put('/:id', protectRoute, adminRoute, updateOrder); // Повне редагування замовлення (адмін)
router.put('/:id/status', protectRoute, adminRoute, updateOrderStatus);
router.delete('/:id', protectRoute, adminRoute, deleteOrder);

// Fallback user get
router.get('/:id', protectRoute, getOrderById);

export default router;