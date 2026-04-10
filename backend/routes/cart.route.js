import express from 'express';
import { 
  getCart, 
  addToCart, 
  updateQuantity, 
  removeFromCart, 
  removeAllFromCart, 
  syncCart 
} from '../controllers/cart.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Все роуты для корзины в бэкенде защищены, так как гости хранят её в localStorage
router.get('/', protectRoute, getCart);
router.post('/add', protectRoute, addToCart);
router.put('/:id', protectRoute, updateQuantity);
router.delete('/:id', protectRoute, removeFromCart);
router.delete('/', protectRoute, removeAllFromCart);

// Синхронизация при логине
router.post('/sync', protectRoute, syncCart);

export default router;
