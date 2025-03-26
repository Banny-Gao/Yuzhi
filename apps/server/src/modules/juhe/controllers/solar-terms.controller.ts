import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { SolarTermsService } from '../services/solar-terms.service'
import { SolarTermQueryDto } from '../dto/solar-term-query.dto'
import { SolarTerm } from '../entities/solar-term.entity'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'

@ApiTags('节气')
@Controller('calendar/solar-terms')
export class SolarTermsController {
  constructor(private readonly solarTermsService: SolarTermsService) {}

  @ApiOperation({ summary: '获取二十四节气' })
  @ApiResponse({
    status: 200,
    description: '返回二十四节气数据',
    type: [SolarTerm],
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async getSolarTerms(@Query() query: SolarTermQueryDto) {
    return this.solarTermsService.getSolarTerms(query.year)
  }
}
