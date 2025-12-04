import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  uid: string; // Firebase UID
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>('User', UserSchema);

