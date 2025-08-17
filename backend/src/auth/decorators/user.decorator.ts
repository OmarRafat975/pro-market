import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Roles } from '../schemas/user.schema';

export interface JwtUser {
  userId: string;
  role: Roles;
}

export const User = createParamDecorator(
  (data: keyof JwtUser | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user as JwtUser | undefined;
    return data ? user?.[data] : user;
  },
);
