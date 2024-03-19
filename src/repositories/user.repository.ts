
import mongoose from 'mongoose'
import { User } from '../models/users'
import { AuthService } from '@src/services/auth';

export class UserRepository {
  static async createUser(data: User): Promise<User> {
    return await User.create(data)
  }

  static async createManyUsers(data: User[]): Promise<User[]> {
    return await User.insertMany(data);
  }

  static async getUsersCount(): Promise<number> {
    return await User.countDocuments({});
  }

  static async getById(id: string): Promise<User | null> {
    return await User.findById(new mongoose.Types.ObjectId(id));
  }

  static async getUserByUsername(username: string): Promise<User | null> {
    return await User.findOne({ username })
  }

  static async getUsersByName(name: string): Promise<User[]> {
    return await User.find({ name })
  }

  static async getAllUsers(): Promise<User[]> {
    return await User.find({});
  }

  static async getLikeUsername(username: string, limit: number, removeUserId?: string): Promise<User[]> {
    username = username.replace(/[^\w\s]/gi, '');
    return await User.find({ username: { $regex: new RegExp('^' + username, 'i') }, _id: { $ne: removeUserId } })
      .limit(limit);
  }

  static async getLikeName(name: string, limit: number, removeUserId?: string): Promise<User[]> {
    name = name.replace(/[^\w\s]/gi, '');
    return await User.find({ name: { $regex: new RegExp('^' + name, 'i') }, _id: { $ne: removeUserId } })
      .limit(limit);
  }

  static async deleteUser(id: string): Promise<User | null> {
    return await User.findByIdAndDelete(id)
  }

  static async updateUser(id: string, data: User): Promise<User | null> {
    return await User.findByIdAndUpdate(id, data, { new: true })
  }

  static async updateUserPassword(id: string, password: string) {
    const hashedPassword = await AuthService.hashPassword(password);
    return await User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true })
  }

}