import { AuthGuard } from '@nestjs/passport';
import { AUTH_STRATEGIES } from '../../modules/auth/constants/auth.constants';

export class JwtRefreshGuard extends AuthGuard(AUTH_STRATEGIES.JWT_REFRESH) {}
