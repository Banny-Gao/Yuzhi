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
    const targetYear = year || new Date().getFullYear()
    this.logger.debug(`Fetching solar terms for year ${targetYear}`)

    let solarTerms = await this.findSolarTermsByYear(targetYear)

    if (solarTerms.length === 0) {
      this.logger.debug(`No solar terms found in database for year ${targetYear}, fetching from API`)
      try {
        const apiData = await this.juheApiService.getSolarTerms(targetYear)
        solarTerms = await this.saveSolarTermsFromApi(targetYear, apiData)
      } catch (error: unknown) {
        const err = error as { message?: string }
        this.logger.error(`Failed to fetch solar terms from API: ${err.message || 'Unknown error'}`)
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
      where: { pub_year: year },
      order: { pub_date: 'ASC' },
    })
  }

  /**
   * 将API返回的节气数据保存到数据库
   * @param year 年份
   * @param apiData API返回的数据
   * @returns 保存后的节气数据列表
   */
  private async saveSolarTermsFromApi(year: number, apiData: any): Promise<SolarTerm[]> {
    if (!apiData || typeof apiData !== 'object') {
      this.logger.error('Invalid API response format')
      throw new BadRequestException('无法解析API返回的节气数据')
    }

    const solarTerms: SolarTerm[] = apiData.map(item => ({
      pub_year: year,
      pub_date: item.pub_date,
      pri_date: item.pri_date,
      pub_time: item.pub_time,
      des: item.des,
      name: item.name,
      youLai: item.youLai,
      xiSu: item.xiSu,
      heath: item.heath,
    }))

    if (solarTerms.length > 0) {
      try {
        return await this.solarTermRepository.save(solarTerms)
      } catch (error: unknown) {
        const err = error as { message?: string }
        this.logger.error(`Failed to save solar terms to database: ${err.message || 'Unknown error'}`)
        throw error
      }
    }

    this.logger.warn(`No valid solar terms data received from API`)
    return []
  }
}
