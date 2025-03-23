/**
 * 测试MySQL数据库连接脚本
 *
 * 用法: node test-db-connection.js
 *
 * 该脚本尝试直接连接到MySQL数据库，以验证连接设置是否正确。
 * 如果连接成功，它会执行一个简单的查询并输出结果。
 * 如果连接失败，它会输出错误消息。
 */

const mysql = require('mysql2')
require('dotenv').config({ path: '.env' })

// 从环境变量中读取连接参数
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'bazi_db',
  connectTimeout: 30000,
  keepAliveInitialDelay: 10000,
  enableKeepAlive: true,
  timezone: '+08:00',
}

console.log('尝试连接到MySQL数据库...')
console.log(`主机: ${config.host}`)
console.log(`端口: ${config.port}`)
console.log(`用户: ${config.user}`)
console.log(`数据库: ${config.database}`)

// 创建连接
const connection = mysql.createConnection(config)

// 尝试连接
connection.connect(err => {
  if (err) {
    console.error('连接失败:', err)
    console.error('错误代码:', err.code)

    if (err.code === 'ECONNREFUSED') {
      console.log('\n可能的原因:')
      console.log('1. 数据库服务器未运行')
      console.log('2. 主机地址或端口不正确')
      console.log('3. 防火墙阻止了连接')
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n可能的原因:')
      console.log('1. 用户名或密码不正确')
      console.log('2. 用户没有远程访问权限')
    } else if (err.code === 'ETIMEDOUT') {
      console.log('\n可能的原因:')
      console.log('1. 网络连接问题')
      console.log('2. 防火墙阻止了连接')
      console.log('3. 数据库服务器配置不允许远程连接')
    } else if (err.code === 'ER_DBACCESS_DENIED_ERROR') {
      console.log('\n可能的原因:')
      console.log('1. 用户没有访问指定数据库的权限')
    }

    console.log('\n建议:')
    console.log('1. 验证连接参数是否正确')
    console.log('2. 检查数据库服务器是否运行')
    console.log('3. 确认数据库用户有访问权限')
    console.log('4. 确认MySQL服务器配置允许远程连接')

    process.exit(1)
  }

  console.log('连接成功!')

  // 尝试执行简单查询
  connection.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) {
      console.error('查询执行失败:', err)
      process.exit(1)
    }

    console.log('查询执行成功。结果:', results[0].solution)

    // 尝试获取数据库列表
    connection.query('SHOW DATABASES', (err, results) => {
      if (err) {
        console.error('无法列出数据库:', err)
      } else {
        console.log('\n可用的数据库:')
        results.forEach(db => console.log(`- ${db.Database}`))
      }

      // 关闭连接
      connection.end(err => {
        if (err) {
          console.error('关闭连接时出错:', err)
          process.exit(1)
        }

        console.log('连接已关闭。测试完成。')
        process.exit(0)
      })
    })
  })
})
