import express from "express"
import { 
  getAllCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory, 
  getCategoryById 
} from "../controllers/category.controller.js"
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

// Публичные маршруты (доступны всем)
router.get("/", getAllCategories)
router.get("/:id", getCategoryById)

// Приватные маршруты (только для админов)
router.post("/", protectRoute, adminRoute, createCategory)
router.put("/:id", protectRoute, adminRoute, updateCategory)
router.delete("/:id", protectRoute, adminRoute, deleteCategory)

export default router