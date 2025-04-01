import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { JuheModule } from './modules/juhe/juhe.module'
import { SystemModule } from './modules/system/system.module'
import configuration from './config/configuration'
import databaseConfig from './config/database.config'
import jwtConfig from './config/jwt.config'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'

/**
 * 主应用模块 - Bazi API服务器的根模块
 * 负责组织和配置应用的所有组件，包括：
 * - 全局配置管理
 * - 数据库连接
 * - 功能模块的导入和组织
 */
@Module({
  imports: [
    // 全局配置模块 - 使应用中的所有其他模块可以通过ConfigService访问环境配置
    ConfigModule.forRoot({
      isGlobal: true, // 将配置设为全局可用
      load: [configuration, databaseConfig, jwtConfig], // 加载自定义配置文件
      envFilePath: ['.env'], // 指定环境变量文件路径
    }),

    // 数据库连接配置 - 使用MySQL数据库
    // 从.env文件和配置服务读取连接参数
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => databaseConfig(),
    }),

    // 用户管理模块 - 处理用户数据的CRUD操作和用户信息管理
    UsersModule,

    // 认证模块 - 处理用户登录、注册、JWT令牌验证等功能
    AuthModule,

    // 聚合数据模块 - 集成第三方聚合数据API服务
    JuheModule,

    // 系统模块 - 处理系统相关的功能
    SystemModule,
  ],
  controllers: [AppController], // 根控制器 - 处理基本的应用路由
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ], // 根服务 - 提供基本的应用功能
})
export class AppModule {}
