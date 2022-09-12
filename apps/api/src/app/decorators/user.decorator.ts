import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@music-match/entities';

export const UserFromSession = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return (request.user as User) || null;
  }
);
