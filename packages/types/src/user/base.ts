export interface User {
  id: string
  username: string
  email: string
  displayName?: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST',
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  notifications: boolean
  language: string
}
