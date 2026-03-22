import mongoose from "mongoose"

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
      version: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  }
)

const Category = mongoose.model("Category", categorySchema)

export default Category