/**
 * 应用配置工厂函数
 *
 * 返回一个包含所有应用配置的对象，从环境变量中读取值
 * 配置在应用中可通过ConfigService访问
 * 例如: configService.get('database.host')
 *
 * @returns {Object} 配置对象
 */
export default () => ({
  // HTTP服务器端口，默认为3000
  port: parseInt(process.env.PORT, 10) || 3000,

  // 数据库连接配置
  database: {
    type: 'mysql',
    host: process.env.DB_HOST, // 数据库主机地址
    port: parseInt(process.env.DB_PORT, 10) || 3306, // 数据库端口，默认MySQL端口3306
    username: process.env.DB_USERNAME, // 数据库用户名
    password: process.env.DB_PASSWORD, // 数据库密码
    database: process.env.DB_DATABASE, // 数据库名称
    charset: process.env.DB_CHARSET || 'utf8mb4',
  },

  // JWT(JSON Web Token)认证配置
  jwt: {
    secret: process.env.JWT_SECRET, // 访问令牌加密密钥
    refreshSecret: process.env.JWT_REFRESH_SECRET, // 刷新令牌加密密钥
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m', // 访问令牌有效期，默认15分钟
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d', // 刷新令牌有效期，默认7天
  },

  // 短信服务配置(用于短信验证等功能)
  sms: {
    apiKey: process.env.SMS_API_KEY, // 短信服务API密钥
    secret: process.env.SMS_SECRET, // 短信服务密钥
  },

  // 聚合数据API配置(用于获取外部数据服务)
  juhe: {
    apiKey: process.env.JUHE_API_KEY, // 聚合数据平台API密钥
    apiUrl: process.env.JUHE_API_URL, // 聚合数据平台API基础URL
  },
})
