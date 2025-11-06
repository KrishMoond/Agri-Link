import apiClient from '../configs/api';
import { User } from '../types';

export const userService = {
  // Get user profile
  async getUserProfile(): Promise<User | null> {
    try {
      const response = await apiClient.get('/users/profile');
      return { ...response.data, uid: response.data._id };
    } catch (error) {
      return null;
    }
  },

  // Get user by ID
  async getUserById(uid: string): Promise<User | null> {
    try {
      const response = await apiClient.get(`/users/${uid}`);
      return { ...response.data, uid: response.data._id };
    } catch (error) {
      return null;
    }
  },

  // Update user profile
  async updateUser(updates: Partial<User>): Promise<void> {
    await apiClient.put('/users/profile', updates);
  },

  // Check if user is seller
  async isSeller(uid: string): Promise<boolean> {
    const user = await this.getUserById(uid);
    return user?.role === 'seller';
  }
};
