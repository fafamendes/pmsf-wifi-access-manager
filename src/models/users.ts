import mongoose, { Document, Model } from "mongoose";
import { AuthService } from "@src/services/auth";

export interface User {
  id?: string,
  name: string,
  username: string,
  role: 'ADMIN' | 'USER',
  password: string,
  status: boolean
}

export enum CUSTOM_VALIDATION {
  DUPLICATED = 'DUPLICATED',
}

export interface UserModel extends Omit<User, 'id'>, Document { }

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['ADMIN', 'USER'], default: 'USER' },
    status: { type: Boolean, default: true }
  },
  {
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      }
    }
  });

userSchema.path('username').validate(
  async (username: string) => {
    const user = await User.findOne({ username: username });
    return !user;
  },
  'Username already exists',
  CUSTOM_VALIDATION.DUPLICATED
);

userSchema.pre('save', async function () {
  if (!this.password || !this.isModified('password')) {
    return;
  }
  try {
    const hashedPassword = await AuthService.hashPassword(this.password);
    this.password = hashedPassword;
  } catch (error: any) {
    console.error('Error hashing password', error);
  }
});


export const User: Model<UserModel> = mongoose.model<UserModel>('User', userSchema);