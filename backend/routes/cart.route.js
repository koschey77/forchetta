import express from 'express';
import { 
  getCart, 
  addToCart, 
  updateQuantity, 
  removeFromCart, 
  removeAllFromCart,
  removeManyFromCart
} from '../controllers/cart.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Все роуты для корзины в бэкенде защищены
router.get('/', protectRoute, getCart);
router.post('/add', protectRoute, addToCart);
router.post('/remove-many', protectRoute, removeManyFromCart);
router.put('/:id', protectRoute, updateQuantity);
router.delete('/:id', protectRoute, removeFromCart);
router.delete('/', protectRoute, removeAllFromCart);

export default router;
