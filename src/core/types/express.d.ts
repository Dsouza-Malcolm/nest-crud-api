import { UserResponseDto } from '../modules/users/dto/user-response.dto';

declare global {
  namespace Express {
    export interface Request {
      user?: UserResponseDto;
    }
  }
}
