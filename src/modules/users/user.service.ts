import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from '../../core/utils/auth/hash.util';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>,
  ) {}

  async findUserByEmail(email: string) {
    return this.user.findOne({
      where: { email },
    });
  }

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.findUserByEmail(dto.email);
    if (existing) throw new ConflictException('Email already in use');

    const hashed = await hashPassword(dto.password);

    const user = this.user.create({ ...dto, password: hashed });
    return this.user.save(user);
  }

  async findById(id: string): Promise<User | null> {
    return this.user.findOne({ where: { id } });
  }

  async updateRefreshToken(
    userId: string,
    hashedToken: string | null,
  ): Promise<void> {
    await this.user.update(userId, { hashedRefreshToken: hashedToken });
  }
}
