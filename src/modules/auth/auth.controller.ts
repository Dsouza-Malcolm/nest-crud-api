import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { LocalAuthGuard } from '../../common/guards/local.guard';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import type { Response } from 'express';
import {
  setAuthCookies,
  setCsrfCookie,
} from '../../core/utils/auth/cookie.util';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@CurrentUser() user: UserResponseDto) {
    return this.authService.login(user);
  }

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { tokens, user } = await this.authService.register(dto);

    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    setCsrfCookie(res);

    return { user };
  }
}
