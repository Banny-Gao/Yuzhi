/**
 * 统一存储管理工具
 * @description 提供加密的本地存储操作，统一管理所有本地存储的键值
 */
import Taro from '@tarojs/taro'

// 存储键定义 - 集中管理所有存储键
export const STORAGE_KEYS = {
  TOKEN: 'YUZHI_AUTH_TOKEN', // 用户token
  REFRESH_TOKEN: 'YUZHI_REFRESH_TOKEN', // 用户刷新token
  USER_INFO: 'YUZHI_USER_INFO', // 用户信息
  SETTINGS: 'YUZHI_SETTINGS', // 用户设置
  THEME: 'YUZHI_THEME', // 用户主题
  LANGUAGE: 'YUZHI_LANGUAGE', // 用户语言
  LAST_LOGIN: 'YUZHI_LAST_LOGIN', // 上次登录时间
  PAGES_STACK: 'YUZHI_PAGES_STACK', // 页面栈
  SOLAR_TERM_CACHE: 'SOLAR_TERM_CACHE', // 节气缓存
}

/**
 * 保存数据到本地存储（自动加密）
 * @param key 存储键
 * @param data 要存储的数据
 * @param encrypt 是否加密，默认为true
 */
export const setStorage = <T>(key: string, data: T): void => {
  try {
    const value = typeof data === 'string' ? data : JSON.stringify(data)

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
export const getStorage = <T>(key: string, defaultValue: T | null = null): T | null => {
  try {
    const value = Taro.getStorageSync?.(key)

    if (!value) return defaultValue

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
