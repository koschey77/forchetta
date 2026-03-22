import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    summary: { type: String },
    description: { type: String, required: true },
    ingredients: { type: String },
    contains: {
      lactose: { type: Boolean, default: false },
      gluten: { type: Boolean, default: false },
      nuts: { type: Boolean, default: false },
      palmOil: { type: Boolean, default: false },
    },
    weight: { type: Number, min: 0 },
    price: { type: Number, min: 0, required: true },
    discountPrice: { type: Number, min: 0 },
    images: [{
      url: { type: String, required: true },
      public_id: { type: String, required: true },
      version: { type: Number }
    }],
    category: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    qty: { type: Number, min: 0, required: true },
    shelfLife: { 
      type: String,
      required: true,
      enum: ['36 годин', '2 доби', '3 доби', '4 доби', '5 діб', '14 діб', '21 доба', '6 місяців']
    },
    storageConditions: {
      type: String,
      required: true,
      enum: ['від +2°C до +6°C', 'до +20°C']
    },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true },
)

const Product = mongoose.model("Product", productSchema)

export default Product
