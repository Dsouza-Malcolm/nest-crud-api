import { UserResponseDto } from '../../users/dto/user-response.dto';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult {
  tokens: TokenPair;
  user: UserResponseDto;
}
