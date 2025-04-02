/**
 * 通用数据库修复脚本
 *
 * 用法: node index.js
 */

const mysql = require('mysql2/promise')
const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })

// 检查环境变量
function checkEnvironmentVariables() {
  const requiredVars = ['DB_HOST', 'DB_PORT', 'DB_USERNAME', 'DB_PASSWORD', 'DB_DATABASE']
  const missingVars = requiredVars.filter(varName => !process.env[varName])

  if (missingVars.length > 0) {
    console.error('错误: 缺少必要的环境变量:')
    missingVars.forEach(varName => console.error(`  - ${varName}`))
    console.error('\n请确保 .env 文件包含所有必要的配置')
    process.exit(1)
  }
}

async function executeSQL(connection, sql, description = '') {
  try {
    console.log(`\n执行SQL${description ? ` (${description})` : ''}:`)
    console.log(sql)

    const [result] = await connection.execute(sql)

    if (sql.toLowerCase().trim().startsWith('select') || sql.toLowerCase().trim().startsWith('show')) {
      console.log('\n查询结果:')
      console.table(result)
    } else {
      console.log('影响行数:', result.affectedRows)
    }

    return result
  } catch (error) {
    console.error('\nSQL执行错误:', error.message)
    if (error.sqlMessage) {
      console.error('SQL错误详情:', error.sqlMessage)
    }
    throw error
  }
}

async function executeSQLFile(connection, filePath) {
  console.log(`\n开始执行SQL文件: ${path.basename(filePath)}`)
  console.log('='.repeat(50))

  // 读取SQL脚本文件
  const sqlScript = fs.readFileSync(filePath, 'utf8')

  // 将SQL脚本拆分为多个语句
  const statements = sqlScript
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0)

  console.log(`读取到 ${statements.length} 条SQL语句`)

  // 开始事务
  await connection.beginTransaction()
  console.log('\n开始事务...')

  try {
    // 执行每条SQL语句
    for (let i = 0; i < statements.length; i++) {
      await executeSQL(connection, statements[i] + ';', `${i + 1}/${statements.length}`)
    }

    // 提交事务
    await connection.commit()
    console.log('\n✅ 事务提交成功')
    console.log('='.repeat(50))
    return true
  } catch (error) {
    // 发生错误时回滚事务
    await connection.rollback()
    console.error('\n❌ 执行失败，事务已回滚')
    console.error('='.repeat(50))
    throw error
  }
}

async function main() {
  console.log('\n数据库修复工具')
  console.log('='.repeat(50))

  // 检查环境变量
  checkEnvironmentVariables()

  // 获取当前目录下的所有 .sql 文件
  const sqlFiles = fs
    .readdirSync(__dirname)
    .filter(file => file.endsWith('.sql'))
    .map(file => ({
      name: file,
      value: path.join(__dirname, file),
    }))

  if (sqlFiles.length === 0) {
    console.error('\n❌ 错误: 当前目录下没有找到 SQL 文件')
    process.exit(1)
  }

  // 添加全选选项
  const choices = [
    new inquirer.Separator('= 选择要执行的 SQL 文件 ='),
    {
      name: '全选',
      value: 'all',
    },
    new inquirer.Separator('= 单个文件 ='),
    ...sqlFiles,
  ]

  // 交互式选择文件
  const { selectedFiles } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedFiles',
      message: '请选择要执行的 SQL 文件:',
      choices,
      pageSize: 20,
      validate: answer => {
        if (answer.length < 1) {
          return '请至少选择一个文件'
        }
        return true
      },
    },
  ])

  // 处理全选
  const filesToExecute = selectedFiles.includes('all') ? sqlFiles.map(file => file.value) : selectedFiles.filter(file => file !== 'all')

  // 确认执行
  const { confirmed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message: `确定要执行选中的 ${filesToExecute.length} 个文件吗？`,
      default: false,
    },
  ])

  if (!confirmed) {
    console.log('\n已取消执行')
    process.exit(0)
  }

  // 从环境变量中读取数据库连接参数
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'yuzhi',
    charset: process.env.DB_CHARSET || 'utf8mb4',
    multipleStatements: true, // 允许执行多条SQL语句
  }

  console.log(`\n连接到数据库: ${config.host}:${config.port}/${config.database}`)

  let connection
  try {
    // 创建数据库连接
    connection = await mysql.createConnection(config)
    console.log('✅ 数据库连接成功')

    let successCount = 0
    let failureCount = 0

    // 执行选中的文件
    for (const file of filesToExecute) {
      try {
        await executeSQLFile(connection, file)
        successCount++
      } catch (error) {
        failureCount++
        const { shouldContinue } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'shouldContinue',
            message: `执行 ${path.basename(file)} 失败。是否继续执行下一个文件？`,
            default: false,
          },
        ])
        if (!shouldContinue) break
      }
    }

    console.log('\n执行结果统计:')
    console.log('='.repeat(50))
    console.log(`总文件数: ${filesToExecute.length}`)
    console.log(`成功: ${successCount}`)
    console.log(`失败: ${failureCount}`)
  } catch (error) {
    console.error('\n❌ 脚本执行失败:', error.message)
    process.exit(1)
  } finally {
    if (connection) {
      await connection.end()
      console.log('\n数据库连接已关闭')
    }
  }
}

main().catch(error => {
  console.error('\n❌ 脚本执行失败:', error)
  process.exit(1)
})
