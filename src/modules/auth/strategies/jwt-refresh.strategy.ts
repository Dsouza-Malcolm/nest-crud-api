import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AUTH_COOKIE_KEYS, AUTH_STRATEGIES } from '../constants/auth.constants';
import type { ConfigType } from '@nestjs/config';
import { jwtConfig } from '../../../core/config/env/jwt.config';
import { UserService } from '../../users/user.service';
import type { Request } from 'express';
import { JwtPayload } from '../types/jwt-payload.type';
import { verifyPassword } from '../../../core/utils/auth/hash.util';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  AUTH_STRATEGIES.JWT_REFRESH,
) {
  constructor(
    @Inject(jwtConfig.KEY)
    private jwt: ConfigType<typeof jwtConfig>,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const token: unknown = req.cookies[AUTH_COOKIE_KEYS.REFRESH];

          return typeof token === 'string' ? token : null;
        },
      ]),
      secretOrKey: jwt.refreshSecret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const rawRefreshToken: unknown = req.cookies?.[AUTH_COOKIE_KEYS.REFRESH];
    if (!rawRefreshToken || typeof rawRefreshToken !== 'string')
      throw new UnauthorizedException();

    const user = await this.userService.findById(payload.sub);
    if (!user || !user.hashedRefreshToken) throw new UnauthorizedException();

    const isValid = await verifyPassword(
      user.hashedRefreshToken,
      rawRefreshToken,
    );

    if (!isValid) throw new UnauthorizedException();

    return user;
  }
}
