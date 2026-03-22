import cloudinary from "./cloudinary.js"

console.log('🔧 imageService loaded, cloudinary config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'present' : 'missing',
  api_key: process.env.CLOUDINARY_API_KEY ? 'present' : 'missing',
  api_secret: process.env.CLOUDINARY_API_SECRET ? 'present' : 'missing'
})

export const uploadImages = async (images, folder = "forchetta/products") => {
  console.log('📤 uploadImages called with:', images ? 'images present' : 'no images')
  
  if (!images) return []
  
  const imageArray = Array.isArray(images) ? images : [images]
  console.log('📊 Processing images count:', imageArray.length)
  
  try {
    // Параллельная загрузка изображений
    const uploadPromises = imageArray.map((img, index) => {
      console.log(`🖼️ Uploading image ${index + 1}/${imageArray.length}`)
      return cloudinary.uploader.upload(img, { 
        asset_folder: folder,
        resource_type: "auto"
      })
    })
    
    console.log('⏳ Starting parallel upload...')
    const uploadResults = await Promise.all(uploadPromises)
    console.log('✅ All uploads completed successfully')
    
    return uploadResults.map(result => ({
      url: result.secure_url,
      public_id: result.public_id,
      version: result.version
    }))
  } catch (error) {
    console.log('❌ Error in uploadImages:', error.message)
    console.log('❌ Error stack:', error.stack)
    throw error
  }
}

export const deleteImages = async (images) => {
  if (!images || !images.length) return
  
  const deletePromises = images.map(image => 
    cloudinary.uploader.destroy(image.public_id)
  )
  
  await Promise.all(deletePromises)
}

export const deleteImage = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId)
}