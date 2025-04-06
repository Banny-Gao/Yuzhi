/**
 * 统一存储管理工具
 * @description 提供加密的本地存储操作，统一管理所有本地存储的键值
 */
import Taro from '@tarojs/taro'
import CryptoJS from 'crypto-js'

// 加密密钥 - 实际应用中应从环境变量或安全配置获取
const ENCRYPTION_KEY = process.env.TARO_APP_ENCRYPTION_KEY

// 存储键定义 - 集中管理所有存储键
export const STORAGE_KEYS = {
  TOKEN: 'YUZHI_AUTH_TOKEN',
  REFRESH_TOKEN: 'YUZHI_REFRESH_TOKEN',
  USER_INFO: 'YUZHI_USER_INFO',
  SETTINGS: 'YUZHI_SETTINGS',
  THEME: 'YUZHI_THEME',
  LANGUAGE: 'YUZHI_LANGUAGE',
  LAST_LOGIN: 'YUZHI_LAST_LOGIN',
  PAGES_STACK: 'YUZHI_PAGES_STACK',
}

/**
 * 加密数据
 * @param data 要加密的数据
 * @returns 加密后的字符串
 */
export const encrypt = (data: any): string => {
  if (data === null || data === undefined) return ''

  const dataStr = typeof data === 'string' ? data : JSON.stringify(data)
  return CryptoJS.AES.encrypt(dataStr, ENCRYPTION_KEY!).toString()
}

/**
 * 解密数据
 * @param encryptedData 加密的字符串
 * @returns 解密后的数据
 */
export const decrypt = <T>(encryptedData: string): T | null => {
  if (!encryptedData) return null

  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY!)
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8)

    // 如果是JSON，则解析
    if (decryptedData.startsWith('{') || decryptedData.startsWith('[')) {
      return JSON.parse(decryptedData) as T
    }

    return decryptedData as unknown as T
  } catch (error) {
    console.error('解密数据失败:', error)
    return null
  }
}

/**
 * 保存数据到本地存储（自动加密）
 * @param key 存储键
 * @param data 要存储的数据
 * @param encrypt 是否加密，默认为true
 */
export const setStorage = <T>(key: string, data: T, shouldEncrypt = true): void => {
  try {
    const value = shouldEncrypt ? encrypt(data) : typeof data === 'string' ? data : JSON.stringify(data)
    Taro.setStorageSync(key, value)
  } catch (error) {
    console.error(`保存数据到 ${key} 失败:`, error)
  }
}

/**
 * 从本地存储获取数据（自动解密）
 * @param key 存储键
 * @param defaultValue 默认值，如果获取失败或不存在则返回
 * @param encrypted 是否已加密，默认为true
 * @returns 解密和解析后的数据，或默认值
 */
export const getStorage = <T>(key: string, defaultValue: T | null = null, encrypted = true): T | null => {
  try {
    const value = Taro.getStorageSync(key)
    if (!value) return defaultValue

    if (encrypted) {
      return decrypt<T>(value) || defaultValue
    }

    // 如果是JSON字符串，尝试解析
    if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
      try {
        return JSON.parse(value) as T
      } catch {
        return value as unknown as T
      }
    }

    return value as unknown as T
  } catch (error) {
    console.error(`获取数据 ${key} 失败:`, error)
    return defaultValue
  }
}

/**
 * 从本地存储中移除数据
 * @param key 存储键
 */
export const removeStorage = (key: string): void => {
  try {
    Taro.removeStorageSync(key)
  } catch (error) {
    console.error(`移除数据 ${key} 失败:`, error)
  }
}

/**
 * 清除所有本地存储
 */
export const clearStorage = (): void => {
  try {
    Taro.clearStorageSync()
  } catch (error) {
    console.error('清除所有存储失败:', error)
  }
}
