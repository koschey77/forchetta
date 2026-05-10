import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import {
  getProductReviews,
  getPendingReviewProducts,
  getMyReviews,
  createReview,
  updateMyReview,
  deleteMyReview,
  getAllReviewsAdmin,
  updateReviewStatusAdmin,
  replyToReviewAdmin,
  deleteReviewAdmin,
} from "../controllers/review.controller.js";

const router = express.Router();

// ==========================================
// 1. КЛІЄНТСЬКА ЧАСТИНА (Авторизований юзер)
// ==========================================
router.get("/pending", protectRoute, getPendingReviewProducts);
router.get("/my-reviews", protectRoute, getMyReviews);
router.post("/", protectRoute, createReview);
router.put("/my-reviews/:id", protectRoute, updateMyReview);
router.delete("/my-reviews/:id", protectRoute, deleteMyReview);

// ==========================================
// 2. ПУБЛІЧНА ЧАСТИНА 
// ==========================================
// Публічний доступ для перегляду опублікованих відгуків товару
router.get("/product/:productId", getProductReviews);

// ==========================================
// 3. АДМІНІСТРАТИВНА ЧАСТИНА
// ==========================================
router.get("/admin", protectRoute, adminRoute, getAllReviewsAdmin);
router.put("/admin/:id/status", protectRoute, adminRoute, updateReviewStatusAdmin);
router.put("/admin/:id/reply", protectRoute, adminRoute, replyToReviewAdmin);
router.delete("/admin/:id", protectRoute, adminRoute, deleteReviewAdmin);

export default router;
