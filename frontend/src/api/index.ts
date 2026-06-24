import api from './client'
import type { AuthResponse, User, Product, PaginatedResponse, Category } from '../types'

// Auth
export const authApi = {
  register: (data: { name: string; email: string; password: string; role?: string }) =>
    api.post<AuthResponse>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),
}

// Users
export const usersApi = {
  getProfile: () => api.get<User>('/users/me'),
  updateProfile: (data: Partial<User>) => api.patch<User>('/users/me', data),
}

// Products
export const productsApi = {
  getAll: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<Product>>('/products', { params }),
  getById: (id: string) => api.get<Product>(`/products/${id}`),
  getMyProducts: () => api.get<Product[]>('/products/my-products'),
  create: (data: any) => api.post<Product>('/products', data),
  update: (id: string, data: any) => api.patch<Product>(`/products/${id}`, data),
  updateStatus: (id: string, status: string) =>
    api.patch(`/products/${id}/status`, { status }),
  delete: (id: string) => api.delete(`/products/${id}`),
}

// Categories
export const categoriesApi = {
  getAll: () => api.get<Category[]>('/categories'),
}

// Messages
export const messagesApi = {
  send: (data: { receiverId: string; content: string }) =>
    api.post('/messages', data),
  getConversationList: () => api.get('/messages'),
  getConversation: (userId: string) => api.get(`/messages/${userId}`),
}

// Reports
export const reportsApi = {
  create: (data: {
    reason: string
    details?: string
    targetUserId?: string
    targetProductId?: string
  }) => api.post('/reports', data),
}
