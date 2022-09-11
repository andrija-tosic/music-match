import { CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';

export class SessionGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();

    // Logger.log('SessionGuard', 'SessionGuard');

    try {
      // Logger.log(request.session.passport.user, 'request.session.passport.user');
      if (request.session.passport.user) {
        return true;
      }
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
