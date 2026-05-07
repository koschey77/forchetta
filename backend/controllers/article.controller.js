import { Article } from '../models/article.model.js';
import { uploadImages } from '../lib/imageService.js';

// Завантаження картинки з текстового редактора (React Quill)
export const uploadArticleImage = async (req, res) => {
  try {
    const { image } = req.body;
    if (!image || !image.startsWith('data:image')) {
      return res.status(400).json({ message: 'Недійсне зображення' });
    }
    const uploadedImages = await uploadImages([image], 'forchetta/articles/inline');
    
    if (uploadedImages && uploadedImages.length > 0) {
      return res.status(200).json({ url: uploadedImages[0].url });
    }
    
    res.status(500).json({ message: 'Не вдалося завантажити зображення на сервер' });
  } catch (error) {
    console.error('Помилка в uploadArticleImage:', error.message);
    res.status(500).json({ message: 'Помилка сервера при завантаженні зображення' });
  }
};

// Отримати всі опубліковані статті (Для ПУБЛІЧНОЇ сторінки)
export const getArticles = async (req, res) => {
  try {
    const articles = await Article.find({ status: 'Опубліковано' }).sort({ createdAt: -1 });
    res.status(200).json(articles);
  } catch (error) {
    console.error('Помилка в getArticles:', error.message);
    res.status(500).json({ message: 'Помилка сервера при отриманні статей' });
  }
};

// Отримати всі статті (Для АДМІН-ПАНЕЛІ - включає чернетки і приховані)
export const getAdminArticles = async (req, res) => {
  try {
    const articles = await Article.find({}).sort({ createdAt: -1 });
    res.status(200).json(articles);
  } catch (error) {
    console.error('Помилка в getAdminArticles:', error.message);
    res.status(500).json({ message: 'Помилка сервера при отриманні всіх статей' });
  }
};

// Отримати одну статтю за ID (і збільшити лічильник переглядів)
export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewsCount: 1 } }, // Атомарне збільшення переглядів на +1
      { new: true } // Повернути вже оновлений документ
    );

    if (!article) {
      return res.status(404).json({ message: 'Статтю не знайдено' });
    }

    res.status(200).json(article);
  } catch (error) {
    console.error('Помилка в getArticleById:', error.message);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Статтю не знайдено (невірний ID)' });
    }
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

// Створити статтю (Для АДМІН-ПАНЕЛІ)
export const createArticle = async (req, res) => {
  try {
    const { title, excerpt, content, imageUrl, status } = req.body;

    let finalImageUrl = imageUrl;
    
    // Якщо прийшов рядок, який починається з data:image (base64) - завантажуємо в Cloudinary
    if (imageUrl && imageUrl.startsWith('data:image')) {
      const uploadedImages = await uploadImages([imageUrl], 'forchetta/articles');
      if (uploadedImages && uploadedImages.length > 0) {
        finalImageUrl = uploadedImages[0].url;
      }
    }

    const newArticle = new Article({
      title,
      excerpt,
      content,
      imageUrl: finalImageUrl,
      status: status || 'Чернетка',
    });

    const savedArticle = await newArticle.save();
    res.status(201).json(savedArticle);
  } catch (error) {
    console.error('Помилка в createArticle:', error.message);
    res.status(500).json({ message: error.message || 'Помилка при створенні статті' });
  }
};

// Оновити статтю або її статус (Для АДМІН-ПАНЕЛІ)
export const updateArticle = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Якщо прийшов рядок, який починається з data:image (base64) - завантажуємо в Cloudinary
    if (updateData.imageUrl && updateData.imageUrl.startsWith('data:image')) {
      const uploadedImages = await uploadImages([updateData.imageUrl], 'forchetta/articles');
      if (uploadedImages && uploadedImages.length > 0) {
        updateData.imageUrl = uploadedImages[0].url;
      }
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedArticle) {
      return res.status(404).json({ message: 'Статтю не знайдено для оновлення' });
    }

    res.status(200).json(updatedArticle);
  } catch (error) {
    console.error('Помилка в updateArticle:', error.message);
    res.status(500).json({ message: 'Помилка сервера при оновленні статті' });
  }
};

// Видалити статтю (Для АДМІН-ПАНЕЛІ)
export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: 'Статтю не знайдено для видалення' });
    }

    res.status(200).json({ message: 'Статтю успішно видалено' });
  } catch (error) {
    console.error('Помилка в deleteArticle:', error.message);
    res.status(500).json({ message: 'Помилка сервера при видаленні статті' });
  }
};