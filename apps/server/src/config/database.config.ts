import { registerAs } from '@nestjs/config'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'yuzhi',
    charset: 'utf8mb4',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: process.env.NODE_ENV !== 'production',
    logging: ['error', 'warn'],
    logger: 'advanced-console',

    // Connection pool configuration
    poolSize: 10,
    connectTimeout: 30000,

    // Retry configuration
    retryAttempts: 5,
    retryDelay: 3000,

    // Keep connection alive
    keepConnectionAlive: true,
    extra: {
      connectionLimit: 10,
      acquireTimeout: 30000,
      waitForConnections: true,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
    },

    // Additional settings
    timezone: '+08:00',
    supportBigNumbers: true,
    bigNumberStrings: true,
    dateStrings: true,
  })
)
