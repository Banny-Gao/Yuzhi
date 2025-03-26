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
  pub_year: number

  @ApiProperty({ description: '节气名称' })
  @Column()
  name: string

  @ApiProperty({ description: '节气公历日期' })
  @Column()
  pub_date: string

  @ApiProperty({ description: '节气农历日期' })
  @Column()
  pri_date: string

  @ApiProperty({ description: '节气时间' })
  @Column()
  pub_time: string

  @ApiProperty({ description: '节气简介' })
  @Column('text')
  des: string

  @ApiProperty({ description: '节气由来' })
  @Column('text')
  youLai: string

  @ApiProperty({ description: '节气习俗' })
  @Column('text')
  xiSu: string

  @ApiProperty({ description: '节气养生建议' })
  @Column('text')
  heath: string
}
