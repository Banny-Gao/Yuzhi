-- 修复solar_terms表结构的SQL脚本
-- 运行此脚本前请先备份数据库

-- 1. 修改农历日期字段，添加默认值
ALTER TABLE `solar_terms` 
MODIFY COLUMN `lunar_date` VARCHAR(20) NOT NULL DEFAULT '未知' COMMENT '节气的农历日期';

-- 2. 修改介绍字段（不能设置默认值）
-- MySQL中TEXT类型不能设置默认值
ALTER TABLE `solar_terms` 
MODIFY COLUMN `intro` TEXT NULL COMMENT '节气的详细介绍';

-- 3. 修改日期字段，确保非空并添加说明
ALTER TABLE `solar_terms` 
MODIFY COLUMN `date` VARCHAR(20) NOT NULL COMMENT '节气的公历日期，格式：YYYY-MM-DD';

-- 4. 更新可能存在的空日期字段
UPDATE `solar_terms` 
SET `date` = CONCAT(year, '-01-01') 
WHERE `date` IS NULL OR `date` = '';

-- 5. 更新可能存在的空农历日期字段
UPDATE `solar_terms` 
SET `lunar_date` = '未知' 
WHERE `lunar_date` IS NULL OR `lunar_date` = '';

-- 6. 更新空的介绍字段（代替默认值）
UPDATE `solar_terms` 
SET `intro` = '' 
WHERE `intro` IS NULL;

-- 7. 更新完成后查询确认
SELECT COUNT(*) FROM `solar_terms` WHERE `date` IS NULL OR `date` = '';
SELECT COUNT(*) FROM `solar_terms` WHERE `lunar_date` IS NULL OR `lunar_date` = ''; 