import { MigrationInterface, QueryRunner } from 'typeorm'
import * as bcrypt from 'bcrypt'

export class AddUserRolesAndNickname1709347200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 检查并添加 nickname 列
    await queryRunner
      .query(
        `ALTER TABLE users
       ADD COLUMN nickname VARCHAR(50) NULL UNIQUE`
      )
      .catch(() => {
        // 如果列已存在，忽略错误
      })

    // 检查并添加 roles 列
    await queryRunner
      .query(
        `ALTER TABLE users
       ADD COLUMN roles VARCHAR(255) NOT NULL DEFAULT 'user'`
      )
      .catch(() => {
        // 如果列已存在，忽略错误
      })

    // 检查并添加 is_active 列
    await queryRunner
      .query(
        `ALTER TABLE users
       ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE`
      )
      .catch(() => {
        // 如果列已存在，忽略错误
      })

    // 更新现有用户为默认角色
    await queryRunner.query(`UPDATE users SET roles = 'user' WHERE roles IS NULL`)

    // 生成管理员密码的哈希值
    const adminPassword = 'Admin@123' // 默认管理员密码
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds)

    // 创建管理员用户（如果不存在）
    await queryRunner.query(
      `INSERT INTO users (id, username, email, password, roles, is_active, created_at, updated_at)
       SELECT 1, 'admin', 'admin@example.com', ?, 'admin', TRUE, NOW(), NOW()
       WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin')`,
      [hashedPassword]
    )

    console.log('Migration completed. Default admin credentials:')
    console.log('Username: admin')
    console.log('Password: Admin@123')
    console.log('Please change the password after first login!')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE users DROP COLUMN IF EXISTS nickname`)
    await queryRunner.query(`ALTER TABLE users DROP COLUMN IF EXISTS roles`)
    await queryRunner.query(`ALTER TABLE users DROP COLUMN IF EXISTS is_active`)
  }
}
