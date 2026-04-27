import { registerAs } from '@nestjs/config';

export interface JwtConfig {
  accessSecret: string;
  accessExpiry: string;
  refreshSecret: string;
  refreshExpiry: string;
}

export const jwtConfig = registerAs(
  'jwt',
  (): JwtConfig => ({
    accessSecret: process.env.JWT_ACCESS_SECRET!,
    accessExpiry: process.env.JWT_ACCESS_EXPIRY!,
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY!,
  }),
);
