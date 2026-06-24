export interface User {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  avatar?: string
  role: 'PROVIDER' | 'SEEKER' | 'ADMIN'
  isActive?: boolean
  createdAt?: string
  _count?: {
    products: number
  }
}

export interface Category {
  id: string
  name: string
  slug: string
  icon?: string
  _count?: {
    products: number
  }
}

export interface ProductImage {
  id: string
  url: string
  productId: string
}

export interface Location {
  id: string
  address: string
  latitude?: number
  longitude?: number
  productId: string
}

export interface Product {
  id: string
  title: string
  description: string
  price?: number
  condition: 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR' | 'POOR'
  type: 'SELL' | 'EXCHANGE' | 'DONATE'
  status: 'AVAILABLE' | 'SOLD' | 'EXCHANGED' | 'DONATED'
  createdAt: string
  updatedAt: string
  ownerId: string
  categoryId: string
  images: ProductImage[]
  location?: Location
  category: Category
  owner: Pick<User, 'id' | 'name' | 'email' | 'phone' | 'avatar'> & {
    createdAt?: string
    _count?: { products: number }
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface AuthResponse {
  user: Pick<User, 'id' | 'email' | 'name' | 'role'>
  accessToken: string
}

export interface Message {
  id: string
  content: string
  isRead: boolean
  createdAt: string
  senderId: string
  receiverId: string
  sender: Pick<User, 'id' | 'name' | 'avatar'>
}

export interface Report {
  id: string
  reason: 'SPAM' | 'SCAM' | 'INAPPROPRIATE_CONTENT' | 'OTHER'
  details?: string
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED'
  createdAt: string
  reporterId: string
  targetUserId?: string
  targetProductId?: string
}
