import { makeAutoObservable } from 'mobx'

import { getStorage, setStorage, removeStorage, STORAGE_KEYS } from '@/utils/storage'
import { goTo } from '@/utils/router'
import { withCache, OpenAPI } from '@/utils/request'
import type { LoginUserDto, SmsLoginDto, LoginResponseDto, UserDto } from '@/utils/request'
export class UserStore {
  private token: string | null = null
  private userInfo: UserDto | null = null
  private loading = false

  constructor() {
    makeAutoObservable(this)
    this.initFromStorage()
  }

  private initFromStorage() {
    try {
      const token = getStorage<string>(STORAGE_KEYS.TOKEN)
      const userInfo = getStorage<UserDto>(STORAGE_KEYS.USER_INFO)

      if (token) {
        this.setToken(token)
      }

      if (userInfo) {
        this.setUserInfo(userInfo)
      }
    } catch (error) {
      console.error('Failed to initialize from storage:', error)
    }
  }

  private saveToStorage() {
    try {
      if (this.token) {
        setStorage(STORAGE_KEYS.TOKEN, this.token)
      } else {
        removeStorage(STORAGE_KEYS.TOKEN)
      }

      if (this.userInfo) {
        setStorage(STORAGE_KEYS.USER_INFO, this.userInfo)
      } else {
        removeStorage(STORAGE_KEYS.USER_INFO)
      }
    } catch (error) {
      console.error('Failed to save to storage:', error)
    }
  }

  // Handle successful authentication
  private async handleSuccessfulAuth(response) {
    const { accessToken, refreshToken, user } = response.data as LoginResponseDto

    // Store tokens
    setStorage(STORAGE_KEYS.TOKEN, accessToken)
    setStorage(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)

    // Update user state
    this.setUserInfo(user)
    this.setToken(accessToken)

    // Navigate to home
    goTo.home()

    return true
  }

  // Login with username/phone and password
  async login(loginData: LoginUserDto) {
    this.setLoading(true)

    try {
      const response = await withCache(
        async () => await OpenAPI.authControllerLogin({ body: loginData }),
        {
          key: 'login',
          ttl: 1000 * 60 * 10,
        }
      )

      return await this.handleSuccessfulAuth(response)
    } finally {
      this.setLoading(false)
    }
  }

  // Login with SMS code
  async smsLogin(smsData: SmsLoginDto) {
    this.setLoading(true)

    try {
      const response = await OpenAPI.authControllerSmsLogin({ body: smsData })

      return await this.handleSuccessfulAuth(response)
    } finally {
      this.setLoading(false)
    }
  }

  // Getters and setters
  get isAuthenticated(): boolean {
    return !!this.token
  }

  get isLoading(): boolean {
    return this.loading
  }

  get user(): UserDto | null {
    return this.userInfo
  }

  private setToken(token: string) {
    this.token = token
    this.saveToStorage()
  }

  private setUserInfo(user: UserDto) {
    this.userInfo = user
    this.saveToStorage()
  }

  private setLoading(loading: boolean) {
    this.loading = loading
  }
}

export const userStore = new UserStore()
