import express from 'express';
import { getDashboardStats, getRegistrationStats } from '../controllers/stats.controller.js';
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Admin Route to fetch dashboard generic statistics
router.get('/dashboard', protectRoute, adminRoute, getDashboardStats);
// Route to fetch dynamic registration stats by period
router.get('/registrations', protectRoute, adminRoute, getRegistrationStats);

export default router;
