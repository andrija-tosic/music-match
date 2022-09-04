import { Roles, User } from '@music-match/entities';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRole = this.reflector.get<Roles>(
      'role',
      context.getHandler()
    );

    const { user }: { user: User } = context.switchToHttp().getRequest();

    return requiredRole === user.role;
  }
}
