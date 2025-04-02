import { DataSource } from 'typeorm'
import { config } from 'dotenv'
import databaseConfig from '../src/config/database.config'

// 加载环境变量
config()

const dataSource = new DataSource(databaseConfig())

dataSource
  .initialize()
  .then(async () => {
    console.log('Running migrations...')
    return dataSource.runMigrations()
  })
  .then(() => {
    console.log('Migrations completed successfully')
    process.exit(0)
  })
  .catch(error => {
    console.error('Error during migration:', error)
    process.exit(1)
  })
