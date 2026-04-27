import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { UserMapper } from '../users/mappers/user.mapper';
import { hashPassword, verifyPassword } from '../../core/utils/auth/hash.util';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { jwtConfig } from '../../core/config/env/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { AuthResult } from './types/auth.type';
import { User } from '../users/entities/user.entity';
import { JwtPayload } from './types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private jwt: ConfigType<typeof jwtConfig>,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserResponseDto | null> {
    const user = await this.userService.findUserByEmail(email);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValid = await verifyPassword(user.password, password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    return UserMapper.toResponse(user);
  }

  async login(user: UserResponseDto) {
    console.log(user);
  }

  async register(dto: RegisterDto): Promise<AuthResult> {
    const user = await this.userService.create(dto);
    return this.buildAuthResult(user);
  }

  private async buildAuthResult(user: User): Promise<AuthResult> {
    const payload: JwtPayload = { sub: user.id, email: user.email };

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
