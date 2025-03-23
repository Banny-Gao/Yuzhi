import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

/**
 * 二十四节气实体类
 * 用于存储中国传统二十四节气的数据
 */
@Entity('solar_terms')
export class SolarTerm {
  @ApiProperty({ description: '主键ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ description: '年份' })
  @Column()
  year: number

  @ApiProperty({ description: '节气名称' })
  @Column({ length: 50 })
  name: string

  @ApiProperty({ description: '节气日期（公历）' })
  @Column({
    length: 20,
    nullable: false,
    comment: '节气的公历日期，格式：YYYY-MM-DD',
  })
  date: string

  @ApiProperty({ description: '农历日期' })
  @Column({
    name: 'lunar_date',
    length: 20,
    nullable: false,
    default: '未知',
    comment: '节气的农历日期',
  })
  lunarDate: string

  @ApiProperty({ description: '节气介绍' })
  @Column({
    type: 'text',
    nullable: true,
    comment: '节气的详细介绍',
  })
  intro: string

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
