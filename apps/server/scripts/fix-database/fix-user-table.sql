-- 修复用户表结构的SQL脚本
-- 运行此脚本前请先备份数据库

-- 1. 检查表是否存在，不存在则创建
CREATE TABLE IF NOT EXISTS `user` (
  `id` varchar(36) NOT NULL,
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `password` varchar(255) NOT NULL COMMENT '密码',
  `email` varchar(100) NOT NULL COMMENT '邮箱',
  `phone_number` varchar(20) NOT NULL COMMENT '手机号',
  `nickname` varchar(50) DEFAULT NULL COMMENT '昵称',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像URL',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：0-禁用，1-启用',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  UNIQUE KEY `uk_email` (`email`),
  UNIQUE KEY `uk_phone_number` (`phone_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. 修改表结构以匹配实体定义
ALTER TABLE `user`
  MODIFY COLUMN `id` varchar(36) NOT NULL COMMENT '主键ID',
  MODIFY COLUMN `username` varchar(50) NOT NULL COMMENT '用户名',
  MODIFY COLUMN `password` varchar(255) NOT NULL COMMENT '密码',
  MODIFY COLUMN `email` varchar(100) NOT NULL COMMENT '邮箱',
  MODIFY COLUMN `phone_number` varchar(20) NOT NULL COMMENT '手机号',
  MODIFY COLUMN `nickname` varchar(50) DEFAULT NULL COMMENT '昵称',
  MODIFY COLUMN `avatar` varchar(255) DEFAULT NULL COMMENT '头像URL',
  MODIFY COLUMN `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：0-禁用，1-启用',
  MODIFY COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  MODIFY COLUMN `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间';

-- 3. 查询确认修复结果
SELECT COUNT(*) as total_records FROM `user`;

-- 4. 检查字段是否存在
SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT, COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
AND TABLE_NAME = 'user'
ORDER BY ORDINAL_POSITION;
