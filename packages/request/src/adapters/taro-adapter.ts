/**
 * Taro环境适配器
 * 实现小程序环境下的FormData和请求适配
 */
import Taro from '@tarojs/taro'
import type { AxiosResponse, AxiosRequestConfig } from 'axios'

/**
 * Taro环境下的FormData替代实现
 */
export class TaroFormData {
  private data: Record<string, any> = {}

  /**
   * 添加表单项
   */
  append(key: string, value: any, _filename?: string) {
    this.data[key] = value
  }

  /**
   * 获取处理后的数据对象
   */
  getBody() {
    return this.data
  }

  /**
   * 兼容axios所需的getHeaders方法
   */
  getHeaders() {
    return {
      'Content-Type': 'multipart/form-data',
    }
  }
}

/**
 * 适配Taro请求到Axios响应格式
 */
export const taroRequest = async (config: AxiosRequestConfig): Promise<AxiosResponse> => {
  // 确保url存在
  if (!config.url) {
    throw new Error('URL is required for Taro request adapter')
  }

  // 处理FormData类型的数据
  let data = config.data
  if (data instanceof TaroFormData) {
    data = (data as TaroFormData).getBody()
  }

  try {
    const response = await Taro.request({
      url: config.url,
      method: (config.method || 'GET') as any,
      header: config.headers as Record<string, string>,
      data,
      credentials: config.withCredentials ? 'include' : 'same-origin',
    })

    // 将Taro响应转换为Axios响应格式
    return {
      data: response.data,
      status: response.statusCode,
      statusText: response.errMsg,
      headers: response.header as Record<string, string>,
      config: config as any,
      request: {} as any,
    }
  } catch (error) {
    // 转换错误为Axios格式
    const axiosError: any = new Error('Request failed')
    axiosError.isAxiosError = true
    axiosError.response = {
      status: (error as any).statusCode || 500,
      statusText: (error as any).errMsg || 'Request failed',
      data: (error as any).data,
      headers: (error as any).header,
      config: config as any,
    }
    throw axiosError
  }
}
