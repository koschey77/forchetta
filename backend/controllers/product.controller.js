import Product from "../models/product.model.js"
import Category from "../models/category.model.js"
import { uploadImages, deleteImages, deleteImage } from "../lib/imageService.js"
import { redis } from "../lib/redis.js"

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate('category', 'name image')
    res.json({ products })
  } catch (error) {
    console.log("Error in getAllProducts controller", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_products")
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts))
    }

    featuredProducts = await Product.find({ isFeatured: true }).populate('category', 'name image').lean()

    if (!featuredProducts) {
      return res.status(404).json({ message: "No featured products found" })
    }

    await redis.set("featured_products", JSON.stringify(featuredProducts))

    res.json(featuredProducts)
  } catch (error) {
    console.log("Error in getFeaturedProducts controller", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export const createProduct = async (req, res) => {
  try {
    console.log('📦 Creating product...')
    console.log('📋 Request body:', req.body)
    
    const { name, summary, description, ingredients, contains, weight, price, discountPrice, 
            images, category, qty, shelfLife, storageConditions, isFeatured } = req.body

    console.log('🖼️ Images received:', images?.length || 0)
    if (images && images.length > 0) {
      console.log('📸 First image preview:', images[0].substring(0, 50) + '...')
      console.log('📸 Image type check:', typeof images[0])
      console.log('📸 Is valid base64?', images[0].startsWith('data:image/'))
    }

    // Проверяем существование категории
    console.log('📂 Checking category:', category)
    const categoryExists = await Category.findById(category)
    if (!categoryExists) {
      return res.status(400).json({ message: "Категорію не знайдено" })
    }
    console.log('✅ Category found:', categoryExists.name)

    // Обработка изображений через сервис
    const processedImages = await uploadImages(images, "forchetta/products")
    
    console.log('✅ Images processed:', processedImages.length)

    const product = await Product.create({ 
      name, summary, description, ingredients, contains: contains || {}, 
      weight, price, discountPrice, images: processedImages, category,
      qty, shelfLife, storageConditions, isFeatured: isFeatured || false 
    })

    // Очищаем кеши при создании нового продукта
    await redis.del("featured_products")
    await redis.del("recommended_products")

    res.status(201).json(product)
  } catch (error) {
    console.log("❌ Error in createProduct controller:")
    console.log("Error message:", error.message)
    console.log("Error stack:", error.stack)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export const updateProduct = async (req, res) => {
  try {
    console.log('🔄 Updating product...')
    console.log('📋 Product ID:', req.params.id)
    console.log('📋 Request body:', req.body)
    
    const { id } = req.params
    const { name, summary, description, ingredients, contains, weight, price, discountPrice, 
            images, category, qty, shelfLife, storageConditions, isFeatured, existingImages } = req.body

    // Находим существующий продукт
    const existingProduct = await Product.findById(id)
    if (!existingProduct) {
      return res.status(404).json({ message: "Товар не знайдено" })
    }

    // Проверяем категорию если она изменилась
    if (category && category !== existingProduct.category?.toString()) {
      console.log('📂 Checking new category:', category)
      const categoryExists = await Category.findById(category)
      if (!categoryExists) {
        return res.status(400).json({ message: "Категорію не знайдено" })
      }
      console.log('✅ New category found:', categoryExists.name)
    }

    // Определяем какие старые изображения нужно удалить
    const imagesToDelete = []
    if (existingProduct.images && existingProduct.images.length > 0) {
      existingProduct.images.forEach(oldImage => {
        // Если изображение не найдено в existingImages, то его нужно удалить
        const stillExists = existingImages && existingImages.some(img => img.public_id === oldImage.public_id)
        if (!stillExists) {
          imagesToDelete.push(oldImage.public_id)
        }
      })
    }

    // Удаляем ненужные изображения из Cloudinary
    if (imagesToDelete.length > 0) {
      console.log('🗑️ Deleting removed images from Cloudinary:', imagesToDelete.length)
      try {
        for (const publicId of imagesToDelete) {
          await deleteImage(publicId)
        }
      } catch (deleteError) {
        console.log('⚠️ Error deleting some images:', deleteError.message)
      }
    }

    // Начинаем с существующих изображений (те что остались)
    let processedImages = existingImages || existingProduct.images || []
    
    // Обрабатываем новые изображения если они есть
    if (images && images.length > 0) {
      console.log('🖼️ New images received:', images.length)
      
      // Загружаем новые изображения
      const newUploadedImages = await uploadImages(images, "forchetta/products")
      console.log('✅ New images processed:', newUploadedImages.length)
      
      // ДОБАВЛЯЕМ новые изображения к существующим
      processedImages = [...processedImages, ...newUploadedImages]
      console.log('📸 Total images after update:', processedImages.length)
    }

    // Обновляем продукт
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { 
        name, summary, description, ingredients, contains: contains || {}, 
        weight, price, discountPrice, images: processedImages, category,
        qty, shelfLife, storageConditions, isFeatured: isFeatured || false 
      },
      { new: true, runValidators: true }
    ).populate('category', 'name image')

    // Очищаем кеши
    await redis.del("featured_products")
    await redis.del("recommended_products")

    console.log('✅ Product updated successfully')
    res.json(updatedProduct)
  } catch (error) {
    console.log("❌ Error in updateProduct controller:")
    console.log("Error message:", error.message)
    console.log("Error stack:", error.stack)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params
    const product = await Product.findById(id).populate('category', 'name image')
    
    if (!product) {
      return res.status(404).json({ message: "Товар не знайдено" })
    }

    res.json(product)
  } catch (error) {
    console.log("Error in getProductById controller", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    if (product.images) {
      // Удаляем изображения из Cloudinary
      await deleteImages(product.images)
    }

    await Product.findByIdAndDelete(req.params.id)

    // Очищаем кеши после удаления продукта
    await redis.del("featured_products")
    await redis.del("recommended_products")

    res.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.log("Error in deleteProduct controller", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params
  try {
    const products = await Product.find({ category }).populate('category', 'name image')
    res.json({ products })
  } catch (error) {
    console.log("Error in getProductsByCategory controller", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export const getRecommendedProducts = async (req, res) => {
  try {
    let recommendedProducts = await redis.get("recommended_products")
    if (recommendedProducts) {
      return res.json(JSON.parse(recommendedProducts))
    }

    // Пока логика рекомендаций без истории заказов
    const [newProducts, featuredProducts, discountedProducts] = await Promise.all([
      // Новинки (последние 3 товара)
      Product.find({}).populate('category', 'name image').sort({ createdAt: -1 }).limit(3).lean(),
      
      // Featured товары (2 товара)
      Product.find({ isFeatured: true }).populate('category', 'name image').limit(2).lean(),
      
      // Товары со скидкой (1 товар)
      Product.find({ discountPrice: { $gt: 0 } }).populate('category', 'name image').limit(1).lean()
    ])

    // Объединяем и убираем дубликаты
    const allRecommended = [...newProducts, ...featuredProducts, ...discountedProducts]
    const uniqueRecommended = allRecommended.filter((product, index, self) => 
      index === self.findIndex(p => p._id.toString() === product._id.toString())
    ).slice(0, 6) // Максимум 6 товаров

    // Кешируем на 1 день
    await redis.setex("recommended_products", 86400, JSON.stringify(uniqueRecommended))

    res.json(uniqueRecommended)
  } catch (error) {
    console.log("Error in getRecommendedProducts controller", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (product) {
      product.isFeatured = !product.isFeatured
      const updatedProduct = await product.save()
      await redis.del("featured_products")
      res.json(updatedProduct)
    } else {
      res.status(404).json({ message: "Product not found" })
    }
  } catch (error) {
    console.log("Error in toggleFeaturedProduct controller", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}
