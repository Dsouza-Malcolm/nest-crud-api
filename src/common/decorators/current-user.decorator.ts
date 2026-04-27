import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserResponseDto } from '../../modules/users/dto/user-response.dto';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user?: UserResponseDto }>();

    return request.user;
  },
);
