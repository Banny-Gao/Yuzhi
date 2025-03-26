/**
 * 手动执行迁移脚本，用于更新太长的字段
 */
const mysql = require('mysql2/promise')
require('dotenv').config()

async function runMigration() {
  console.log('开始执行数据库迁移...')

  // 从环境变量获取数据库配置
  const host = process.env.DB_HOST || 'localhost'
  const port = parseInt(process.env.DB_PORT || '3306', 10)
  const username = process.env.DB_USERNAME || 'root'
  const password = process.env.DB_PASSWORD || ''
  const database = process.env.DB_DATABASE || 'bazi'

  // 创建数据库连接
  const connection = await mysql.createConnection({
    host,
    port,
    user: username,
    password,
    database,
  })

  try {
    console.log('已连接到数据库, 准备执行字段类型迁移')

    // 修改des字段为text类型
    await connection.query(`ALTER TABLE \`solar_terms\` MODIFY COLUMN \`des\` TEXT`)
    console.log('已将des字段修改为TEXT类型')

    // 修改youLai字段为text类型
    await connection.query(`ALTER TABLE \`solar_terms\` MODIFY COLUMN \`youLai\` TEXT`)
    console.log('已将youLai字段修改为TEXT类型')

    // 修改xiSu字段为text类型
    await connection.query(`ALTER TABLE \`solar_terms\` MODIFY COLUMN \`xiSu\` TEXT`)
    console.log('已将xiSu字段修改为TEXT类型')

    // 修改heath字段为text类型
    await connection.query(`ALTER TABLE \`solar_terms\` MODIFY COLUMN \`heath\` TEXT`)
    console.log('已将heath字段修改为TEXT类型')

    console.log('数据库迁移成功完成!')
  } catch (error) {
    console.error('执行迁移时出错:', error)
  } finally {
    await connection.end()
    console.log('数据库连接已关闭')
  }
}

runMigration().catch(console.error)
