// Authentication Service

import { apiService } from './api';
import { setAuthToken, removeAuthToken } from '@/config/api';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider?: 'local' | 'google';
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface GoogleAuthData {
  idToken: string;
}

class AuthService {
  async register(data: RegisterData): Promise<User> {
    const response = await apiService.post<User>('/auth/register', data);
    if (response.success && response.data) {
      setAuthToken(response.data.token);
      return response.data;
    }
    throw new Error(response.message || 'Registration failed');
  }

  async login(credentials: LoginCredentials): Promise<User> {
    const response = await apiService.post<User>('/auth/login', credentials);
    if (response.success && response.data) {
      setAuthToken(response.data.token);
      return response.data;
    }
    throw new Error(response.message || 'Login failed');
  }

  async googleAuth(data: GoogleAuthData): Promise<User> {
    const response = await apiService.post<User>('/auth/google', data);
    if (response.success && response.data) {
      setAuthToken(response.data.token);
      return response.data;
    }
    throw new Error(response.message || 'Google authentication failed');
  }

  logout(): void {
    removeAuthToken();
  }

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  setCurrentUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('user', JSON.stringify(user));
  }
}

export const authService = new AuthService();
