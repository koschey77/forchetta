import express from 'express';
import {
  getArticles,
  getAdminArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  uploadArticleImage,
} from '../controllers/article.controller.js';
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// ПУБЛІЧНІ МАРШРУТИ
router.get('/', getArticles); 

// МАРШРУТИ АДМІНІСТРАТОРА
router.get('/admin/all', protectRoute, adminRoute, getAdminArticles);
router.post('/upload-image', protectRoute, adminRoute, uploadArticleImage);
router.post('/', protectRoute, adminRoute, createArticle);
router.put('/:id', protectRoute, adminRoute, updateArticle);
router.delete('/:id', protectRoute, adminRoute, deleteArticle);

router.get('/:id', getArticleById); // Важливо: :id має йти після специфічних маршрутів

export default router;