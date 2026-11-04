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

export interface FormFieldSchema {
  name: string
  label: string
  type: 'string' | 'number' | 'select'
  options?: string[]
  required?: boolean
}

export interface Category {
  id: string
  name: string
  slug: string
  icon?: string
  formSchema?: FormFieldSchema[]
  _count?: {
    products: number
  }
}

export interface ProductImage {
  id: string
  url: string
  productId: string
}

export interface Tag {
  id: string
  name: string
}

export interface Location {
  id: string
  address: string
  latitude?: number
  longitude?: number
  provinceId?: string
  districtId?: string
  wardId?: string
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
  attributes?: Record<string, any>
  createdAt: string
  updatedAt: string
  ownerId: string
  images: ProductImage[]
  location?: Location
  categories: Category[]
  tags?: Tag[]
  owner: Pick<User, 'id' | 'name' | 'email' | 'phone' | 'avatar'> & {
    createdAt?: string
    _count?: { products: number }
  }
  distanceMeters?: number
  distanceKm?: number
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
  reporter?: Pick<User, 'id' | 'name' | 'email'>
  targetUser?: Pick<User, 'id' | 'name' | 'email' | 'isActive'>
  targetProduct?: Pick<Product, 'id' | 'title' | 'status'>
}
