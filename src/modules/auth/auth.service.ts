import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { jwtConfig } from '../../core/config/env/jwt.config';
import { hashPassword, verifyPassword } from '../../core/utils/auth/hash.util';
import { User } from '../users/entities/user.entity';
import { UserMapper } from '../users/mappers/user.mapper';
import { UserService } from '../users/user.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResult } from './types/auth.type';
import { JwtPayload } from './types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private jwt: ConfigType<typeof jwtConfig>,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findUserByEmail(email);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValid = await verifyPassword(user.password, password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async login(user: User): Promise<AuthResult> {
    return this.buildAuthResult(user);
  }

  async register(dto: RegisterDto): Promise<AuthResult> {
    const user = await this.userService.create(dto);
    return this.buildAuthResult(user);
  }

  async refresh(user: User): Promise<AuthResult> {
    return this.buildAuthResult(user);
  }

  async logout(userId: string): Promise<void> {
    await this.userService.updateRefreshToken(userId, null);
  }

  private async buildAuthResult(user: User): Promise<AuthResult> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.jwt.accessSecret,
        expiresIn: this.jwt.accessExpiry as JwtSignOptions['expiresIn'],
      }),
      this.jwtService.signAsync(payload, {
        secret: this.jwt.refreshSecret,
        expiresIn: this.jwt.refreshExpiry as JwtSignOptions['expiresIn'],
      }),
    ]);

    const hashed = await hashPassword(refreshToken);
    await this.userService.updateRefreshToken(user.id, hashed);

    return {
      tokens: { accessToken, refreshToken },
      user: UserMapper.toResponse(user),
    };
  }
}
