import { Injectable, ConflictException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { User } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // 检查用户名是否已存在
    const existingUsername = await this.usersRepository.findOne({
      where: { username: createUserDto.username },
    })
    if (existingUsername) {
      throw new ConflictException('用户名已被使用')
    }

    // 检查邮箱是否已存在
    const existingEmail = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    })
    if (existingEmail) {
      throw new ConflictException('邮箱已被使用')
    }

    // 检查手机号是否已存在
    if (createUserDto.phoneNumber) {
      const existingPhone = await this.usersRepository.findOne({
        where: { phoneNumber: createUserDto.phoneNumber },
      })
      if (existingPhone) {
        throw new ConflictException('手机号已被使用')
      }
    }

    // 创建新用户
    const user = this.usersRepository.create(createUserDto)

    // 哈希密码
    const salt = await bcrypt.genSalt()
    user.password = await bcrypt.hash(createUserDto.password, salt)

    // 保存用户
    return this.usersRepository.save(user)
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } })
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } })
  }

  async findByPhone(phoneNumber: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { phoneNumber } })
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } })
    if (!user) {
      throw new NotFoundException('用户不存在')
    }
    return user
  }

  async findByUsernameOrPhone(usernameOrPhone: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: [{ username: usernameOrPhone }, { phoneNumber: usernameOrPhone }],
    })
  }

  async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
    let hashedRefreshToken = null
    if (refreshToken) {
      const salt = await bcrypt.genSalt()
      hashedRefreshToken = await bcrypt.hash(refreshToken, salt)
    }

    await this.usersRepository.update(userId, {
      refreshToken: hashedRefreshToken,
    })
  }

  async verifyPhone(userId: string): Promise<User> {
    const user = await this.findById(userId)
    user.isPhoneVerified = true
    return this.usersRepository.save(user)
  }
}
