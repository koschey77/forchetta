import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Заголовок статті обов\'язковий'],
      trim: true,
    },
    excerpt: {
      type: String,
      required: [true, 'Короткий опис обов\'язковий'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Текст статті обов\'язковий'],
    },
    imageUrl: {
      type: String,
      default: '', 
    },
    status: {
      type: String,
      enum: ['Опубліковано', 'Чернетка', 'Приховано'],
      default: 'Чернетка',
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Автоматично додасть поля createdAt та updatedAt
  }
);

export const Article = mongoose.model('Article', articleSchema);
