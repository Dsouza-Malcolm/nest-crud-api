import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { AUTH_COOKIE_KEYS, AUTH_STRATEGIES } from '../constants/auth.constants';
import { jwtConfig } from '../../../core/config/env/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { UserService } from '../../users/user.service';
import { JwtPayload } from '../types/jwt-payload.type';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  AUTH_STRATEGIES.JWT_ACCESS,
) {
  constructor(
    @Inject(jwtConfig.KEY)
    private jwt: ConfigType<typeof jwtConfig>,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string | null => {
          const token: unknown = req.cookies[AUTH_COOKIE_KEYS.ACCESS];

          return typeof token === 'string' ? token : null;
        },
      ]),
      secretOrKey: jwt.accessSecret,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.findById(payload.sub);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
