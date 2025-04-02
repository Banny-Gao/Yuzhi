-- 修复solar_terms表结构的SQL脚本
-- 运行此脚本前请先备份数据库

-- 1. 检查表是否存在，不存在则创建
CREATE TABLE IF NOT EXISTS `solar_terms` (
  `id` varchar(36) NOT NULL,
  `pub_year` int NOT NULL COMMENT '年份',
  `name` varchar(50) NOT NULL COMMENT '节气名称',
  `pub_date` varchar(20) NOT NULL COMMENT '节气公历日期',
  `pri_date` varchar(20) NOT NULL DEFAULT '未知' COMMENT '节气农历日期',
  `pub_time` varchar(20) NOT NULL COMMENT '节气时间',
  `des` text COMMENT '节气简介',
  `youLai` text COMMENT '节气由来',
  `xiSu` text COMMENT '节气习俗',
  `heath` text COMMENT '节气养生建议',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. 修改表结构以匹配实体定义
ALTER TABLE `solar_terms`
  MODIFY COLUMN `id` varchar(36) NOT NULL COMMENT '主键ID',
  MODIFY COLUMN `pub_year` int NOT NULL COMMENT '年份',
  MODIFY COLUMN `name` varchar(50) NOT NULL COMMENT '节气名称',
  MODIFY COLUMN `pub_date` varchar(20) NOT NULL COMMENT '节气公历日期',
  MODIFY COLUMN `pri_date` varchar(20) NOT NULL DEFAULT '未知' COMMENT '节气农历日期',
  MODIFY COLUMN `pub_time` varchar(20) NOT NULL COMMENT '节气时间',
  MODIFY COLUMN `des` text NULL COMMENT '节气简介',
  MODIFY COLUMN `youLai` text NULL COMMENT '节气由来',
  MODIFY COLUMN `xiSu` text NULL COMMENT '节气习俗',
  MODIFY COLUMN `heath` text NULL COMMENT '节气养生建议';

-- 3. 更新可能存在的空字段
UPDATE `solar_terms` SET `pri_date` = '未知' WHERE `pri_date` IS NULL OR `pri_date` = '';
UPDATE `solar_terms` SET `des` = '' WHERE `des` IS NULL;
UPDATE `solar_terms` SET `youLai` = '' WHERE `youLai` IS NULL;
UPDATE `solar_terms` SET `xiSu` = '' WHERE `xiSu` IS NULL;
UPDATE `solar_terms` SET `heath` = '' WHERE `heath` IS NULL;

-- 4. 查询确认修复结果
SELECT COUNT(*) as total_records FROM `solar_terms`;
SELECT COUNT(*) as empty_pri_date FROM `solar_terms` WHERE `pri_date` IS NULL OR `pri_date` = '';
SELECT COUNT(*) as empty_des FROM `solar_terms` WHERE `des` IS NULL;
