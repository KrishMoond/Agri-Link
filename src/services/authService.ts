import apiClient from '../configs/api';
import { setAuthToken, setCurrentUser, removeAuthToken, removeCurrentUser } from '../configs/auth';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  location: string[];
  gender: string;
  dob: string;
  role: 'buyer' | 'farmer' | 'retailer' | 'expert';
  gstNumber?: string;
  farmerCardNumber?: string;
}

export const authService = {
  async login(data: LoginData) {
    const response = await apiClient.post('/auth/login', data);
    const { token, user } = response.data;
    setAuthToken(token);
    setCurrentUser(user);
    return { token, user };
  },

  async register(data: RegisterData) {
    const formattedData = {
      ...data,
      location: {
        state: data.location[0],
        district: data.location[1],
        village: data.location[2],
        pincode: data.location[3]
      }
    };
    const response = await apiClient.post('/auth/register', formattedData);
    const { token, user } = response.data;
    setAuthToken(token);
    setCurrentUser(user);
    return { token, user };
  },

  logout() {
    removeAuthToken();
    removeCurrentUser();
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  },

  hasRole(requiredRole: string): boolean {
    const user = this.getCurrentUser();
    return user && user.role === requiredRole;
  },

  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return user && roles.includes(user.role);
  }
};
