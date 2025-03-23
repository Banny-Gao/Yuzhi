import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { Exclude } from 'class-transformer'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true, nullable: false, length: 50 })
  username: string

  @Column({ unique: true, nullable: false, length: 100 })
  email: string

  @Column({ unique: true, nullable: true, length: 20 })
  phoneNumber: string

  @Column({ nullable: false, length: 100 })
  @Exclude()
  password: string

  @Column({ default: false })
  isPhoneVerified: boolean

  @Column({ default: false })
  isEmailVerified: boolean

  @Column({ nullable: true, length: 200 })
  refreshToken: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
