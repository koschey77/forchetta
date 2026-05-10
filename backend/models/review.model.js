import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000, 
    },
    status: {
      type: String,
      enum: ['pending', 'published', 'rejected'],
      default: 'pending',
    },
    adminReply: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Один користувач може залишити лише один відгук на певний товар
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
