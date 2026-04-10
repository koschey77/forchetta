import mongoose from "mongoose"
import { PRODUCT_ENUMS } from "../constants/enums.js"

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
      enum: PRODUCT_ENUMS.shelfLife
    },
    storageConditions: {
      type: String,
      required: true,
      enum: PRODUCT_ENUMS.storageConditions
    },
    isFeatured: { type: Boolean, default: false },
    salesCount: { type: Number, default: 0 },
  },
  { timestamps: true },
)

const Product = mongoose.model("Product", productSchema)

export default Product
