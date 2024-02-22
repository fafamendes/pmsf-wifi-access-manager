
import { User } from '../models/users'

export class UserRepository {
  static async createUser(data: User): Promise<User> {
    return await User.create(data)
  }

  static async getAllUsers(): Promise<User[]> {
    return await User.find()
  }
  
  static async getById(id: string): Promise<User | null> {
    return await User.findById(id)
  }

  static async getUserByUsername(username: string): Promise<User | null> {
    return await User.findOne({ username })
  }

  static async getUsersByName(name: string): Promise<User[]> {
    return await User.find({ name })
  }

  static async deleteUser(id: string): Promise<User | null> {
    return await User.findByIdAndDelete(id)
  }

  static async updateUser(id: string, data: User): Promise<User | null> {
    return await User.findByIdAndUpdate(id, data, { new: true })
  }
}