import api from './client'
import type { AuthResponse, User, Product, PaginatedResponse, Category, Report } from '../types'

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
  getAll: () => api.get<User[]>('/users'),
  toggleActive: (id: string) => api.patch<User>(`/users/${id}/toggle-active`),
}

// Products
export const productsApi = {
  getAll: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<Product>>('/products', { params }),
  search: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<Product>>('/products/search', { params }),
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
  getById: (id: string) => api.get<Category>(`/categories/${id}`),
}

// Messages
export const messagesApi = {
  send: (data: { receiverId: string; content: string }) =>
    api.post('/messages', data),
  getConversationList: () => api.get('/messages'),
  getConversation: (userId: string) => api.get(`/messages/${userId}`),
  markAsRead: (senderId: string) => api.patch(`/messages/${senderId}/read`),
}

// Reports
export const reportsApi = {
  create: (data: {
    reason: string
    details?: string
    targetUserId?: string
    targetProductId?: string
  }) => api.post('/reports', data),
  getAll: (status?: string) => api.get<Report[]>('/reports', { params: { status } }),
  handle: (id: string, data: { status: string; blockUser?: boolean; blockProduct?: boolean }) =>
    api.patch(`/reports/${id}/handle`, data),
}
