import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../auth/entities/user.entity';

export const AuthorizedUser = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
