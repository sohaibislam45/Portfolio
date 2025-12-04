import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  name: string;
  role: string;
  company?: string;
  content: string;
  avatar?: string;
  rating?: number;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);

