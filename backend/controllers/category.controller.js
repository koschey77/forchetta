import Category from "../models/category.model.js"
import { uploadImages, deleteImage } from "../lib/imageService.js"

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ createdAt: -1 })
    res.json({ categories })
  } catch (error) {
    console.log("Error in getAllCategories controller", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export const createCategory = async (req, res) => {
  try {
    console.log('📂 Creating category...')
    console.log('📋 Request body:', req.body)
    
    const { name, description, image } = req.body

    // Проверка обязательных полей
    if (!name || !description) {
      return res.status(400).json({ message: "Назва та опис є обов'язковими" })
    }

    // Проверка на уникальность имени
    const existingCategory = await Category.findOne({ name })
    if (existingCategory) {
      return res.status(400).json({ message: "Категорія з такою назвою вже існує" })
    }

    console.log('🖼️ Image received:', image ? 'present' : 'missing')
    
    // Обработка изображения
    let processedImage
    if (image) {
      console.log('📸 Processing category image...')
      const uploadedImages = await uploadImages([image], "forchetta/categories")
      processedImage = uploadedImages[0]
      console.log('✅ Category image processed:', processedImage ? 'success' : 'failed')
    }

    const category = await Category.create({ 
      name, 
      description, 
      image: processedImage
    })

    res.status(201).json(category)
  } catch (error) {
    console.log("❌ Error in createCategory controller:")
    console.log("Error message:", error.message)
    console.log("Error stack:", error.stack)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, image } = req.body

    const category = await Category.findById(id)
    if (!category) {
      return res.status(404).json({ message: "Категорію не знайдено" })
    }

    // Проверка уникальности имени (если изменяется)
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ name })
      if (existingCategory) {
        return res.status(400).json({ message: "Категорія з такою назвою вже існує" })
      }
    }

    // Обработка нового изображения, если предоставлено
    if (image) {
      // Удаляем старое изображение
      if (category.image?.public_id) {
        await deleteImage(category.image.public_id)
      }
      
      // Загружаем новое
      const uploadedImages = await uploadImages([image], "forchetta/categories")
      category.image = uploadedImages[0]
    }

    // Обновляем остальные поля
    if (name) category.name = name
    if (description) category.description = description

    await category.save()

    res.json(category)
  } catch (error) {
    console.log("Error in updateCategory controller", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params

    const category = await Category.findById(id)
    if (!category) {
      return res.status(404).json({ message: "Категорію не знайдено" })
    }

    // Удаляем изображение из Cloudinary
    if (category.image?.public_id) {
      await deleteImage(category.image.public_id)
    }

    await Category.findByIdAndDelete(id)

    res.json({ message: "Категорію успішно видалено" })
  } catch (error) {
    console.log("Error in deleteCategory controller", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params
    const category = await Category.findById(id)
    
    if (!category) {
      return res.status(404).json({ message: "Категорію не знайдено" })
    }

    res.json(category)
  } catch (error) {
    console.log("Error in getCategoryById controller", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}