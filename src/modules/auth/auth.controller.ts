import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { Roles } from '../../common/decorators/auth/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CsrfGuard } from '../../common/guards/csrf.guard';
import { JwtAccessGuard } from '../../common/guards/jwt-access.guard';
import { JwtRefreshGuard } from '../../common/guards/jwt-refresh.guard';
import { LocalAuthGuard } from '../../common/guards/local.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import {
  clearAuthCookies,
  setAuthCookies,
  setCsrfCookie,
} from '../../core/utils/auth/cookie.util';
import { Role, User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { tokens, user: loggedInUser } = await this.authService.login(user);

    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    setCsrfCookie(res);

    return { user: loggedInUser };
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

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { tokens, user: loggedInUser } = await this.authService.refresh(user);

    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    setCsrfCookie(res);

    return {
      user: loggedInUser,
    };
  }

  @Post('logout')
  @UseGuards(JwtAccessGuard, CsrfGuard)
  async logout(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(user.id);
    clearAuthCookies(res);

    return { message: 'Logged out successfully' };
  }

  @Get('admin')
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(Role.USER)
  admin() {
    return {
      message: 'admin',
    };
  }
}
