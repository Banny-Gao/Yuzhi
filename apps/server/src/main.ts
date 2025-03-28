import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module'

/**
 * 应用程序引导函数 - 负责创建并配置NestJS应用实例
 * 1. 创建NestJS应用实例
 * 2. 配置全局中间件和管道
 * 3. 设置API文档
 * 4. 启动HTTP服务器
 */
async function bootstrap() {
  // 创建NestJS应用实例，引入根模块AppModule
  const app = await NestFactory.create(AppModule)

  // 获取配置服务，用于读取环境变量和配置
  const configService = app.get(ConfigService)

  // 启用CORS(跨域资源共享)
  // 允许前端应用从不同的域名/端口访问API
  app.enableCors()

  // 启用全局验证管道
  // 自动验证请求数据，确保符合DTO(数据传输对象)定义的规则
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动移除非DTO中定义的属性
      transform: true, // 自动转换数据类型(如字符串转数字)
    })
  )

  // 设置Swagger API文档
  // 为API提供交互式文档界面，便于开发和测试
  const config = new DocumentBuilder()
    .setTitle('Yuzhi API') // API标题
    .setDescription('The Yuzhi API documentation') // API描述
    .setVersion('1.0') // API版本
    .addBearerAuth() // 添加Bearer认证支持(JWT)
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document) // 设置文档路径为/api

  // 启动HTTP服务器
  // 从配置中获取端口号，默认为3000
  const port = configService.get<number>('port', 3000)
  await app.listen(port)

  // 输出服务器信息到控制台
  console.log(`Application is running on: http://localhost:${port}`)
  console.log(`API documentation available at: http://localhost:${port}/api`)
}

// 调用引导函数启动应用
bootstrap()
