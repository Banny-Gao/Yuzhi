import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsInt, Min, Max } from 'class-validator'
import { Type } from 'class-transformer'

export class SolarTermQueryDto {
  @ApiProperty({ description: '年份，默认为当前年份', required: false, example: 2024 })
  @IsOptional()
  @IsInt({ message: '年份必须是整数' })
  @Min(1900, { message: '年份不能小于1900' })
  @Max(2100, { message: '年份不能大于2100' })
  @Type(() => Number)
  year?: number
}
