import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AppService } from './app.service'

/**
 * 应用根控制器
 *
 * 处理应用层面的基本HTTP请求
 * 主要用于健康检查、基本信息和服务状态等接口
 */
@ApiTags('App') // Swagger文档标签
@Controller() // 路由前缀为空，表示根路径(/)
export class AppController {
  /**
   * 构造函数，通过依赖注入获取AppService的实例
   * @param _appService 应用服务实例
   */
  constructor(private readonly _appService: AppService) {}
}
