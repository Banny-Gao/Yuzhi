import { makeAutoObservable } from 'mobx'
import Taro from '@tarojs/taro'
import { withErrorHandling, withNetworkCheck } from '@/utils/requestHelpers'
import { AuthService } from '@workspace/request'
import type { LoginUserDto, SmsLoginDto, CreateUserDto } from '@workspace/request'

// Define UserProfileDto since it's not exported from @workspace/request
export interface UserProfileDto {
  id: string
  username: string
  email?: string
  phoneNumber?: string
  avatar?: string
  createdAt?: string
  updatedAt?: string
  [key: string]: any
}

// Storage keys
const TOKEN_STORAGE_KEY = 'token'
const USER_INFO_STORAGE_KEY = 'userInfo'

export class UserStore {
  // User state
  isLoggedIn: boolean = false
  token: string | null = null
  userInfo: UserProfileDto | null = null
  loading: boolean = false

  constructor() {
    makeAutoObservable(this)
    this.initFromStorage()
  }

  // Initialize from local storage
  initFromStorage() {
    try {
      const token = Taro.getStorageSync(TOKEN_STORAGE_KEY)
      const userInfo = Taro.getStorageSync(USER_INFO_STORAGE_KEY)

      if (token) {
        this.token = token
        this.isLoggedIn = true
      }

      if (userInfo) {
        this.userInfo = JSON.parse(userInfo)
      }
    } catch (error) {
      console.error('Failed to restore user state from storage:', error)
    }
  }

  // Save state to storage
  saveToStorage() {
    try {
      if (this.token) {
        Taro.setStorageSync(TOKEN_STORAGE_KEY, this.token)
      } else {
        Taro.removeStorageSync(TOKEN_STORAGE_KEY)
      }

      if (this.userInfo) {
        Taro.setStorageSync(USER_INFO_STORAGE_KEY, JSON.stringify(this.userInfo))
      } else {
        Taro.removeStorageSync(USER_INFO_STORAGE_KEY)
      }
    } catch (error) {
      console.error('Failed to save user state to storage:', error)
    }
  }

  // Set loading state
  setLoading(loading: boolean) {
    this.loading = loading
  }

  // Set user token
  setToken(token: string | null) {
    this.token = token
    this.isLoggedIn = !!token
    this.saveToStorage()
  }

  // Set user info
  setUserInfo(userInfo: UserProfileDto | null) {
    this.userInfo = userInfo
    this.saveToStorage()
  }

  // Login with username/phone and password
  async login(loginData: LoginUserDto) {
    this.setLoading(true)

    try {
      const response = await withErrorHandling(() => withNetworkCheck(() => AuthService.authControllerLogin(loginData)), '登录失败，请检查您的用户名和密码')

      if (response && response.token) {
        this.setToken(response.token)
        await this.fetchUserProfile()
        return true
      }
      return false
    } catch (error) {
      console.error('Login failed:', error)
      return false
    } finally {
      this.setLoading(false)
    }
  }

  // Login with SMS code
  async smsLogin(smsData: SmsLoginDto) {
    this.setLoading(true)

    try {
      const response = await withErrorHandling(() => withNetworkCheck(() => AuthService.authControllerLoginWithSms(smsData)), '登录失败，请检查您的验证码')

      if (response && response.token) {
        this.setToken(response.token)
        await this.fetchUserProfile()
        return true
      }
      return false
    } catch (error) {
      console.error('SMS login failed:', error)
      return false
    } finally {
      this.setLoading(false)
    }
  }

  // Register new user
  async register(userData: CreateUserDto) {
    this.setLoading(true)

    try {
      const response = await withErrorHandling(() => withNetworkCheck(() => AuthService.authControllerRegister(userData)), '注册失败，请稍后重试')

      if (response && response.token) {
        this.setToken(response.token)
        await this.fetchUserProfile()
        return true
      }
      return false
    } catch (error) {
      console.error('Registration failed:', error)
      return false
    } finally {
      this.setLoading(false)
    }
  }

  // Fetch user profile
  async fetchUserProfile() {
    if (!this.token) return null

    this.setLoading(true)

    try {
      const userProfile = await withErrorHandling(() => withNetworkCheck(() => AuthService.authControllerGetProfile()), '获取用户信息失败')

      if (userProfile) {
        this.setUserInfo(userProfile)
        return userProfile
      }
      return null
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      return null
    } finally {
      this.setLoading(false)
    }
  }

  // Logout
  logout() {
    this.setToken(null)
    this.setUserInfo(null)
    this.isLoggedIn = false
  }
}

// Create a singleton instance
export const userStore = new UserStore()

export default userStore
