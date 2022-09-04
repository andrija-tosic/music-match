import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User as UserEntity } from '@music-match/entities';

export const User = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return (request.user as UserEntity) || null;
  }
);
