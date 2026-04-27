export const AUTH_COOKIE_KEYS = {
  ACCESS: 'access_token',
  REFRESH: 'refresh_token',
  CSRF: 'csrf_token',
} as const;

export const REFRESH_COOKIE_PATH = '/api/v1/auth/refresh';

export const AUTH_STRATEGIES = {
  JWT_ACCESS: 'jwt-access',
  JWT_REFRESH: 'jwt-refresh',
  LOCAL: 'local',
} as const;
