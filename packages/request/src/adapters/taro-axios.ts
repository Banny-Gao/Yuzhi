/**
 * Taro环境下的axios适配器
 * 为小程序环境提供与axios相同接口的实现
 */
import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { taroRequest } from './taro-adapter'

// 创建简化的axios对象用于小程序环境
const taroAxios = {
  // 基础请求方法
  request: async <T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    if (process.env.TARO_ENV && process.env.TARO_ENV !== 'h5') {
      return (await taroRequest(config)) as AxiosResponse<T>
    } else {
      return await axios(config)
    }
  },

  // HTTP方法
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return taroAxios.request<T>({ ...config, url, method: 'GET' })
  },

  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return taroAxios.request<T>({ ...config, url, method: 'POST', data })
  },

  put: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return taroAxios.request<T>({ ...config, url, method: 'PUT', data })
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return taroAxios.request<T>({ ...config, url, method: 'DELETE' })
  },

  patch: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return taroAxios.request<T>({ ...config, url, method: 'PATCH', data })
  },

  head: async <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return taroAxios.request<T>({ ...config, url, method: 'HEAD' })
  },

  options: async <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return taroAxios.request<T>({ ...config, url, method: 'OPTIONS' })
  },

  // 配置
  defaults: {
    baseURL: undefined,
    timeout: 0,
    withCredentials: false,
    headers: {},
  },

  // 拦截器
  interceptors: {
    request: {
      use: (onFulfilled, onRejected) => {
        // 简化的拦截器实现
        return { id: 1 }
      },
      eject: id => {
        // 简化的拦截器实现
      },
      clear: () => {
        // 简化的拦截器实现
      },
    },
    response: {
      use: (onFulfilled, onRejected) => {
        // 简化的拦截器实现
        return { id: 1 }
      },
      eject: id => {
        // 简化的拦截器实现
      },
      clear: () => {
        // 简化的拦截器实现
      },
    },
  },

  // 工厂方法
  create: () => {
    return { ...taroAxios }
  },
}

export default taroAxios
