import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import {
  getProfile,
  updateProfile,
  addAddress,
  deleteAddress,
  updateAddress,
  setDefaultAddress,
  toggleFavorite,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserRole,
  toggleUserStatus,
} from "../controllers/user.controller.js";

const router = express.Router();

// --- Роуты для клиентской части (доступны авторизованным пользователям) ---
router.get("/profile", protectRoute, getProfile);
router.put("/profile", protectRoute, updateProfile);
router.post("/addresses", protectRoute, addAddress);
router.put("/addresses/:id", protectRoute, updateAddress);
router.delete("/addresses/:id", protectRoute, deleteAddress);
router.put("/addresses/:id/default", protectRoute, setDefaultAddress);
router.post("/favorites/:productId", protectRoute, toggleFavorite);

// --- Роуты для админ-панели (доступны только администраторам) ---
router.get("/", protectRoute, adminRoute, getAllUsers);
router.post("/", protectRoute, adminRoute, createUser);
router.get("/:id", protectRoute, adminRoute, getUserById);
router.put("/:id", protectRoute, adminRoute, updateUser);
router.patch("/:id/role", protectRoute, adminRoute, updateUserRole);
router.patch("/:id/status", protectRoute, adminRoute, toggleUserStatus);

export default router;