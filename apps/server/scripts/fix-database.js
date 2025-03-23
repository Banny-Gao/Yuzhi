/**
 * 数据库修复脚本
 *
 * 此脚本运行SQL命令来修复solar_terms表的结构问题
 * 用法: node fix-database.js
 */

const mysql = require('mysql2/promise')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env' })

async function main() {
  console.log('开始执行数据库修复脚本...')

  // 从环境变量中读取数据库连接参数
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'bazi_db',
    charset: process.env.DB_CHARSET || 'utf8mb4',
    multipleStatements: true, // 允许执行多条SQL语句
  }

  console.log(`连接到数据库: ${config.host}:${config.port}/${config.database}`)

  let connection
  try {
    // 创建数据库连接
    connection = await mysql.createConnection(config)
    console.log('数据库连接成功')

    // 读取SQL脚本文件
    const sqlScript = fs.readFileSync(path.join(__dirname, 'fix-solar-terms-table.sql'), 'utf8')

    // 将SQL脚本拆分为多个语句
    const statements = sqlScript.split(';').filter(statement => statement.trim().length > 0)

    console.log(`读取到${statements.length}条SQL语句`)

    // 执行每条SQL语句
    for (let i = 0; i < statements.length; i++) {
      const sql = statements[i].trim() + ';'
      console.log(`执行SQL语句 (${i + 1}/${statements.length}):`)
      console.log(sql)

      const [result] = await connection.execute(sql)

      // 显示查询结果
      if (sql.toLowerCase().includes('select')) {
        console.log('查询结果:', result)
      } else {
        console.log('影响行数:', result.affectedRows)
      }
    }

    console.log('数据库修复完成!')
  } catch (error) {
    console.error('执行SQL脚本时出错:', error.message)
    if (error.sqlMessage) {
      console.error('SQL错误:', error.sqlMessage)
    }
    process.exit(1)
  } finally {
    if (connection) {
      await connection.end()
      console.log('数据库连接已关闭')
    }
  }
}

main().catch(error => {
  console.error('脚本执行失败:', error)
  process.exit(1)
})
