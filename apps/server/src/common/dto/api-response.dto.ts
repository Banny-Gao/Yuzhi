import { ApiProperty } from '@nestjs/swagger'

/**
 * 通用API响应DTO
 * @template T - 响应数据类型
 */
export class ApiResponse<T = any> {
  @ApiProperty({
    description: '响应状态码',
    example: 200,
  })
  code: number

  @ApiProperty({
    description: '响应数据',
    example: {},
    type: 'object',
  })
  data: T

  @ApiProperty({
    description: '响应消息',
    example: '操作成功',
  })
  message: string
}
