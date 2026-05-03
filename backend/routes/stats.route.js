import express from 'express';
import { getDashboardStats } from '../controllers/stats.controller.js';
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Admin Route to fetch dashboard generic statistics
router.get('/dashboard', protectRoute, adminRoute, getDashboardStats);

export default router;
