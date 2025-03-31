import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { JuheModule } from './modules/juhe/juhe.module'
import { SystemModule } from './modules/system/system.module'
import configuration from './config/configuration'

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
      load: [configuration], // 加载自定义配置文件
      envFilePath: ['.env'], // 指定环境变量文件路径
    }),

    // 数据库连接配置 - 使用MySQL数据库
    // 从.env文件和配置服务读取连接参数
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql', // 数据库类型
        host: configService.get('database.host'), // 主机地址
        port: configService.get('database.port'), // 端口
        username: configService.get('database.username'), // 用户名
        password: configService.get('database.password'), // 密码
        database: configService.get('database.database'), // 数据库名
        charset: configService.get('database.charset'), // 字符集
        entities: [__dirname + '/**/*.entity{.ts,.js}'], // 自动加载所有实体类
        synchronize: configService.get('NODE_ENV') !== 'production', // 仅在非生产环境自动同步数据库结构
        logging: ['error', 'warn'], // 只记录错误和警告
        logger: 'advanced-console', // 使用高级控制台记录器

        // 连接池配置
        poolSize: 10, // 连接池大小
        connectTimeout: 30000, // 连接超时（毫秒）增加到30秒

        // 重试配置
        retryAttempts: 5, // 连接失败时重试次数
        retryDelay: 3000, // 重试之间的延迟（毫秒）

        // 心跳配置以保持连接活动
        keepConnectionAlive: true, // 保持连接
        extra: {
          connectionLimit: 10, // 最大连接数
          acquireTimeout: 30000, // 获取连接超时
          waitForConnections: true, // 当没有可用连接时等待
          queueLimit: 0, // 队列限制，0表示无限
          // 保持连接活动的设置
          enableKeepAlive: true,
          keepAliveInitialDelay: 10000, // 10秒
        },
        // 额外设置可能解决远程连接问题
        timezone: '+08:00', // 设置时区
        supportBigNumbers: true,
        bigNumberStrings: true,
        dateStrings: true,
      }),
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
  providers: [AppService], // 根服务 - 提供基本的应用功能
})
export class AppModule {}
