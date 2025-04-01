import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'

@Injectable()
export class JuheApiService {
  private readonly logger = new Logger(JuheApiService.name)
  private readonly apiUrl: string

  constructor(private configService: ConfigService) {
    this.apiUrl = this.configService.get<string>('JUHE_API_URL')
  }

  /**
   * 获取二十四节气数据
   * @param year 年份
   * @returns 二十四节气数据
   */
  async getSolarTerms(year: number): Promise<any> {
    try {
      const url = `${this.apiUrl}fapig/solarTerms/query`
      this.logger.debug(`Requesting solar terms for year ${year}`)

      const response = await axios.get(url, {
        params: {
          key: '0531c828aabed1fc3420663fa2085d83', // 二十四节气接口的固定key
          year,
        },
        timeout: 10000,
      })

      const { error_code, reason, result } = response.data

      if (error_code !== 0) {
        this.logger.error(`Failed to get solar terms: code=${error_code}, reason=${reason}`)
        throw new HttpException(reason || '获取节气数据失败', HttpStatus.BAD_REQUEST)
      }

      if (!result || typeof result !== 'object') {
        this.logger.error('Invalid API response format')
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
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
        const errorMessage = error.response?.data?.reason || error.message
        this.logger.error(`API request failed: ${errorMessage}, status: ${status}`)
        throw new HttpException(`获取节气数据失败: ${errorMessage}`, status)
      }

      const err = error as { message?: string; stack?: string }
      this.logger.error(`Unexpected error: ${err.message || 'Unknown error'}`, err.stack)
      throw new HttpException('获取节气数据失败', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
