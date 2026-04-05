import Product from "../models/product.model.js"
import Category from "../models/category.model.js"
import { uploadImages, deleteImages, deleteImage } from "../lib/imageService.js"
import { redis } from "../lib/redis.js"

export const getAllProducts = async (req, res) => {
  try {
    const { 
      categories, 
      ingredients, 
      priceMin, 
      priceMax, 
      weights, 
      sortBy, 
      sortOrder = 'asc',
      page = 1, 
      limit = 12,
      search  // Новый параметр поиска
    } = req.query;

    // Строим объект фильтрации
    let filter = {};

    // Фильтр по категориям
    if (categories) {
      const categoryIds = categories.split(',');
      filter.category = { $in: categoryIds };
    }

    // Фильтр по ингредиентам 
    if (ingredients) {
      const ingredientList = ingredients.split(',');
      const ingredientFilters = [];

      ingredientList.forEach(ingredient => {
        switch (ingredient) {
          case 'З горіхами':
            ingredientFilters.push({ 'contains.nuts': true });
            break;
          case 'Без горіхів':
            ingredientFilters.push({ 'contains.nuts': false });
            break;
          case 'Без пальмової олії':
            ingredientFilters.push({ 'contains.palmOil': false });
            break;
          case 'Без лактози':
            ingredientFilters.push({ 'contains.lactose': false });
            break;
          case 'Без глютену':
            ingredientFilters.push({ 'contains.gluten': false });
            break;
        }
      });

      if (ingredientFilters.length > 0) {
        // Добавляем ингредиенты в существующий $and или создаем новый
        if (filter.$and) {
          filter.$and = [...filter.$and, ...ingredientFilters];
        } else {
          filter.$and = ingredientFilters;
        }
      }
    }

    // Фильтр по диапазону цен
    if (priceMin || priceMax) {
      filter.$expr = {};
      const priceField = {
        $cond: {
          if: { $gt: ["$discountPrice", 0] },
          then: "$discountPrice",
          else: "$price"
        }
      };

      if (priceMin && priceMax) {
        filter.$expr.$and = [
          { $gte: [priceField, parseInt(priceMin)] },
          { $lte: [priceField, parseInt(priceMax)] }
        ];
      } else if (priceMin) {
        filter.$expr.$gte = [priceField, parseInt(priceMin)];
      } else if (priceMax) {
        filter.$expr.$lte = [priceField, parseInt(priceMax)];
      }
    }

    // Фильтр по весу
    if (weights) {
      const weightList = weights.split(',').map(w => parseInt(w));
      filter.weight = { $in: weightList };
    }

    // Поиск по названию, описанию и ингредиентам
    if (search && search.trim()) {
      const searchTerm = search.trim();
      const searchRegex = new RegExp(searchTerm, 'i'); // case-insensitive поиск
      
      const searchConditions = {
        $or: [
          { name: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
          { 'ingredients.name': { $regex: searchRegex } } // поиск в массиве ингредиентов
        ]
      };

      // Добавляем поисковые условия в $and
      if (filter.$and) {
        filter.$and.push(searchConditions);
      } else {
        filter.$and = [searchConditions];
      }
    }

    // Настройка сортировки
    let sort = {};
    if (sortBy) {
      switch (sortBy) {
        case 'price':
          // Сортировка по цене (с учетом скидочной цены)
          sort = sortOrder === 'desc' ? { price: -1 } : { price: 1 };
          break;
        case 'new':
          sort = { createdAt: -1 };
          break;
        case 'sales':
          // Сортировка по акциям: сначала товары со скидкой, потом остальные
          sort = { 
            discountPrice: -1, // Товары со скидкой (discountPrice > 0) в начале
            price: 1           // Внутри каждой группы сортируем по цене
          };
          break;
        case 'name':
          sort = { name: sortOrder === 'desc' ? -1 : 1 };
          break;
        default:
          sort = { createdAt: -1 };
      }
    } else {
      sort = { createdAt: -1 }; // По умолчанию сортируем по дате создания
    }

    // Пагинация
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Выполняем запрос с фильтрами, сортировкой и пагинацией
    const [products, totalCount] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name image')
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(filter)
    ]);

    // Метаданные для пагинации
    const totalPages = Math.ceil(totalCount / limitNum);
    const hasMore = pageNum < totalPages;

    res.json({ 
      products,
      pagination: {
        currentPage: pageNum,
        limit: limitNum,
        total: totalCount,
        totalPages,
        hasMore
      }
    });

  } catch (error) {
    console.log("Error in getAllProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
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
    const { name, summary, description, ingredients, contains, weight, price, discountPrice, 
            images, category, qty, shelfLife, storageConditions, isFeatured } = req.body

    // Проверяем существование категории
    const categoryExists = await Category.findById(category)
    if (!categoryExists) {
      return res.status(400).json({ message: "Категорію не знайдено" })
    }

    // Обработка изображений через сервис
    const processedImages = await uploadImages(images, "forchetta/products")

    const product = await Product.create({ 
      name, summary, description, ingredients, contains: contains || {}, 
      weight, price, discountPrice, images: processedImages, category,
      qty, shelfLife, storageConditions, isFeatured: isFeatured || false 
    })

    // Очищаем кеши при создании нового продукта
    await redis.del("featured_products")
    await redis.del("recommended_products")
    await redis.del("available_weights")

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
      const categoryExists = await Category.findById(category)
      if (!categoryExists) {
        return res.status(400).json({ message: "Категорію не знайдено" })
      }
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
      // Загружаем новые изображения
      const newUploadedImages = await uploadImages(images, "forchetta/products")
      
      // ДОБАВЛЯЕМ новые изображения к существующим
      processedImages = [...processedImages, ...newUploadedImages]
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
    await redis.del("available_weights")

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
    await redis.del("available_weights")

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
      await redis.del("available_weights")
      res.json(updatedProduct)
    } else {
      res.status(404).json({ message: "Product not found" })
    }
  } catch (error) {
    console.log("Error in toggleFeaturedProduct controller", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export const getAvailableWeights = async (req, res) => {
  try {
    // Проверяем кэш
    let availableWeights = await redis.get("available_weights")
    if (availableWeights) {
      return res.json(JSON.parse(availableWeights))
    }

    // Получаем все уникальные веса из базы данных
    const weights = await Product.distinct('weight')
    
    // Фильтруем null значения и сортируем
    const filteredWeights = weights
      .filter(weight => weight != null && weight > 0)
      .sort((a, b) => a - b)

    // Кешируем на 1 час (данные редко меняются)
    await redis.setex("available_weights", 3600, JSON.stringify(filteredWeights))

    res.json(filteredWeights)
  } catch (error) {
    console.log("Error in getAvailableWeights controller", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}
