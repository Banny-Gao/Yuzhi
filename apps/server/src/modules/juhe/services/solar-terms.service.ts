import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SolarTerm } from '../entities/solar-term.entity'
import { JuheApiService } from './juhe-api.service'

@Injectable()
export class SolarTermsService {
  private readonly logger = new Logger(SolarTermsService.name)

  constructor(
    @InjectRepository(SolarTerm)
    private readonly solarTermRepository: Repository<SolarTerm>,
    private readonly juheApiService: JuheApiService
  ) {}

  /**
   * 获取指定年份的二十四节气
   * @param year 年份，默认为当前年份
   * @returns 二十四节气数据列表
   */
  async getSolarTerms(year?: number): Promise<SolarTerm[]> {
    // 如果未指定年份，则使用当前年份
    const targetYear = year || new Date().getFullYear()
    this.logger.log(`获取${targetYear}年二十四节气数据`)

    // 首先从数据库中查询
    let solarTerms = await this.findSolarTermsByYear(targetYear)

    // 如果数据库中没有数据，则从聚合数据API获取
    if (solarTerms.length === 0) {
      this.logger.log(`数据库中没有${targetYear}年的节气数据，正在从API获取`)

      try {
        // 从聚合数据API获取
        const apiData = await this.juheApiService.getSolarTerms(targetYear)

        // 打印API返回的数据结构，帮助调试
        this.logger.debug(`API返回数据: ${JSON.stringify(apiData).substring(0, 200)}...`)

        // 转换并保存到数据库
        solarTerms = await this.saveSolarTermsFromApi(targetYear, apiData)
      } catch (error: unknown) {
        const err = error as { message?: string; stack?: string }
        this.logger.error(`从API获取节气数据失败: ${err.message || '未知错误'}`, err.stack)
        throw error
      }
    }

    return solarTerms
  }

  /**
   * 从数据库查询指定年份的节气数据
   * @param year 年份
   * @returns 节气数据列表
   */
  private async findSolarTermsByYear(year: number): Promise<SolarTerm[]> {
    return this.solarTermRepository.find({
      where: { year },
      order: { date: 'ASC' },
    })
  }

  /**
   * 将API返回的节气数据保存到数据库
   * @param year 年份
   * @param apiData API返回的数据
   * @returns 保存后的节气数据列表
   */
  private async saveSolarTermsFromApi(year: number, apiData: any): Promise<SolarTerm[]> {
    const solarTerms: SolarTerm[] = []

    // 确保apiData是有效的对象
    if (!apiData || typeof apiData !== 'object') {
      this.logger.error('API返回的数据格式无效')
      throw new BadRequestException('无法解析API返回的节气数据')
    }

    // 处理API返回的数据
    for (const key in apiData) {
      if (Object.prototype.hasOwnProperty.call(apiData, key)) {
        const termData = apiData[key]

        // 记录当前处理的数据，便于调试
        this.logger.debug(`处理节气: ${key}, 数据: ${JSON.stringify(termData)}`)

        // 数据验证：确保必要字段存在
        if (!termData || !termData.gregoriandate) {
          this.logger.warn(`节气 ${key} 数据无效或缺少必要字段, 跳过`)
          continue
        }

        // 创建新的节气实体
        const solarTerm = new SolarTerm()
        solarTerm.year = year
        solarTerm.name = key

        // 确保date字段有值
        if (termData.gregoriandate) {
          solarTerm.date = termData.gregoriandate // 公历日期
        } else {
          // 提供默认值，避免数据库错误
          const defaultDate = `${year}-01-01`
          this.logger.warn(`节气 ${key} 缺少日期数据，使用默认值: ${defaultDate}`)
          solarTerm.date = defaultDate
        }

        // 确保lunarDate字段有值
        if (termData.lunardate) {
          solarTerm.lunarDate = termData.lunardate // 农历日期
        } else {
          // 提供默认值
          solarTerm.lunarDate = '未知'
          this.logger.warn(`节气 ${key} 缺少农历日期数据，使用默认值`)
        }

        // 设置介绍信息
        solarTerm.intro = termData.intro || '' // 如果API提供了介绍则使用，否则为空字符串

        // 保存到数组
        solarTerms.push(solarTerm)
      }
    }

    // 批量保存到数据库
    if (solarTerms.length > 0) {
      this.logger.log(`正在保存${year}年的${solarTerms.length}个节气数据到数据库`)

      // 打印第一个节气数据，用于调试
      this.logger.debug(`示例节气数据: ${JSON.stringify(solarTerms[0])}`)

      try {
        return await this.solarTermRepository.save(solarTerms)
      } catch (error: unknown) {
        const err = error as { message?: string; stack?: string }
        this.logger.error(`保存节气数据到数据库失败: ${err.message || '未知错误'}`, err.stack)
        throw error
      }
    } else {
      this.logger.warn(`未从API获取到有效的节气数据`)
      return []
    }
  }
}
