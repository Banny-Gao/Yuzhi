import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'

@Injectable()
export class JuheApiService {
  private readonly logger = new Logger(JuheApiService.name)
  private readonly apiUrl: string

  constructor(private configService: ConfigService) {
    this.apiUrl = this.configService.get<string>('JUHE_API_URL')

    // 记录配置信息，方便调试
    this.logger.log(`聚合数据API配置: apiUrl=${this.apiUrl}`)
  }

  /**
   * 获取二十四节气数据
   * @param year 年份
   * @returns 二十四节气数据
   */
  async getSolarTerms(year: number): Promise<any> {
    try {
      this.logger.log(`正在从聚合数据API获取${year}年二十四节气数据`)

      // API接口：https://www.juhe.cn/docs/api/id/620
      // 根据文档，正确的节气API路径是 fapig/solarTerms/query
      const url = `${this.apiUrl}fapig/solarTerms/query`
      const key = '0531c828aabed1fc3420663fa2085d83'
      this.logger.debug(`请求URL: ${url}, 参数: { key: ${key}, year: ${year} }`)

      const response = await axios.get(url, {
        params: {
          key,
          year,
        },
        timeout: 10000, // 10秒超时
      })

      this.logger.debug(`API响应状态: ${response.status}`)

      // 检查响应数据结构
      if (!response.data) {
        throw new HttpException('API返回空数据', HttpStatus.BAD_REQUEST)
      }

      const { error_code, reason, result } = response.data

      // 记录完整的响应数据，帮助调试
      this.logger.debug(`API响应数据: ${JSON.stringify(response.data).substring(0, 200)}...`)

      if (error_code !== 0) {
        this.logger.error(`获取二十四节气数据失败: 错误码=${error_code}, 原因=${reason}`)
        throw new HttpException(reason || '获取节气数据失败', HttpStatus.BAD_REQUEST)
      }

      if (!result || typeof result !== 'object') {
        this.logger.error('API返回的结果数据格式不正确')
        throw new HttpException('节气数据格式错误', HttpStatus.BAD_REQUEST)
      }

      // 检查API返回的数据是否包含节气信息
      const termKeys = Object.keys(result)
      this.logger.log(`API返回了${termKeys.length}个节气数据`)

      if (termKeys.length === 0) {
        this.logger.warn('API返回的节气数据为空')
      } else {
        this.logger.debug(`节气列表: ${termKeys.join(', ')}`)
      }

      return result
    } catch (error: unknown) {
      // 对于Axios错误，提供更详细的错误信息
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
        const errorMessage = error.response?.data?.reason || error.message

        this.logger.error(`Axios错误: ${errorMessage}, 状态码: ${statusCode}`)
        this.logger.error(`请求URL: ${error.config?.url}`)
        this.logger.error(`请求参数: ${JSON.stringify(error.config?.params)}`)

        throw new HttpException(`获取节气数据失败: ${errorMessage}`, statusCode)
      }

      const err = error as { message?: string; stack?: string }
      this.logger.error(`获取二十四节气数据异常: ${err.message || '未知错误'}`, err.stack)

      if (error instanceof HttpException) {
        throw error
      }

      throw new HttpException('获取节气数据失败', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
